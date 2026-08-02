import { createHash } from "node:crypto";

import { demoBundle } from "@/lib/datahub/demo-seed";
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

async function fetchDemoRows() {
  return demoBundle.listings.map<RawProductRecord>((listing) => ({
    sourceId: "naver-demo",
    sourceName: "NaverShoppingAdapter",
    marketType: "consumer",
    productId: listing.productId,
    title: listing.title,
    sellerName: listing.sellerName,
    price: listing.price,
    shippingFee: listing.shippingFee,
    totalPrice: listing.totalPrice,
    productUrl: listing.productUrl,
    brand: listing.sellerName,
    category: demoBundle.products.find((product) => product.id === listing.productId)?.category,
    updatedAt: listing.collectedAt,
  }));
}

export class NaverShoppingAdapter implements DataSourceAdapter {
  sourceId = "naver-shopping";
  sourceName = "NaverShoppingAdapter";
  marketType = "consumer" as const;

  async fetch(options: FetchOptions): Promise<RawProductRecord[]> {
    const clientId = process.env.NAVER_CLIENT_ID;
    const clientSecret = process.env.NAVER_CLIENT_SECRET;
    if (!clientId || !clientSecret || !options.query) {
      return fetchDemoRows();
    }

    const url = new URL("https://openapi.naver.com/v1/search/shop.json");
    url.searchParams.set("query", options.query);
    url.searchParams.set("display", String(options.limit || 20));

    const response = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": clientId,
        "X-Naver-Client-Secret": clientSecret,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Naver API failed: ${response.status}`);
    }

    const json = (await response.json()) as {
      items?: Array<Record<string, unknown>>;
    };

    return (json.items || []).map<RawProductRecord>((item) => ({
      sourceId: "naver-openapi",
      sourceName: "NaverShoppingAdapter",
      marketType: "consumer",
      productId: String(item.productId || item.link || hashPayload(item)),
      title: String(item.title || ""),
      sellerName: String(item.mallName || ""),
      price: Number(item.lprice || 0),
      shippingFee: 0,
      totalPrice: Number(item.lprice || 0),
      productUrl: typeof item.link === "string" ? item.link : null,
      imageUrl: typeof item.image === "string" ? item.image : null,
      brand:
        typeof item.brand === "string"
          ? item.brand
          : typeof item.maker === "string"
            ? item.maker
            : null,
      category:
        typeof item.category4 === "string"
          ? item.category4
          : typeof item.category3 === "string"
            ? item.category3
            : typeof item.category2 === "string"
              ? item.category2
              : typeof item.category1 === "string"
                ? item.category1
                : null,
      updatedAt: new Date().toISOString(),
    }));
  }

  normalize(record: RawProductRecord): Product {
    const displayName = normalizeProductName(String(record.title || record.displayName || ""));
    return {
      id: String(record.productId || hashPayload(record)),
      canonicalName: buildCanonicalName(displayName),
      displayName,
      modelName: extractModelName(displayName),
      brand: record.brand ? normalizeCompanyName(String(record.brand)) : null,
      manufacturerId: null,
      supplierIds: [],
      marketTypes: ["consumer"],
      category: String(record.category || "기타"),
      subcategory: null,
      specifications: extractSpecifications(displayName),
      certifications: [],
      images: typeof record.imageUrl === "string" ? [record.imageUrl] : [],
      sourceRecords: [
        {
          sourceName: this.sourceName,
          sourceType: "consumer",
          originalId: String(record.productId || ""),
          originalUrl: typeof record.productUrl === "string" ? record.productUrl : null,
          collectedAt: new Date().toISOString(),
          updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : null,
          fetchStatus: "success",
          rawHash: hashPayload(record),
        },
      ],
      firstSeenAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
      lastSeenAt: typeof record.updatedAt === "string" ? record.updatedAt : new Date().toISOString(),
      status: "active",
      dataQualityScore: 60,
      demo: !process.env.NAVER_CLIENT_ID,
    };
  }

  validate(record: RawProductRecord): ValidationResult {
    const issues: string[] = [];
    if (!record.title) issues.push("상품명이 없습니다.");
    if (!record.totalPrice) issues.push("가격이 없습니다.");
    return { valid: issues.length === 0, issues };
  }
}
