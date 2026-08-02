import { promises as fs } from "node:fs";
import path from "node:path";

import { median } from "../lib/datahub/analytics";
import { demoBundle } from "../lib/datahub/demo-seed";
import { normalizeBusinessNumber, normalizeCompanyName } from "../lib/datahub/normalizers";
import {
  loadCollectionRunHistory,
  loadLatestChangeSummary,
  loadLatestCollectionRuns,
} from "../lib/datahub/pipeline-history";
import { ProcurementAdapter } from "../lib/datahub/sources/procurement";
import type {
  AnalysisReport,
  CollectionRun,
  Company,
  DataIssue,
  PriceSnapshot,
  ProcurementRecord,
  Product,
  PublicDataBundle,
  RawProductRecord,
} from "../types/datahub";
import {
  buildDashboardSummary,
  buildMarketComparisonRows,
  buildPriceDeltaRows,
  buildSourceHealthRows,
  categoryCounts,
} from "../lib/datahub/analytics";
import {
  buildCategoryOptions,
  buildColorTemperatureOptions,
  buildWattageOptions,
} from "../lib/datahub/filters";

const rawDir = path.join(process.cwd(), "data", "raw");
const outDir = path.join(process.cwd(), "data", "public");

async function writeJson(filename: string, payload: unknown) {
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(path.join(outDir, filename), JSON.stringify(payload, null, 2), "utf8");
}

async function listProcurementRawFiles() {
  try {
    const entries = await fs.readdir(rawDir);
    return entries
      .filter((entry) => /^procurement-\d{4}-\d{2}-\d{2}\.json$/.test(entry))
      .sort()
      .reverse();
  } catch {
    return [];
  }
}

async function readLatestProcurementRows() {
  const [latestFile] = await listProcurementRawFiles();
  if (!latestFile) return { rows: [] as RawProductRecord[], file: null as string | null };
  const fullPath = path.join(rawDir, latestFile);
  const raw = await fs.readFile(fullPath, "utf8");
  const rows = JSON.parse(raw) as RawProductRecord[];
  return { rows, file: latestFile };
}

function summarizePipelineRuns(runs: CollectionRun[]) {
  if (runs.length === 0) return null;
  const startedAt = runs[0]?.startedAt ?? new Date().toISOString();
  const finishedAt = runs[runs.length - 1]?.finishedAt ?? startedAt;
  const requiredFailures = runs.filter(
    (run) => run.sourceName === "PublicDataBuilder" && !run.success
  );
  const hasPartial = runs.some((run) => run.status === "partial" || !run.success);

  return {
    runId: startedAt.replace(/[-:.TZ]/g, "").slice(0, 14),
    startedAt,
    finishedAt,
    sourceName: "DataPipeline",
    success: requiredFailures.length === 0,
    fetchedCount: runs.reduce((sum, run) => sum + run.fetchedCount, 0),
    insertedCount: runs.reduce((sum, run) => sum + run.insertedCount, 0),
    changedCount: runs.reduce((sum, run) => sum + run.changedCount, 0),
    errorCount: runs.reduce((sum, run) => sum + run.errorCount, 0),
    errorSummary:
      requiredFailures[0]?.errorSummary ??
      runs.find((run) => !run.success)?.errorSummary ??
      null,
    outputFile: "data/public/bundle.json",
    durationMs: runs.reduce((sum, run) => sum + (run.durationMs ?? 0), 0),
    status: requiredFailures.length > 0 ? "failed" : hasPartial ? "partial" : "success",
    demo: false,
  } satisfies CollectionRun;
}

function createCompanyId(name: string, bizno?: string | null) {
  const normalizedBizno = normalizeBusinessNumber(bizno || "");
  if (normalizedBizno) return `cmp-${normalizedBizno.replace(/-/g, "")}`;
  return `cmp-${normalizeCompanyName(name).toLowerCase().replace(/[^a-z0-9가-힣]+/giu, "-")}`;
}

