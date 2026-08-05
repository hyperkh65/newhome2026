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
  $source = datahub_db_path();
  $snapshotDir = '/tmp/datahub-cache';
  $snapshot = $snapshotDir . '/led_datahub.sqlite';
  if (!is_dir($snapshotDir)) {
    @mkdir($snapshotDir, 0777, true);
  }
  if (!file_exists($snapshot) || (@filemtime($source) !== false && @filemtime($snapshot) < @filemtime($source))) {
    @copy($source, $snapshot);
  }
  $db = new SQLite3($snapshot, SQLITE3_OPEN_READONLY);
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

function datahub_http_get(string $url, int $connectTimeout = 20, int $timeout = 60, array $headers = []): string {
  $ch = curl_init($url);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => $connectTimeout,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_USERAGENT => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    CURLOPT_ENCODING => '',
  ]);
  if ($headers) {
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
  }
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

function datahub_http_post_json(string $url, array $payload, array $headers = [], int $connectTimeout = 20, int $timeout = 60): array {
  $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($body === false) {
    throw new RuntimeException('Failed to encode JSON payload');
  }
  $ch = curl_init($url);
  $finalHeaders = array_merge([
    'Content-Type: application/json;charset=UTF-8',
    'Accept: application/json, text/plain, */*',
    'Origin: https://shop.g2b.go.kr',
    'Referer: https://shop.g2b.go.kr/',
    'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
  ], $headers);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => $connectTimeout,
    CURLOPT_TIMEOUT => $timeout,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => $finalHeaders,
    CURLOPT_ENCODING => '',
  ]);
  $resp = curl_exec($ch);
  if ($resp === false) {
    $err = curl_error($ch);
    curl_close($ch);
    throw new RuntimeException($err ?: 'curl request failed');
  }
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  curl_close($ch);
  if ($code >= 400) {
    throw new RuntimeException('HTTP ' . $code . ' for ' . $url);
  }
  $decoded = json_decode($resp, true);
  if (!is_array($decoded)) {
    throw new RuntimeException('Failed to parse JSON from ' . $url);
  }
  return $decoded;
}

function datahub_shop_api_term(string $term): string {
  $term = trim($term);
  if ($term === '') {
    return '';
  }

  $normalized = preg_replace('/^\s*(?:\(\s*주\s*\)|㈜|주식회사)\s*/u', '', $term);
  $normalized = trim((string)$normalized);

  return $normalized !== '' ? $normalized : $term;
}

function datahub_shop_search_vo(string $term, int $page, int $rows): array {
  $term = datahub_shop_api_term($term);
  return [
    'tabDiv' => '',
    'target' => '계300001,계300002,계309999',
    'apmlNo' => '',
    'itemCfnm' => '',
    'selectValue' => 'etpsNm',
    'searchKeyword' => $term,
    'reSelectValue' => '',
    'researchKeyword' => '',
    'andKeyword' => '',
    'orKeyword' => '',
    'notKeyword' => '',
    'lCate' => '',
    'mCate' => '',
    'etpsNm' => '',
    'ctrtClass' => '',
    'prcMgmtNo' => '',
    'mfrcNo' => '',
    'stndDt' => '',
    'endDt' => '',
    'sortCd' => 'rct',
    'sortOrder' => 'desc',
    'pageSize' => $rows,
    'currentPage' => $page,
    'recordCountPerPage' => $rows,
    'srchSeCd' => '검030006',
    'rdoIndex' => 1,
    'dgtlSrvcMallYn' => 'N',
    'untySrchYn' => '',
  ];
}

