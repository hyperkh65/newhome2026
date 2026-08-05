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

function fetchAll(string $sql): array {
  $rows = [];
  $res = db()->query($sql);
  if (!$res) return $rows;
  while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $rows[] = $row;
  }
  return $rows;
}

function fetchOne(string $sql): array {
  $res = db()->querySingle($sql, true);
  return is_array($res) ? $res : [];
}

function asInt($value): int {
  return (int)($value ?? 0);
}

function topCategories(array $products): array {
  $map = [];
  foreach ($products as $row) {
    $category = trim((string)($row['category'] ?? ''));
    if ($category === '') continue;
    $map[$category] = ($map[$category] ?? 0) + 1;
  }
  arsort($map);
  $items = [];
  foreach (array_slice($map, 0, 6, true) as $category => $count) {
    $items[] = ['category' => $category, 'count' => $count];
  }
  return $items;
}

function topRegions(array $suppliers): array {
  $map = [];
  foreach ($suppliers as $row) {
    $region = trim((string)($row['region'] ?? ''));
    if ($region === '') continue;
    $map[$region] = ($map[$region] ?? 0) + 1;
  }
  arsort($map);
  $items = [];
  foreach (array_slice($map, 0, 6, true) as $region => $count) {
    $items[] = ['region' => $region, 'count' => $count];
  }
  return $items;
}

function parsePrice(string $value): float {
  $value = preg_replace('/[^0-9.]/', '', $value);
  return (float)($value ?: 0);
}

function pct(float $num): string {
  return ($num >= 0 ? '+' : '') . number_format($num, 1) . '%';
}

require_once __DIR__ . '/datahub-live.php';

function liveOverviewSnapshot(): ?array {
  $suppliers = datahub_cache_load('live_suppliers_365_80_100', 60 * 60 * 24 * 30);
  $supplierItems = $suppliers['items'] ?? [];
  $products = datahub_cache_load('live_products_' . md5(json_encode([count($supplierItems), 120, 3, 30])), 60 * 60 * 24 * 30);
  $productItems = is_array($products)
    ? ($products['items'] ?? [])
    : fetchAll("select id,name,category,hs_code,power,cct,certs,target_price,korea_price,status,created_at,files from products order by datetime(created_at) desc");
  if (count($supplierItems) === 0 && count($productItems) === 0) {
    return null;
  }

  $productUpdatedAt = is_array($products)
    ? (string)($products['updatedAt'] ?? gmdate('c'))
    : (string)($productItems[0]['created_at'] ?? gmdate('c'));

  return [
    'suppliers' => $supplierItems,
    'products' => $productItems,
    'updatedAt' => max((string)($suppliers['updatedAt'] ?? gmdate('c')), $productUpdatedAt),
  ];
}

