<?php
declare(strict_types=1);

function datahub_db_path(): string {
  return '/volume1/web/datahub-storage/led_datahub.sqlite';
}

function datahub_db(): SQLite3 {
  static $db = null;
  if ($db instanceof SQLite3) {
    return $db;
  }
  $db = new SQLite3(datahub_db_path(), SQLITE3_OPEN_READONLY);
  return $db;
}

function datahub_setting(string $key): string {
  $stmt = datahub_db()->prepare('select value from app_settings where key = :key limit 1');
  $stmt->bindValue(':key', $key, SQLITE3_TEXT);
  $row = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
  return trim((string)($row['value'] ?? ''));
}

function datahub_service_key(): string {
  return datahub_setting('DATA_GO_KR_SERVICE_KEY');
}

function datahub_http_get(string $url): string {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 20,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_USERAGENT => 'datahub-live/1.0',
  ]);
  $body = curl_exec($ch);
  if ($body === false) {
    $err = curl_error($ch);
    curl_close($ch);
    throw new RuntimeException($err ?: 'curl request failed');
  }
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  curl_close($ch);
  if ($code >= 400) {
    throw new RuntimeException('HTTP ' . $code . ' for ' . $url);
  }
  return $body;
}

function datahub_api_xml(string $baseUrl, string $path, array $params): SimpleXMLElement {
  $serviceKey = $params['serviceKey'] ?? '';
  unset($params['serviceKey']);
  $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
  $url = rtrim($baseUrl, '/') . $path . '?serviceKey=' . $serviceKey;
  if ($query !== '') {
    $url .= '&' . $query;
  }
  $xml = datahub_http_get($url);
  libxml_use_internal_errors(true);
  $doc = simplexml_load_string($xml);
  if ($doc === false) {
    throw new RuntimeException('Failed to parse XML from ' . $path);
  }
  return $doc;
}

function datahub_xml_items(SimpleXMLElement $doc): array {
  $items = [];
  $nodes = $doc->xpath('//body/items/item') ?: [];
  foreach ($nodes as $node) {
    $row = [];
    foreach ($node->children() as $child) {
      $row[$child->getName()] = trim((string)$child);
    }
    if ($row) {
      $items[] = $row;
    }
  }
  return $items;
}

function datahub_xml_total_count(SimpleXMLElement $doc): int {
  $rows = $doc->xpath('//body/totalCount');
  if (!$rows || !isset($rows[0])) {
    return 0;
  }
  return (int)trim((string)$rows[0]);
}

function datahub_cache_dir(): string {
  $dir = '/volume1/web/datahub-storage/cache';
  if (!is_dir($dir)) {
    @mkdir($dir, 0775, true);
  }
  return $dir;
}

function datahub_cache_path(string $name): string {
  return rtrim(datahub_cache_dir(), '/') . '/' . $name . '.json';
}

function datahub_cache_load(string $name, int $ttlSeconds): ?array {
  $path = datahub_cache_path($name);
  if (!is_file($path)) {
    return null;
  }
  if ((time() - filemtime($path)) > $ttlSeconds) {
    return null;
  }
  $json = file_get_contents($path);
  if ($json === false) {
    return null;
  }
  $decoded = json_decode($json, true);
  return is_array($decoded) ? $decoded : null;
}

function datahub_cache_save(string $name, array $payload): void {
  $path = datahub_cache_path($name);
  @file_put_contents(
    $path,
    json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
  );
}

function datahub_normalize_key(string $value): string {
  $value = mb_strtolower(trim($value), 'UTF-8');
  $value = preg_replace('/^(주식회사|㈜|\(주\))/u', '', $value);
  $value = preg_replace('/(주식회사|㈜|\(주\))$/u', '', $value);
  $value = preg_replace('/[^\p{L}\p{N}]+/u', '', $value);
  return trim((string)$value);
}

function datahub_category_fallback(string $value): string {
  $value = trim($value);
  return $value !== '' ? $value : '기타';
}

function datahub_infer_supplier_category(array $row): string {
  return datahub_category_fallback(
    trim((string)($row['corpBsnsDivNm'] ?? '')) !== '' ? trim((string)($row['corpBsnsDivNm'] ?? '')) :
    (trim((string)($row['mnfctDivNm'] ?? '')) !== '' ? trim((string)($row['mnfctDivNm'] ?? '')) :
    (trim((string)($row['bizIndClsfcNm'] ?? '')) !== '' ? trim((string)($row['bizIndClsfcNm'] ?? '')) :
    trim((string)($row['bizTpNm'] ?? ''))))
  );
}

function datahub_infer_product_category(array $row): string {
  return datahub_category_fallback(
    trim((string)($row['prdctClsfcNoNm'] ?? '')) !== '' ? trim((string)($row['prdctClsfcNoNm'] ?? '')) :
    (trim((string)($row['prdctClsfcNm'] ?? '')) !== '' ? trim((string)($row['prdctClsfcNm'] ?? '')) :
    (trim((string)($row['dtilPrdctClsfcNoNm'] ?? '')) !== '' ? trim((string)($row['dtilPrdctClsfcNoNm'] ?? '')) :
    trim((string)($row['prdctNm'] ?? ''))))
  );
}

