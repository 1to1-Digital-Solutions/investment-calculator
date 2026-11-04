"use client";

import { useMemo } from "react";

import type { Params } from "@/lib/finance/params";
import { simulate, type YearRow } from "@/lib/finance/simulate";
import { linkTo, useParams } from "./url-params";

export interface Scenario {
  params: Params;
  rows: YearRow[];
  /** The URL of this scenario, to share. */
  link: () => string;
}

/** The calculated parameters from the URL and the yearly rows the charts draw. */
export function useScenario(): Scenario {
  const params = useParams();
  const rows = useMemo(
    () =>
      simulate({
        initial: params.initial,
        monthly: params.monthly,
        annualRate: params.rate,
        inflation: params.inflation,
        years: params.years,
      }),
    [params],
  );
  return { params, rows, link: () => linkTo(params) };
}
