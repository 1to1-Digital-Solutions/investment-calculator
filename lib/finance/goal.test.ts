import { describe, expect, it } from "vitest";

import { MAX_GOAL_YEARS, monthsToReach, yearsToCover } from "./goal";
import { simulate } from "./simulate";

describe("monthsToReach", () => {
  it("is zero when the initial capital already covers the target", () => {
    expect(monthsToReach({ initial: 5_000, monthly: 0, annualRate: 7, target: 5_000 })).toBe(0);
  });

  it("counts the months of saving with no return", () => {
    expect(monthsToReach({ initial: 0, monthly: 100, annualRate: 0, target: 1_200 })).toBe(12);
    expect(monthsToReach({ initial: 0, monthly: 100, annualRate: 0, target: 1_250 })).toBe(13);
  });

  it("agrees with simulate(): the balance crosses the target in the month it says", () => {
    const goal = { initial: 10_000, monthly: 200, annualRate: 7, target: 100_000 };
    const months = monthsToReach(goal);
    expect(months).not.toBeNull();
    const years = yearsToCover(months!);
    const rows = simulate({ ...goal, inflation: 0, years });
    expect(rows[years]!.balance).toBeGreaterThanOrEqual(goal.target);
    expect(rows[years - 1]!.balance).toBeLessThan(goal.target);
  });

  it("gives up when nothing goes in and nothing grows", () => {
    expect(monthsToReach({ initial: 100, monthly: 0, annualRate: 0, target: 1_000 })).toBeNull();
  });

  it("gives up past a century even if the balance is still creeping up", () => {
    expect(monthsToReach({ initial: 0, monthly: 1, annualRate: 0, target: MAX_GOAL_YEARS * 12 + 1 })).toBeNull();
    expect(monthsToReach({ initial: 0, monthly: 1, annualRate: 0, target: MAX_GOAL_YEARS * 12 })).toBe(MAX_GOAL_YEARS * 12);
  });
});

describe("yearsToCover", () => {
  it("rounds months up to whole years, never below one", () => {
    expect(yearsToCover(0)).toBe(1);
    expect(yearsToCover(12)).toBe(1);
    expect(yearsToCover(13)).toBe(2);
    expect(yearsToCover(30)).toBe(3);
  });
});