function buildProcurementBundle(rows: RawProductRecord[], sourceFile: string | null): PublicDataBundle {
  const adapter = new ProcurementAdapter();
  const products = new Map<string, Product>();
  const companies = new Map<string, Company>();
  const procurementRecords: ProcurementRecord[] = [];
  const priceHistory: PriceSnapshot[] = [];
  const issues: DataIssue[] = [];
  const now = new Date().toISOString();

  for (const row of rows) {
    const validation = adapter.validate(row);
    if (!validation.valid) {
      issues.push({
        issueId: `issue-${row.productId || procurementRecords.length + 1}`,
        productId: typeof row.productId === "string" ? row.productId : null,
        issueType: "validation",
        severity: "medium",
        description: validation.issues.join(", "),
        sourceName: adapter.sourceName,
        detectedAt: now,
        resolved: false,
        demo: false,
      });
      continue;
    }

    const product = adapter.normalize(row);
    const supplierName = normalizeCompanyName(
      String(row.supplierName ?? row.brand ?? product.brand ?? "미상")
    );
    const supplierBizno = normalizeBusinessNumber(String(row.supplierBizno ?? ""));
    const companyId = createCompanyId(supplierName, supplierBizno);
    const existingCompany = companies.get(companyId);

    companies.set(
      companyId,
      existingCompany ?? {
        id: companyId,
        name: supplierName,
        normalizedName: normalizeCompanyName(supplierName),
        businessNumber: supplierBizno || null,
        companyType: "supplier",
        address: (row.supplierRegion as string | null) ?? null,
        region: (row.supplierRegion as string | null) ?? null,
        website: null,
        productCount: 0,
        procurementProductCount: 0,
        consumerProductCount: 0,
        firstSeenAt: product.firstSeenAt,
        lastSeenAt: product.lastSeenAt,
        demo: false,
      }
    );

    product.manufacturerId = companyId;
    product.supplierIds = [companyId];
    product.demo = false;
    products.set(product.id, product);

    const recordId = `pr-${String(row.productId || procurementRecords.length + 1)}`;
    const registeredPrice =
      typeof row.registeredPrice === "number"
        ? row.registeredPrice
        : typeof row.contractPrice === "number"
          ? row.contractPrice
          : null;

    procurementRecords.push({
      id: recordId,
      productId: product.id,
      contractType: String((row.raw as Record<string, unknown> | undefined)?.shopCtrtTyNm ?? ""),
      registeredPrice,
      contractPrice: typeof row.contractPrice === "number" ? row.contractPrice : registeredPrice,
      quantity: typeof row.quantity === "number" ? row.quantity : null,
      amount: typeof row.amount === "number" ? row.amount : null,
      buyer: typeof row.buyer === "string" ? row.buyer : null,
      supplier: supplierName,
      contractDate: typeof row.contractDate === "string" ? row.contractDate : product.lastSeenAt,
      sourceUrl: typeof row.originalUrl === "string" ? row.originalUrl : null,
      demo: false,
    });

    if (registeredPrice !== null) {
      priceHistory.push({
        id: `ps-${recordId}`,
        productId: product.id,
        listingId: null,
        price: registeredPrice,
        shippingFee: 0,
        totalPrice: registeredPrice,
        collectedAt: typeof row.updatedAt === "string" ? row.updatedAt : product.lastSeenAt,
        demo: false,
      });
    }
  }

  for (const product of products.values()) {
    for (const companyId of product.supplierIds) {
      const company = companies.get(companyId);
      if (!company) continue;
      company.productCount += 1;
      company.procurementProductCount += 1;
      if (company.firstSeenAt > product.firstSeenAt) company.firstSeenAt = product.firstSeenAt;
      if (company.lastSeenAt < product.lastSeenAt) company.lastSeenAt = product.lastSeenAt;
    }
  }

  const productList = Array.from(products.values()).sort((a, b) => b.lastSeenAt.localeCompare(a.lastSeenAt));
  const companyList = Array.from(companies.values()).sort((a, b) => b.procurementProductCount - a.procurementProductCount);
  const latestUpdatedAt = productList[0]?.lastSeenAt ?? now;
  const prices = procurementRecords
    .map((record) => record.registeredPrice ?? record.contractPrice)
    .filter((value): value is number => typeof value === "number" && Number.isFinite(value));
  const priceMedian = prices.length > 0 ? median(prices) : null;

  const collectionRuns: CollectionRun[] = [
    {
      runId: `run-${sourceFile ?? "procurement"}`,
      startedAt: latestUpdatedAt,
      finishedAt: now,
      sourceName: adapter.sourceName,
      success: productList.length > 0,
      fetchedCount: rows.length,
      insertedCount: productList.length,
      changedCount: procurementRecords.length,
      errorCount: issues.length,
      errorSummary: issues.length > 0 ? issues[0].description : null,
      demo: false,
    },
  ];

  const analysisReports: AnalysisReport[] = [
    {
      id: "analysis-procurement-latest",
      createdAt: now,
      title: "조달 실데이터 요약",
      periodLabel: sourceFile ? sourceFile.replace("procurement-", "").replace(".json", "") : "최신 수집",
      dataPoints: productList.length,
      confidenceLabel: "실수집",
      summary:
        productList.length > 0
          ? `조달 실데이터 ${productList.length}건을 반영했습니다. 중앙 등록가는 ${
              priceMedian ? `${Math.round(priceMedian).toLocaleString("ko-KR")}원` : "집계 전"
            }입니다.`
          : "조달 실데이터가 아직 비어 있습니다.",
      details: [
        `출처: ${adapter.sourceName}`,
        `공급 업체 수: ${companyList.length}`,
        `조달 기록 수: ${procurementRecords.length}`,
      ],
      demo: false,
    },
  ];

  return {
    generatedAt: now,
    demo: false,
    products: productList,
    companies: companyList,
    listings: [],
    priceHistory,
    procurementRecords,
    collectionRuns,
    dataIssues: issues,
    analysisReports,
  };
}