function datahub_shop_product_row(array $row): array {
  $supplierName = trim((string)($row['etpsNm'] ?? $row['ctentUntyGrpNm'] ?? $row['mnftrEtpsNm'] ?? $row['rprsCtentUntyGrpNm'] ?? ''));
  $supplierBizno = trim((string)($row['etpsCd'] ?? $row['ctentUntyGrpNo'] ?? $row['bzmnRegNo'] ?? ''));
  $region = trim((string)($row['hdofcLctnNm'] ?? $row['hdofcSgnguNm'] ?? $row['addr'] ?? ''));
  $name = trim((string)($row['itemIdnfNm'] ?? $row['itemIndfNmView'] ?? $row['dtlsPrnm'] ?? $row['itemCfnm'] ?? ''));
  if ($name === '') {
    $name = trim((string)($row['snymNm'] ?? $row['itemIdnfNo'] ?? $row['ctrtItemMngNo'] ?? ''));
  }
  $classificationNo = trim((string)($row['ctrtItemMngNo'] ?? $row['itemIdnfNo'] ?? $row['dtlsPrnmNo'] ?? $row['itemClsfNo'] ?? ''));
  $classificationName = trim((string)($row['dtlsPrnm'] ?? $row['itemCfnm'] ?? $row['itemIndfNmView'] ?? $row['itemIdnfNm'] ?? ''));
  $createdAt = trim((string)($row['ctrtYmd'] ?? $row['ctrtBgngYmd'] ?? $row['toDay'] ?? gmdate('Y-m-d H:i:s')));
  if (preg_match('/^\d{8}$/', $createdAt)) {
    $createdAt = substr($createdAt, 0, 4) . '-' . substr($createdAt, 4, 2) . '-' . substr($createdAt, 6, 2) . ' 00:00:00';
  } elseif (preg_match('/^\d{14}$/', $createdAt)) {
    $createdAt = substr($createdAt, 0, 4) . '-' . substr($createdAt, 4, 2) . '-' . substr($createdAt, 6, 2) . ' ' . substr($createdAt, 8, 2) . ':' . substr($createdAt, 10, 2) . ':' . substr($createdAt, 12, 2);
  }
  $price = trim((string)($row['ctrtUprc'] ?? $row['srchUprc'] ?? ''));
  return [
    'name' => $name,
    'category' => trim((string)($row['itemCfnm'] ?? $row['dtlsPrnm'] ?? $classificationName)),
    'hs_code' => trim((string)($row['itemClsfNo'] ?? $row['dtlsPrnmNo'] ?? '')),
    'classification_no' => $classificationNo,
    'classification_name' => $classificationName,
    'supplier_name' => $supplierName,
    'supplier_country' => '대한민국',
    'supplier_score' => (int)min(95, 60 + max(0, (int)($row['gdsCnt'] ?? 0))),
    'supplier_region' => $region,
    'supplier_homepage' => '',
    'supplier_bizno' => $supplierBizno,
    'supplier_docs' => trim((string)($row['untyAtchFileNo'] ?? '')),
    'bizno' => $supplierBizno !== '' ? $supplierBizno : ('name:' . datahub_normalize_key($supplierName)),
    'status' => 'approved',
    'created_at' => $createdAt,
    'certs' => trim(implode(' ', array_filter([
      trim((string)($row['itemCert'] ?? '')),
      trim((string)($row['ftalPrchsTrgtCert'] ?? '')),
      trim((string)($row['apmlNm'] ?? '')),
    ]))),
    'files' => trim((string)($row['untyAtchFileNo'] ?? '')),
    'power' => trim((string)($row['itemIdnfNo'] ?? '')),
    'cct' => trim((string)($row['ctrtItemSqno'] ?? '')),
    'target_price' => $price,
    'korea_price' => $price,
    'source' => 'shop.g2b/newShopUntySrchApi',
    'source_updated_at' => gmdate('c'),
    'raw_json' => json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
  ];
}

