# DATA_DICTIONARY

이 문서는 LED 시장 데이터 허브에서 사용하는 핵심 데이터 구조를 정의합니다.

## Product

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 내부 제품 ID | 예 | 정규화 파이프라인 | 소스별 원본 ID와 매칭 규칙으로 생성 |
| `canonicalName` | `string` | 정규화 기준 제품명 | 예 | 제품명, 모델명 | 대소문자/공백/광고문구 정리 |
| `displayName` | `string` | 화면 표시용 제품명 | 예 | 원본 제목 | 원문 유지, HTML 제거 |
| `modelName` | `string \| null` | 모델명 | 아니오 | 제품명, 모델명 필드 | 패턴 추출, 영문/숫자 조합 우선 |
| `brand` | `string \| null` | 브랜드 | 아니오 | 원본 제품 정보 | 업체명 정규화 후 반영 |
| `manufacturerId` | `string \| null` | 제조사 ID | 아니오 | 제조사/업체 | 업체 정규화 후 연결 |
| `supplierIds` | `string[]` | 공급사 ID 목록 | 아니오 | 판매처/공급사 | 중복 제거 |
| `marketTypes` | `("procurement" \| "consumer")[]` | 속한 시장 | 예 | 소스 메타데이터 | 조달/민수 구분 값 매핑 |
| `category` | `string` | 제품 분류 | 예 | 원본 분류 | 카테고리명 표준화 |
| `subcategory` | `string \| null` | 세부 분류 | 아니오 | 원본 분류 | 세부 분류 매핑 |
| `specifications` | `Specifications` | 핵심 사양 | 예 | 제목/규격/API 필드 | 숫자·단위 통일 |
| `certifications` | `Certification[]` | 인증 정보 | 아니오 | 인증 데이터 | 번호/기관/상태 분리 |
| `images` | `string[]` | 이미지 URL 목록 | 아니오 | 원본 링크 | 중복 제거 |
| `sourceRecords` | `SourceMetadata[]` | 출처 메타데이터 | 예 | 모든 수집 소스 | 수집 시각/원본 URL 포함 |
| `firstSeenAt` | `string` | 최초 수집 시각 | 예 | 수집 파이프라인 | ISO 문자열 |
| `lastSeenAt` | `string` | 최근 수집 시각 | 예 | 수집 파이프라인 | ISO 문자열 |
| `status` | `string` | 활성/미확인/중단 등 상태 | 예 | 수집 결과 | 표준 상태값 사용 |
| `dataQualityScore` | `number` | 데이터 품질 점수 | 예 | 분석 결과 | 0~100 범위 |

## Specifications

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `wattage` | `number \| null` | 소비전력(W) | 아니오 | 제목, 규격 | `100 W` -> `100W` |
| `luminousFlux` | `number \| null` | 정격광속(lm) | 아니오 | 규격/API | 쉼표 제거 후 숫자화 |
| `efficacy` | `number \| null` | 광효율(lm/W) | 아니오 | 규격/API | 숫자화 |
| `colorTemperature` | `number \| null` | 색온도(K) | 아니오 | 제목, 규격 | `5700 K` -> `5700K` |
| `cri` | `number \| null` | 연색성 | 아니오 | 규격/API | `Ra80` -> `80` |
| `powerFactor` | `number \| null` | 역률 | 아니오 | 규격/API | 숫자화 |
| `inputVoltage` | `string \| null` | 입력전압 | 아니오 | 규격/API | 문자열 정리 |
| `beamAngle` | `number \| null` | 배광각 | 아니오 | 규격/API | 숫자화 |
| `ipRating` | `string \| null` | 방수등급 | 아니오 | 규격/API | `IP65` 형식 유지 |
| `dimensions` | `string \| null` | 크기 | 아니오 | 규격/API | `1285×320` -> `1285x320` |
| `weight` | `number \| null` | 중량 | 아니오 | 규격/API | 숫자화 |
| `material` | `string \| null` | 재질 | 아니오 | 규격/API | 문자열 정리 |
| `installationType` | `string \| null` | 설치 형태 | 아니오 | 규격/API | 표준 명칭 매핑 |
| `hsCode` | `string \| null` | HS 코드 | 아니오 | 조달/API | 공백 제거 |
| `countryOfOrigin` | `string \| null` | 원산지 | 아니오 | 조달/API | 국가명 정리 |

