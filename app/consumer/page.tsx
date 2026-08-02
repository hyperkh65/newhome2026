import { Badge } from "@/components/datahub/Badge";
import { BarList } from "@/components/datahub/BarList";
import { DataTable } from "@/components/datahub/DataTable";
import { PageFrame } from "@/components/datahub/PageFrame";
import { StatGrid } from "@/components/datahub/StatGrid";
import { median } from "@/lib/datahub/analytics";
import { formatDate, formatWon } from "@/lib/datahub/format";
import { loadBundle } from "@/lib/datahub/repository";

export default async function ConsumerPage() {
  const bundle = await loadBundle();
  const products = bundle.products.filter((product) =>
    product.marketTypes.includes("consumer")
  );
  const listings = bundle.listings.filter((listing) => listing.marketType === "consumer");
  const prices = listings.map((listing) => listing.totalPrice).filter((price) => price > 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;

  return (
    <PageFrame updatedAt={bundle.generatedAt}>
      <section className="dh-hero">
        <div className="dh-hero__head">
          <div>
            <h1>민수시장</h1>
            <p>쇼핑몰·CSV·수동 입력 데이터를 제품 그룹 단위로 비교합니다.</p>
          </div>
          <Badge tone="consumer">민수</Badge>
        </div>
      </section>

      <StatGrid
        items={[
          { label: "민수 판매 제품", value: products.length, helper: "제품 그룹 기준" },
          { label: "원본 판매 목록", value: listings.length, helper: "판매처별 원본 행" },
          { label: "중앙가격", value: formatWon(median(prices)), helper: "전체 민수 총액 중앙값" },
          { label: "최저가", value: formatWon(minPrice), helper: "배송비 포함 총액 기준" },
          { label: "최고가", value: formatWon(maxPrice), helper: "배송비 포함 총액 기준" },
          { label: "최종 확인일", value: formatDate(bundle.generatedAt), helper: "데이터 생성 시각" },
        ]}
      />

      <div className="dh-grid-2">
        <BarList
          title="판매처별 상품 수"
          items={[...new Set(listings.map((listing) => listing.sellerName))].map((sellerName) => ({
            label: sellerName,
            value: listings.filter((listing) => listing.sellerName === sellerName).length,
          }))}
        />
        <BarList
          title="제품별 중앙가격"
          kind="price"
          items={products.map((product) => ({
            label: product.displayName,
            value: median(
              listings
                .filter((listing) => listing.productId === product.id)
                .map((listing) => listing.totalPrice)
            ),
          }))}
        />
      </div>

      <section className="dh-panel">
        <div className="dh-section-head">
          <div>
            <h2>민수 판매 목록</h2>
            <p>동일 제품의 판매처를 그룹화하되 원본 판매 목록도 확인할 수 있습니다.</p>
          </div>
        </div>
        <DataTable
          rows={listings}
          columns={[
            {
              key: "title",
              label: "상품명",
              href: (row) => row.productUrl || null,
              render: (row) => (
                <div>
                  <strong>{row.title}</strong>
                  <div className="dh-muted">{row.sellerName}</div>
                </div>
              ),
            },
            { key: "source", label: "출처", render: (row) => row.source },
            { key: "price", label: "상품가", render: (row) => formatWon(row.price) },
            { key: "shipping", label: "배송비", render: (row) => formatWon(row.shippingFee) },
            { key: "total", label: "총액", render: (row) => formatWon(row.totalPrice) },
            {
              key: "rating",
              label: "리뷰/평점",
              render: (row) => `${row.reviewCount ?? 0} / ${row.rating ?? "-"}`,
            },
            { key: "date", label: "확인일", render: (row) => formatDate(row.collectedAt) },
          ]}
        />
      </section>
    </PageFrame>
  );
}
