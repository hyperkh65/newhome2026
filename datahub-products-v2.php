<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Access-Control-Allow-Origin: *');

function db(): SQLite3 {
  static $db = null;
  if ($db instanceof SQLite3) return $db;
  $source = '/volume1/web/datahub-storage/led_datahub.sqlite';
  $snapshotDir = '/tmp/datahub-cache';
  $snapshot = $snapshotDir . '/led_datahub.sqlite';
  if (!is_dir($snapshotDir)) @mkdir($snapshotDir, 0777, true);
  if (!file_exists($snapshot) || (@filemtime($source) !== false && @filemtime($snapshot) < @filemtime($source))) {
    @copy($source, $snapshot);
  }
  $db = new SQLite3($snapshot, SQLITE3_OPEN_READONLY);
  return $db;
}

function qv(string $key, string $default = ''): string {
  return trim((string)($_GET[$key] ?? $default));
}

function topCounts(string $sql, int $limit = 10): array {
  $rows = [];
  $res = db()->query($sql . ' limit ' . max(1, $limit));
  if (!$res) return $rows;
  while ($row = $res->fetchArray(SQLITE3_ASSOC)) $rows[] = $row;
  return $rows;
}

function parsePrice(?string $value): float {
  $value = preg_replace('/[^0-9.]/', '', (string)$value);
  return (float)($value ?: 0);
}

function normalizeSearchText(string $value): string {
  $value = preg_replace('/^\s*(?:\(\s*주\s*\)|㈜|주식회사|주)\s*/u', '', $value);
  $value = mb_strtolower($value, 'UTF-8');
  $value = preg_replace('/[\s\-\._\/\(\)\[\]\{\},]+/u', '', $value);
  return trim((string)$value);
}

function rowHasCert(array $row): bool {
  return trim((string)($row['certs'] ?? '')) !== '';
}

function rowHasFiles(array $row): bool {
  if (trim((string)($row['files'] ?? '')) !== '') return true;
  return trim((string)($row['supplier_docs'] ?? '')) !== '';
}

function rowDisplayPrice(array $row): float {
  return parsePrice((string)($row['korea_price'] ?? $row['target_price'] ?? ''));
}

function productRankScore(array $row): int {
  $score = 0;
  if (rowHasCert($row)) $score += 40;
  if (rowHasFiles($row)) $score += 30;
  $score += min(20, (int)($row['supplier_score'] ?? 0));
  if (trim((string)($row['status'] ?? '')) === 'approved') $score += 10;
  return $score;
}

function normalizeProductRow(array $row): array {
  $row['has_cert'] = rowHasCert($row);
  $row['has_files'] = rowHasFiles($row);
  return $row;
}

