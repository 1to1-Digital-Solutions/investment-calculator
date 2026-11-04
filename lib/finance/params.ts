/**
 * The parameters of a scenario, their bounds and their shape in the URL, so a scenario can be
 * shared as a link. Only numbers travel: the tool knows nothing about the person.
 */

export type Mode = "years" | "goal";

export interface Params {
  initial: number;
  monthly: number;
  rate: number;
  inflation: number;
  years: number;
  mode: Mode;
  target: number;
}

/**
 * The default inflation is the latest annual CPI of Spain that was published when this was
 * written: the INE flash estimate for October 2026. It is shown with its date so nobody takes
 * it for live data, and it can be changed in the form.
 */
export const INFLATION_DEFAULT = { value: 4.9, period: "2026-10", source: "INE" } as const;

export const DEFAULTS: Params = {
  initial: 10_000,
  monthly: 200,
  rate: 7,
  inflation: INFLATION_DEFAULT.value,
  years: 20,
  mode: "years",
  target: 100_000,
};

interface Bound {
  min: number;
  max: number;
  /** Decimals kept; amounts are whole euros. */
  decimals: number;
}

export const BOUNDS: Record<Exclude<keyof Params, "mode">, Bound> = {
  initial: { min: 0, max: 100_000_000, decimals: 0 },
  monthly: { min: 0, max: 1_000_000, decimals: 0 },
  rate: { min: -50, max: 50, decimals: 2 },
  inflation: { min: -20, max: 100, decimals: 2 },
  years: { min: 1, max: 60, decimals: 0 },
  target: { min: 1, max: 1_000_000_000, decimals: 0 },
};

/** Keeps a value inside its bounds and rounds it to the decimals the field has. */
export function clamp(key: keyof typeof BOUNDS, value: number): number {
  const { min, max, decimals } = BOUNDS[key];
  const factor = Math.pow(10, decimals);
  const rounded = Math.round(value * factor) / factor;
  return Math.min(max, Math.max(min, rounded));
}

/** The URL keys, short because they are typed and shared. */
const KEYS: Record<keyof Params, string> = {
  initial: "i",
  monthly: "m",
  rate: "r",
  inflation: "f",
  years: "y",
  mode: "mode",
  target: "t",
};

function readNumber(search: URLSearchParams, key: keyof typeof BOUNDS): number {
  const raw = search.get(KEYS[key]);
  if (raw === null || raw.trim() === "") return DEFAULTS[key];
  const value = Number(raw);
  return Number.isFinite(value) ? clamp(key, value) : DEFAULTS[key];
}

/** A scenario from a query string; anything missing or malformed falls back to the default. */
export function parseParams(query: string): Params {
  const search = new URLSearchParams(query);
  return {
    initial: readNumber(search, "initial"),
    monthly: readNumber(search, "monthly"),
    rate: readNumber(search, "rate"),
    inflation: readNumber(search, "inflation"),
    years: readNumber(search, "years"),
    mode: search.get(KEYS.mode) === "goal" ? "goal" : "years",
    target: readNumber(search, "target"),
  };
}

/** The query string of a scenario, without the leading `?`. Defaults are left out to keep links short. */
export function toQuery(params: Params): string {
  const search = new URLSearchParams();
  for (const key of Object.keys(KEYS) as (keyof Params)[]) {
    if (params[key] !== DEFAULTS[key]) search.set(KEYS[key], String(params[key]));
  }
  return search.toString();
}
