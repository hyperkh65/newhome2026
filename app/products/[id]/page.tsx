import { notFound } from "next/navigation";

import { Badge } from "@/components/datahub/Badge";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { formatDate, formatDateTime, formatPercent, formatWon } from "@/lib/datahub/format";
import { searchLiveProcurement } from "@/lib/datahub/live-search";
import {
  getConsumerMedian,
  getListingsForProduct,
  getProductById,
  getSnapshotsForProduct,
  loadBundle,
} from "@/lib/datahub/repository";
import { calculateChangeRate, median } from "@/lib/datahub/analytics";

export default async function ProductDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const query = await searchParams;
  const bundle = await loadBundle();
  let product = getProductById(bundle.products, id);

  if (!product && query.source === "live" && typeof query.q === "string" && query.q.trim()) {
    const live = await searchLiveProcurement(query.q);
    product = live.products.find((item) => item.id === id) ?? null;
  }

  if (!product) notFound();

  const listings = getListingsForProduct(bundle.listings, id);
  const snapshots = getSnapshotsForProduct(bundle.priceHistory, id);
  const procurementRecords = bundle.procurementRecords.filter((record) => record.productId === id);
  const currentSnapshot = snapshots.at(-1);
  const previousSnapshot = snapshots.at(-2);
  const consumerPrices = listings.map((listing) => listing.totalPrice).filter(Boolean);
  const procurementPrices = procurementRecords.map((record) => record.registeredPrice || 0).filter(Boolean);
  const currentPrice = currentSnapshot?.totalPrice ?? median(consumerPrices);
  const previousPrice = previousSnapshot?.totalPrice ?? null;
  const sourceRecord = product.sourceRecords[0] ?? null;
  const additionalSpecs = [
    ["세부 분류", product.subcategory || "-"],
    ["설치 형태", product.specifications.installationType ?? "-"],
    ["배광각", product.specifications.beamAngle ? `${product.specifications.beamAngle}°` : "-"],
    ["재질", product.specifications.material ?? "-"],
    ["상태", product.status],
    ["데이터 품질점수", product.dataQualityScore],
    ["출처", sourceRecord?.sourceName ?? "-"],
    ["원본 링크", sourceRecord?.originalUrl ?? "-"],
  ] as const;

  return (
    <PageFrame updatedAt={product.lastSeenAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>{product.displayName}</h1>
            <p>{product.modelName || "모델명 없음"} · {product.brand || "브랜드 미상"}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {product.marketTypes.map((market) => (
              <Badge key={market} tone={market === "procurement" ? "procurement" : "consumer"}>
                {market === "procurement" ? "조달" : "민수"}
              </Badge>
            ))}
            {product.demo ? <Badge tone="warning">예시 데이터</Badge> : null}
          </div>
        </div>
      </section>

      <div className="dh-grid-2">
        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>핵심 사양</h2>
            </div>
          </div>
          <div className="dh-kv">
            {[
              ["제품 분류", product.category],
              ["소비전력", product.specifications.wattage ? `${product.specifications.wattage}W` : "-"],
              ["정격광속", product.specifications.luminousFlux ? `${product.specifications.luminousFlux}lm` : "-"],
              ["광효율", product.specifications.efficacy ? `${product.specifications.efficacy}lm/W` : "-"],
              ["색온도", product.specifications.colorTemperature ? `${product.specifications.colorTemperature}K` : "-"],
              ["연색성", product.specifications.cri ?? "-"],
              ["역률", product.specifications.powerFactor ?? "-"],
              ["입력전압", product.specifications.inputVoltage ?? "-"],
              ["크기", product.specifications.dimensions ?? "-"],
              ["무게", product.specifications.weight ?? "-"],
              ["방수등급", product.specifications.ipRating ?? "-"],
              ["HS 코드", product.specifications.hsCode ?? "-"],
              ["원산지", product.specifications.countryOfOrigin ?? "-"],
            ].map(([label, value]) => (
              <div className="dh-kv__row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>가격</h2>
            </div>
          </div>
          <div className="dh-kv">
            {[
              ["현재 가격", formatWon(currentPrice)],
              ["이전 가격", formatWon(previousPrice)],
              ["변동률", formatPercent(calculateChangeRate(currentPrice, previousPrice))],
              ["민수 중앙가격", formatWon(getConsumerMedian(bundle.listings, id))],
              ["조달 등록가", formatWon(median(procurementPrices))],
              ["최저가", formatWon(consumerPrices.length ? Math.min(...consumerPrices) : null)],
              ["최고가", formatWon(consumerPrices.length ? Math.max(...consumerPrices) : null)],
              ["최초 수집일", formatDate(product.firstSeenAt)],
              ["최근 수집일", formatDateTime(product.lastSeenAt)],
            ].map(([label, value]) => (
              <div className="dh-kv__row" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>추가 정보</h2>
          </div>
        </div>
        <div className="dh-kv">
          {additionalSpecs.map(([label, value]) => (
            <div className="dh-kv__row" key={label}>
              <span>{label}</span>
              <strong>
                {label === "원본 링크" && typeof value === "string" && value !== "-" ? (
                  <a href={value} target="_blank" rel="noreferrer">
                    원문 보기
                  </a>
                ) : (
                  value
                )}
              </strong>
            </div>
          ))}
        </div>
      </section>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>인증</h2>
          </div>
        </div>
        <DataTable
          rows={product.certifications}
          emptyText="등록된 인증이 없습니다."
          columns={[
            { key: "type", label: "종류", render: (row) => row.type },
            { key: "number", label: "번호", render: (row) => row.number },
            { key: "issuer", label: "발급기관", render: (row) => row.issuer || "-" },
            { key: "status", label: "상태", render: (row) => row.status || "-" },
            { key: "issued", label: "발급일", render: (row) => formatDate(row.issuedAt) },
          ]}
        />
      </section>

      <div className="dh-grid-2">
        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>조달 기록</h2>
            </div>
          </div>
          <DataTable
            rows={procurementRecords}
            emptyText="조달 기록이 없습니다."
            columns={[
              { key: "date", label: "계약일", render: (row) => formatDate(row.contractDate) },
              { key: "type", label: "구분", render: (row) => row.contractType || "-" },
              { key: "registered", label: "등록가", render: (row) => formatWon(row.registeredPrice) },
              { key: "contract", label: "계약가", render: (row) => formatWon(row.contractPrice) },
              { key: "qty", label: "수량", render: (row) => row.quantity ?? "-" },
              { key: "buyer", label: "수요기관", render: (row) => row.buyer || "-" },
            ]}
          />
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>가격 이력</h2>
            </div>
          </div>
          <DataTable
            rows={snapshots}
            emptyText="가격 이력이 없습니다."
            columns={[
              { key: "date", label: "수집일", render: (row) => formatDateTime(row.collectedAt) },
              { key: "price", label: "상품가", render: (row) => formatWon(row.price) },
              { key: "ship", label: "배송비", render: (row) => formatWon(row.shippingFee) },
              { key: "total", label: "총액", render: (row) => formatWon(row.totalPrice) },
            ]}
          />
        </section>

        <section className="dh-panel">
          <div className="dh-section-head">
            <div>
              <h2>원본 판매 목록</h2>
            </div>
          </div>
          <DataTable
            rows={listings}
            emptyText="민수 판매 목록이 없습니다."
            columns={[
              { key: "seller", label: "판매처", render: (row) => row.sellerName },
              { key: "source", label: "출처", render: (row) => row.source },
              { key: "total", label: "총액", render: (row) => formatWon(row.totalPrice) },
              { key: "review", label: "리뷰", render: (row) => row.reviewCount ?? 0 },
              { key: "date", label: "확인일", render: (row) => formatDate(row.collectedAt) },
            ]}
          />
        </section>
      </div>
    </PageFrame>
  );
}