async function main() {
  const { rows, file } = await readLatestProcurementRows();
  const hasRealProcurementRows = rows.some((row) => row.sourceId !== "procurement-demo");
  const latestPipelineRuns = await loadLatestCollectionRuns();
  const runHistory = await loadCollectionRunHistory();
  const latestChanges = await loadLatestChangeSummary();

  const bundle = hasRealProcurementRows
    ? buildProcurementBundle(rows, file)
    : {
        ...demoBundle,
        generatedAt: new Date().toISOString(),
      };

  if (latestPipelineRuns.length > 0) {
    bundle.collectionRuns = latestPipelineRuns;
  }

  await writeJson("bundle.json", bundle);
  await writeJson("products.json", bundle.products);
  await writeJson("companies.json", bundle.companies);
  await writeJson("listings.json", bundle.listings);
  await writeJson("price-history.json", bundle.priceHistory);
  await writeJson("procurement-records.json", bundle.procurementRecords);
  await writeJson("collection-runs.json", bundle.collectionRuns);
  await writeJson("analysis-reports.json", bundle.analysisReports);
  await writeJson("data-issues.json", bundle.dataIssues);
  if (latestChanges) {
    await writeJson("change-summary.json", latestChanges);
  }

  const dashboardSummary = buildDashboardSummary(bundle.products, bundle.companies);
  const priceChanges = buildPriceDeltaRows(bundle.products, bundle.priceHistory, bundle.companies);
  const sourceHealth = buildSourceHealthRows(bundle.collectionRuns, bundle.dataIssues);
  const marketComparison = buildMarketComparisonRows(
    bundle.products,
    bundle.listings,
    bundle.procurementRecords
  );
  const procurementProducts = bundle.products.filter((product) =>
    product.marketTypes.includes("procurement")
  );

  await writeJson("dashboard.json", {
    generatedAt: bundle.generatedAt,
    demo: bundle.demo,
    summary: dashboardSummary,
    categoryStats: categoryCounts(bundle.products).slice(0, 12),
    priceChanges: priceChanges.slice(0, 12),
    sourceHealth,
    marketComparison: marketComparison.slice(0, 20),
    newProducts: [...bundle.products]
      .sort((a, b) => b.firstSeenAt.localeCompare(a.firstSeenAt))
      .slice(0, 8),
    recentChanges: latestChanges?.summary ?? null,
    topCompanies: [...bundle.companies]
      .sort((a, b) => b.productCount - a.productCount)
      .slice(0, 8),
  });

  await writeJson("products-page.json", {
    generatedAt: bundle.generatedAt,
    demo: bundle.demo,
    total: bundle.products.length,
    categories: buildCategoryOptions(bundle.products),
    wattages: buildWattageOptions(bundle.products),
    colorTemperatures: buildColorTemperatureOptions(bundle.products),
    rows: bundle.products.slice(0, 300),
  });

  await writeJson("companies-page.json", {
    generatedAt: bundle.generatedAt,
    demo: bundle.demo,
    total: bundle.companies.length,
    rows: bundle.companies,
  });

  await writeJson("procurement-page.json", {
    generatedAt: bundle.generatedAt,
    demo: bundle.demo,
    stats: {
      products: procurementProducts.length,
      companies: bundle.companies.filter((company) => company.procurementProductCount > 0).length,
      records: bundle.procurementRecords.length,
      certifiedProducts: procurementProducts.filter((product) => product.certifications.length > 0).length,
    },
    categoryStats: categoryCounts(procurementProducts).slice(0, 20),
    rows: procurementProducts.slice(0, 300),
    records: bundle.procurementRecords.slice(0, 600),
  });

  await writeJson("collection-runs-history.json", runHistory);
  const latestRun = summarizePipelineRuns(latestPipelineRuns);
  await writeJson("pipeline-status.json", {
    generatedAt: bundle.generatedAt,
    demo: bundle.demo,
    latestRun,
    lastSuccessfulBuildAt: bundle.generatedAt,
    runs: latestPipelineRuns,
    historyCount: runHistory.length,
    latestChanges: latestChanges?.summary ?? null,
  });

  console.log(
    `Public data written to ${outDir} (${bundle.demo ? "demo" : "real procurement"} mode, products=${bundle.products.length})`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
