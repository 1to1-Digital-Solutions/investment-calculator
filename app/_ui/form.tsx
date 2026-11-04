"use client";

import { useId, useState } from "react";

import { BOUNDS, INFLATION_DEFAULT, type Params } from "@/lib/finance/params";
import { formatPercent } from "@/lib/finance/format";
import { useLocale, useMessages } from "./i18n/locale";
import { NumberField } from "./number-field";
import { card, label as labelClass, primaryButton } from "./styles";

interface Props {
  /** The last calculated scenario; what the fields show until they are edited. */
  calculated: Params;
  /** Whether results are on screen: then the years live in the bar at the bottom, not here. */
  showing: boolean;
  onCalculate: (params: Params) => void;
}

/**
 * The inputs of the plan. Edits stay in the form until "Calculate": the charts do not jump
 * while a number is half typed, and the URL only ever holds what was calculated.
 */
export function PlanForm({ calculated, showing, onCalculate }: Props) {
  const t = useMessages();
  const locale = useLocale();
  const [edits, setEdits] = useState<Partial<Params>>({});
  const params: Params = { ...calculated, ...edits };
  const yearsId = useId();
  const monthName = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
    new Date(`${INFLATION_DEFAULT.period}-15T12:00:00Z`),
  );

  const set = <K extends keyof Params>(key: K, value: Params[K]) => setEdits((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      className={`${card} flex flex-col gap-5 p-4 sm:p-5`}
      onSubmit={(event) => {
        event.preventDefault();
        setEdits({});
        onCalculate(params);
      }}
    >
      <fieldset className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
      </fieldset>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        {showing ? (
          <p className="flex-1 text-sm text-muted">{t.form.yearsBelow}</p>
        ) : (
          <div className="flex flex-1 flex-col gap-1">
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
        )}
        <button type="submit" className={`${primaryButton} sm:w-auto`}>
          {showing ? t.form.recalculate : t.form.calculate}
        </button>
      </div>
    </form>
  );
}
