/**
 * Numbers as the page shows them. Euros always, whole euros (the cents of a 30-year projection
 * are noise), in the notation of the interface language.
 */

export type NumberLocale = "en" | "es";

const TAGS: Record<NumberLocale, string> = { en: "en-IE", es: "es-ES" };

export function formatMoney(value: number, locale: NumberLocale): string {
  return new Intl.NumberFormat(TAGS[locale], {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/** A rate as typed: up to two decimals, no trailing zeros. */
export function formatPercent(value: number, locale: NumberLocale): string {
  return new Intl.NumberFormat(TAGS[locale], {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(value / 100);
}

/** A short money label for chart axes: 1.2k, 350k, 2.5M. */
export function formatCompact(value: number, locale: NumberLocale): string {
  return new Intl.NumberFormat(TAGS[locale], {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** CSV of the yearly rows, with a header, for a spreadsheet. */
export function toCsv(header: readonly string[], rows: readonly (readonly number[])[]): string {
  const line = (cells: readonly (string | number)[]) =>
    cells.map((cell) => (typeof cell === "number" ? String(Math.round(cell)) : `"${cell.replaceAll('"', '""')}"`)).join(",");
  return [line(header), ...rows.map(line)].join("\n");
}