## Company

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 내부 업체 ID | 예 | 업체 데이터 | 정규화명 기반 생성 가능 |
| `name` | `string` | 업체명 | 예 | 원본 업체명 | 화면용 원문 유지 |
| `normalizedName` | `string` | 정규화 업체명 | 예 | 원본 업체명 | `(주)`, `㈜`, `주식회사` 통합 |
| `businessNumber` | `string \| null` | 사업자번호 | 아니오 | 업체 데이터 | 숫자 외 제거 |
| `companyType` | `"manufacturer" \| "supplier" \| "seller" \| "unknown"` | 업체 구분 | 예 | 조달/민수 출처 | 표준 값 매핑 |
| `address` | `string \| null` | 주소 | 아니오 | 업체 데이터 | 공백 정리 |
| `region` | `string \| null` | 지역 | 아니오 | 주소 | 광역단위 추출 |
| `website` | `string \| null` | 홈페이지 | 아니오 | 업체 데이터 | URL 문자열 검증 |
| `productCount` | `number` | 전체 제품 수 | 예 | 분석 결과 | 중복 제거 후 계산 |
| `procurementProductCount` | `number` | 조달 제품 수 | 예 | 분석 결과 | 시장별 계산 |
| `consumerProductCount` | `number` | 민수 제품 수 | 예 | 분석 결과 | 시장별 계산 |
| `firstSeenAt` | `string` | 최초 수집 시각 | 예 | 파이프라인 | ISO 문자열 |
| `lastSeenAt` | `string` | 최근 수집 시각 | 예 | 파이프라인 | ISO 문자열 |

## Listing

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 내부 리스팅 ID | 예 | 원본 상품 ID | 소스명 조합 가능 |
| `productId` | `string` | 연결된 제품 ID | 예 | 매칭 결과 | 자동/수동 매칭 |
| `source` | `string` | 출처명 | 예 | API/CSV | 표준 소스명 |
| `sourceProductId` | `string` | 원본 상품 ID | 예 | API/CSV | 원문 유지 |
| `sellerName` | `string` | 판매자명 | 예 | API/CSV | 공백/법인표기 정리 |
| `title` | `string` | 원본 상품명 | 예 | API/CSV | HTML 제거 |
| `price` | `number \| null` | 상품 가격 | 아니오 | API/CSV | 숫자화 |
| `shippingFee` | `number \| null` | 배송비 | 아니오 | API/CSV | 숫자화 |
| `totalPrice` | `number \| null` | 총 가격 | 아니오 | 계산 또는 API | `price + shippingFee` 우선 |
| `rating` | `number \| null` | 평점 | 아니오 | API | 숫자화 |
| `reviewCount` | `number \| null` | 리뷰 수 | 아니오 | API | 숫자화 |
| `productUrl` | `string \| null` | 원본 링크 | 아니오 | API/CSV | URL 검증 |
| `imageUrl` | `string \| null` | 이미지 URL | 아니오 | API | URL 검증 |
| `availability` | `string` | 판매 상태 | 예 | API/CSV | `available`, `ended` 등 표준화 |
| `collectedAt` | `string` | 수집 시각 | 예 | 파이프라인 | ISO 문자열 |

## PriceSnapshot

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 스냅샷 ID | 예 | 파이프라인 | 제품/리스팅/시각 조합 |
| `productId` | `string` | 제품 ID | 예 | 매칭 결과 | 내부 ID 사용 |
| `listingId` | `string` | 리스팅 ID | 예 | 수집 결과 | 내부 ID 사용 |
| `price` | `number \| null` | 상품 가격 | 아니오 | API/CSV | 숫자화 |
| `shippingFee` | `number \| null` | 배송비 | 아니오 | API/CSV | 숫자화 |
| `totalPrice` | `number \| null` | 총 가격 | 아니오 | 계산/API | 숫자화 |
| `collectedAt` | `string` | 수집 시각 | 예 | 파이프라인 | ISO 문자열 |

## Certification

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `type` | `string` | 인증 종류 | 예 | 인증 데이터 | KS, 고효율 등 표준화 |
| `number` | `string` | 인증번호 | 예 | 인증 데이터 | 공백/하이픈 정리 |
| `issuer` | `string \| null` | 발급기관 | 아니오 | 인증 데이터 | 기관명 정리 |
| `status` | `string` | 상태 | 예 | 인증 데이터 | 유효/만료/미확인 |
| `issuedAt` | `string \| null` | 발급일 | 아니오 | 인증 데이터 | ISO 또는 원문 일자 |
| `expiresAt` | `string \| null` | 만료일 | 아니오 | 인증 데이터 | ISO 또는 원문 일자 |
| `sourceUrl` | `string \| null` | 원본 링크 | 아니오 | 인증 데이터 | URL 검증 |

## ProcurementRecord

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 계약/등록 레코드 ID | 예 | 조달 데이터 | 원본 ID 사용 |
| `productId` | `string` | 제품 ID | 예 | 매칭 결과 | 내부 ID 사용 |
| `contractType` | `string \| null` | 계약 유형 | 아니오 | 조달 API | 표준화 필요 |
| `registeredPrice` | `number \| null` | 등록 가격 | 아니오 | 조달 API | 숫자화 |
| `contractPrice` | `number \| null` | 계약 가격 | 아니오 | 조달 API | 숫자화 |
| `quantity` | `number \| null` | 수량 | 아니오 | 조달 API | 숫자화 |
| `amount` | `number \| null` | 금액 | 아니오 | 조달 API | 숫자화 |
| `buyer` | `string \| null` | 수요기관 | 아니오 | 조달 API | 공백 정리 |
| `supplier` | `string \| null` | 공급사 | 아니오 | 조달 API | 업체명 정규화 |
| `contractDate` | `string \| null` | 계약일 | 아니오 | 조달 API | ISO 또는 원문 일자 |
| `sourceUrl` | `string \| null` | 원본 링크 | 아니오 | 조달 API | URL 검증 |