function enrichShopProductRow(array $row): array {
  $supplierName = trim((string)($row['supplier_name'] ?? ''));
  $classificationNo = trim((string)($row['classification_no'] ?? $row['hs_code'] ?? ''));
  $name = trim((string)($row['name'] ?? ''));
  if ($supplierName === '' || ($classificationNo === '' && $name === '')) {
    return normalizeProductRow($row);
  }

  $sql = '
    select
      p.certs, p.files, p.target_price, p.korea_price, p.status, p.classification_no, p.hs_code,
      s.docs as supplier_docs, s.region as supplier_region, s.bizno as supplier_bizno, s.score as supplier_score
    from products p
    left join suppliers s on s.id = p.supplier_id
    where coalesce(s.name, \'\') = :supplier
      and (
        (:classification_no <> \'\' and (coalesce(p.classification_no, \'\') = :classification_no or coalesce(p.hs_code, \'\') = :classification_no))
        or (:product_name <> \'\' and coalesce(p.name, \'\') = :product_name)
      )
    order by
      (case when trim(coalesce(p.korea_price, \'\')) <> \'\' or trim(coalesce(p.target_price, \'\')) <> \'\' then 1 else 0 end) desc,
      (case when trim(coalesce(p.certs, \'\')) <> \'\' then 1 else 0 end) desc,
      (case when trim(coalesce(p.files, \'\')) <> \'\' then 1 else 0 end) desc,
      datetime(p.created_at) desc
    limit 1
  ';
  $stmt = db()->prepare($sql);
  if (!$stmt) {
    return normalizeProductRow($row);
  }
  $stmt->bindValue(':supplier', $supplierName, SQLITE3_TEXT);
  $stmt->bindValue(':classification_no', $classificationNo, SQLITE3_TEXT);
  $stmt->bindValue(':product_name', $name, SQLITE3_TEXT);
  $match = $stmt->execute()?->fetchArray(SQLITE3_ASSOC);
  if (!is_array($match)) {
    return normalizeProductRow($row);
  }

  foreach (['certs', 'files', 'target_price', 'korea_price', 'status', 'supplier_docs', 'supplier_region', 'supplier_bizno', 'supplier_score'] as $field) {
    if (trim((string)($row[$field] ?? '')) === '' && trim((string)($match[$field] ?? '')) !== '') {
      $row[$field] = $match[$field];
    }
  }

  return normalizeProductRow($row);
}

function enrichShopProductRows(array $items): array {
  return array_map('enrichShopProductRow', $items);
}

require_once __DIR__ . '/datahub-live-v2.php';

function liveProductRows(): array {
  if (datahub_setting('DATAHUB_ENABLE_LIVE_API') !== '1') {
    return [];
  }
  $suppliers = datahub_cache_load('live_suppliers_365_80_100', 600);
  if (!is_array($suppliers)) {
    $suppliers = datahub_fetch_live_suppliers();
  }
  $products = datahub_fetch_live_products($suppliers);
  return $products['items'] ?? [];
}

function productSuggestionCandidates(int $limit = 1000): array {
  $rows = [];
  $res = db()->query('
    select
      p.name, p.created_at, p.classification_name, p.classification_no, p.hs_code, p.bizno,
      s.name as supplier_name, s.region as supplier_region
    from products p
    left join suppliers s on s.id = p.supplier_id
    order by datetime(p.created_at) desc
    limit ' . max(50, $limit) . '
  ');
  if (!$res) return $rows;
  while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $rows[] = $row;
  }
  return $rows;
}

function liveProductPayload(array $items, string $q, string $category, string $supplier, string $region, string $status, string $sort, int $page, int $perPage, ?int $totalOverride = null): array {
  $needle = normalizeSearchText($q);
  $filtered = array_values(array_filter($items, function (array $row) use ($q, $category, $supplier, $region, $status, $needle): bool {
    if ($q !== '') {
      $hay = normalizeSearchText(implode(' ', [
        $row['name'] ?? '',
        $row['supplier_name'] ?? '',
        $row['supplier_region'] ?? '',
        $row['supplier_bizno'] ?? '',
        $row['supplier_country'] ?? '',
        $row['supplier_docs'] ?? '',
        $row['classification_no'] ?? '',
        $row['classification_name'] ?? '',
        $row['hs_code'] ?? '',
        $row['power'] ?? '',
        $row['cct'] ?? '',
        $row['bizno'] ?? '',
        $row['status'] ?? '',
      ]));
      if ($needle === '' || !str_contains($hay, $needle)) return false;
    }
    if ($category !== '' && ($row['category'] ?? '') !== $category) return false;
    if ($supplier !== '' && ($row['supplier_name'] ?? '') !== $supplier) return false;
    if ($region !== '' && ($row['supplier_region'] ?? '') !== $region) return false;
    if ($status !== '' && ($row['status'] ?? '') !== $status) return false;
    return true;
  }));

  $sortFn = match ($sort) {
    'name' => fn($a, $b) => strcmp((string)$a['name'], (string)$b['name']),
    'price-asc' => fn($a, $b) => rowDisplayPrice($a) <=> rowDisplayPrice($b),
    'price', 'price-desc' => fn($a, $b) => rowDisplayPrice($b) <=> rowDisplayPrice($a),
    'supplier' => fn($a, $b) => strcmp((string)$a['supplier_name'], (string)$b['supplier_name']) ?: strcmp((string)$a['name'], (string)$b['name']),
    'rating', 'featured' => fn($a, $b) => productRankScore($b) <=> productRankScore($a) ?: strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? '')),
    'oldest' => fn($a, $b) => strcmp((string)($a['created_at'] ?? ''), (string)($b['created_at'] ?? '')),
    'newest', 'recent' => fn($a, $b) => strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? '')),
    default => fn($a, $b) => strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? '')),
  };
  usort($filtered, $sortFn);

  $total = $totalOverride ?? count($filtered);
  $offset = ($page - 1) * $perPage;
  $pageItems = array_map('normalizeProductRow', array_slice($filtered, $offset, $perPage));
  $suggestions = [];
  if ($q !== '' && count($pageItems) === 0) {
    $needleScore = function (array $row) use ($needle): int {
      $scores = [];
      similar_text($needle, normalizeSearchText((string)($row['name'] ?? '')), $s1); $scores[] = $s1;
      similar_text($needle, normalizeSearchText((string)($row['supplier_name'] ?? '')), $s2); $scores[] = $s2;
      similar_text($needle, normalizeSearchText((string)($row['supplier_region'] ?? '')), $s3); $scores[] = $s3;
      return (int)max($scores);
    };
    $ranked = array_map(function (array $row) use ($needleScore) {
      $row['_score'] = $needleScore($row);
      return $row;
    }, $items);
    usort($ranked, fn($a, $b) => ($b['_score'] <=> $a['_score']) ?: strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? '')));
    $suggestions = array_slice($ranked, 0, 5);
    $suggestions = array_map(fn($row) => array_diff_key($row, ['_score' => true]), $suggestions);
  }

  $statuses = [];
  $categories = [];
  $suppliers = [];
  $regions = [];
  foreach ($items as $row) {
    $statuses[$row['status'] ?? 'unknown'] = ($statuses[$row['status'] ?? 'unknown'] ?? 0) + 1;
    $categories[$row['category'] ?? '기타'] = ($categories[$row['category'] ?? '기타'] ?? 0) + 1;
    $suppliers[$row['supplier_name'] ?? '미상'] = ($suppliers[$row['supplier_name'] ?? '미상'] ?? 0) + 1;
    $regions[$row['supplier_region'] ?? '미상'] = ($regions[$row['supplier_region'] ?? '미상'] ?? 0) + 1;
  }
  arsort($statuses); arsort($categories); arsort($suppliers);
  arsort($regions);

  return [
    'ok' => true,
    'query' => [
      'q' => $q,
      'category' => $category,
      'supplier' => $supplier,
      'status' => $status,
      'sort' => $sort,
      'page' => $page,
      'perPage' => $perPage,
    ],
    'stats' => [
      'total' => $total,
      'returned' => count($pageItems),
      'totalPages' => (int)ceil(max($total, 1) / $perPage),
      'certCoverage' => $total > 0 ? round((count(array_filter($filtered, 'rowHasCert')) / $total) * 100, 1) : 0,
      'docCoverage' => $total > 0 ? round((count(array_filter($filtered, 'rowHasFiles')) / $total) * 100, 1) : 0,
      'statusCounts' => $statuses,
    ],
    'facets' => [
      'categories' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($categories, 0, 12, true)), array_values(array_slice($categories, 0, 12, true))),
      'suppliers' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($suppliers, 0, 12, true)), array_values(array_slice($suppliers, 0, 12, true))),
      'regions' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($regions, 0, 12, true)), array_values(array_slice($regions, 0, 12, true))),
      'statuses' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($statuses, 0, 8, true)), array_values(array_slice($statuses, 0, 8, true))),
    ],
    'items' => $pageItems,
    'suggestions' => $suggestions,
    'source' => 'live',
  ];
}

