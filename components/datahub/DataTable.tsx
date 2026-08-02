import Link from "next/link";
import type { ReactNode } from "react";

export interface DataColumn<Row> {
  key: string;
  label: string;
  render: (row: Row) => ReactNode;
  href?: (row: Row) => string | null;
}

export function DataTable<Row>({
  columns,
  rows,
  emptyText = "데이터가 없습니다.",
}: {
  columns: DataColumn<Row>[];
  rows: Row[];
  emptyText?: string;
}) {
  return (
    <div className="dh-table-wrap">
      <table className="dh-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="dh-table__empty">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={index}>
                {columns.map((column) => {
                  const href = column.href?.(row);
                  const content = column.render(row);
                  return (
                    <td key={column.key}>
                      {href ? (
                        <Link href={href} className="dh-table__link">
                          {content}
                        </Link>
                      ) : (
                        content
                      )}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
