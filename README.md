# LED 제품 시장 데이터

조달 등록정보와 민수 판매정보를 검색하고 비교하는 데이터 중심 서비스입니다.  
이 저장소는 홍보용 회사 홈페이지가 아니라, LED 조명 제품 시장 데이터를 수집·정규화·누적·분석·검색하는 데이터 허브를 목표로 합니다.

## 프로젝트 목적

- LED 제품명, 모델명, 업체명, 규격, 인증번호 기반 통합 검색
- 조달시장과 민수시장 가격 및 사양 비교
- 업체별 등록 현황, 제품 수, 가격대, 계약 정보 확인
- 가격 이력, 변경 감지, 통계 분석, 데이터 품질 상태 제공
- 2일 간격 자동 수집 및 정적 JSON 기반 배포

## 전체 아키텍처

### 프론트엔드

- Next.js App Router
- TypeScript
- CSS 기반 데이터 밀도 높은 UI
- 정적 데이터 파일 우선 로드

### 데이터 계층

- `data/raw`: 원본 수집 결과
- `data/normalized`: 정규화 결과
- `data/history`: 가격 및 상태 이력
- `data/analytics`: 통계/분석 산출물
- `data/public`: 웹사이트에서 직접 사용하는 정적 JSON

### 핵심 모듈

- `lib/datahub/normalizers.ts`: 제품명, 업체명, 사양 정규화
- `lib/datahub/matching.ts`: 유사 제품 매칭 점수 계산
- `lib/datahub/analytics.ts`: 중앙값, IQR, 가격 변화, 비교 통계
- `lib/datahub/repository.ts`: 공개 JSON 로더
- `lib/datahub/sources/*`: 데이터 소스 어댑터
- `lib/datahub/notion.ts`: Notion API 큐/재시도 처리

### 자동화

- `scripts/*`: 수집, 정규화, 매칭, 변경 감지, 분석, Notion 동기화, 공개 데이터 생성
- `.github/workflows/collect-and-analyze.yml`: 2일 간격 자동 실행

## 설치 방법

```bash
npm install
```

## 환경변수 설정

`.env.example`를 참고해 `.env.local` 또는 배포 환경 변수에 아래 값을 설정합니다.

### 필수

- `NEXT_PUBLIC_SITE_URL`
- `ADMIN_SECRET`

### Notion 연동

- `NOTION_TOKEN`
- `NOTION_PRODUCTS_DATABASE_ID`
- `NOTION_COMPANIES_DATABASE_ID`
- `NOTION_PRICE_HISTORY_DATABASE_ID`
- `NOTION_LISTINGS_DATABASE_ID`
- `NOTION_CERTIFICATIONS_DATABASE_ID`
- `NOTION_PROCUREMENT_RECORDS_DATABASE_ID`
- `NOTION_COLLECTION_RUNS_DATABASE_ID`
- `NOTION_ANALYSIS_REPORTS_DATABASE_ID`
- `NOTION_DATA_ISSUES_DATABASE_ID`

### 데이터 소스

- `PROCUREMENT_API_KEY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`

### 선택

- `OLLAMA_BASE_URL`

## 로컬 실행 방법

### 공개 데이터 생성

```bash
npm run build:data
```

### 개발 서버 실행

```bash
npm run dev
```

### 전체 파이프라인 실행

```bash
npm run pipeline
```

## 주요 화면

- `/`: 메인 대시보드
- `/search`: 통합검색
- `/procurement`: 조달시장
- `/consumer`: 민수시장
- `/products`: 제품 목록
- `/products/[id]`: 제품 상세
- `/companies`: 업체 목록
- `/companies/[id]`: 업체 상세
- `/insights`: 자동 분석
- `/sources`: 데이터 출처 및 수집 상태
- `/admin`: 운영자용 상태 화면

## Notion 데이터베이스 설정

다음 데이터베이스를 분리해서 준비합니다.

1. Products
2. Companies
3. Listings
4. Price History
5. Certifications
6. Procurement Records
7. Collection Runs
8. Analysis Reports
9. Data Issues

각 데이터베이스는 ID를 환경변수에 연결합니다.  
현재 스크립트는 기본적인 페이지 생성/업데이트 큐와 재시도 구조를 포함하며, 실제 속성 매핑은 운영 중인 Notion 스키마에 맞춰 확장해야 합니다.

## GitHub Secrets 설정

GitHub Actions에서 아래 Secrets를 설정합니다.

