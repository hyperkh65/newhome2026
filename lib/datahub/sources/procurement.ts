import { createHash } from "node:crypto";

import {
  buildCanonicalName,
  extractModelName,
  extractSpecifications,
  normalizeCompanyName,
  normalizeProductName,
} from "@/lib/datahub/normalizers";
import type {
  Certification,
  DataSourceAdapter,
  FetchOptions,
  Product,
  RawProductRecord,
  ValidationResult,
} from "@/types/datahub";

const SHOP_BASE_URL = "https://shop.g2b.go.kr";
const SHOP_PRODUCT_PATH = "/gm/gms/gmsd/newShopUntySrchApi.do";
const SHOP_VENTURE_PATH = "/gm/gms/gmsd/vntrUntySrchApi.do";
type ShopSelectValue = "etpsNm" | "itemIdnfNm";

const DEFAULT_SEARCH_TERMS = [
  "LED",
  "가로등",
  "조명",
  "경관조명",
];
const DEFAULT_COMPANY_TERMS = [
  "주식회사",
  "유한회사",
  "산업",
  "테크",
  "전자",
  "시스템",
  "건설",
  "개발",
  "엔지니어링",
  "정보통신",
  "전기",
  "가구",
  "기술",
  "사업단",
];
const MAX_PAGE_SIZE = 100;
const MAX_RESULT_LIMIT = 2000000;
const INCLUDED_CATEGORY_KEYWORDS = [
  "경관조명",
  "LED실내조명등",
  "도로조명설비",
  "거주로조명설비",
  "다운라이트설비",
  "투광조명",
  "신재생에너지가로등",
  "조명타워",
  "조명제어장치",
];
const EXCLUDED_CATEGORY_KEYWORDS = [
  "가로등주및부속자재",
];
const LIGHTING_NAME_KEYWORDS = [
  "LED",
  "조명",
  "등기구",
  "가로등",
  "보안등",
  "다운라이트",
  "투광",
  "경관",
];

