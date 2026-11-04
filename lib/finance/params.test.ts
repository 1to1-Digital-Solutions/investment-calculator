import { describe, expect, it } from "vitest";

import { BOUNDS, clamp, DEFAULTS, INFLATION_DEFAULT, parseParams, toQuery } from "./params";

describe("clamp", () => {
  it("keeps amounts whole and rates to two decimals", () => {
    expect(clamp("initial", 1_234.56)).toBe(1_235);
    expect(clamp("rate", 7.123)).toBe(7.12);
  });

  it("stops at the bounds", () => {
    expect(clamp("years", 0)).toBe(BOUNDS.years.min);
    expect(clamp("years", 999)).toBe(BOUNDS.years.max);
    expect(clamp("initial", -5)).toBe(0);
  });
});

describe("parseParams", () => {
  it("is the defaults for an empty query, with the dated inflation", () => {
    expect(parseParams("")).toEqual(DEFAULTS);
    expect(DEFAULTS.inflation).toBe(INFLATION_DEFAULT.value);
  });

  it("reads every field and the mode", () => {
    expect(parseParams("?i=5000&m=150&r=5.5&f=3&y=30&mode=goal&t=250000")).toEqual({
      initial: 5_000,
      monthly: 150,
      rate: 5.5,
      inflation: 3,
      years: 30,
      mode: "goal",
      target: 250_000,
    });
  });

  it("falls back to the default for garbage and clamps what is out of range", () => {
    const params = parseParams("i=abc&m=&r=Infinity&y=500&mode=whatever");
    expect(params.initial).toBe(DEFAULTS.initial);
    expect(params.monthly).toBe(DEFAULTS.monthly);
    expect(params.rate).toBe(DEFAULTS.rate);
    expect(params.years).toBe(BOUNDS.years.max);
    expect(params.mode).toBe("years");
  });
});

describe("toQuery", () => {
  it("round-trips a scenario and leaves the defaults out", () => {
    expect(toQuery(DEFAULTS)).toBe("");
    const custom = { ...DEFAULTS, initial: 20_000, mode: "goal" as const, target: 50_000 };
    expect(toQuery(custom)).toBe("i=20000&mode=goal&t=50000");
    expect(parseParams(toQuery(custom))).toEqual(custom);
  });
});
