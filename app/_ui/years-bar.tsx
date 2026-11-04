"use client";

import { useId } from "react";

import { BOUNDS } from "@/lib/finance/params";
import { useMessages } from "./i18n/locale";
import { label as labelClass } from "./styles";

/**
 * The years slider, floating over the bottom of the screen once there are results, in the
 * shape of the company site's navigation bar, tinted and outlined so it stands out from the page:
 * the charts follow it as it moves, from anywhere on the page, without going back up to the form.
 */
export function YearsBar({ years, onChange }: { years: number; onChange: (years: number) => void }) {
  const t = useMessages();
  const id = useId();
  return (
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 w-[95%] max-w-3xl -translate-x-1/2 rounded-full border-2 border-accent/60 bg-accent-soft/90 shadow-xl backdrop-blur-xl">
      <div className="flex items-center gap-4 px-5 py-2">
        <label htmlFor={id} className={`${labelClass} shrink-0`}>
          {t.form.years}
        </label>
        <input
          id={id}
          type="range"
          className="slider min-h-11 w-full pointer-fine:min-h-8"
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