function datahub_fetch_live_suppliers(int $daysBack = 365, int $pageLimit = 80, int $rows = 100): array {
  $cacheKey = "live_suppliers_{$daysBack}_{$pageLimit}_{$rows}";
  $cached = datahub_cache_load($cacheKey, 600);
  if (is_array($cached)) {
    return $cached;
  }

  $serviceKey = datahub_service_key();
  if ($serviceKey === '') {
    return ['items' => [], 'totalCount' => 0, 'updatedAt' => null];
  }

  $begin = (new DateTimeImmutable(sprintf('-%d days', $daysBack)))->setTime(0, 0)->format('YmdHi');
  $end = (new DateTimeImmutable('now', new DateTimeZone('Asia/Seoul')))
    ->setTime((int)date('H'), (int)date('i'))
    ->format('YmdHi');

  $suppliers = [];
  $seen = [];
  $totalCount = 0;
  $baseUrl = 'https://apis.data.go.kr/1230000/ao/UsrInfoService02';
  for ($page = 1; $page <= $pageLimit; $page++) {
    $doc = datahub_api_xml($baseUrl, '/getPrcrmntCorpBasicInfo02', [
      'serviceKey' => $serviceKey,
      'inqryDiv' => '1',
      'inqryBgnDt' => $begin,
      'inqryEndDt' => $end,
      'pageNo' => (string)$page,
      'numOfRows' => (string)$rows,
      'Type' => 'xml',
    ]);
    $totalCount = datahub_xml_total_count($doc);
    $items = datahub_xml_items($doc);
    if (!$items) {
      break;
    }
    foreach ($items as $row) {
      $bizno = trim((string)($row['bizno'] ?? ''));
      if ($bizno !== '' && isset($seen[$bizno])) {
        continue;
      }
      if ($bizno !== '') {
        $seen[$bizno] = true;
      }
      $suppliers[] = $row;
    }
    if (count($seen) >= $totalCount) {
      break;
    }
  }

  $payload = [
    'updatedAt' => gmdate('c'),
    'totalCount' => $totalCount,
    'items' => $suppliers,
  ];
  datahub_cache_save($cacheKey, $payload);
  return $payload;
}

function datahub_fetch_live_products(array $supplierSnapshot, int $supplierLimit = 200, int $pagesPerSupplier = 4, int $rows = 30): array {
  $cacheKey = 'live_products_' . md5(json_encode([count($supplierSnapshot['items'] ?? []), $supplierLimit, $pagesPerSupplier, $rows]));
  $cached = datahub_cache_load($cacheKey, 600);
  if (is_array($cached)) {
    return $cached;
  }

  $serviceKey = datahub_service_key();
  if ($serviceKey === '') {
    return ['items' => [], 'updatedAt' => null];
  }

  $suppliers = array_slice($supplierSnapshot['items'] ?? [], 0, $supplierLimit);
  $products = [];
  $seen = [];
  $baseUrl = 'https://apis.data.go.kr/1230000/ao/UsrInfoService02';

  foreach ($suppliers as $supplierRow) {
    $bizno = trim((string)($supplierRow['bizno'] ?? ''));
    if ($bizno === '') {
      continue;
    }
    for ($page = 1; $page <= $pagesPerSupplier; $page++) {
      $doc = datahub_api_xml($baseUrl, '/getPrcrmntCorpSplyPrdctInfo02', [
        'serviceKey' => $serviceKey,
        'inqryDiv' => '1',
        'bizno' => $bizno,
        'pageNo' => (string)$page,
        'numOfRows' => (string)$rows,
        'Type' => 'xml',
      ]);
      $items = datahub_xml_items($doc);
      if (!$items) {
        break;
      }
      foreach ($items as $row) {
        $name = trim((string)($row['prdctNm'] ?? $row['dtilPrdctClsfcNoNm'] ?? ''));
        if ($name === '') {
          continue;
        }
        $classificationNo = trim((string)($row['dtilPrdctClsfcNo'] ?? $row['prdctNo'] ?? ''));
        $dedupe = $bizno . '|' . $classificationNo . '|' . datahub_normalize_key($name);
        if (isset($seen[$dedupe])) {
          continue;
        }
        $seen[$dedupe] = true;
        $products[] = [
          'name' => $name,
          'category' => datahub_infer_product_category($row),
          'hs_code' => $classificationNo,
          'classification_no' => $classificationNo,
          'classification_name' => trim((string)($row['dtilPrdctClsfcNoNm'] ?? '')),
          'supplier_name' => trim((string)($supplierRow['corpNm'] ?? $supplierRow['name'] ?? '')),
          'supplier_country' => trim((string)($supplierRow['cntryNm'] ?? '대한민국')),
          'supplier_score' => 70,
          'supplier_region' => trim((string)($supplierRow['rgnNm'] ?? $supplierRow['adrs'] ?? '')),
          'supplier_homepage' => trim((string)($supplierRow['hmpgAdrs'] ?? '')),
          'supplier_bizno' => $bizno,
          'supplier_docs' => trim((string)($supplierRow['adrs'] ?? '')),
          'bizno' => $bizno,
          'status' => 'approved',
          'created_at' => trim((string)($row['rgstDt'] ?? gmdate('Y-m-d H:i:s'))),
          'certs' => trim((string)($row['dtilPrdctClsfcNoNm'] ?? '')),
          'files' => '',
          'power' => '',
          'cct' => '',
          'target_price' => '',
          'korea_price' => '',
          'source' => 'data.go.kr/live',
        ];
      }
    }
  }

  $payload = [
    'updatedAt' => gmdate('c'),
    'items' => $products,
  ];
  datahub_cache_save($cacheKey, $payload);
  return $payload;
}