try {
  $q = qv('q');
  $category = qv('category');
  $supplier = qv('supplier');
  $status = qv('status');
  $sort = qv('sort', 'recent');
  $page = max(1, (int)($_GET['page'] ?? 1));
  $perPage = min(200, max(8, (int)($_GET['perPage'] ?? 200)));
  $offset = ($page - 1) * $perPage;

  $liveItems = liveProductRows();
  if ($q !== '') {
    $shop = datahub_fetch_shop_products($q, $page, $perPage);
    echo json_encode(liveProductPayload(enrichShopProductRows($shop['items'] ?? []), $q, $category, $supplier, qv('region'), $status, $sort, $page, $perPage, (int)($shop['totalCount'] ?? 0)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  if (count($liveItems) > 0) {
    echo json_encode(liveProductPayload($liveItems, $q, $category, $supplier, qv('region'), $status, $sort, $page, $perPage), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  $where = ['1=1'];
  $params = [];

  if ($q !== '') {
    $where[] = '(p.name like :q or p.category like :q or p.hs_code like :q or p.certs like :q or p.classification_name like :q or s.name like :q or s.region like :q or s.docs like :q or s.bizno like :q)';
    $params[':q'] = '%' . $q . '%';
  }
  if ($category !== '') {
    $where[] = "coalesce(p.category, '') = :category";
    $params[':category'] = $category;
  }
  if ($supplier !== '') {
    $where[] = "coalesce(s.name, '') = :supplier";
    $params[':supplier'] = $supplier;
  }
  $region = qv('region');
  if ($region !== '') {
    $where[] = "coalesce(s.region, '') = :region";
    $params[':region'] = $region;
  }
  if ($status !== '') {
    $where[] = "coalesce(p.status, '') = :status";
    $params[':status'] = $status;
  }

  $priceExpr = "cast(replace(coalesce(nullif(p.korea_price, ''), nullif(p.target_price, ''), '0'), ',', '') as integer)";
  $scoreExpr = "(case when trim(coalesce(p.certs, '')) <> '' then 40 else 0 end + case when trim(coalesce(p.files, '')) <> '' then 30 else 0 end + case when coalesce(p.status, '') = 'approved' then 10 else 0 end + min(20, cast(coalesce(s.score, 0) as integer)))";
  $orderBy = match ($sort) {
    'name' => 'p.name asc',
    'price-asc' => $priceExpr . " asc, datetime(p.created_at) desc",
    'price', 'price-desc' => $priceExpr . " desc, datetime(p.created_at) desc",
    'supplier' => "coalesce(s.name, '') asc, datetime(p.created_at) desc",
    'rating', 'featured' => $scoreExpr . " desc, datetime(p.created_at) desc",
    'oldest' => 'datetime(p.created_at) asc',
    'newest', 'recent' => 'datetime(p.created_at) desc',
    default => 'datetime(p.created_at) desc',
  };

  $countStmt = db()->prepare('
    select count(*) as n
    from products p
    left join suppliers s on s.id = p.supplier_id
    where ' . implode(' and ', $where)
  );
  if (!$countStmt) {
    echo json_encode(['ok' => false, 'phase' => 'count', 'error' => db()->lastErrorMsg()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return;
  }
  foreach ($params as $key => $value) $countStmt->bindValue($key, $value, SQLITE3_TEXT);
  $total = (int)($countStmt->execute()->fetchArray(SQLITE3_ASSOC)['n'] ?? 0);

  $sql = "
    select
    p.id, p.name, p.category, p.hs_code, p.power, p.cct, p.certs,
    p.target_price, p.korea_price, p.files, p.status, p.created_at, p.bizno, p.classification_no, p.classification_name,
      s.name as supplier_name, s.country as supplier_country, s.score as supplier_score, s.region as supplier_region, s.homepage as supplier_homepage, s.bizno as supplier_bizno, s.docs as supplier_docs
    from products p
    left join suppliers s on s.id = p.supplier_id
    where " . implode(' and ', $where) . "
    order by " . $orderBy . "
    limit :limit offset :offset
  ";
  $stmt = db()->prepare($sql);
  if (!$stmt) {
    echo json_encode(['ok' => false, 'phase' => 'rows', 'error' => db()->lastErrorMsg(), 'sql' => $sql], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return;
  }
  foreach ($params as $key => $value) $stmt->bindValue($key, $value, SQLITE3_TEXT);
  $stmt->bindValue(':limit', $perPage, SQLITE3_INTEGER);
  $stmt->bindValue(':offset', $offset, SQLITE3_INTEGER);
  $res = $stmt->execute();

  $items = [];
  $certCount = 0;
  $docCount = 0;
  $statuses = [];
  $categories = [];
  $suppliers = [];

  while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $items[] = [
      'id' => (int)$row['id'],
      'name' => $row['name'],
      'category' => $row['category'],
      'hs_code' => $row['hs_code'],
      'power' => $row['power'],
      'cct' => $row['cct'],
      'certs' => $row['certs'],
      'target_price' => $row['target_price'],
      'korea_price' => $row['korea_price'],
      'files' => $row['files'],
      'status' => $row['status'],
      'created_at' => $row['created_at'],
      'supplier_name' => $row['supplier_name'],
      'supplier_country' => $row['supplier_country'],
      'supplier_score' => $row['supplier_score'],
      'supplier_region' => $row['supplier_region'],
      'supplier_homepage' => $row['supplier_homepage'],
      'supplier_bizno' => $row['supplier_bizno'],
      'supplier_docs' => $row['supplier_docs'],
      'bizno' => $row['bizno'],
      'classification_no' => $row['classification_no'],
      'classification_name' => $row['classification_name'],
      'has_cert' => rowHasCert($row),
      'has_files' => rowHasFiles($row),
    ];
    if (rowHasCert($row)) $certCount++;
    if (rowHasFiles($row)) $docCount++;
    $statuses[$row['status'] ?? 'unknown'] = ($statuses[$row['status'] ?? 'unknown'] ?? 0) + 1;
    $categories[$row['category'] ?? '기타'] = ($categories[$row['category'] ?? '기타'] ?? 0) + 1;
    $suppliers[$row['supplier_name'] ?? '미상'] = ($suppliers[$row['supplier_name'] ?? '미상'] ?? 0) + 1;
  }

  arsort($statuses);
  arsort($categories);
  arsort($suppliers);

  $suggestions = [];
  if ($q !== '' && count($items) === 0) {
    $ranked = array_map(function (array $row) use ($needle) {
      $scores = [];
      similar_text($needle, normalizeSearchText((string)($row['name'] ?? '')), $s1); $scores[] = $s1;
      similar_text($needle, normalizeSearchText((string)($row['supplier_name'] ?? '')), $s2); $scores[] = $s2;
      similar_text($needle, normalizeSearchText((string)($row['supplier_region'] ?? '')), $s3); $scores[] = $s3;
      similar_text($needle, normalizeSearchText((string)($row['classification_name'] ?? '')), $s4); $scores[] = $s4;
      $row['_score'] = max($scores);
      return $row;
    }, productSuggestionCandidates());
    usort($ranked, fn($a, $b) => ($b['_score'] <=> $a['_score']) ?: strcmp((string)($b['created_at'] ?? ''), (string)($a['created_at'] ?? '')));
    $suggestions = array_slice($ranked, 0, 5);
    $suggestions = array_map(fn($row) => array_diff_key($row, ['_score' => true]), $suggestions);
  }

  $totals = db()->querySingle("
    select
      count(*) as total,
      sum(case when trim(coalesce(certs, '')) <> '' then 1 else 0 end) as certed,
      sum(case when trim(coalesce(files, '')) <> '' then 1 else 0 end) as doced
    from products
  ", true) ?: ['total' => 0, 'certed' => 0, 'doced' => 0];

  $payload = [
    'ok' => true,
    'query' => [
      'q' => $q,
      'category' => $category,
      'supplier' => $supplier,
      'status' => $status,
      'sort' => $sort,
      'page' => $page,
      'perPage' => $perPage,
    ],
    'stats' => [
      'total' => (int)($totals['total'] ?? 0),
      'returned' => count($items),
      'totalPages' => (int)ceil(max($total, 1) / $perPage),
      'certCoverage' => (int)($totals['total'] ?? 0) > 0 ? round(((int)($totals['certed'] ?? 0) / (int)($totals['total'] ?? 0)) * 100, 1) : 0,
      'docCoverage' => (int)($totals['total'] ?? 0) > 0 ? round(((int)($totals['doced'] ?? 0) / (int)($totals['total'] ?? 0)) * 100, 1) : 0,
      'statusCounts' => $statuses,
    ],
    'facets' => [
      'categories' => topCounts("select coalesce(category, '기타') as name, count(*) as count from products group by coalesce(category, '기타') order by count(*) desc", 100),
      'suppliers' => topCounts("select coalesce(s.name, '미상') as name, count(*) as count from products p left join suppliers s on s.id = p.supplier_id group by coalesce(s.name, '미상') order by count(*) desc", 100),
      'regions' => topCounts("select coalesce(s.region, '미상') as name, count(*) as count from products p left join suppliers s on s.id = p.supplier_id group by coalesce(s.region, '미상') order by count(*) desc", 100),
      'statuses' => topCounts("select coalesce(status, 'unknown') as name, count(*) as count from products group by coalesce(status, 'unknown') order by count(*) desc", 20),
    ],
    'items' => $items,
    'suggestions' => $suggestions,
  ];

  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
