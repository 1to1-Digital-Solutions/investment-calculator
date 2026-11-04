"use client";

import { formatMoney, toCsv } from "@/lib/finance/format";
import type { YearRow } from "@/lib/finance/simulate";
import { useLocale, useMessages } from "./i18n/locale";
import { button, card, muted } from "./styles";

/** The yearly figures as a table, folded away, with the same figures as a CSV for a spreadsheet. */
export function YearTable({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const money = (value: number) => formatMoney(value, locale);
  const columns = [t.table.year, t.table.contributed, t.table.interest, t.table.balance, t.table.real];

  function download() {
    const csv = toCsv(columns, rows.map((r) => [r.year, r.contributed, r.interest, r.balance, r.real]));
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = t.table.fileName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <details className={`${card} px-4 py-2 sm:px-5`}>
      <summary className="min-h-11 font-semibold leading-11 pointer-fine:min-h-0 pointer-fine:leading-normal pointer-fine:py-2">
        {t.table.summary}
      </summary>
      <div className="-mx-4 overflow-x-auto px-4 sm:-mx-5 sm:px-5">
        <table className="my-3 w-full min-w-[32rem] text-sm tabular-nums">
          <thead>
            <tr className={`border-b border-border text-left ${muted}`}>
              {columns.map((column, index) => (
                <th key={column} scope="col" className={`py-2 font-medium ${index > 0 ? "text-right" : ""}`}>
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.year} className="border-b border-border/60 last:border-0">
                <th scope="row" className="py-1.5 text-left font-normal">
                  {r.year}
                </th>
                <td className="py-1.5 text-right">{money(r.contributed)}</td>
                <td className="py-1.5 text-right">{money(r.interest)}</td>
                <td className="py-1.5 text-right font-medium">{money(r.balance)}</td>
                <td className="py-1.5 text-right">{money(r.real)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pb-2">
        <button type="button" className={button} onClick={download}>
          {t.table.download}
        </button>
      </div>
    </details>
  );
}
