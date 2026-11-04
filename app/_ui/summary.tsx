"use client";

import { formatMoney, formatPercent, splitMonths } from "@/lib/finance/format";
import { outcome, realRate } from "@/lib/finance/simulate";
import { useLocale, useMessages } from "./i18n/locale";
import type { Scenario } from "./scenario";
import { card, muted } from "./styles";

/** The headline numbers: the answer to the question the form asks. */
export function Summary({ scenario }: { scenario: Scenario }) {
  const t = useMessages();
  const locale = useLocale();
  const { params, goalMonths, horizon, rows } = scenario;
  const last = outcome(rows);
  const money = (value: number) => formatMoney(value, locale);

  let title: string;
  if (goalMonths === undefined) {
    title = t.summary.yearsTitle(horizon);
  } else if (goalMonths === null) {
    title = params.monthly === 0 && params.rate <= 0 ? t.summary.goalUnreachable : t.summary.goalTooFar;
  } else {
    const { years, months } = splitMonths(goalMonths);
    title = t.summary.goalReached(years, months);
  }

  const figures = [
    { label: t.summary.balance, value: money(last.balance), strong: true },
    { label: t.summary.contributed, value: money(last.contributed) },
    { label: t.summary.interest, value: money(last.interest) },
    { label: t.summary.real, value: money(last.real), hint: t.summary.realHint },
  ];

  return (
    <section className={`${card} p-4 sm:p-5`} aria-live="polite">
      <h2 className="text-lg font-semibold">{title}</h2>
      {goalMonths !== null && (
        <>
          {goalMonths !== undefined && <p className={`mt-0.5 text-sm ${muted}`}>{t.summary.yearsTitle(horizon)}</p>}
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col gap-0.5">
                <dt className={`text-xs ${muted}`} title={figure.hint}>
                  {figure.label}
                </dt>
                <dd className={`tabular-nums ${figure.strong ? "text-2xl font-semibold text-accent" : "text-lg font-medium"}`}>
                  {figure.value}
                </dd>
              </div>
            ))}
          </dl>
          <p className={`mt-3 text-sm ${muted}`}>{t.summary.realRate(formatPercent(realRate(params.rate, params.inflation), locale))}</p>
        </>
      )}
    </section>
  );
}
