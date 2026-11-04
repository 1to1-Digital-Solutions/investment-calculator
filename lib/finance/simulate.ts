/**
 * The growth of an investment, month by month, summarised per year.
 *
 * **Conventions, written down because every calculator picks its own and the results differ:**
 * - `annualRate` is the *effective* annual rate: 7 % means money multiplies by 1.07 in a year.
 *   It is compounded monthly through the equivalent monthly rate, so "7 % a year" stays 7 % a
 *   year whatever the contributions.
 * - The monthly contribution goes in at the end of each month, after that month's interest.
 *   The initial capital is there from day one.
 * - Nothing is taken out: no fees, no taxes. The tool shows the mechanics, not a tax return.
 * - `real` deflates the balance to today's money with the annual inflation rate: what the
 *   balance of that year buys today.
 * - `contributedReal` deflates each contribution from the month it was made: the purchasing
 *   power that was actually given up. It is what `real` has to beat for the investment to have
 *   gained anything; comparing `real` with the nominal `contributed` would count a euro of year
 *   19 as a euro of today.
 */

export interface Inputs {
  /** Money invested on day one, in euros. */
  initial: number;
  /** Money added at the end of every month, in euros. */
  monthly: number;
  /** Effective annual return, in percent (7 for 7 %). */
  annualRate: number;
  /** Annual inflation, in percent. */
  inflation: number;
  /** Horizon, in whole years. */
  years: number;
}

export interface YearRow {
  /** 0 is the starting point. */
  year: number;
  /** Everything put in so far: the initial capital plus the contributions. */
  contributed: number;
  /** What the investment has generated so far. */
  interest: number;
  /** `contributed + interest`, in the euros of that year. */
  balance: number;
  /** The balance in today's euros. */
  real: number;
  /** What was put in, each contribution in the euros of the day it was made. */
  contributedReal: number;
}

/** The monthly rate that compounds to the given effective annual rate. */
export function monthlyRate(annualPercent: number): number {
  return Math.pow(1 + annualPercent / 100, 1 / 12) - 1;
}

/** Divides by (1 + inflation)^years: the value in today's money. */
export function deflate(amount: number, inflationPercent: number, years: number): number {
  return amount / Math.pow(1 + inflationPercent / 100, years);
}

/** One row per year, from year 0 (the starting point) to `years`. */
export function simulate(inputs: Inputs): YearRow[] {
  const rate = monthlyRate(inputs.annualRate);
  const row = (year: number, balance: number, contributed: number, contributedReal: number): YearRow => ({
    year,
    contributed,
    interest: balance - contributed,
    balance,
    real: deflate(balance, inputs.inflation, year),
    contributedReal,
  });

  let balance = inputs.initial;
  let contributed = inputs.initial;
  let contributedReal = inputs.initial;
  const rows = [row(0, balance, contributed, contributedReal)];
  for (let year = 1; year <= inputs.years; year++) {
    for (let month = 1; month <= 12; month++) {
      balance = balance * (1 + rate) + inputs.monthly;
      contributed += inputs.monthly;
      contributedReal += deflate(inputs.monthly, inputs.inflation, year - 1 + month / 12);
    }
    rows.push(row(year, balance, contributed, contributedReal));
  }
  return rows;
}

/** The last row, for the summary. */
export function outcome(rows: readonly YearRow[]): YearRow {
  const last = rows[rows.length - 1];
  if (!last) throw new Error("simulate() always returns the starting row");
  return last;
}

/**
 * The real annual return: what the money grows per year *in purchasing power*. It is not
 * `rate − inflation` (Fisher): with 7 % and 4.9 % it is 2.0 %, not 2.1 %.
 */
export function realRate(annualPercent: number, inflationPercent: number): number {
  return ((1 + annualPercent / 100) / (1 + inflationPercent / 100) - 1) * 100;
}
