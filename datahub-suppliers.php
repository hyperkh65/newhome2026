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

require_once __DIR__ . '/datahub-live-v2.php';

function liveSupplierScore(array $row): int {
  $score = 60;
  if (!empty($row['telNo'])) $score += 4;
  if (!empty($row['hmpgAdrs'])) $score += 4;
  if (!empty($row['ceoNm'])) $score += 2;
  if (!empty($row['adrs'])) $score += 2;
  return min(95, $score);
}

function liveSupplierCategory(array $row): string {
  return datahub_infer_supplier_category($row);
}

function liveSupplierRows(): array {
  if (datahub_setting('DATAHUB_ENABLE_LIVE_API') !== '1') {
    return [];
  }
  $snapshot = datahub_cache_load('live_suppliers_365_80_100', 600);
  if (!is_array($snapshot)) {
    $snapshot = datahub_fetch_live_suppliers();
  }
  $rows = [];
  foreach ($snapshot['items'] ?? [] as $row) {
    $name = trim((string)($row['corpNm'] ?? $row['name'] ?? ''));
    if ($name === '') {
      continue;
    }
    $region = trim((string)($row['rgnNm'] ?? $row['adrs'] ?? ''));
    $homepage = trim((string)($row['hmpgAdrs'] ?? ''));
    $docs = trim((string)($row['adrs'] ?? '')) . ($homepage !== '' ? "\n" . $homepage : '');
    $rows[] = [
      'name' => $name,
      'bizno' => trim((string)($row['bizno'] ?? '')),
      'country' => trim((string)($row['cntryNm'] ?? '대한민국')) ?: '대한민국',
      'contact' => trim((string)($row['telNo'] ?? '')),
      'email' => '',
      'category' => liveSupplierCategory($row),
      'docs' => $docs,
      'status' => 'approved',
      'score' => liveSupplierScore($row),
      'created_at' => trim((string)($row['rgstDt'] ?? gmdate('Y-m-d H:i:s'))),
      'region' => $region,
      'homepage' => $homepage,
      'doc_files' => $homepage,
      'source' => 'data.go.kr/live',
      'source_updated_at' => $snapshot['updatedAt'] ?? gmdate('c'),
    ];
  }
  return $rows;
}

function liveSupplierPayload(array $items, string $q, string $region, string $category, string $status, string $sort, int $page, int $perPage, ?int $totalOverride = null): array {
  $filtered = array_values(array_filter($items, function (array $row) use ($q, $region, $category, $status): bool {
    if ($q !== '') {
      $hay = strtolower(implode(' ', [$row['name'] ?? '', $row['bizno'] ?? '', $row['region'] ?? '', $row['docs'] ?? '', $row['homepage'] ?? '', $row['country'] ?? '']));
      if (!str_contains($hay, strtolower($q))) return false;
    }
    if ($region !== '' && ($row['region'] ?? '') !== $region) return false;
    if ($category !== '' && ($row['category'] ?? '') !== $category) return false;
    if ($status !== '' && ($row['status'] ?? '') !== $status) return false;
    return true;
  }));

  $sortFn = match ($sort) {
    'name' => fn($a, $b) => strcmp((string)$a['name'], (string)$b['name']),
    'region' => fn($a, $b) => strcmp((string)$a['region'], (string)$b['region']) ?: strcmp((string)$a['name'], (string)$b['name']),
    'score' => fn($a, $b) => (int)($b['score'] ?? 0) <=> (int)($a['score'] ?? 0) ?: strcmp((string)$a['name'], (string)$b['name']),
    default => fn($a, $b) => strcmp((string)$b['created_at'], (string)$a['created_at']),
  };
  usort($filtered, $sortFn);

  $total = $totalOverride ?? count($filtered);
  $offset = ($page - 1) * $perPage;
  $pageItems = array_slice($filtered, $offset, $perPage);

  $regions = [];
  $categories = [];
  $statuses = [];
  foreach ($items as $row) {
    $regions[$row['region'] ?? '미상'] = ($regions[$row['region'] ?? '미상'] ?? 0) + 1;
    $categories[$row['category'] ?? '기타'] = ($categories[$row['category'] ?? '기타'] ?? 0) + 1;
    $statuses[$row['status'] ?? 'unknown'] = ($statuses[$row['status'] ?? 'unknown'] ?? 0) + 1;
  }
  arsort($regions); arsort($categories); arsort($statuses);

  return [
    'ok' => true,
    'query' => [
      'q' => $q,
      'region' => $region,
      'category' => $category,
      'status' => $status,
      'sort' => $sort,
      'page' => $page,
      'perPage' => $perPage,
    ],
    'stats' => [
      'total' => $total,
      'returned' => count($pageItems),
      'totalPages' => (int)ceil(max($total, 1) / $perPage),
      'statusCounts' => $statuses,
    ],
    'facets' => [
      'regions' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($regions, 0, 12, true)), array_values(array_slice($regions, 0, 12, true))),
      'categories' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($categories, 0, 12, true)), array_values(array_slice($categories, 0, 12, true))),
      'statuses' => array_map(fn($name, $count) => ['name' => $name, 'count' => $count], array_keys(array_slice($statuses, 0, 8, true)), array_values(array_slice($statuses, 0, 8, true))),
    ],
    'items' => $pageItems,
    'source' => 'live',
  ];
}

