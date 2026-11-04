"use client";

import { useMemo } from "react";

import { monthsToReach, yearsToCover } from "@/lib/finance/goal";
import type { Params } from "@/lib/finance/params";
import { simulate, type YearRow } from "@/lib/finance/simulate";
import { linkTo, setParams, useParams } from "./url-params";

export interface Scenario {
  params: Params;
  set: <K extends keyof Params>(key: K, value: Params[K]) => void;
  /** Months to the target in goal mode; `null` when it is out of reach; `undefined` in years mode. */
  goalMonths: number | null | undefined;
  /** The years the charts span: the chosen ones, or those the goal needs. */
  horizon: number;
  rows: YearRow[];
  /** The URL of this scenario, to share. */
  link: () => string;
}

/** The parameters from the URL and everything the page derives from them. */
export function useScenario(): Scenario {
  const params = useParams();

  const goalMonths = useMemo(
    () =>
      params.mode === "goal"
        ? monthsToReach({ initial: params.initial, monthly: params.monthly, annualRate: params.rate, target: params.target })
        : undefined,
    [params],
  );

  const horizon = typeof goalMonths === "number" ? yearsToCover(goalMonths) : params.years;

  const rows = useMemo(
    () =>
      simulate({
        initial: params.initial,
        monthly: params.monthly,
        annualRate: params.rate,
        inflation: params.inflation,
        years: horizon,
      }),
    [params, horizon],
  );

  return {
    params,
    set: (key, value) => setParams({ ...params, [key]: value }),
    goalMonths,
    horizon,
    rows,
    link: () => linkTo(params),
  };
}