function hashPayload(payload: unknown) {
  return createHash("sha1").update(JSON.stringify(payload)).digest("hex");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function errorMessage(error: unknown) {
  if (error instanceof Error) {
    const cause =
      typeof error.cause === "object" && error.cause
        ? JSON.stringify(error.cause)
        : error.cause
          ? String(error.cause)
          : "";
    return cause ? `${error.message} (cause: ${cause})` : error.message;
  }
  return String(error);
}

function shopApiTerm(term: string) {
  const normalized = term
    .trim()
    .replace(/^\s*(?:\(\s*주\s*\)|㈜|주식회사)\s*/u, "")
    .trim();
  return normalized || term.trim();
}

function shopBaseSearchVO(
  term: string,
  page: number,
  rows: number,
  selectValue: ShopSelectValue
) {
  return {
    tabDiv: "",
    target: "계300001,계300002,계309999",
    apmlNo: "",
    itemCfnm: "",
    selectValue,
    searchKeyword: shopApiTerm(term),
    reSelectValue: "",
    researchKeyword: "",
    andKeyword: "",
    orKeyword: "",
    notKeyword: "",
    lCate: "",
    mCate: "",
    etpsNm: "",
    ctrtClass: "",
    prcMgmtNo: "",
    mfrcNo: "",
    stndDt: "",
    endDt: "",
    sortCd: "rct",
    sortOrder: "desc",
    pageSize: rows,
    currentPage: page,
    recordCountPerPage: rows,
    srchSeCd: "검030006",
    rdoIndex: 1,
    dgtlSrvcMallYn: "N",
    untySrchYn: "",
  };
}

function buildSearchPlans(query?: string | null) {
  const trimmed = (query || "").trim();
  if (trimmed) {
    return [
      { term: trimmed, selectValue: "itemIdnfNm" as const },
      { term: trimmed, selectValue: "etpsNm" as const },
    ];
  }

  return [
    { term: "", selectValue: "itemIdnfNm" as const },
    ...DEFAULT_SEARCH_TERMS.map((term) => ({
      term,
      selectValue: "itemIdnfNm" as const,
    })),
    ...DEFAULT_COMPANY_TERMS.map((term) => ({
      term,
      selectValue: "etpsNm" as const,
    })),
  ];
}

function parseNumeric(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const normalized = value.replace(/[^\d.-]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseKoreanDate(value: unknown) {
  if (typeof value !== "string") return new Date().toISOString();
  const trimmed = value.trim();
  if (/^\d{14}$/.test(trimmed)) {
    return new Date(
      `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}T${trimmed.slice(8, 10)}:${trimmed.slice(10, 12)}:${trimmed.slice(12, 14)}+09:00`
    ).toISOString();
  }
  if (/^\d{8}$/.test(trimmed)) {
    return new Date(
      `${trimmed.slice(0, 4)}-${trimmed.slice(4, 6)}-${trimmed.slice(6, 8)}T00:00:00+09:00`
    ).toISOString();
  }
  const parsed = Date.parse(trimmed);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString() : new Date().toISOString();
}

function parseInputVoltage(value: string) {
  const match = value.match(/\b((?:AC|DC)\s*\d{2,4}V?)\b/i);
  return match?.[1]?.replace(/\s+/g, "") ?? null;
}

function parseInstallationType(value: string) {
  const match = value.match(/(매입형|천장형|직부형|브라켓형|벽부형|펜던트형|고정형)/u);
  return match?.[1] ?? null;
}

function parseDimensions(value: string) {
  const explicit = value.match(/(\d{2,4}\s*[x×]\s*\d{2,4}(?:\s*[x×]\s*\d{2,4})?)(?:\s*mm)?/i);
  if (explicit?.[1]) {
    return explicit[1].replace(/[×X]/g, "x").replace(/\s+/g, "");
  }

  const mmMatches = Array.from(value.matchAll(/(\d{2,4})\s*mm\b/gi)).map((match) => match[1]);
  if (mmMatches.length >= 2) {
    return mmMatches.slice(0, 3).join("x");
  }

  return null;
}

function decodeHtmlText(value: string) {
  return value
    .replace(/&#40;/g, "(")
    .replace(/&#41;/g, ")")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseAttributeMap(row: Record<string, unknown>) {
  const rawLabels = decodeHtmlText(String(row.pdctAtrbNm ?? ""));
  const rawValues = decodeHtmlText(
    String(row.pdctAtrbCdDtlNm ?? row.pdctAtrbCdDtl ?? row.pdctAtrbDtlAbbrNm ?? "")
  );

  if (!rawLabels || !rawValues) return new Map<string, string>();

  const labels = rawLabels
    .split("|")
    .map((chunk) => chunk.split("$")[4]?.trim())
    .filter(Boolean) as string[];
  const values = rawValues
    .split("$")
    .map((value) => value.trim());

  const attributeMap = new Map<string, string>();
  labels.forEach((label, index) => {
    const value = values[index];
    if (value) attributeMap.set(label, value);
  });

  return attributeMap;
}

function parsePartialNumber(value: string, regex: RegExp) {
  const match = decodeHtmlText(value).match(regex);
  if (!match?.[1]) return null;
  const parsed = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAttributeSpecifications(
  row: Record<string, unknown>,
  attributeMap: Map<string, string>,
  combinedSpecSource: string
) {
  const width = attributeMap.get("크기(폭)") ?? null;
  const depth = attributeMap.get("크기(깊이)") ?? null;
  const height = attributeMap.get("크기(높이)") ?? null;
  const sizeParts = [width, depth, height]
    .map((value) => value?.match(/(\d+(?:\.\d+)?)/)?.[1] ?? null)
    .filter(Boolean) as string[];
  const optionText = [
    attributeMap.get("옵션/기타"),
    attributeMap.get("기타"),
    attributeMap.get("비고"),
    String(row.snymNm ?? ""),
  ]
    .filter(Boolean)
    .map((value) => decodeHtmlText(String(value)))
    .join(" ");

  const dimensions =
    sizeParts.length >= 2 ? sizeParts.slice(0, 3).join("x") : parseDimensions(combinedSpecSource);

  return {
    wattage:
      parsePartialNumber(attributeMap.get("램프전력") ?? "", /(\d+(?:\.\d+)?)\s*W/i) ??
      parsePartialNumber(combinedSpecSource, /(\d+(?:\.\d+)?)\s*W\b/i),
    luminousFlux:
      parsePartialNumber(optionText, /(?:광속|정격광속|전광속)\s*[:：]?\s*([\d,]+)\s*lm/i) ??
      null,
    efficacy:
      parsePartialNumber(optionText, /(?:광효율|효율)\s*[:：]?\s*([\d,]+(?:\.\d+)?)\s*lm\/?\s*W/i) ??
      null,
    colorTemperature:
      parsePartialNumber(optionText, /(?:색온도)\s*[:：]?\s*(\d{3,5})\s*K?/i) ??
      parsePartialNumber(combinedSpecSource, /(?:색온도)\s*[:：]?\s*(\d{3,5})\s*K?/i) ??
      parsePartialNumber(attributeMap.get("색온도") ?? "", /(\d{3,5})\s*K?/i),
    cri:
      parsePartialNumber(optionText, /(?:연색성|CRI|Ra)\s*[:：]?\s*(\d{1,3})/i) ?? null,
    powerFactor:
      parsePartialNumber(optionText, /(?:역률)\s*[:：]?\s*(0?\.\d+|\d{1,3})/i) ?? null,
    beamAngle:
      parsePartialNumber(optionText, /(?:배광각|조사각)\s*[:：]?\s*(\d{1,3})\s*°?/i) ?? null,
    ipRating:
      decodeHtmlText(optionText).match(/\b(IP\d{2})\b/i)?.[1]?.toUpperCase() ??
      decodeHtmlText(combinedSpecSource).match(/\b(IP\d{2})\b/i)?.[1]?.toUpperCase() ??
      null,
    inputVoltage:
      parseInputVoltage(attributeMap.get("사용전압") ?? "") ??
      parseInputVoltage(combinedSpecSource),
    dimensions,
    weight:
      decodeHtmlText(optionText).match(/(?:중량|무게)\s*[:：]?\s*([\d.]+\s*(?:kg|g))/i)?.[1] ??
      null,
    material:
      decodeHtmlText(optionText).match(/(?:재질)\s*[:：]?\s*([^,|]+)/i)?.[1]?.trim() ?? null,
    installationType:
      parseInstallationType(attributeMap.get("취부방식") ?? "") ??
      parseInstallationType(combinedSpecSource),
  };
}

function parseCertifications(row: Record<string, unknown>): Certification[] {
  const names = String(row.apmlNm ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const numbers = String(row.apmlNo ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const directCerts = String(row.itemCert ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const ftalCerts = String(row.ftalPrchsTrgtCert ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const certs: Certification[] = [];
  const count = Math.max(names.length, numbers.length);
  for (let index = 0; index < count; index += 1) {
    const name = names[index] ?? "인증";
    const number = numbers[index] ?? `${name}-${index + 1}`;
    certs.push({
      type: name,
      number,
      status: "확인",
    });
  }

  for (const cert of directCerts) {
    certs.push({ type: cert, number: cert, status: "확인" });
  }

  for (const cert of ftalCerts) {
    certs.push({ type: cert, number: cert, status: "확인" });
  }

  const seen = new Set<string>();
  return certs.filter((cert) => {
    const key = `${cert.type}|${cert.number}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function includesKeyword(value: string, keywords: string[]) {
  return keywords.some((keyword) => value.includes(keyword));
}

function isLightingRow(row: Record<string, unknown>) {
  const category = String(row.itemCfnm ?? row.dtlsPrnm ?? row.pdctCfnm ?? "").trim();
  const name = normalizeProductName(
    String(row.itemIdnfNm ?? row.itemIndfNmView ?? row.snymNm ?? row.dtlsPrnm ?? row.vntrItemNm ?? "")
  );

  if (category && includesKeyword(category, EXCLUDED_CATEGORY_KEYWORDS)) {
    return false;
  }

  if (category && includesKeyword(category, INCLUDED_CATEGORY_KEYWORDS)) {
    return true;
  }

  return includesKeyword(name, LIGHTING_NAME_KEYWORDS);
}

function buildSourceUrl(record: Record<string, unknown>) {
  const itemId = String(record.itemIdnfNo ?? "").trim();
  if (!itemId) return SHOP_BASE_URL;
  return `${SHOP_BASE_URL}/sv/ps/psd/goodsInfo.do?goodsIdntfcNo=${encodeURIComponent(itemId)}`;
}

async function shopRequest(path: string, payload: Record<string, unknown>) {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(`${SHOP_BASE_URL}${path}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Accept: "application/json, text/plain, */*",
          Origin: SHOP_BASE_URL,
          Referer: `${SHOP_BASE_URL}/`,
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });

      if (response.ok) {
        const decoded = (await response.json()) as Record<string, unknown>;
        if (!decoded || typeof decoded !== "object") {
          throw new Error("shop.g2b returned invalid JSON");
        }
        return decoded;
      }

      lastError = new Error(`shop.g2b request failed: ${response.status}`);
      if (![408, 422, 429, 500, 502, 503, 504].includes(response.status) || attempt === 3) {
        throw lastError;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt === 3) {
        throw new Error(`shop.g2b network failure: ${errorMessage(error)}`);
      }
    }

    await sleep(700 * attempt + Math.floor(Math.random() * 250));
  }

  throw lastError ?? new Error("shop.g2b request failed");
}

function normalizeShopProductRecord(row: Record<string, unknown>): RawProductRecord {
  const supplierName = normalizeCompanyName(
    String(row.mnftrEtpsNm ?? row.etpsNm ?? row.rprsCtentUntyGrpNm ?? row.grpNm ?? "")
  );
  const displayName = normalizeProductName(
    String(row.itemIdnfNm ?? row.itemIndfNmView ?? row.snymNm ?? row.dtlsPrnm ?? row.vntrItemNm ?? "")
  );
  const category = String(row.itemCfnm ?? row.dtlsPrnm ?? row.pdctCfnm ?? "기타").trim() || "기타";
  const attributeMap = parseAttributeMap(row);
  const combinedSpecSource = [
    displayName,
    String(row.snymNm ?? ""),
    String(row.pdctAtrbNm ?? ""),
    String(row.pdctAtrbCdDtlNm ?? row.pdctAtrbCdDtl ?? row.pdctAtrbDtlAbbrNm ?? ""),
  ]
    .filter(Boolean)
    .join(" ");
  const baseSpecifications = extractSpecifications(combinedSpecSource);
  const attributeSpecifications = parseAttributeSpecifications(row, attributeMap, combinedSpecSource);
  const price = parseNumeric(row.ctrtUprc ?? row.srchUprc ?? row.itemUprc);
  const quantity = parseNumeric(row.ctrtQty);

  return {
    sourceId: `shop.g2b:${String(row.itemIdnfNo ?? row.ctrtItemMngNo ?? row.ctrtNo ?? row.vntrEtpsIndyDmndSqno ?? hashPayload(row))}`,
    sourceName: typeof row.vntrItemNm === "string" ? "나라장터 벤처나라" : "나라장터 종합쇼핑몰",
    marketType: "procurement",
    productId: String(row.itemIdnfNo ?? row.ctrtItemMngNo ?? row.ctrtNo ?? row.vntrEtpsIndyDmndSqno ?? hashPayload(row)),
    displayName,
    brand: supplierName || null,
    category,
    originalUrl: buildSourceUrl(row),
    updatedAt: parseKoreanDate(row.ctrtYmd ?? row.ctrtBgngYmd ?? row.toDay),
    supplierName: supplierName || null,
    supplierBizno: String(row.bzmnRegNo ?? row.etpsCd ?? row.ctentUntyGrpNo ?? "").trim() || null,
    supplierRegion:
      String(row.hdofcLctnCityNm ?? row.hdofcSgnguNm ?? row.spplRgnNm ?? row.whabArnm ?? "").trim() || null,
    itemIdnfNo: String(row.itemIdnfNo ?? "").trim() || null,
    contractNo: String(row.ctrtNo ?? "").trim() || null,
    contractDate: parseKoreanDate(row.ctrtYmd ?? row.ctrtBgngYmd ?? row.toDay),
    registeredPrice: price,
    contractPrice: price,
    quantity,
    amount: price !== null && quantity !== null ? price * quantity : null,
    buyer: String(row.dlvgdsPlacNm ?? "").trim() || null,
    certifications: parseCertifications(row),
    specifications: {
      ...baseSpecifications,
      ...attributeSpecifications,
      hsCode: String(row.itemClsfNo ?? row.dtlsPrnmNo ?? "").trim() || null,
      countryOfOrigin: "대한민국",
    },
    raw: row,
  };
}

function rebuildSpecificationsFromRaw(
  displayName: string,
  rawRow: Record<string, unknown>,
  fallback: Product["specifications"]
) {
  const attributeMap = parseAttributeMap(rawRow);
  const combinedSpecSource = [
    displayName,
    String(rawRow.snymNm ?? ""),
    String(rawRow.pdctAtrbNm ?? ""),
    String(rawRow.pdctAtrbCdDtlNm ?? rawRow.pdctAtrbCdDtl ?? rawRow.pdctAtrbDtlAbbrNm ?? ""),
  ]
    .filter(Boolean)
    .join(" ");
  const baseSpecifications = extractSpecifications(combinedSpecSource);
  const attributeSpecifications = parseAttributeSpecifications(
    rawRow,
    attributeMap,
    combinedSpecSource
  );
  const rawHsCode = String(rawRow.itemClsfNo ?? rawRow.dtlsPrnmNo ?? "").trim();

  return {
    ...baseSpecifications,
    ...fallback,
    ...attributeSpecifications,
    hsCode: fallback.hsCode ?? (rawHsCode.length > 0 ? rawHsCode : null),
    countryOfOrigin: fallback.countryOfOrigin ?? "대한민국",
  } satisfies Product["specifications"];
}

export class ProcurementAdapter implements DataSourceAdapter {
  sourceId = "procurement-shop-g2b";
  sourceName = "나라장터 종합쇼핑몰";
  marketType = "procurement" as const;

  async fetch(options: FetchOptions) {
    const requestedLimit = Math.max(1, Math.min(options.limit ?? MAX_RESULT_LIMIT, MAX_RESULT_LIMIT));
    const rowsPerPage = Math.min(MAX_PAGE_SIZE, requestedLimit);
    const restrictToLighting = (options.categoryMode ?? "lighting") === "lighting";
    const effectivePageLimit = Math.max(1, Math.min(options.pageLimit ?? 500, 20000));
    const searchPlans = buildSearchPlans(options.query);

    const items = new Map<string, RawProductRecord>();
    const errors: string[] = [];

    for (const plan of searchPlans) {
      let termMaxPages = 1;

      for (let page = 1; page <= termMaxPages; page += 1) {
        try {
          const decoded = await shopRequest(SHOP_PRODUCT_PATH, {
            searchVO: shopBaseSearchVO(plan.term, page, rowsPerPage, plan.selectValue),
          });
          const rows = Array.isArray(decoded.rsltList) ? decoded.rsltList : [];
          const totalSize = Number(decoded.totalSize ?? rows.length ?? 0);

          if (page === 1) {
            termMaxPages = Math.max(
              1,
              Math.ceil(Math.min(totalSize || requestedLimit, requestedLimit) / rowsPerPage)
            );
            termMaxPages = Math.min(termMaxPages, effectivePageLimit);
          }

          if (rows.length === 0) {
            await sleep(150);
            break;
          }

          for (const row of rows) {
            if (!row || typeof row !== "object") continue;
            if (restrictToLighting && !isLightingRow(row as Record<string, unknown>)) continue;
            const normalized = normalizeShopProductRecord(row as Record<string, unknown>);
            items.set(normalized.productId as string, normalized);
            if (items.size >= requestedLimit) {
              return Array.from(items.values()).slice(0, requestedLimit);
            }
          }

          await sleep(150);
        } catch (error) {
          errors.push(`${plan.selectValue}:${plan.term || "(blank)"}:${page}:${errorMessage(error)}`);
          await sleep(600);
          break;
        }
      }
    }

    for (const plan of searchPlans) {
      let termMaxPages = 1;

      for (let page = 1; page <= termMaxPages; page += 1) {
        try {
          const decoded = await shopRequest(SHOP_VENTURE_PATH, {
            searchVO: shopBaseSearchVO(plan.term, page, rowsPerPage, plan.selectValue),
          });
          const rows = Array.isArray(decoded.rsltList) ? decoded.rsltList : [];
          const totalSize = Number(decoded.totalSize ?? rows.length ?? 0);

          if (page === 1) {
            termMaxPages = Math.max(
              1,
              Math.ceil(Math.min(totalSize || requestedLimit, requestedLimit) / rowsPerPage)
            );
            termMaxPages = Math.min(termMaxPages, effectivePageLimit);
          }

          if (rows.length === 0) {
            await sleep(150);
            break;
          }

          for (const row of rows) {
            if (!row || typeof row !== "object") continue;
            if (restrictToLighting && !isLightingRow(row as Record<string, unknown>)) continue;
            const normalized = normalizeShopProductRecord(row as Record<string, unknown>);
            items.set(normalized.productId as string, normalized);
            if (items.size >= requestedLimit) {
              return Array.from(items.values()).slice(0, requestedLimit);
            }
          }

          await sleep(150);
        } catch (error) {
          errors.push(
            `venture:${plan.selectValue}:${plan.term || "(blank)"}:${page}:${errorMessage(error)}`
          );
          await sleep(600);
          break;
        }
      }
    }

    if (items.size === 0) {
      throw new Error(
        errors.length > 0
          ? `조달 실데이터 수집 실패: ${errors.slice(0, 3).join(" | ")}`
          : "조달 실데이터를 찾지 못했습니다."
      );
    }

    return Array.from(items.values()).slice(0, requestedLimit);
  }

  normalize(record: RawProductRecord): Product {
    const displayName = normalizeProductName(String(record.displayName || ""));
    const brand = record.brand ? normalizeCompanyName(String(record.brand)) : null;
    const fallbackSpecifications =
      typeof record.specifications === "object" && record.specifications
        ? ({
            ...extractSpecifications(displayName),
            ...(record.specifications as Product["specifications"]),
          } satisfies Product["specifications"])
        : extractSpecifications(displayName);
    const specifications =
      record.raw && typeof record.raw === "object"
        ? rebuildSpecificationsFromRaw(
            displayName,
            record.raw as Record<string, unknown>,
            fallbackSpecifications
          )
        : fallbackSpecifications;

    return {
      id: String(record.productId || hashPayload(record)),
      canonicalName: buildCanonicalName(displayName),
      displayName,
      modelName: extractModelName(displayName),
      brand,
      manufacturerId: null,
      supplierIds: [],
      marketTypes: ["procurement"],
      category: String(record.category || "기타"),
      subcategory: String(record.subcategory || "").trim() || null,
      specifications,
      certifications: Array.isArray(record.certifications)
        ? (record.certifications as Product["certifications"])
        : [],
      images: [],
      sourceRecords: [
        {
          sourceName: this.sourceName,
          sourceType: "procurement",
          originalId: String(record.productId || ""),
          originalUrl: typeof record.originalUrl === "string" ? record.originalUrl : null,
          collectedAt: new Date().toISOString(),
          updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
          fetchStatus: "success",
          rawHash: hashPayload(record),
        },
      ],
      firstSeenAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
      lastSeenAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
      status: "active",
      dataQualityScore: 82,
      demo: false,
    };
  }

  validate(record: RawProductRecord): ValidationResult {
    const issues: string[] = [];
    if (!record.displayName) issues.push("제품명이 없습니다.");
    if (!record.category) issues.push("분류가 없습니다.");
    if (!record.productId) issues.push("상품 식별값이 없습니다.");
    return { valid: issues.length === 0, issues };
  }
}