## SourceMetadata

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `sourceName` | `string` | 출처명 | 예 | 파이프라인 | 표준 소스명 |
| `sourceType` | `string` | 출처 유형 | 예 | 파이프라인 | API/CSV/manual 등 |
| `originalId` | `string` | 원본 레코드 ID | 예 | 원본 데이터 | 원문 유지 |
| `originalUrl` | `string \| null` | 원본 링크 | 아니오 | 원본 데이터 | URL 검증 |
| `collectedAt` | `string` | 수집 시각 | 예 | 파이프라인 | ISO 문자열 |
| `updatedAt` | `string \| null` | 원본 갱신 시각 | 아니오 | API | ISO 또는 원문 일자 |
| `fetchStatus` | `string` | 수집 상태 | 예 | 파이프라인 | `ok`, `partial`, `failed` |
| `rawHash` | `string` | 원본 해시 | 예 | 파이프라인 | 변경 감지용 해시 |

## CollectionRun

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 실행 ID | 예 | 파이프라인 | 시각/소스 기반 생성 |
| `startedAt` | `string` | 시작 시각 | 예 | 파이프라인 | ISO 문자열 |
| `finishedAt` | `string \| null` | 종료 시각 | 아니오 | 파이프라인 | ISO 문자열 |
| `sourceId` | `string` | 소스 식별자 | 예 | 파이프라인 | 어댑터 ID 사용 |
| `success` | `boolean` | 성공 여부 | 예 | 파이프라인 | 불리언 |
| `fetchedCount` | `number` | 조회 건수 | 예 | 파이프라인 | 숫자 |
| `newCount` | `number` | 신규 건수 | 예 | 파이프라인 | 숫자 |
| `changedCount` | `number` | 변경 건수 | 예 | 파이프라인 | 숫자 |
| `errorCount` | `number` | 오류 건수 | 예 | 파이프라인 | 숫자 |
| `summary` | `string` | 요약 | 아니오 | 파이프라인 | 짧은 텍스트 |

## DataIssue

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 이슈 ID | 예 | 분석 결과 | 내부 생성 |
| `productId` | `string \| null` | 관련 제품 ID | 아니오 | 분석 결과 | 내부 ID 사용 |
| `issueType` | `string` | 문제 유형 | 예 | 분석 결과 | 누락/중복/미갱신 등 |
| `severity` | `string` | 심각도 | 예 | 분석 결과 | low/medium/high |
| `description` | `string` | 설명 | 예 | 분석 결과 | 템플릿 기반 |
| `sourceName` | `string \| null` | 관련 출처 | 아니오 | 분석 결과 | 표준 소스명 |
| `detectedAt` | `string` | 감지 시각 | 예 | 분석 결과 | ISO 문자열 |
| `resolved` | `boolean` | 해결 여부 | 예 | 운영 처리 | 불리언 |

## AnalysisReport

| 필드 | 타입 | 설명 | 필수 | 원본 출처 | 정규화 규칙 |
| --- | --- | --- | --- | --- | --- |
| `id` | `string` | 리포트 ID | 예 | 분석 파이프라인 | 내부 생성 |
| `title` | `string` | 분석 제목 | 예 | 분석 파이프라인 | 짧은 제목 |
| `generatedAt` | `string` | 생성 시각 | 예 | 분석 파이프라인 | ISO 문자열 |
| `periodStart` | `string` | 분석 시작 | 예 | 분석 파이프라인 | ISO 문자열 |
| `periodEnd` | `string` | 분석 종료 | 예 | 분석 파이프라인 | ISO 문자열 |
| `confidence` | `number` | 신뢰도 | 예 | 분석 파이프라인 | 0~1 또는 0~100 규칙 고정 필요 |
| `summaryLines` | `string[]` | 요약 문장 | 예 | 분석 파이프라인 | 계산 근거 기반 |
| `basis` | `string[]` | 계산 근거 | 예 | 분석 파이프라인 | 기간/표본/비교 기준 명시 |

## 데이터 품질 점수 기준

현재 구현은 아래 항목을 기준으로 확장 가능하도록 설계되어 있습니다.

- 제품명 존재
- 모델명 존재
- 업체 존재
- 가격 존재
- 주요 사양 존재
- 인증 정보 존재
- 원본 URL 존재
- 최근 수집 여부
- 다중 출처 교차 확인
- 제품 매칭 신뢰도

운영 시 점수 계산식은 `lib/datahub/analytics.ts` 또는 전용 품질 모듈로 고정하는 것을 권장합니다.
