<?php
declare(strict_types=1);

date_default_timezone_set('Asia/Seoul');

$dbPath = '/volume1/web/datahub-storage/led_datahub.sqlite';
$baseUrl = 'https://apis.data.go.kr/1230000/ao/UsrInfoService02';
$shopBaseUrl = 'https://shop.g2b.go.kr';
$defaultDaysBack = 7;
$defaultBasicRows = 100;
$defaultProductRows = 50;
$maxBasicPages = 8;
$maxProductsPerSupplier = 120;
$maxProductPagesPerSupplier = 3;
$targetSuppliers = 80;
$supplierDaysBack = 3650;
$supplierPageLimit = 300;
$shopRowsPerPage = 100;
$shopPageLimit = 6;
$shopSearchTerms = [
  '조명기구',
  '조명',
  'LED 조명',
  'LED 등기구',
  '등기구',
  '램프',
  '전등',
  '가로등',
  '투광기',
  '다운라이트',
  '천장등',
  '벽등',
  '스포트라이트',
  '공장등',
];
$lightingKeywords = [
  'led', '조명', '램프', '등기구', '가로등', '투광', '다운라이트', '천장등', '벽등',
  '전등', '조명기구', '실내조명', '실외조명', '간판등', '스포트라이트', '매입등',
];
$supplierFocusKeywords = ['조명', 'led', '램프', '등기구', '전등', '가로등', '투광'];

function db(): SQLite3 {
  static $db = null;
  if ($db instanceof SQLite3) {
    return $db;
  }
  $path = getenv('DATAHUB_DB_PATH') ?: '/volume1/web/datahub-storage/led_datahub.sqlite';
  $db = new SQLite3($path);
  $db->busyTimeout(5000);
  return $db;
}

function logLine(string $message): void {
  fwrite(STDOUT, '[' . date('Y-m-d H:i:s') . '] ' . $message . PHP_EOL);
}

function tableColumns(string $table): array {
  $rows = [];
  $res = db()->query('pragma table_info(' . $table . ')');
  if (!$res) {
    return $rows;
  }
  while ($row = $res->fetchArray(SQLITE3_ASSOC)) {
    $rows[] = $row['name'];
  }
  return $rows;
}

function ensureColumn(string $table, string $column, string $definition): void {
  $columns = tableColumns($table);
  if (!in_array($column, $columns, true)) {
    db()->exec("alter table {$table} add column {$definition}");
  }
}

function ensureSchema(): void {
  ensureColumn('suppliers', 'bizno', 'bizno text');
  ensureColumn('suppliers', 'corp_nm', 'corp_nm text');
  ensureColumn('suppliers', 'region', 'region text');
  ensureColumn('suppliers', 'homepage', 'homepage text');
  ensureColumn('suppliers', 'source', 'source text');
  ensureColumn('suppliers', 'source_updated_at', 'source_updated_at text');

  ensureColumn('products', 'bizno', 'bizno text');
  ensureColumn('products', 'classification_no', 'classification_no text');
  ensureColumn('products', 'classification_name', 'classification_name text');
  ensureColumn('products', 'source', 'source text');
  ensureColumn('products', 'source_updated_at', 'source_updated_at text');
  ensureColumn('products', 'raw_json', 'raw_json text');

  db()->exec('create unique index if not exists idx_suppliers_bizno on suppliers(bizno)');
  db()->exec('create unique index if not exists idx_products_bizno_classification on products(bizno, classification_no)');
}

function getSetting(string $key): string {
  $stmt = db()->prepare('select value from app_settings where key = :key limit 1');
  $stmt->bindValue(':key', $key, SQLITE3_TEXT);
  $row = $stmt->execute()->fetchArray(SQLITE3_ASSOC);
  return trim((string)($row['value'] ?? ''));
}

function setSetting(string $key, string $value): void {
  $stmt = db()->prepare('insert into app_settings(key, value, updated_at) values(:key, :value, datetime(\'now\')) on conflict(key) do update set value = excluded.value, updated_at = excluded.updated_at');
  $stmt->bindValue(':key', $key, SQLITE3_TEXT);
  $stmt->bindValue(':value', $value, SQLITE3_TEXT);
  $stmt->execute();
}