function datahub_shop_supplier_row(array $row): array {
  $name = trim((string)($row['etpsNm'] ?? $row['ctentUntyGrpNm'] ?? $row['mnftrEtpsNm'] ?? $row['rprsCtentUntyGrpNm'] ?? ''));
  $bizno = trim((string)($row['etpsCd'] ?? $row['ctentUntyGrpNo'] ?? $row['bzmnRegNo'] ?? ''));
  $region = trim((string)($row['hdofcLctnNm'] ?? $row['hdofcSgnguNm'] ?? $row['address'] ?? $row['addr'] ?? ''));
  if ($bizno === '') {
    $bizno = 'name:' . datahub_normalize_key($name !== '' ? $name : $region);
  }
  return [
    'name' => $name,
    'bizno' => $bizno,
    'country' => '대한민국',
    'contact' => '',
    'email' => '',
    'category' => trim((string)($row['cmpnClassNm'] ?? $row['entFormSeNm'] ?? '')),
    'docs' => $region,
    'status' => 'approved',
    'score' => (int)min(95, 60 + max(0, (int)($row['gdsCnt'] ?? 0))),
    'created_at' => gmdate('Y-m-d H:i:s'),
    'region' => $region,
    'homepage' => '',
    'doc_files' => '',
    'source' => 'shop.g2b/vntrUntySrchApi',
    'source_updated_at' => gmdate('c'),
  ];
}

function datahub_fetch_shop_products(string $term, int $page = 1, int $rows = 100): array {
  $decoded = datahub_http_post_json('https://shop.g2b.go.kr/gm/gms/gmsd/newShopUntySrchApi.do', [
    'searchVO' => datahub_shop_search_vo($term, $page, $rows),
  ]);
  $items = [];
  foreach (($decoded['rsltList'] ?? []) as $row) {
    if (is_array($row)) {
      $items[] = datahub_shop_product_row($row);
    }
  }
  return [
    'totalCount' => (int)($decoded['totalSize'] ?? count($items)),
    'items' => $items,
    'raw' => $decoded,
    'updatedAt' => gmdate('c'),
  ];
}

function datahub_collect_shop_suppliers(array $decoded): array {
  $items = [];
  $seen = [];

  foreach (array_merge($decoded['dlTechQltyItemEtpsL'] ?? [], $decoded['dlGnrlItemEtpsL'] ?? []) as $row) {
    if (!is_array($row)) {
      continue;
    }
    $supplier = datahub_shop_supplier_row($row);
    if (isset($seen[$supplier['bizno']])) {
      continue;
    }
    $seen[$supplier['bizno']] = true;
    $items[] = $supplier;
  }

  if (count($items) === 0) {
    foreach (($decoded['rsltList'] ?? []) as $row) {
      if (!is_array($row)) {
        continue;
      }
      $supplier = datahub_shop_supplier_row($row);
      if (($supplier['name'] ?? '') === '' || isset($seen[$supplier['bizno']])) {
        continue;
      }
      $seen[$supplier['bizno']] = true;
      $items[] = $supplier;
    }
  }

  return $items;
}

function datahub_fetch_shop_suppliers(string $term, int $page = 1, int $rows = 100): array {
  $decoded = datahub_http_post_json('https://shop.g2b.go.kr/gm/gms/gmsd/vntrUntySrchApi.do', [
    'searchVO' => datahub_shop_search_vo($term, $page, $rows),
  ]);

  $items = datahub_collect_shop_suppliers($decoded);
  $totalCount = (int)($decoded['totalSize'] ?? count($items));

  if (count($items) === 0 && $term !== '') {
    $productDecoded = datahub_http_post_json('https://shop.g2b.go.kr/gm/gms/gmsd/newShopUntySrchApi.do', [
      'searchVO' => datahub_shop_search_vo($term, $page, $rows),
    ]);
    $items = datahub_collect_shop_suppliers($productDecoded);
    if (count($items) > 0) {
      $totalCount = count($items);
      $decoded = $productDecoded;
    }
  }

  return [
    'totalCount' => $totalCount,
    'items' => $items,
    'raw' => $decoded,
    'updatedAt' => gmdate('c'),
  ];
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
