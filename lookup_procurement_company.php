<?php
declare(strict_types=1);

require '/volume1/web/datahub-app/datahub-live-v2.php';

function shopPostJson(string $path, array $payload): array {
  $url = 'https://shop.g2b.go.kr' . $path;
  $ch = curl_init($url);
  $body = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  if ($body === false) {
    throw new RuntimeException('Failed to encode payload');
  }
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_CONNECTTIMEOUT => 20,
    CURLOPT_TIMEOUT => 60,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $body,
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json;charset=UTF-8',
      'Accept: application/json, text/plain, */*',
      'Origin: https://shop.g2b.go.kr',
      'Referer: https://shop.g2b.go.kr/',
      'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36',
    ],
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
    throw new RuntimeException('HTTP ' . $code . ' for ' . $path);
  }
  $decoded = json_decode($resp, true);
  if (!is_array($decoded)) {
    throw new RuntimeException('Failed to parse JSON response from ' . $path);
  }
  return $decoded;
}

function baseSearchVO(string $term): array {
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
    'pageSize' => 10,
    'currentPage' => 1,
    'recordCountPerPage' => 10,
    'srchSeCd' => '검030006',
    'rdoIndex' => 1,
    'dgtlSrvcMallYn' => 'N',
    'untySrchYn' => '',
  ];
}

function companyKey(array $row): string {
  $parts = [
    trim((string)($row['etpsCd'] ?? '')),
    trim((string)($row['bzmnRegNo'] ?? '')),
    trim((string)($row['etpsNm'] ?? '')),
    trim((string)($row['address'] ?? '')),
  ];
  return trim(implode('|', array_filter($parts, static fn($v) => $v !== '')));
}

$term = $argv[1] ?? '';
if ($term === '') {
  fwrite(STDERR, "usage: php lookup_procurement_company.php <company>\n");
  exit(1);
}

$vntrPayload = ['searchVO' => baseSearchVO($term)];
$shopPayload = ['searchVO' => baseSearchVO($term)];

echo "shop-company-search:\n";
$vntr = shopPostJson('/gm/gms/gmsd/vntrUntySrchApi.do', $vntrPayload);
echo 'totalSize=' . (int)($vntr['totalSize'] ?? 0) . PHP_EOL;
echo 'supplier-facets=' . count($vntr['dlTechQltyItemEtpsL'] ?? []) . PHP_EOL;

$suppliers = [];
foreach (array_merge($vntr['dlTechQltyItemEtpsL'] ?? [], $vntr['dlGnrlItemEtpsL'] ?? []) as $row) {
  if (!is_array($row)) {
    continue;
  }
  $key = companyKey($row);
  if ($key === '' || isset($suppliers[$key])) {
    continue;
  }
  $suppliers[$key] = $row;
}

foreach (array_slice(array_values($suppliers), 0, 10) as $row) {
  echo json_encode([
    'etpsNm' => $row['etpsNm'] ?? '',
    'etpsCd' => $row['etpsCd'] ?? '',
    'address' => $row['address'] ?? '',
    'cmpnClassNm' => $row['cmpnClassNm'] ?? '',
    'gdsCnt' => $row['gdsCnt'] ?? '',
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
}

echo "shop-products:\n";
$shop = shopPostJson('/gm/gms/gmsd/newShopUntySrchApi.do', $shopPayload);
echo 'totalSize=' . (int)($shop['totalSize'] ?? 0) . PHP_EOL;
echo 'rsltList=' . count($shop['rsltList'] ?? []) . PHP_EOL;

foreach (array_slice($shop['rsltList'] ?? [], 0, 10) as $row) {
  if (!is_array($row)) {
    continue;
  }
  echo json_encode([
    'itemIdnfNm' => $row['itemIdnfNm'] ?? '',
    'itemIndfNmView' => $row['itemIndfNmView'] ?? '',
    'etpsNm' => $row['etpsNm'] ?? ($row['ctentUntyGrpNm'] ?? ''),
    'etpsCd' => $row['etpsCd'] ?? ($row['ctentUntyGrpNo'] ?? ''),
    'hdofcLctnNm' => $row['hdofcLctnNm'] ?? '',
    'dtlsPrnmNo' => $row['dtlsPrnmNo'] ?? '',
    'dtlsPrnm' => $row['dtlsPrnm'] ?? '',
    'ctrtUprc' => $row['ctrtUprc'] ?? '',
    'ctrtEndYmd' => $row['ctrtEndYmd'] ?? '',
  ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
}

