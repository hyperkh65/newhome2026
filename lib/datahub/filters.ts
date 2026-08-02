import { normalizeCompanyName } from "@/lib/datahub/normalizers";
import type { Company, Listing, Product } from "@/types/datahub";

export interface ProductFilterInput {
  market?: string | null;
  category?: string | null;
  manufacturer?: string | null;
  wattage?: string | null;
  efficacyMin?: string | null;
  colorTemperature?: string | null;
  cert?: string | null;
  updatedWithinDays?: string | null;
  q?: string | null;
}

export function filterProducts(products: Product[], input: ProductFilterInput) {
  const now = Date.now();
  const wattage = Number(input.wattage || 0);
  const efficacyMin = Number(input.efficacyMin || 0);
  const colorTemperature = Number(input.colorTemperature || 0);
  const updatedWithinDays = Number(input.updatedWithinDays || 0);
  const query = (input.q || "").trim().toLowerCase();

  return products.filter((product) => {
    if (input.market && input.market !== "all" && !product.marketTypes.includes(input.market as "procurement" | "consumer")) {
      return false;
    }
    if (input.category && product.category !== input.category) return false;
    if (input.manufacturer && product.manufacturerId !== input.manufacturer) return false;
    if (wattage > 0 && product.specifications.wattage !== wattage) return false;
    if (efficacyMin > 0 && (product.specifications.efficacy || 0) < efficacyMin) return false;
    if (colorTemperature > 0 && product.specifications.colorTemperature !== colorTemperature) return false;
    if (input.cert === "yes" && product.certifications.length === 0) return false;
    if (input.cert === "no" && product.certifications.length > 0) return false;
    if (
      updatedWithinDays > 0 &&
      now - new Date(product.lastSeenAt).getTime() > updatedWithinDays * 24 * 60 * 60 * 1000
    ) {
      return false;
    }
    if (query) {
      const haystack = [
        product.displayName,
        product.canonicalName,
        product.modelName,
        product.brand,
        product.category,
        product.subcategory,
        product.certifications.map((cert) => cert.number).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function filterCompanies(companies: Company[], query?: string | null) {
  const normalized = normalizeCompanyName(query || "").trim().toLowerCase();
  return companies.filter((company) => {
    if (!normalized) return true;
    return [
      normalizeCompanyName(company.name),
      normalizeCompanyName(company.normalizedName),
      company.businessNumber,
      company.region,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()
      .includes(normalized);
  });
}

export function buildCategoryOptions(products: Product[]) {
  return [...new Set(products.map((product) => product.category))].sort();
}

export function buildWattageOptions(products: Product[]) {
  return [...new Set(products.map((product) => product.specifications.wattage).filter(Boolean) as number[])].sort((a, b) => a - b);
}

export function buildColorTemperatureOptions(products: Product[]) {
  return [...new Set(products.map((product) => product.specifications.colorTemperature).filter(Boolean) as number[])].sort((a, b) => a - b);
}

export function listingSummary(listings: Listing[]) {
  const totalPrices = listings.map((listing) => listing.totalPrice).filter((price) => price > 0);
  return {
    count: listings.length,
    min: totalPrices.length ? Math.min(...totalPrices) : null,
    max: totalPrices.length ? Math.max(...totalPrices) : null,
  };
}
