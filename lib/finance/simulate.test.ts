import { describe, expect, it } from "vitest";

import { deflate, monthlyRate, outcome, realRate, simulate, type Inputs } from "./simulate";

const base: Inputs = { initial: 1_000, monthly: 0, annualRate: 7, inflation: 0, years: 10 };

describe("monthlyRate", () => {
  it("compounds twelve times to the effective annual rate", () => {
    expect(Math.pow(1 + monthlyRate(7), 12)).toBeCloseTo(1.07, 12);
    expect(monthlyRate(0)).toBe(0);
  });
});

describe("simulate", () => {
  it("1,000 € at 7 % for 10 years are 1,967 €, the textbook case", () => {
    const rows = simulate(base);
    expect(rows).toHaveLength(11);
    expect(outcome(rows).balance).toBeCloseTo(1_967.15, 2);
    expect(outcome(rows).interest).toBeCloseTo(967.15, 2);
    expect(outcome(rows).contributed).toBe(1_000);
  });

  it("starts from the initial capital, with nothing earned yet", () => {
    const [start] = simulate(base);
    expect(start).toEqual({ year: 0, contributed: 1_000, interest: 0, balance: 1_000, real: 1_000, cashReal: 1_000, contributedReal: 1_000 });
  });

  it("with no return, the balance is just what was put in", () => {
    const rows = simulate({ ...base, initial: 0, monthly: 100, annualRate: 0, years: 2 });
    expect(rows.map((r) => r.balance)).toEqual([0, 1_200, 2_400]);
    expect(rows.map((r) => r.interest)).toEqual([0, 0, 0]);
  });

  it("a contribution made at the end of a month earns from the next month on", () => {
    // 100 € a month at 12 % effective: the first contribution compounds 11 months, the last none.
    const [, first] = simulate({ ...base, initial: 0, monthly: 100, annualRate: 12, years: 1 });
    const m = monthlyRate(12);
    let expected = 0;
    for (let k = 0; k < 12; k++) expected += 100 * Math.pow(1 + m, k);
    expect(first?.balance).toBeCloseTo(expected, 9);
    expect(first?.contributed).toBe(1_200);
  });

  it("deflates both the balance and the cash to today's euros", () => {
    const rows = simulate({ ...base, inflation: 4.9, years: 10 });
    const last = outcome(rows);
    expect(last.real).toBeCloseTo(last.balance / Math.pow(1.049, 10), 9);
    expect(last.cashReal).toBeCloseTo(1_000 / Math.pow(1.049, 10), 9);
    expect(last.real).toBeLessThan(last.balance);
  });

  it("values each contribution in the euros of its own month", () => {
    const inputs = { ...base, initial: 0, monthly: 100, annualRate: 0, inflation: 4.9, years: 2 };
    const last = outcome(simulate(inputs));
    // Without inflation the two are the same; with it, deflating from each month lands between
    // the nominal sum and the sum deflated as a whole from the end.
    expect(outcome(simulate({ ...inputs, inflation: 0 })).contributedReal).toBe(2_400);
    expect(last.contributedReal).toBeLessThan(last.contributed);
    expect(last.contributedReal).toBeGreaterThan(last.cashReal);
    let expected = 0;
    for (let month = 1; month <= 24; month++) expected += 100 / Math.pow(1.049, month / 12);
    expect(last.contributedReal).toBeCloseTo(expected, 9);
  });

  it("a negative return shrinks the balance", () => {
    expect(outcome(simulate({ ...base, annualRate: -10, years: 1 })).balance).toBeCloseTo(900, 9);
  });

  it("outcome refuses an empty list, which simulate never produces", () => {
    expect(() => outcome([])).toThrow(/starting row/);
  });
});

describe("deflate", () => {
  it("is the identity at zero inflation and halves roughly every 14 years at 5 %", () => {
    expect(deflate(500, 0, 30)).toBe(500);
    expect(deflate(1_000, 5, 14.2)).toBeCloseTo(500, 0);
  });
});

describe("realRate", () => {
  it("uses Fisher, not a subtraction: 7 % with 4.9 % inflation is 2.0 %, not 2.1 %", () => {
    expect(realRate(7, 4.9)).toBeCloseTo(2.0, 1);
    expect(realRate(7, 4.9)).toBeLessThan(2.1);
    expect(realRate(5, 5)).toBeCloseTo(0, 12);
    expect(realRate(3, 5)).toBeLessThan(0);
  });
});
