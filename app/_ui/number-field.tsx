"use client";

import { useId, useState } from "react";

import { BOUNDS, clamp } from "@/lib/finance/params";
import { field, label as labelClass, muted } from "./styles";

interface Props {
  name: keyof typeof BOUNDS;
  label: string;
  /** The unit shown after the field: € or %. */
  unit: string;
  value: number;
  onChange: (value: number) => void;
  hint?: string;
}

/**
 * A number field that lets the person type freely. While the field has focus it shows what was
 * typed: "1" or "" or "7." are fine and change nothing; the number only moves when the text
 * parses. Out of focus it shows the number itself, tidied (clamped, rounded). Without this, a
 * controlled `<input type="number">` snaps "" back to 0 and nobody can clear a field to retype.
 */
export function NumberField({ name, label, unit, value, onChange, hint }: Props) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const bounds = BOUNDS[name];
  const step = bounds.decimals === 0 ? 1 : 0.1;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          className={`${field} pr-9`}
          value={draft ?? String(value)}
          min={bounds.min}
          max={bounds.max}
          step={step}
          aria-describedby={hint ? `${id}-hint` : undefined}
          onFocus={() => setDraft(String(value))}
          onChange={(event) => {
            setDraft(event.target.value);
            const parsed = Number(event.target.value);
            if (event.target.value.trim() !== "" && Number.isFinite(parsed)) onChange(clamp(name, parsed));
          }}
          onBlur={() => setDraft(null)}
        />
        <span aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm ${muted}`}>
          {unit}
        </span>
      </div>
      {hint && (
        <p id={`${id}-hint`} className={`text-xs ${muted}`}>
          {hint}
        </p>
      )}
    </div>
  );
}