function httpGet(string $url, int $connectTimeout = 20, int $timeout = 60, array $headers = []): string {
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

function httpPostJson(string $url, array $payload, array $headers = [], int $connectTimeout = 20, int $timeout = 60): array {
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

function apiXml(string $baseUrl, string $path, array $params): SimpleXMLElement {
  $serviceKey = $params['serviceKey'] ?? '';
  unset($params['serviceKey']);
  $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
  $url = rtrim($baseUrl, '/') . $path . '?serviceKey=' . $serviceKey;
  if ($query !== '') {
    $url .= '&' . $query;
  }
  $xml = httpGet($url, 20, 60);
  libxml_use_internal_errors(true);
  $doc = simplexml_load_string($xml);
  if ($doc === false) {
    throw new RuntimeException('Failed to parse XML from ' . $path);
  }
  return $doc;
}

function apiJson(string $baseUrl, string $path, array $params): array {
  $serviceKey = $params['serviceKey'] ?? '';
  unset($params['serviceKey']);
  $query = http_build_query($params, '', '&', PHP_QUERY_RFC3986);
  $url = rtrim($baseUrl, '/') . $path . '?serviceKey=' . $serviceKey;
  if ($query !== '') {
    $url .= '&' . $query;
  }
  $json = httpGet($url, 20, 60);
  $decoded = json_decode($json, true);
  if (!is_array($decoded)) {
    throw new RuntimeException('Failed to parse JSON from ' . $path);
  }
  return $decoded;
}

function xmlItems(SimpleXMLElement $doc): array {
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

function xmlTotalCount(SimpleXMLElement $doc): int {
  $rows = $doc->xpath('//body/totalCount');
  if (!$rows || !isset($rows[0])) {
    return 0;
  }
  return (int)trim((string)$rows[0]);
}

function jsonItems(array $decoded): array {
  $items = $decoded['response']['body']['items']['item'] ?? [];
  if ($items === null || $items === '') {
    return [];
  }
  if (isset($items['prdctNm']) || isset($items['bizName']) || isset($items['prdctNo'])) {
    return [$items];
  }
  return is_array($items) ? array_values($items) : [];
}

function jsonTotalCount(array $decoded): int {
  return (int)($decoded['response']['body']['totalCount'] ?? 0);
}

function cleanText(?string $value): string {
  return trim((string)$value);
}

function normalizeKey(string $value): string {
  $value = mb_strtolower(trim($value), 'UTF-8');
  $value = preg_replace('/^(주식회사|㈜|\(주\))/u', '', $value);
  $value = preg_replace('/(주식회사|㈜|\(주\))$/u', '', $value);
  $value = preg_replace('/[^\p{L}\p{N}]+/u', '', $value);
  return trim((string)$value);
}

function isLightingRelevant(string $text, array $keywords): bool {
  $hay = mb_strtolower($text, 'UTF-8');
  foreach ($keywords as $keyword) {
    if (str_contains($hay, mb_strtolower($keyword, 'UTF-8'))) {
      return true;
    }
  }
  return false;
}

function isLightingSupplier(array $supplier, array $keywords): bool {
  $text = implode(' ', [
    $supplier['corpNm'] ?? '',
    $supplier['corpBsnsDivNm'] ?? '',
    $supplier['mnfctDivNm'] ?? '',
    $supplier['hmpgAdrs'] ?? '',
  ]);
  return isLightingRelevant($text, $keywords);
}

function normalizeCategory(string $name): string {
  $name = trim($name);
  return $name !== '' ? $name : '기타';
}

function inferSupplierCategory(array $row): string {
  return normalizeCategory(
    cleanText($row['corpBsnsDivNm'] ?? '') !== '' ? cleanText($row['corpBsnsDivNm'] ?? '') :
    (cleanText($row['mnfctDivNm'] ?? '') !== '' ? cleanText($row['mnfctDivNm'] ?? '') :
    (cleanText($row['bizIndClsfcNm'] ?? '') !== '' ? cleanText($row['bizIndClsfcNm'] ?? '') :
    cleanText($row['bizTpNm'] ?? '')))
  );
}

function inferProductCategory(array $row): string {
  return normalizeCategory(
    cleanText($row['prdctClsfcNoNm'] ?? '') !== '' ? cleanText($row['prdctClsfcNoNm'] ?? '') :
    (cleanText($row['prdctClsfcNm'] ?? '') !== '' ? cleanText($row['prdctClsfcNm'] ?? '') :
    (cleanText($row['dtilPrdctClsfcNoNm'] ?? '') !== '' ? cleanText($row['dtilPrdctClsfcNoNm'] ?? '') :
    cleanText($row['prdctNm'] ?? '')))
  );
}

function scoreSupplier(array $supplier, int $matchedProducts): int {
  $score = 58;
  if (!empty($supplier['telNo'])) {
    $score += 4;
  }
  if (!empty($supplier['hmpgAdrs'])) {
    $score += 4;
  }
  if (!empty($supplier['ceoNm'])) {
    $score += 2;
  }
  if (($supplier['esntlNoCertRgstYn'] ?? '') === 'Y') {
    $score += 4;
  }
  $score += min(18, $matchedProducts * 2);
  return min(95, $score);
}

function upsertSupplier(array $row, string $source, string $sourceUpdatedAt, int $matchedProducts = 0, string $status = 'approved'): int {
  $bizno = cleanText($row['bizno'] ?? '');
  $corpNm = cleanText($row['corpNm'] ?? $row['corp_nm'] ?? '');
  if ($bizno === '') {
    $bizno = 'name:' . normalizeKey($corpNm !== '' ? $corpNm : cleanText($row['name'] ?? ''));
  }
  $region = cleanText($row['rgnNm'] ?? $row['adrs'] ?? '');
  $homepage = cleanText($row['hmpgAdrs'] ?? '');
  $score = scoreSupplier($row, $matchedProducts);
  $category = inferSupplierCategory($row);
  if ($status === 'approved' && $source !== 'data.go.kr/UsrInfoService02') {
    $status = 'pending';
  }
  $docs = cleanText($row['adrs'] ?? '') . ($homepage !== '' ? "\n" . $homepage : '');

  $existingStmt = db()->prepare('select id from suppliers where bizno = :bizno or name = :name limit 1');
  $existingStmt->bindValue(':bizno', $bizno, SQLITE3_TEXT);
  $existingStmt->bindValue(':name', $corpNm !== '' ? $corpNm : $bizno, SQLITE3_TEXT);
  $existing = $existingStmt->execute()->fetchArray(SQLITE3_ASSOC);
  if ($existing && (int)($existing['id'] ?? 0) > 0) {
    $update = db()->prepare('update suppliers set bizno = :bizno, name = :name, corp_nm = :corp_nm, country = :country, contact = :contact, email = :email, category = :category, docs = :docs, status = :status, score = :score, region = :region, homepage = :homepage, source = :source, source_updated_at = :source_updated_at where id = :id');
    $update->bindValue(':id', (int)$existing['id'], SQLITE3_INTEGER);
    $update->bindValue(':bizno', $bizno, SQLITE3_TEXT);
    $update->bindValue(':name', $corpNm !== '' ? $corpNm : $bizno, SQLITE3_TEXT);
    $update->bindValue(':corp_nm', $corpNm, SQLITE3_TEXT);
    $update->bindValue(':country', cleanText($row['cntryNm'] ?? '대한민국') ?: '대한민국', SQLITE3_TEXT);
    $update->bindValue(':contact', cleanText($row['telNo'] ?? ''), SQLITE3_TEXT);
    $update->bindValue(':email', '', SQLITE3_TEXT);
    $update->bindValue(':category', $category, SQLITE3_TEXT);
    $update->bindValue(':docs', $docs, SQLITE3_TEXT);
    $update->bindValue(':status', $status, SQLITE3_TEXT);
    $update->bindValue(':score', $score, SQLITE3_INTEGER);
    $update->bindValue(':region', $region, SQLITE3_TEXT);
    $update->bindValue(':homepage', $homepage, SQLITE3_TEXT);
    $update->bindValue(':source', $source, SQLITE3_TEXT);
    $update->bindValue(':source_updated_at', $sourceUpdatedAt, SQLITE3_TEXT);
    $update->execute();
    return (int)$existing['id'];
  }

  $stmt = db()->prepare('
    insert into suppliers (
      bizno, name, corp_nm, country, contact, email, category, docs, status, score, created_at, user_id, doc_files, region, homepage, source, source_updated_at
    ) values (
      :bizno, :name, :corp_nm, :country, :contact, :email, :category, :docs, :status, :score, :created_at, :user_id, :doc_files, :region, :homepage, :source, :source_updated_at
    )
    on conflict(bizno) do update set
      name = excluded.name,
      corp_nm = excluded.corp_nm,
      country = excluded.country,
      contact = excluded.contact,
      email = excluded.email,
      category = excluded.category,
      docs = excluded.docs,
      status = excluded.status,
      score = excluded.score,
      region = excluded.region,
      homepage = excluded.homepage,
      source = excluded.source,
      source_updated_at = excluded.source_updated_at
  ');
  $stmt->bindValue(':bizno', $bizno, SQLITE3_TEXT);
  $stmt->bindValue(':name', $corpNm !== '' ? $corpNm : $bizno, SQLITE3_TEXT);
  $stmt->bindValue(':corp_nm', $corpNm, SQLITE3_TEXT);
  $stmt->bindValue(':country', cleanText($row['cntryNm'] ?? '대한민국') ?: '대한민국', SQLITE3_TEXT);
  $stmt->bindValue(':contact', cleanText($row['telNo'] ?? ''), SQLITE3_TEXT);
  $stmt->bindValue(':email', '', SQLITE3_TEXT);
  $stmt->bindValue(':category', $category, SQLITE3_TEXT);
  $stmt->bindValue(':docs', $docs, SQLITE3_TEXT);
  $stmt->bindValue(':status', $status, SQLITE3_TEXT);
  $stmt->bindValue(':score', $score, SQLITE3_INTEGER);
  $stmt->bindValue(':created_at', cleanText($row['rgstDt'] ?? date('Y-m-d H:i:s')), SQLITE3_TEXT);
  $stmt->bindValue(':user_id', null, SQLITE3_NULL);
  $stmt->bindValue(':doc_files', cleanText($row['hmpgAdrs'] ?? ''), SQLITE3_TEXT);
  $stmt->bindValue(':region', $region, SQLITE3_TEXT);
  $stmt->bindValue(':homepage', $homepage, SQLITE3_TEXT);
  $stmt->bindValue(':source', $source, SQLITE3_TEXT);
  $stmt->bindValue(':source_updated_at', $sourceUpdatedAt, SQLITE3_TEXT);
  $stmt->execute();

  $idStmt = db()->prepare('select id from suppliers where bizno = :bizno limit 1');
  $idStmt->bindValue(':bizno', $bizno, SQLITE3_TEXT);
  $id = (int)($idStmt->execute()->fetchArray(SQLITE3_ASSOC)['id'] ?? 0);
  return $id;
}

function upsertProduct(array $supplier, array $row, int $supplierId, string $source, string $sourceUpdatedAt): void {
  $bizno = cleanText($supplier['bizno'] ?? $row['bizno'] ?? '');
  if ($bizno === '') {
    $bizno = 'name:' . normalizeKey(cleanText($supplier['corpNm'] ?? $supplier['name'] ?? ''));
  }
  $classificationNo = cleanText(
    $row['classification_no']
    ?? $row['ctrtItemMngNo']
    ?? $row['itemIdnfNo']
    ?? $row['dtlsPrnmNo']
    ?? $row['dtilPrdctClsfcNo']
    ?? $row['prdctNo']
    ?? $row['productNo']
    ?? ''
  );
  $classificationName = cleanText(
    $row['classification_name']
    ?? $row['dtlsPrnm']
    ?? $row['itemCfnm']
    ?? $row['dtilPrdctClsfcNoNm']
    ?? $row['bizName']
    ?? ''
  );
  $category = inferProductCategory($row);
  $name = cleanText(
    $row['name']
    ?? $row['prdctNm']
    ?? $row['itemIdnfNm']
    ?? $row['itemIndfNmView']
    ?? $row['snymNm']
    ?? ''
  );
  if ($name === '') {
    $name = $classificationName !== '' ? $classificationName : $classificationNo;
  }
  $createdAt = cleanText($row['created_at'] ?? $row['rgstDt'] ?? date('Y-m-d H:i:s'));
  $updatedAt = cleanText($row['source_updated_at'] ?? $row['chgDt'] ?? $createdAt);
  $rawJson = json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

  $stmt = db()->prepare('
    insert into products (
      supplier_id, bizno, name, category, hs_code, power, cct, certs, target_price, korea_price, files, status, created_at, classification_no, classification_name, source, source_updated_at, raw_json
    ) values (
      :supplier_id, :bizno, :name, :category, :hs_code, :power, :cct, :certs, :target_price, :korea_price, :files, :status, :created_at, :classification_no, :classification_name, :source, :source_updated_at, :raw_json
    )
    on conflict(bizno, classification_no) do update set
      supplier_id = excluded.supplier_id,
      name = excluded.name,
      category = excluded.category,
      hs_code = excluded.hs_code,
      power = excluded.power,
      cct = excluded.cct,
      certs = excluded.certs,
      target_price = excluded.target_price,
      korea_price = excluded.korea_price,
      files = excluded.files,
      status = excluded.status,
      classification_name = excluded.classification_name,
      source = excluded.source,
      source_updated_at = excluded.source_updated_at,
      raw_json = excluded.raw_json
  ');
  $stmt->bindValue(':supplier_id', $supplierId, SQLITE3_INTEGER);
  $stmt->bindValue(':bizno', $bizno, SQLITE3_TEXT);
  $stmt->bindValue(':name', $name, SQLITE3_TEXT);
  $stmt->bindValue(':category', $category, SQLITE3_TEXT);
  $stmt->bindValue(':hs_code', $classificationNo, SQLITE3_TEXT);
  $stmt->bindValue(':power', '', SQLITE3_TEXT);
  $stmt->bindValue(':cct', '', SQLITE3_TEXT);
  $certs = $classificationName;
  if (!empty($row['mnfctYn']) && $row['mnfctYn'] === 'Y') {
    $certs = trim($certs . ' 제조');
  }
  if ($classificationName === '' && cleanText($row['bizName'] ?? $row['etpsNm'] ?? '') !== '') {
    $classificationName = cleanText($row['bizName'] ?? $row['etpsNm'] ?? '');
  }
  $stmt->bindValue(':certs', $certs, SQLITE3_TEXT);
  $stmt->bindValue(':target_price', cleanText((string)($row['target_price'] ?? $row['ctrtUprc'] ?? '')), SQLITE3_TEXT);
  $stmt->bindValue(':korea_price', cleanText((string)($row['korea_price'] ?? $row['ctrtUprc'] ?? '')), SQLITE3_TEXT);
  $stmt->bindValue(':files', cleanText((string)($row['files'] ?? $row['untyAtchFileNo'] ?? '')), SQLITE3_TEXT);
  $stmt->bindValue(':status', 'approved', SQLITE3_TEXT);
  $stmt->bindValue(':created_at', $createdAt, SQLITE3_TEXT);
  $stmt->bindValue(':classification_no', $classificationNo, SQLITE3_TEXT);
  $stmt->bindValue(':classification_name', $classificationName, SQLITE3_TEXT);
  $stmt->bindValue(':source', $source, SQLITE3_TEXT);
  $stmt->bindValue(':source_updated_at', $updatedAt, SQLITE3_TEXT);
  $stmt->bindValue(':raw_json', $rawJson, SQLITE3_TEXT);
  $stmt->execute();
}

function shopBaseSearchVO(string $term, int $page, int $rows): array {
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

function shopRequest(string $path, array $payload): array {
  $decoded = httpPostJson('https://shop.g2b.go.kr' . $path, $payload);
  if (!is_array($decoded)) {
    throw new RuntimeException('Invalid response from ' . $path);
  }
  return $decoded;
}

function shopSupplierKey(array $row): string {
  $parts = [
    cleanText((string)($row['etpsCd'] ?? '')),
    cleanText((string)($row['bzmnRegNo'] ?? '')),
    cleanText((string)($row['ctentUntyGrpNo'] ?? '')),
    cleanText((string)($row['etpsNm'] ?? '')),
    cleanText((string)($row['address'] ?? '')),
  ];
  return trim(implode('|', array_filter($parts, static fn(string $value): bool => $value !== '')));
}

function normalizeShopSupplierRow(array $row): array {
  $name = cleanText($row['etpsNm'] ?? $row['ctentUntyGrpNm'] ?? $row['mnftrEtpsNm'] ?? $row['rprsCtentUntyGrpNm'] ?? '');
  $bizno = cleanText($row['etpsCd'] ?? $row['ctentUntyGrpNo'] ?? $row['bzmnRegNo'] ?? '');
  $region = cleanText($row['hdofcLctnNm'] ?? $row['hdofcSgnguNm'] ?? $row['address'] ?? $row['addr'] ?? '');
  $homepage = cleanText($row['shmlLnkBtnNm'] ?? '');
  if ($bizno === '') {
    $bizno = 'name:' . normalizeKey($name !== '' ? $name : $region);
  }
  return [
    'corpNm' => $name,
    'bizno' => $bizno,
    'cntryNm' => '대한민국',
    'rgnNm' => $region,
    'adrs' => $region,
    'hmpgAdrs' => $homepage,
    'corpBsnsDivNm' => cleanText($row['cmpnClassNm'] ?? $row['entFormSeNm'] ?? 'shop.g2b'),
    'mnfctDivNm' => cleanText($row['cmpnClassNm'] ?? $row['entFormSeNm'] ?? 'shop.g2b'),
    'bizIndClsfcNm' => cleanText($row['cmpnClassNm'] ?? $row['entFormSeNm'] ?? 'shop.g2b'),
    'bizTpNm' => cleanText($row['cmpnClassNm'] ?? $row['entFormSeNm'] ?? 'shop.g2b'),
    'telNo' => '',
    'ceoNm' => '',
  ];
}

function normalizeShopProductRow(array $row): array {
  $supplierName = cleanText($row['etpsNm'] ?? $row['ctentUntyGrpNm'] ?? $row['mnftrEtpsNm'] ?? $row['rprsCtentUntyGrpNm'] ?? '');
  $supplierBizno = cleanText($row['etpsCd'] ?? $row['ctentUntyGrpNo'] ?? $row['bzmnRegNo'] ?? '');
  $supplierRegion = cleanText($row['hdofcLctnNm'] ?? $row['hdofcSgnguNm'] ?? $row['addr'] ?? '');
  $name = cleanText($row['itemIdnfNm'] ?? $row['itemIndfNmView'] ?? $row['dtlsPrnm'] ?? $row['itemCfnm'] ?? '');
  if ($name === '') {
    $name = cleanText($row['snymNm'] ?? $row['itemIdnfNo'] ?? $row['ctrtItemMngNo'] ?? '');
  }
  $classificationNo = cleanText($row['ctrtItemMngNo'] ?? $row['itemIdnfNo'] ?? $row['dtlsPrnmNo'] ?? $row['itemClsfNo'] ?? '');
  $classificationName = cleanText($row['dtlsPrnm'] ?? $row['itemCfnm'] ?? $row['itemIndfNmView'] ?? $row['itemIdnfNm'] ?? '');
  $createdAt = cleanText($row['ctrtYmd'] ?? $row['ctrtBgngYmd'] ?? $row['toDay'] ?? date('Y-m-d H:i:s'));
  if (preg_match('/^\d{8}$/', $createdAt)) {
    $createdAt = substr($createdAt, 0, 4) . '-' . substr($createdAt, 4, 2) . '-' . substr($createdAt, 6, 2) . ' 00:00:00';
  } elseif (preg_match('/^\d{14}$/', $createdAt)) {
    $createdAt = substr($createdAt, 0, 4) . '-' . substr($createdAt, 4, 2) . '-' . substr($createdAt, 6, 2) . ' ' . substr($createdAt, 8, 2) . ':' . substr($createdAt, 10, 2) . ':' . substr($createdAt, 12, 2);
  }
  $price = cleanText((string)($row['ctrtUprc'] ?? $row['srchUprc'] ?? ''));
  return [
    'name' => $name,
    'category' => cleanText($row['itemCfnm'] ?? $row['dtlsPrnm'] ?? $classificationName ?? ''),
    'hs_code' => cleanText($row['itemClsfNo'] ?? $row['dtlsPrnmNo'] ?? ''),
    'classification_no' => $classificationNo,
    'classification_name' => $classificationName,
    'supplier_name' => $supplierName,
    'supplier_country' => '대한민국',
    'supplier_score' => (int)min(95, 60 + max(0, (int)($row['gdsCnt'] ?? 0))),
    'supplier_region' => $supplierRegion,
    'supplier_homepage' => '',
    'supplier_bizno' => $supplierBizno,
    'supplier_docs' => cleanText($row['untyAtchFileNo'] ?? ''),
    'bizno' => $supplierBizno !== '' ? $supplierBizno : 'name:' . normalizeKey($supplierName),
    'status' => 'approved',
    'created_at' => $createdAt,
    'certs' => trim(implode(' ', array_filter([
      cleanText((string)($row['itemCert'] ?? '')),
      cleanText((string)($row['ftalPrchsTrgtCert'] ?? '')),
      cleanText((string)($row['apmlNm'] ?? '')),
    ]))),
    'files' => cleanText($row['untyAtchFileNo'] ?? ''),
    'power' => cleanText((string)($row['itemIdnfNo'] ?? '')),
    'cct' => cleanText((string)($row['ctrtItemSqno'] ?? '')),
    'target_price' => $price,
    'korea_price' => $price,
    'source' => 'shop.g2b/newShopUntySrchApi',
    'source_updated_at' => gmdate('c'),
    'raw_json' => json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
  ];
}

function processShopSearchResult(string $serviceKey, string $keyword, int $page, int $rows): array {
  $result = fetchShopProducts($serviceKey, $keyword, $page, $rows);
  $items = $result['items'] ?? [];
  if (!$items) {
    return ['matched' => 0, 'products' => 0];
  }

  $matchedProducts = 0;
  foreach ($items as $row) {
    $supplierRow = normalizeShopSupplierRow($row);
    $supplierId = upsertSupplier($supplierRow, 'shop.g2b/newShopUntySrchApi', gmdate('c'));
    if ($supplierId <= 0) {
      continue;
    }
    upsertProduct($supplierRow, $row, $supplierId, 'shop.g2b/newShopUntySrchApi', gmdate('c'));
    $matchedProducts++;
  }

  return ['matched' => count($items), 'products' => $matchedProducts];
}

function clearImportedRows(): void {
  db()->exec("delete from products where source like 'data.go.kr/%' or source like 'shopping.g2b/%' or source like 'shop.g2b/%'");
  db()->exec("delete from suppliers where source like 'data.go.kr/%' or source like 'shopping.g2b/%' or source like 'shop.g2b/%'");
}

function clearImportedShopRows(): void {
  db()->exec("delete from products where source like 'shop.g2b/%'");
  db()->exec("delete from suppliers where source like 'shop.g2b/%'");
}

function clearSampleRows(): void {
  db()->exec("delete from products where name like 'Preview %' or coalesce(category, '') like 'Preview%'");
  db()->exec("delete from suppliers where name like 'Preview %'");
}

function addEvent(string $entityType, string $action, string $note): void {
  $stmt = db()->prepare('insert into events(entity_type, entity_id, action, note, created_at) values(:entity_type, :entity_id, :action, :note, datetime(\'now\'))');
  $stmt->bindValue(':entity_type', $entityType, SQLITE3_TEXT);
  $stmt->bindValue(':entity_id', 0, SQLITE3_INTEGER);
  $stmt->bindValue(':action', $action, SQLITE3_TEXT);
  $stmt->bindValue(':note', $note, SQLITE3_TEXT);
  $stmt->execute();
}

function fetchSuppliers(string $serviceKey, string $begin, string $end, int $page, int $rows): array {
  $doc = apiXml(
    $GLOBALS['baseUrl'],
    '/getPrcrmntCorpBasicInfo02',
    [
      'serviceKey' => $serviceKey,
      'inqryDiv' => '1',
      'inqryBgnDt' => $begin,
      'inqryEndDt' => $end,
      'pageNo' => (string)$page,
      'numOfRows' => (string)$rows,
      'Type' => 'xml',
    ]
  );
  return [
    'totalCount' => xmlTotalCount($doc),
    'items' => xmlItems($doc),
  ];
}

function fetchProducts(string $serviceKey, string $bizno, int $page, int $rows): array {
  $doc = apiXml(
    $GLOBALS['baseUrl'],
    '/getPrcrmntCorpSplyPrdctInfo02',
    [
      'serviceKey' => $serviceKey,
      'inqryDiv' => '1',
      'bizno' => $bizno,
      'pageNo' => (string)$page,
      'numOfRows' => (string)$rows,
      'Type' => 'xml',
    ]
  );
  return [
    'totalCount' => xmlTotalCount($doc),
    'items' => xmlItems($doc),
  ];
}

function processSupplier(string $serviceKey, array $supplierRow, array $keywords, int $productRows, int $maxProductPages): array {
  $bizno = cleanText($supplierRow['bizno'] ?? '');
  if ($bizno === '') {
    return ['matched' => 0, 'products' => 0];
  }

  $matched = 0;
  $totalProducts = 0;
  $rowsToUpsert = [];

  for ($page = 1; $page <= $maxProductPages; $page++) {
    $result = fetchProducts($serviceKey, $bizno, $page, $productRows);
    $items = $result['items'];
    if (!$items) {
      break;
    }
    foreach ($items as $row) {
      $totalProducts++;
      $matched++;
      $rowsToUpsert[] = $row;
    }
    if ($totalProducts >= $GLOBALS['maxProductsPerSupplier']) {
      break;
    }
    if ($totalProducts >= ($result['totalCount'] ?? 0)) {
      break;
    }
  }

  if ($matched <= 0) {
    return ['matched' => 0, 'products' => $totalProducts];
  }

  $supplierId = upsertSupplier($supplierRow, 'data.go.kr/UsrInfoService02', gmdate('c'));
  if ($supplierId <= 0) {
    return ['matched' => 0, 'products' => $totalProducts];
  }

  foreach ($rowsToUpsert as $row) {
    upsertProduct($supplierRow, $row, $supplierId, 'data.go.kr/UsrInfoService02', gmdate('c'));
  }

  if ($matched > 0) {
    $score = scoreSupplier($supplierRow, $matched);
    $stmt = db()->prepare('update suppliers set score = :score, status = :status where bizno = :bizno');
    $stmt->bindValue(':score', $score, SQLITE3_INTEGER);
    $stmt->bindValue(':status', 'approved', SQLITE3_TEXT);
    $stmt->bindValue(':bizno', $bizno, SQLITE3_TEXT);
    $stmt->execute();
  }

  return ['matched' => $matched, 'products' => $totalProducts];
}

function fetchShopProducts(string $serviceKey, string $keyword, int $page, int $rows): array {
  try {
    $payload = [
      'searchVO' => shopBaseSearchVO($keyword, $page, min($rows, 100)),
    ];
    $decoded = shopRequest('/gm/gms/gmsd/newShopUntySrchApi.do', $payload);
    $items = [];
    foreach (($decoded['rsltList'] ?? []) as $row) {
      if (!is_array($row)) {
        continue;
      }
      $items[] = normalizeShopProductRow($row);
    }
    return [
      'totalCount' => (int)($decoded['totalSize'] ?? ($items[0]['totCnt'] ?? count($items))),
      'items' => $items,
      'raw' => $decoded,
    ];
  } catch (Throwable $e) {
    return [
      'totalCount' => 0,
      'items' => [],
      'error' => $e->getMessage(),
    ];
  }
}

ensureSchema();

$serviceKey = getSetting('DATA_GO_KR_SERVICE_KEY');
if ($serviceKey === '') {
  throw new RuntimeException('DATA_GO_KR_SERVICE_KEY is missing from app_settings');
}

clearSampleRows();

$shopOnly = in_array('--shop-only', $argv, true);
if ($shopOnly) {
  clearImportedShopRows();
} else {
  clearImportedRows();
}

$daysBack = max(1, min($supplierDaysBack, (int)($argv[1] ?? $supplierDaysBack)));
$begin = (new DateTimeImmutable(sprintf('-%d days', $daysBack)))->setTime(0, 0)->format('YmdHi');
$end = new DateTimeImmutable('now', new DateTimeZone('Asia/Seoul'));
$end = $end->setTime((int)$end->format('H'), (int)$end->format('i'))->format('YmdHi');

if (!$shopOnly) {
  logLine("Fetching suppliers from {$begin} to {$end}");

  $suppliers = [];
  $seenBizno = [];
  $pagesFetched = 0;
  $totalCount = null;

  for ($page = 1; $page <= $supplierPageLimit; $page++) {
    $result = fetchSuppliers($serviceKey, $begin, $end, $page, $defaultBasicRows);
    $pagesFetched++;
    $totalCount = $result['totalCount'];
    $items = $result['items'];
    if (!$items) {
      break;
    }
    foreach ($items as $row) {
      $bizno = cleanText($row['bizno'] ?? '');
      if ($bizno === '' || isset($seenBizno[$bizno])) {
        continue;
      }
      $seenBizno[$bizno] = true;
      $suppliers[] = $row;
    }
    if (count($seenBizno) >= ($totalCount ?? 0)) {
      break;
    }
  }

  logLine('Supplier candidates: ' . count($suppliers) . ' / ' . ($totalCount ?? 0));

  $matchedSuppliers = 0;
  $matchedProducts = 0;

  foreach ($suppliers as $index => $supplierRow) {
    $bizno = cleanText($supplierRow['bizno'] ?? '');
    $corpNm = cleanText($supplierRow['corpNm'] ?? '');
    if (($index + 1) % 25 === 0) {
      logLine(sprintf('Progress %d/%d', $index + 1, count($suppliers)));
    }
    logLine(sprintf('Scanning %d/%d %s (%s)', $index + 1, count($suppliers), $corpNm ?: '-', $bizno ?: '-'));
    $result = processSupplier($serviceKey, $supplierRow, $lightingKeywords, 50, 4);
    if ($result['matched'] > 0) {
      $matchedSuppliers++;
      $matchedProducts += $result['matched'];
      logLine(sprintf('  imported %d products', $result['matched']));
    }
  }
} else {
  $suppliers = [];
  $matchedSuppliers = 0;
  $matchedProducts = 0;
}

logLine('Fetching shop.g2b search terms...');
foreach ($shopSearchTerms as $termIndex => $term) {
  logLine(sprintf('Shop term %d/%d: %s', $termIndex + 1, count($shopSearchTerms), $term));
  for ($page = 1; $page <= $shopPageLimit; $page++) {
    $result = processShopSearchResult($serviceKey, $term, $page, $shopRowsPerPage);
    if (($result['matched'] ?? 0) <= 0) {
      break;
    }
    $matchedProducts += (int)($result['products'] ?? 0);
    logLine(sprintf('  imported %d shopping products', (int)($result['products'] ?? 0)));
  }
}

addEvent(
  'procurement-sync',
  'refresh',
  sprintf(
    'Synced %d supplier candidates, %d suppliers, %d products from data.go.kr + shop.g2b',
    count($suppliers),
    $matchedSuppliers,
    $matchedProducts
  )
);

setSetting('procurement_sync_last_run', gmdate('c'));
setSetting('procurement_sync_last_count_suppliers', (string)count($suppliers));
setSetting('procurement_sync_last_count_matched_suppliers', (string)$matchedSuppliers);
setSetting('procurement_sync_last_count_matched_products', (string)$matchedProducts);

logLine(sprintf('Done. suppliers=%d products=%d', $matchedSuppliers, $matchedProducts));
