"use client";

import { useId } from "react";

import { BOUNDS } from "@/lib/finance/params";
import { useMessages } from "./i18n/locale";
import { label as labelClass } from "./styles";

/**
 * The years slider, pinned to the bottom of the screen once there are results: the charts
 * follow it as it moves, from anywhere on the page, without going back up to the form.
 */
export function YearsBar({ years, onChange }: { years: number; onChange: (years: number) => void }) {
  const t = useMessages();
  const id = useId();
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-6">
        <label htmlFor={id} className={`${labelClass} shrink-0`}>
          {t.form.years}
        </label>
        <input
          id={id}
          type="range"
          className="min-h-11 w-full pointer-fine:min-h-8"
          min={BOUNDS.years.min}
          max={BOUNDS.years.max}
          step={1}
          value={years}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <output htmlFor={id} className="w-8 shrink-0 text-right text-lg font-semibold tabular-nums">
          {years}
        </output>
      </div>
    </div>
  );
}