- `NOTION_TOKEN`
- `NOTION_PRODUCTS_DATABASE_ID`
- `NOTION_COMPANIES_DATABASE_ID`
- `NOTION_PRICE_HISTORY_DATABASE_ID`
- `NOTION_LISTINGS_DATABASE_ID`
- `NOTION_CERTIFICATIONS_DATABASE_ID`
- `NOTION_PROCUREMENT_RECORDS_DATABASE_ID`
- `NOTION_COLLECTION_RUNS_DATABASE_ID`
- `NOTION_ANALYSIS_REPORTS_DATABASE_ID`
- `NOTION_DATA_ISSUES_DATABASE_ID`
- `PROCUREMENT_API_KEY`
- `NAVER_CLIENT_ID`
- `NAVER_CLIENT_SECRET`
- `ADMIN_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## GitHub Actions 실행 방법

워크플로 파일:

- `.github/workflows/collect-and-analyze.yml`

지원 방식:

- `schedule`: 2일 간격 예약 실행
- `workflow_dispatch`: 수동 실행

동작 순서:

1. 의존성 설치
2. 파이프라인 실행
3. `data/public`, `data/analytics` 갱신
4. 변경이 있을 때만 자동 커밋
5. `[skip ci]`로 배포/수집 무한 반복 방지

## 조달 API 연결 방법

`lib/datahub/sources/procurement.ts`의 `ProcurementAdapter`를 사용합니다.

- `PROCUREMENT_API_KEY`가 없으면 예시 데이터를 반환합니다.
- 공식 Open API 연동만 허용합니다.
- HTML 파싱, 우회 크롤링, 인증 회피는 구현하지 않습니다.
- 실제 응답 필드는 공식 문서 확인 후 `normalize()` 매핑을 확정해야 합니다.

## 네이버 API 연결 방법

`lib/datahub/sources/naver-shopping.ts`의 `NaverShoppingAdapter`를 사용합니다.

- `NAVER_CLIENT_ID`, `NAVER_CLIENT_SECRET` 필요
- 키가 없으면 예시 데이터를 반환합니다.
- 검색어 기반 상품 목록을 받아 정규화 대상 레코드로 변환합니다.

## CSV 업로드 방법

업로드 템플릿:

- `public/csv-template-led-market.csv`

실행 예:

```bash
tsx scripts/import-csv.ts /absolute/path/to/file.csv
```

동작:

- CSV 파싱
- 필수 컬럼 검증
- 정규화 후보 생성
- 콘솔 요약 출력

현재는 파일 저장보다 검증 및 정규화 진입점을 우선 구현했습니다.

## 데이터 파이프라인

실행 스크립트:

- `scripts/run-pipeline.ts`

단계:

1. 조달 데이터 수집
2. 민수 데이터 수집
3. 원본 저장
4. 정규화
5. 제품 매칭
6. 가격 이력 반영
7. 변경 감지
8. 통계 계산
9. 분석 JSON 생성
10. Notion 동기화
11. 공개 JSON 생성

현재 저장소에는 각 단계를 독립 실행 가능한 파일로 분리해 두었습니다.

## 분석 방식

유료 AI 없이 통계 기반으로 계산합니다.

- 중앙값
- 사분위수
- 표준편차
- IQR 이상치
- 전회 대비 변동률
- 조달/민수 가격 비교
- 카테고리별 제품 수
- 출처별 수집 상태
- 데이터 품질 이슈

자동 문장은 계산 결과를 기반으로만 생성해야 하며, 추측성 해석은 포함하지 않습니다.

## 데이터 출처 추가 방법

새 소스는 `DataSourceAdapter` 인터페이스를 구현합니다.

필수 항목:

- `sourceId`
- `sourceName`
- `marketType`
- `fetch()`
- `normalize()`
- `validate()`

권장 순서:

1. 공식 API
2. 제휴 API
3. 공식 다운로드 데이터
4. CSV 업로드
5. 수동 Notion 입력

## 장애 발생 시 확인 방법

1. GitHub Actions 실행 로그 확인
2. `Collection Runs` 데이터베이스에서 실패 원인 확인
3. `data/public/bundle.json` 마지막 정상 생성 시각 확인
4. `Data Issues` 목록에서 누락/중복/미갱신 확인
5. API 키 만료, 응답 스키마 변경, 429 발생 여부 점검

## 무료 운영 범위

- 정적 JSON 기반 서비스
- GitHub Actions 예약 실행
- Notion 관리형 운영
- 공식 API 또는 CSV 업로드 위주 수집
- 로컬 또는 선택적 Ollama 보조 인터페이스

## 향후 확장 항목

- TanStack Table 고급 정렬/가상화
- 자동완성 API 및 검색 인덱스
- 카테고리별 분리 JSON
- 상세한 Notion 속성 매핑
- 계약 실적 데이터 확장
- 관리자 수동 매칭 검토 UI
- 실제 조달/민수 API 응답 스키마 고정

## 검증 명령

```bash
npm run build:data
npm run lint
npm run typecheck
npm run test
npm run build
```

실행 결과는 작업 완료 보고에 별도로 정리합니다.