try {
  $q = qv('q');
  $region = qv('region');
  $category = qv('category');
  $status = qv('status');
  $sort = qv('sort', 'recent');
  $page = max(1, (int)($_GET['page'] ?? 1));
  $perPage = min(200, max(8, (int)($_GET['perPage'] ?? 200)));
  $offset = ($page - 1) * $perPage;

  $liveItems = liveSupplierRows();
  if (datahub_setting('DATAHUB_ENABLE_LIVE_API') === '1' && $q !== '') {
    $shop = datahub_fetch_shop_suppliers($q, $page, $perPage);
    echo json_encode(liveSupplierPayload($shop['items'] ?? [], $q, $region, $category, $status, $sort, $page, $perPage, (int)($shop['totalCount'] ?? 0)), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  if (count($liveItems) > 0) {
    echo json_encode(liveSupplierPayload($liveItems, $q, $region, $category, $status, $sort, $page, $perPage), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
  }

  $where = ['1=1'];
  $params = [];
  if ($q !== '') {
    $where[] = '(name like :q or bizno like :q or region like :q or docs like :q or homepage like :q or country like :q)';
    $params[':q'] = '%' . $q . '%';
  }
  if ($region !== '') {
    $where[] = "coalesce(region, '') = :region";
    $params[':region'] = $region;
  }
  if ($category !== '') {
    $where[] = "coalesce(category, '') = :category";
    $params[':category'] = $category;
  }
  if ($status !== '') {
    $where[] = "coalesce(status, '') = :status";
    $params[':status'] = $status;
  }

  $orderBy = match ($sort) {
    'name' => 'name asc',
    'region' => "coalesce(region, '') asc, name asc",
    'score' => 'score desc, name asc',
    default => 'datetime(created_at) desc',
  };

  $countStmt = db()->prepare('select count(*) as n from suppliers where ' . implode(' and ', $where));
  if (!$countStmt) {
    echo json_encode(['ok' => false, 'phase' => 'count', 'error' => db()->lastErrorMsg()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    return;
  }
  foreach ($params as $key => $value) $countStmt->bindValue($key, $value, SQLITE3_TEXT);
  $total = (int)($countStmt->execute()->fetchArray(SQLITE3_ASSOC)['n'] ?? 0);

  $sql = "
    select id, name, bizno, country, contact, email, category, docs, status, score, created_at, region, homepage, doc_files, source, source_updated_at
    from suppliers
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
  $statuses = [];
  $regions = [];
  $categories = [];

  while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $items[] = [
      'id' => (int)$row['id'],
      'name' => $row['name'],
      'bizno' => $row['bizno'],
      'country' => $row['country'],
      'contact' => $row['contact'],
      'email' => $row['email'],
      'category' => $row['category'],
      'docs' => $row['docs'],
      'status' => $row['status'],
      'score' => $row['score'],
      'created_at' => $row['created_at'],
      'region' => $row['region'],
      'homepage' => $row['homepage'],
      'doc_files' => $row['doc_files'],
      'source' => $row['source'],
      'source_updated_at' => $row['source_updated_at'],
    ];
    $statuses[$row['status'] ?? 'unknown'] = ($statuses[$row['status'] ?? 'unknown'] ?? 0) + 1;
    $regions[$row['region'] ?? '미상'] = ($regions[$row['region'] ?? '미상'] ?? 0) + 1;
    $categories[$row['category'] ?? '기타'] = ($categories[$row['category'] ?? '기타'] ?? 0) + 1;
  }

  arsort($statuses);
  arsort($regions);
  arsort($categories);

  $payload = [
    'ok' => true,
    'query' => [
      'q' => $q,
      'region' => $region,
      'category' => $category,
      'status' => $status,
      'sort' => $sort,
      'page' => $page,
      'perPage' => $perPage,
    ],
    'stats' => [
      'total' => $total,
      'returned' => count($items),
      'totalPages' => (int)ceil(max($total, 1) / $perPage),
      'statusCounts' => $statuses,
    ],
    'facets' => [
      'regions' => topCounts("select coalesce(region, '미상') as name, count(*) as count from suppliers group by coalesce(region, '미상') order by count(*) desc", 100),
      'categories' => topCounts("select coalesce(category, '기타') as name, count(*) as count from suppliers group by coalesce(category, '기타') order by count(*) desc", 100),
      'statuses' => topCounts("select coalesce(status, 'unknown') as name, count(*) as count from suppliers group by coalesce(status, 'unknown') order by count(*) desc", 20),
    ],
    'items' => $items,
  ];

  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  echo json_encode(['ok' => false, 'error' => $e->getMessage()], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
