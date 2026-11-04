import { describe, expect, it } from "vitest";

import { formatCompact, formatMoney, formatPercent, splitMonths, toCsv } from "./format";

/** Intl separates with non-breaking spaces (U+00A0, U+202F); the tests compare plain ones. */
const plain = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("formatMoney", () => {
  it("shows whole euros in the notation of the language", () => {
    expect(formatMoney(1_967.15, "en")).toBe("€1,967");
    expect(plain(formatMoney(1_967.15, "es"))).toBe("1967 €");
    expect(plain(formatMoney(1_234_567, "es"))).toBe("1.234.567 €");
  });
});

describe("formatPercent", () => {
  it("keeps up to two decimals and drops trailing zeros", () => {
    expect(formatPercent(7, "en")).toBe("7%");
    expect(plain(formatPercent(4.9, "es"))).toBe("4,9 %");
    expect(formatPercent(2.002, "en")).toBe("2%");
  });
});

describe("formatCompact", () => {
  it("abbreviates thousands and millions for the axes", () => {
    expect(formatCompact(1_200, "en")).toBe("1.2K");
    expect(formatCompact(2_500_000, "en")).toBe("2.5M");
    expect(plain(formatCompact(350_000, "es"))).toBe("350 mil");
  });
});

describe("splitMonths", () => {
  it("splits into years and the months left", () => {
    expect(splitMonths(30)).toEqual({ years: 2, months: 6 });
    expect(splitMonths(12)).toEqual({ years: 1, months: 0 });
    expect(splitMonths(5)).toEqual({ years: 0, months: 5 });
  });
});

describe("toCsv", () => {
  it("quotes the header, rounds the numbers and escapes quotes", () => {
    expect(toCsv(['Year', 'Balance "nominal"'], [[1, 1_234.6], [2, 2_000]])).toBe(
      '"Year","Balance ""nominal"""\n1,1235\n2,2000',
    );
  });
});