$live = liveOverviewSnapshot();
if ($live) {
  $suppliers = $live['suppliers'];
  $products = $live['products'];
  $priceWatch = fetchAll("select id,product_name,market,vendor,price,currency,note,created_at from price_watch order by datetime(created_at) desc");
  $events = fetchAll("select id,entity_type,action,note,created_at from events order by datetime(created_at) desc");
  $snapshots = fetchAll("select id,source,label,payload,created_at from market_snapshots order by datetime(created_at) desc");

  $latestProduct = $products[0] ?? null;
  $latestSupplier = $suppliers[0] ?? null;
  $latestPrice = $priceWatch[0] ?? null;
  $latestEvent = $events[0] ?? null;
  $latestSnapshot = $snapshots[0] ?? null;

  $pendingSuppliers = 0;
  $pendingProducts = count(array_filter($products, fn($row) => ($row['status'] ?? '') === 'pending'));
  $approvedProducts = count(array_filter($products, fn($row) => ($row['status'] ?? '') === 'approved'));
  $certifiedProducts = count(array_filter($products, fn($row) => trim((string)($row['certs'] ?? '')) !== ''));
  $documentedProducts = count(array_filter($products, fn($row) => trim((string)($row['files'] ?? '')) !== ''));
  $certCoverage = count($products) > 0 ? round(($certifiedProducts / count($products)) * 100, 1) : 0;
  $docCoverage = count($products) > 0 ? round(($documentedProducts / count($products)) * 100, 1) : 0;
  $avgSupplierScore = count($suppliers) > 0
    ? round(array_sum(array_map(fn($row) => (int)($row['score'] ?? 0), $suppliers)) / count($suppliers), 1)
    : 0;
  $supplierRegions = [];
  foreach ($suppliers as $row) {
    $region = trim((string)($row['region'] ?? '미상'));
    $supplierRegions[$region] = ($supplierRegions[$region] ?? 0) + 1;
  }
  arsort($supplierRegions);
  $topRegionLabel = array_key_first($supplierRegions) ?: 'No region';
  $topRegionShare = count($suppliers) > 0 ? round((($supplierRegions[$topRegionLabel] ?? 0) / count($suppliers)) * 100, 1) : 0;
  $productCategories = [];
  foreach ($products as $row) {
    $category = trim((string)($row['category'] ?? '기타'));
    $productCategories[$category] = ($productCategories[$category] ?? 0) + 1;
  }
  arsort($productCategories);
  $topCategoryLabel = array_key_first($productCategories) ?: 'No category';
  $topCategoryShare = count($products) > 0 ? round((($productCategories[$topCategoryLabel] ?? 0) / count($products)) * 100, 1) : 0;
  $targetPrice = parsePrice((string)($latestProduct['target_price'] ?? ''));
  $marketPrice = parsePrice((string)($latestPrice['price'] ?? ''));
  $priceGap = ($targetPrice > 0 && $marketPrice > 0) ? round((($marketPrice - $targetPrice) / $targetPrice) * 100, 1) : null;
  $pricingTone = ($priceGap === null) ? 'neutral' : ($priceGap > 0 ? 'warning' : 'positive');

  $procurementRead = [];
  $procurementRead[] = count($products) > 0
    ? "등록 제품 카탈로그는 {$topCategoryLabel} 중심이며 비중은 {$topCategoryShare}%입니다."
    : '제품 카탈로그가 비어 있습니다.';
  $procurementRead[] = count($products) > 0
    ? "서류 첨부 비율은 {$docCoverage}%이고 인증 커버리지는 {$certCoverage}%입니다."
    : '서류와 인증 비율을 계산할 제품이 없습니다.';
  $procurementRead[] = $priceGap !== null
    ? "관찰가와 목표가의 격차는 " . pct($priceGap) . " 입니다."
    : '가격 비교 샘플이 아직 부족합니다.';
  $procurementRead[] = count($suppliers) > 0
    ? "공급사 평균 신뢰도 점수는 {$avgSupplierScore}점입니다."
    : '';
  $procurementRead[] = count($suppliers) > 0
    ? "본사 소재지는 {$topRegionLabel} 중심이며 비중은 {$topRegionShare}%입니다."
    : '';

  $payload = [
    'ok' => true,
    'fallback' => false,
    'updatedAt' => $live['updatedAt'] ?? gmdate('c'),
    'stats' => [
      'suppliers' => count($suppliers),
      'products' => count($products),
      'priceWatch' => count($priceWatch),
      'events' => count($events),
      'snapshots' => count($snapshots),
    ],
    'summary' => [
      'pendingSuppliers' => $pendingSuppliers,
      'pendingProducts' => $pendingProducts,
      'approvedProducts' => $approvedProducts,
      'certCoverage' => $certCoverage,
      'docCoverage' => $docCoverage,
      'avgSupplierScore' => $avgSupplierScore,
      'topCategoryLabel' => $topCategoryLabel,
      'topCategoryShare' => $topCategoryShare,
      'topRegionLabel' => $topRegionLabel,
      'topRegionShare' => $topRegionShare,
      'priceGap' => $priceGap,
      'pricingTone' => $pricingTone,
    ],
    'dataMode' => 'live',
    'topCategories' => topCategories($products),
    'topRegions' => topRegions($suppliers),
    'latestProducts' => array_slice($products, 0, 4),
    'latestSuppliers' => array_slice($suppliers, 0, 4),
    'latestPriceWatch' => array_slice($priceWatch, 0, 4),
    'latestEvents' => array_slice($events, 0, 5),
    'latestSnapshot' => $latestSnapshot,
    'procurementRead' => array_values(array_filter($procurementRead, fn($line) => trim((string)$line) !== '')),
    'signals' => [],
    'thesis' => '',
    'watchouts' => [],
    'sources' => [
      ['key' => 'suppliers', 'label' => 'Suppliers', 'status' => 'live', 'updatedAt' => $live['updatedAt'] ?? null, 'note' => 'data.go.kr live procurement supplier snapshot'],
      ['key' => 'products', 'label' => 'Products', 'status' => 'live', 'updatedAt' => $live['updatedAt'] ?? null, 'note' => 'data.go.kr live procurement product snapshot'],
      ['key' => 'price-watch', 'label' => 'Price Watch', 'status' => count($priceWatch) > 0 ? 'live' : 'fallback', 'updatedAt' => $latestPrice['created_at'] ?? null, 'note' => count($priceWatch) > 0 ? 'Alibaba / market price samples' : 'no watch rows yet'],
      ['key' => 'events', 'label' => 'Activity Log', 'status' => count($events) > 0 ? 'live' : 'fallback', 'updatedAt' => $latestEvent['created_at'] ?? null, 'note' => count($events) > 0 ? 'approval and audit trail' : 'no activity rows yet'],
      ['key' => 'snapshots', 'label' => 'Market Snapshots', 'status' => count($snapshots) > 0 ? 'cached' : 'fallback', 'updatedAt' => $latestSnapshot['created_at'] ?? null, 'note' => count($snapshots) > 0 ? 'historical market snapshots' : 'no market snapshots yet'],
    ],
  ];

  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

try {
  $products = fetchAll("select id,name,category,hs_code,power,cct,certs,target_price,korea_price,status,created_at,files from products order by datetime(created_at) desc");
  $suppliers = fetchAll("select id,name,country,category,status,score,created_at,region,homepage,bizno,docs from suppliers order by datetime(created_at) desc");
  $priceWatch = fetchAll("select id,product_name,market,vendor,price,currency,note,created_at from price_watch order by datetime(created_at) desc");
  $events = fetchAll("select id,entity_type,action,note,created_at from events order by datetime(created_at) desc");
  $snapshots = fetchAll("select id,source,label,payload,created_at from market_snapshots order by datetime(created_at) desc");

  $latestProduct = $products[0] ?? null;
  $latestSupplier = $suppliers[0] ?? null;
  $latestPrice = $priceWatch[0] ?? null;
  $latestEvent = $events[0] ?? null;
  $latestSnapshot = $snapshots[0] ?? null;
  $looksSample = function (array $rows): bool {
    foreach ($rows as $row) {
      $name = strtolower(trim((string)($row['name'] ?? '')));
      if ($name !== '' && str_starts_with($name, 'preview')) return true;
    }
    return false;
  };
  $dataMode = (count($products) > 0 || count($suppliers) > 0)
    ? (($looksSample($products) || $looksSample($suppliers)) ? 'sample' : 'live')
    : 'empty';

  $pendingSuppliers = count(array_filter($suppliers, fn($row) => ($row['status'] ?? '') === 'pending'));
  $pendingProducts = count(array_filter($products, fn($row) => ($row['status'] ?? '') === 'pending'));
  $approvedProducts = count(array_filter($products, fn($row) => ($row['status'] ?? '') === 'approved'));
  $certifiedProducts = count(array_filter($products, fn($row) => trim((string)($row['certs'] ?? '')) !== ''));
  $documentedProducts = count(array_filter($products, fn($row) => trim((string)($row['files'] ?? '')) !== ''));
  $certCoverage = count($products) > 0 ? round(($certifiedProducts / count($products)) * 100, 1) : 0;
  $docCoverage = count($products) > 0 ? round(($documentedProducts / count($products)) * 100, 1) : 0;
  $avgSupplierScore = count($suppliers) > 0
    ? round(array_sum(array_map(fn($row) => (int)($row['score'] ?? 0), $suppliers)) / count($suppliers), 1)
    : 0;
  $topRegion = topRegions($suppliers)[0] ?? null;
  $topRegionLabel = $topRegion['region'] ?? 'No region';
  $topRegionShare = count($suppliers) > 0 && $topRegion ? round(($topRegion['count'] / count($suppliers)) * 100, 1) : 0;

  $topCategory = topCategories($products)[0] ?? null;
  $topCategoryLabel = $topCategory['category'] ?? 'No category';
  $topCategoryShare = count($products) > 0 && $topCategory ? round(($topCategory['count'] / count($products)) * 100, 1) : 0;

  $targetPrice = parsePrice((string)($latestProduct['target_price'] ?? ''));
  $marketPrice = parsePrice((string)($latestPrice['price'] ?? ''));
  $priceGap = ($targetPrice > 0 && $marketPrice > 0) ? round((($marketPrice - $targetPrice) / $targetPrice) * 100, 1) : null;
  $pricingTone = ($priceGap === null) ? 'neutral' : ($priceGap > 0 ? 'warning' : 'positive');

  $procurementRead = [];
  if (count($products) === 0 && count($suppliers) === 0) {
    $procurementRead[] = '아직 조달 데이터가 비어 있습니다.';
  } else {
    $procurementRead[] = count($products) > 0
      ? "등록 제품 카탈로그는 {$topCategoryLabel} 중심이며 비중은 {$topCategoryShare}%입니다."
      : '제품 카탈로그가 비어 있습니다.';
    $procurementRead[] = count($products) > 0
      ? "서류 첨부 비율은 {$docCoverage}%이고 인증 커버리지는 {$certCoverage}%입니다."
      : '서류와 인증 비율을 계산할 제품이 없습니다.';
    $procurementRead[] = $priceGap !== null
      ? "관찰가와 목표가의 격차는 " . pct($priceGap) . " 입니다."
      : '가격 비교 샘플이 아직 부족합니다.';
    $procurementRead[] = count($suppliers) > 0
      ? "공급사 {$pendingSuppliers}/" . count($suppliers) . " 개가 아직 pending 상태입니다."
      : '공급사 데이터가 아직 없습니다.';
    $procurementRead[] = count($suppliers) > 0
      ? "공급사 평균 신뢰도 점수는 {$avgSupplierScore}점입니다."
      : '';
    $procurementRead[] = count($suppliers) > 0
      ? "본사 소재지는 {$topRegionLabel} 중심이며 비중은 {$topRegionShare}%입니다."
      : '';
  }

  $signals = [
    [
      'key' => 'pricing',
      'label' => '조달 가격 신호',
      'value' => $priceGap !== null ? pct($priceGap) : '-',
      'tone' => $pricingTone,
      'note' => $priceGap !== null
        ? '샘플 가격이 목표가보다 얼마나 비싼지 보여줍니다.'
        : '시장가와 목표가를 비교할 샘플이 더 필요합니다.',
    ],
    [
      'key' => 'approval',
      'label' => '조달 승인 병목',
      'value' => ($pendingSuppliers + $pendingProducts) . ' pending',
      'tone' => ($pendingSuppliers + $pendingProducts) > 0 ? 'warning' : 'positive',
      'note' => '공급사와 제품 승인 대기 수를 합쳐 공개 전 검수 압력을 보여줍니다.',
    ],
    [
      'key' => 'certification',
      'label' => '인증 커버리지',
      'value' => $certCoverage . '%',
      'tone' => $certCoverage >= 80 ? 'positive' : 'warning',
      'note' => '현재 등록된 제품 중 인증서 문자열이 채워진 비율입니다.',
    ],
    [
      'key' => 'concentration',
      'label' => '품목 집중도',
      'value' => $topCategoryShare > 0 ? $topCategoryShare . '%' : '-',
      'tone' => $topCategoryShare >= 70 ? 'warning' : 'neutral',
      'note' => '한 품목에 조달 데이터가 몰리면 수요 해석 전에 확장이 필요합니다.',
    ],
    [
      'key' => 'supplier-score',
      'label' => '공급사 점수',
      'value' => $avgSupplierScore > 0 ? $avgSupplierScore . '점' : '-',
      'tone' => $avgSupplierScore >= 70 ? 'positive' : ($avgSupplierScore > 0 ? 'neutral' : 'warning'),
      'note' => '등록 공급사의 평균 신뢰도 점수입니다.',
    ],
    [
      'key' => 'region',
      'label' => '본사 소재지',
      'value' => $topRegionShare > 0 ? $topRegionLabel . ' ' . $topRegionShare . '%' : '-',
      'tone' => $topRegionShare >= 60 ? 'warning' : 'neutral',
      'note' => '공급사 본사 소재지 분포입니다.',
    ],
  ];

  $thesisParts = [];
  if ($priceGap !== null) {
    $thesisParts[] = $priceGap > 0
      ? "관찰가가 목표가보다 " . pct($priceGap) . " 높아 조달 단가 압력이 큽니다."
      : "관찰가가 목표가보다 낮아 협상 여지가 있습니다.";
  }
  if (($pendingSuppliers + $pendingProducts) > 0) {
    $thesisParts[] = "승인 대기 {$pendingSuppliers}/" . count($suppliers) . " 공급사, {$pendingProducts}/" . count($products) . " 제품이 병목입니다.";
  }
  if ($topCategoryShare > 0) {
    $thesisParts[] = "현재 카탈로그는 {$topCategoryLabel}에 {$topCategoryShare}% 집중되어 있습니다.";
  }
  if ($certCoverage < 100 && count($products) > 0) {
    $thesisParts[] = "인증 커버리지가 {$certCoverage}%라 일부 품목은 서류 보강이 필요합니다.";
  }
  if ($docCoverage < 100 && count($products) > 0) {
    $thesisParts[] = "서류 첨부 비율이 {$docCoverage}%라 제품 등록 보강 여지가 있습니다.";
  }
  if ($avgSupplierScore > 0) {
    $thesisParts[] = "공급사 평균 신뢰도는 {$avgSupplierScore}점입니다.";
  }
  if ($topRegionShare > 0) {
    $thesisParts[] = "본사 소재지는 {$topRegionLabel}에 {$topRegionShare}% 집중되어 있습니다.";
  }
  $thesis = count($thesisParts) > 0
    ? implode(' ', $thesisParts)
    : '아직 조달 해석을 만들 충분한 데이터가 없습니다.';

  $watchouts = [];
  if ($priceGap !== null && $priceGap > 20) $watchouts[] = '단가 프리미엄이 높아 협상 우선순위를 올려야 합니다.';
  if (($pendingSuppliers + $pendingProducts) > 0) $watchouts[] = '승인 대기 항목이 있어 공개 통계의 신뢰도가 아직 제한적입니다.';
  if ($certCoverage < 100 && count($products) > 0) $watchouts[] = '인증 정보가 빠진 품목을 먼저 보강해야 합니다.';
  if ($docCoverage < 100 && count($products) > 0) $watchouts[] = '첨부 서류가 비어 있는 제품을 먼저 보강해야 합니다.';
  if ($topCategoryShare >= 70) $watchouts[] = '품목 구성이 한 카테고리에 과도하게 쏠려 있습니다.';
  if ($topRegionShare >= 70) $watchouts[] = '본사 소재지가 한 지역에 쏠려 있습니다.';

  $sources = [
    [
      'key' => 'suppliers',
      'label' => 'Suppliers',
      'status' => count($suppliers) > 0 ? 'live' : 'fallback',
      'updatedAt' => $latestSupplier['created_at'] ?? null,
      'note' => count($suppliers) > 0 ? 'local sqlite supplier registry' : 'no supplier rows yet',
    ],
    [
      'key' => 'products',
      'label' => 'Products',
      'status' => count($products) > 0 ? 'live' : 'fallback',
      'updatedAt' => $latestProduct['created_at'] ?? null,
      'note' => count($products) > 0 ? 'local sqlite product master' : 'no product rows yet',
    ],
    [
      'key' => 'price-watch',
      'label' => 'Price Watch',
      'status' => count($priceWatch) > 0 ? 'live' : 'fallback',
      'updatedAt' => $latestPrice['created_at'] ?? null,
      'note' => count($priceWatch) > 0 ? 'Alibaba / market price samples' : 'no watch rows yet',
    ],
    [
      'key' => 'events',
      'label' => 'Activity Log',
      'status' => count($events) > 0 ? 'live' : 'fallback',
      'updatedAt' => $latestEvent['created_at'] ?? null,
      'note' => count($events) > 0 ? 'approval and audit trail' : 'no activity rows yet',
    ],
    [
      'key' => 'snapshots',
      'label' => 'Market Snapshots',
      'status' => count($snapshots) > 0 ? 'cached' : 'fallback',
      'updatedAt' => $latestSnapshot['created_at'] ?? null,
      'note' => count($snapshots) > 0 ? 'historical market snapshots' : 'no market snapshots yet',
    ],
  ];

  $payload = [
    'ok' => true,
    'fallback' => false,
    'updatedAt' => gmdate('c'),
    'stats' => [
      'suppliers' => count($suppliers),
      'products' => count($products),
      'priceWatch' => count($priceWatch),
      'events' => count($events),
      'snapshots' => count($snapshots),
    ],
    'summary' => [
      'pendingSuppliers' => $pendingSuppliers,
      'pendingProducts' => $pendingProducts,
      'approvedProducts' => $approvedProducts,
      'certCoverage' => $certCoverage,
      'docCoverage' => $docCoverage,
      'avgSupplierScore' => $avgSupplierScore,
      'topCategoryLabel' => $topCategoryLabel,
      'topCategoryShare' => $topCategoryShare,
      'topRegionLabel' => $topRegionLabel,
      'topRegionShare' => $topRegionShare,
      'priceGap' => $priceGap,
      'pricingTone' => $pricingTone,
    ],
    'dataMode' => $dataMode,
    'topCategories' => topCategories($products),
    'topRegions' => topRegions($suppliers),
    'latestProducts' => array_slice($products, 0, 4),
    'latestSuppliers' => array_slice($suppliers, 0, 4),
    'latestPriceWatch' => array_slice($priceWatch, 0, 4),
    'latestEvents' => array_slice($events, 0, 5),
    'latestSnapshot' => $latestSnapshot,
    'procurementRead' => array_values(array_filter($procurementRead, fn($line) => trim((string)$line) !== '')),
    'signals' => $signals,
    'thesis' => $thesis,
    'watchouts' => $watchouts,
    'sources' => $sources,
  ];

  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  echo json_encode([
    'ok' => false,
    'fallback' => true,
    'error' => $e->getMessage(),
    'updatedAt' => gmdate('c'),
    'stats' => ['suppliers' => 0, 'products' => 0, 'priceWatch' => 0, 'events' => 0, 'snapshots' => 0],
    'topCategories' => [],
    'latestProducts' => [],
    'latestSuppliers' => [],
    'latestPriceWatch' => [],
    'latestEvents' => [],
    'sources' => [],
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
