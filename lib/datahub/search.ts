import { buildCanonicalName, normalizeCompanyName } from "@/lib/datahub/normalizers";
import { scoreProductMatch } from "@/lib/datahub/matching";
import type { Company, Product } from "@/types/datahub";

export type SearchScope = "all" | "procurement" | "consumer" | "companies";

export function tokenizeQuery(query: string) {
  return buildCanonicalName(query).split(" ").filter(Boolean);
}

export function searchProducts(
  products: Product[],
  query: string,
  scope: SearchScope
) {
  const tokens = tokenizeQuery(query);
  const shouldFilterScope = scope === "procurement" || scope === "consumer";

  return products
    .map((product) => {
      const haystack = [
        product.displayName,
        product.canonicalName,
        product.modelName,
        product.brand,
        product.category,
        product.subcategory,
        product.specifications.hsCode,
        product.certifications.map((item) => item.number).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const tokenHits = tokens.filter((token) => haystack.includes(token)).length;
      const matchScore =
        tokenHits * 20 +
        scoreProductMatch(
          {
            displayName: product.displayName,
            canonicalName: product.canonicalName,
            modelName: product.modelName,
            brand: product.brand,
            category: product.category,
            specifications: product.specifications,
          },
          {
            displayName: query,
            canonicalName: buildCanonicalName(query),
            modelName: null,
            brand: null,
            category: null,
            specifications: {},
          }
        ).score;

      return { product, matchScore, tokenHits };
    })
    .filter(({ product, tokenHits }) => {
      if (shouldFilterScope && !product.marketTypes.includes(scope)) return false;
      if (!query) return true;
      return tokenHits > 0;
    })
    .sort((a, b) => b.matchScore - a.matchScore || b.product.lastSeenAt.localeCompare(a.product.lastSeenAt));
}

export function searchCompanies(companies: Company[], query: string) {
  const normalized = normalizeCompanyName(query).toLowerCase();
  return companies.filter((company) => {
    if (!query) return true;
    const haystack = [
      normalizeCompanyName(company.name),
      normalizeCompanyName(company.normalizedName),
      company.businessNumber,
      company.region,
      company.website,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(normalized);
  });
}
