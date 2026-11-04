import { monthlyRate, type Inputs } from "./simulate";

/** Beyond this nobody is planning any more; it also keeps a hopeless search from running away. */
export const MAX_GOAL_YEARS = 100;

export type Goal = Pick<Inputs, "initial" | "monthly" | "annualRate"> & {
  /** The balance to reach, in euros. */
  target: number;
};

/**
 * How many months until the balance first reaches the target, counting the same way
 * `simulate()` does (interest, then the contribution, at the end of each month).
 *
 * `0` when the initial capital already covers it. `null` when it never gets there within
 * `MAX_GOAL_YEARS`: nothing put in each month and no return, or so little of both that a
 * century is not enough.
 */
export function monthsToReach(goal: Goal): number | null {
  if (goal.initial >= goal.target) return 0;
  const rate = monthlyRate(goal.annualRate);
  let balance = goal.initial;
  for (let month = 1; month <= MAX_GOAL_YEARS * 12; month++) {
    balance = balance * (1 + rate) + goal.monthly;
    if (balance >= goal.target) return month;
  }
  return null;
}

/** Whole years that cover the months, for the horizon of the charts: 1 for anything up to 12. */
export function yearsToCover(months: number): number {
  return Math.max(1, Math.ceil(months / 12));
}
