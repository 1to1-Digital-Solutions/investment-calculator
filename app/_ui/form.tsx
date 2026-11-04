"use client";

import { useId } from "react";

import { BOUNDS, INFLATION_DEFAULT, type Mode } from "@/lib/finance/params";
import { formatPercent } from "@/lib/finance/format";
import { useLocale, useMessages } from "./i18n/locale";
import { NumberField } from "./number-field";
import type { Scenario } from "./scenario";
import { card, label as labelClass, segment } from "./styles";

/** The inputs of the plan: the money, the rates, and either the years or the target. */
export function PlanForm({ scenario }: { scenario: Scenario }) {
  const t = useMessages();
  const locale = useLocale();
  const { params, set } = scenario;
  const yearsId = useId();
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(`${INFLATION_DEFAULT.period}-15T12:00:00Z`),
  );

  return (
    <form className={`${card} flex flex-col gap-5 p-4 sm:p-5`} onSubmit={(event) => event.preventDefault()}>
      <fieldset className="flex flex-col gap-2">
        <legend className={`${labelClass} mb-2`}>{t.form.mode}</legend>
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1">
          {(["years", "goal"] as Mode[]).map((mode) => (
            <button
              key={mode}
              type="button"
              className={segment}
              aria-pressed={params.mode === mode}
              onClick={() => set("mode", mode)}
            >
              {mode === "years" ? t.form.modeYears : t.form.modeGoal}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="sr-only">{t.form.legend}</legend>
        <NumberField name="initial" label={t.form.initial} unit={t.form.euro} value={params.initial} onChange={(v) => set("initial", v)} />
        <NumberField name="monthly" label={t.form.monthly} unit={t.form.euro} value={params.monthly} onChange={(v) => set("monthly", v)} />
        <NumberField name="rate" label={t.form.rate} unit={t.form.percent} value={params.rate} onChange={(v) => set("rate", v)} />
        <NumberField
          name="inflation"
          label={t.form.inflation}
          unit={t.form.percent}
          value={params.inflation}
          onChange={(v) => set("inflation", v)}
          hint={t.form.inflationHint(formatPercent(INFLATION_DEFAULT.value, locale), monthName, INFLATION_DEFAULT.source)}
        />

        {params.mode === "years" ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between">
              <label htmlFor={yearsId} className={labelClass}>
                {t.form.years}
              </label>
              <output htmlFor={yearsId} className="text-lg font-semibold tabular-nums">
                {params.years}
              </output>
            </div>
            <input
              id={yearsId}
              type="range"
              className="min-h-11 w-full pointer-fine:min-h-8"
              min={BOUNDS.years.min}
              max={BOUNDS.years.max}
              step={1}
              value={params.years}
              onChange={(event) => set("years", Number(event.target.value))}
            />
          </div>
        ) : (
          <NumberField name="target" label={t.form.target} unit={t.form.euro} value={params.target} onChange={(v) => set("target", v)} />
        )}
      </fieldset>
    </form>
  );
}
