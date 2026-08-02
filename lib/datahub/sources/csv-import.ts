import { createHash } from "node:crypto";

import {
  buildCanonicalName,
  extractModelName,
  extractSpecifications,
  normalizeCompanyName,
  normalizeProductName,
} from "@/lib/datahub/normalizers";
import type {
  DataSourceAdapter,
  FetchOptions,
  Product,
  RawProductRecord,
  ValidationResult,
} from "@/types/datahub";

function hashPayload(payload: unknown) {
  return createHash("sha1").update(JSON.stringify(payload)).digest("hex");
}

export function parseCsv(content: string) {
  const [headerLine, ...lines] = content.trim().split(/\r?\n/);
  const headers = headerLine.split(",").map((header) => header.trim());
  return lines
    .filter(Boolean)
    .map((line) => {
      const cells = line.split(",");
      return Object.fromEntries(headers.map((header, index) => [header, cells[index]?.trim() || ""]));
    });
}

export class CsvImportAdapter implements DataSourceAdapter {
  sourceId = "csv-import";
  sourceName = "CsvImportAdapter";
  marketType = "consumer" as const;

  async fetch(_options: FetchOptions) {
    return [];
  }

  normalize(record: RawProductRecord): Product {
    const displayName = normalizeProductName(String(record.displayName || record.title || ""));
    return {
      id: String(record.productId || hashPayload(record)),
      canonicalName: buildCanonicalName(displayName),
      displayName,
      modelName: extractModelName(displayName),
      brand: record.brand ? normalizeCompanyName(String(record.brand)) : null,
      manufacturerId: null,
      supplierIds: [],
      marketTypes: [String(record.marketType || "consumer") as "consumer"],
      category: String(record.category || "기타"),
      subcategory: null,
      specifications: extractSpecifications(displayName),
      certifications: [],
      images: [],
      sourceRecords: [
        {
          sourceName: this.sourceName,
          sourceType: "manual",
          originalId: String(record.productId || ""),
          originalUrl: typeof record.productUrl === "string" ? record.productUrl : null,
          collectedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          fetchStatus: "success",
          rawHash: hashPayload(record),
        },
      ],
      firstSeenAt: String(record.collectedAt || new Date().toISOString()),
      lastSeenAt: String(record.collectedAt || new Date().toISOString()),
      status: "review",
      dataQualityScore: 58,
    };
  }

  validate(record: RawProductRecord): ValidationResult {
    const issues: string[] = [];
    if (!record.displayName) issues.push("displayName 누락");
    if (!record.price) issues.push("price 누락");
    if (!record.sourceName) issues.push("sourceName 누락");
    return { valid: issues.length === 0, issues };
  }
}
