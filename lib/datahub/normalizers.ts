import type {
  Company,
  NormalizedProductCandidate,
  Specifications,
} from "@/types/datahub";

const COMPANY_PREFIX = /^(주식회사|\(주\)|㈜)\s*/u;
const COMPANY_SUFFIX = /\s*(주식회사|\(주\)|㈜)$/u;
const PROMO_TOKENS = /(무료배송|특가|정품|당일출고|행사|추천|국내배송|빠른배송)/giu;

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'");
}

function cleanText(value: string) {
  return decodeHtmlEntities(value)
    .replace(/<[^>]+>/g, " ")
    .replace(PROMO_TOKENS, " ")
    .replace(/[|/_,;]+/g, " ")
    .replace(/[×X]/g, "x")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeCompanyName(value: string) {
  const cleaned = cleanText(value)
    .replace(COMPANY_PREFIX, "")
    .replace(COMPANY_SUFFIX, "")
    .trim();

  return cleaned || value.trim();
}

export function normalizeBusinessNumber(value?: string | null) {
  const digits = (value || "").replace(/\D/g, "");
  if (digits.length !== 10) return value || "";
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
}

export function normalizeProductName(value: string) {
  return cleanText(value)
    .replace(/\bLED\b/giu, "LED")
    .replace(/(\d+)\s*W\b/giu, "$1W")
    .replace(/(\d{4})\s*K\b/giu, "$1K")
    .replace(/\(([^)]*(특가|행사|정품|무료배송)[^)]*)\)/giu, " ")
    .replace(/\bLED\s+LED\b/giu, "LED")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildCanonicalName(value: string) {
  return normalizeProductName(value)
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/giu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function extractModelName(value: string) {
  const normalized = normalizeProductName(value);
  const tokens = normalized
    .toUpperCase()
    .split(" ")
    .map((token) => token.trim())
    .filter(Boolean);

  const preferred = tokens.find((token) => {
    if (["LED", "KS", "IP"].includes(token)) return false;
    if (!/[A-Z]/.test(token)) return false;
    if (!/\d/.test(token) && !token.includes("-")) return false;
    return /^[A-Z0-9-]{4,}$/u.test(token);
  });

  return preferred ?? null;
}

export function extractNumber(
  value: string,
  regex: RegExp,
  parser: (match: string) => number = Number
) {
  const match = value.match(regex);
  if (!match?.[1]) return null;
  const parsed = parser(match[1].replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

export function extractSpecifications(value: string): Specifications {
  const normalized = normalizeProductName(value);
  const wattage = extractNumber(normalized, /(\d+(?:\.\d+)?)W\b/i);
  const efficacy = extractNumber(normalized, /(\d+(?:\.\d+)?)\s*lm\/W/i);
  const colorTemperature = extractNumber(normalized, /(\d{4,5})K\b/i);
  const beamAngle = extractNumber(normalized, /(\d{2,3})°/i);
  const dimensionsMatch = normalized.match(/(\d{2,4}\s*x\s*\d{2,4}(?:\s*x\s*\d{2,4})?)/i);
  const ipMatch = normalized.match(/\b(IP\d{2})\b/i);

  return {
    wattage,
    efficacy,
    colorTemperature,
    beamAngle,
    dimensions: dimensionsMatch?.[1]?.replace(/\s*/g, "") ?? null,
    ipRating: ipMatch?.[1]?.toUpperCase() ?? null,
  };
}

export function buildNormalizedCandidate(input: {
  displayName: string;
  category?: string | null;
  brand?: string | null;
}) {
  const displayName = normalizeProductName(input.displayName);
  const modelName = extractModelName(displayName);
  const specifications = extractSpecifications(displayName);

  const candidate: NormalizedProductCandidate = {
    displayName,
    canonicalName: buildCanonicalName(displayName),
    modelName,
    brand: input.brand ? normalizeCompanyName(input.brand) : null,
    category: input.category?.trim() || null,
    specifications,
  };

  return candidate;
}

export function createCompanyIndex(companies: Company[]) {
  return new Map(companies.map((company) => [company.id, company]));
}
