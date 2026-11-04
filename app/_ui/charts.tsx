"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { Area, AreaChart, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCompact, formatMoney } from "@/lib/finance/format";
import { outcome, type YearRow } from "@/lib/finance/simulate";
import { useLocale, useMessages, type Locale } from "./i18n/locale";
import { button, card, muted } from "./styles";
import { YearTable } from "./table";

const HEIGHT = 260;

/** The tooltip and the axes in the page's colours; Recharts' defaults are white on white in dark mode. */
const TOOLTIP = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" },
  labelStyle: { color: "var(--muted)", marginBottom: 4 },
  itemStyle: { color: "var(--text)", padding: 0 },
  cursor: { stroke: "var(--muted)", strokeDasharray: "3 3" },
};
const AXIS = { stroke: "var(--muted)", fontSize: 12 };
/** The legend is the only explanation each chart carries, so it is as big as body text. */
const LEGEND = { wrapperStyle: { fontSize: 14, paddingTop: 8 } };

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** The charts draw themselves when they appear, unless the person asked the system for less motion. */
function useAnimated(): boolean {
  return useSyncExternalStore(
    (notify) => {
      const query = window.matchMedia(REDUCED_MOTION);
      query.addEventListener("change", notify);
      return () => query.removeEventListener("change", notify);
    },
    () => !window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  );
}

/**
 * How each series draws itself when the chart appears: a second, easing out, one after the
 * other. Off once drawn (`animate` false), so the years slider moves the charts at once.
 */
function useMotion(animate: boolean) {
  const animated = useAnimated() && animate;
  return (order = 0) => ({ isAnimationActive: animated, animationDuration: 1000, animationBegin: order * 250, animationEasing: "ease-out" as const });
}

interface ChartProps {
  rows: YearRow[];
  /** Whether the series should draw themselves; false once they have. */
  animate: boolean;
}

function useAxes(locale: Locale) {
  const t = useMessages();
  return {
    money: (value: number) => formatMoney(value, locale),
    compact: (value: number) => formatCompact(value, locale),
    year: (year: number) => t.charts.yearN(year),
  };
}

/** A chart with its title, an optional action in the corner and an optional note underneath. */
function Panel({ title, action, note, children }: { title: string; action?: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <section className={`${card} min-w-0 p-4 sm:p-5`}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      {children}
      {note && <p className={`mt-3 text-sm ${muted}`}>{note}</p>}
    </section>
  );
}

/** The fixed-height box the responsive chart fills; `min-w-0` so it shrinks with the viewport. */
function Box({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0" style={{ height: HEIGHT }}>
      <ResponsiveContainer width="100%" height="100%">
        {children as React.ReactElement}
      </ResponsiveContainer>
    </div>
  );
}

/** What was put in and what it earned, stacked: the green wedge is compound interest. The same figures as a table on request. */
export function GrowthChart({ rows, animate }: ChartProps) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion(animate);
  const [view, setView] = useState<"chart" | "table">("chart");
  const other = view === "chart" ? "table" : "chart";
  return (
    <Panel
      title={t.charts.growth.title}
      action={
        <button type="button" className={`${button} shrink-0`} onClick={() => setView(other)}>
          {view === "chart" ? t.charts.growth.showTable : t.charts.growth.showChart}
        </button>
      }
    >
      {view === "chart" ? (
        <Box>
          <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="year" {...AXIS} tickLine={false} />
            <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
            <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
            <Legend iconType="square" {...LEGEND} />
            <Area type="monotone" dataKey="contributed" name={t.charts.growth.contributed} stackId="1" stroke="var(--chart-contributed)" strokeWidth={2} fill="var(--chart-contributed)" fillOpacity={0.25} {...motion(0)} />
            <Area type="monotone" dataKey="interest" name={t.charts.growth.interest} stackId="1" stroke="var(--chart-interest)" strokeWidth={2} fill="var(--chart-interest)" fillOpacity={0.25} {...motion(1)} />
          </AreaChart>
        </Box>
      ) : (
        <YearTable rows={rows} />
      )}
    </Panel>
  );
}

/** The balance against what it buys today; the shaded gap between the two lines is what inflation eats. */
export function InflationChart({ rows, animate }: ChartProps) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion(animate);
  return (
    <Panel title={t.charts.inflation.title}>
      <Box>
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="year" {...AXIS} tickLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
          <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
          <Legend iconType="plainline" itemSorter="dataKey" {...LEGEND} />
          <Area type="monotone" dataKey={(row: YearRow) => [row.real, row.balance]} name={t.charts.inflation.gap} stroke="none" fill="var(--chart-real)" fillOpacity={0.12} legendType="none" tooltipType="none" {...motion(2)} />
          <Line type="monotone" dataKey="balance" name={t.charts.inflation.nominal} stroke="var(--chart-interest)" strokeWidth={2.5} dot={false} {...motion(0)} />
          <Line type="monotone" dataKey="real" name={t.charts.inflation.real} stroke="var(--chart-real)" strokeWidth={2.5} dot={false} {...motion(1)} />
        </ComposedChart>
      </Box>
    </Panel>
  );
}

/**
 * What the same money buys over time, investing and not investing, both in today's money: the
 * shaded gap is what the investment really adds once inflation has had its say.
 */
export function OutcomeChart({ rows, animate }: ChartProps) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion(animate);
  const last = outcome(rows);
  const edge = last.real - last.cashReal;
  return (
    <Panel
      title={t.charts.outcome.title}
      note={
        <>
          {t.charts.outcome.lostToInflation(f.money(last.balance - last.real))}{" "}
          <span className={edge < 0 ? "text-danger" : "text-accent"}>
            {edge < 0 ? t.charts.outcome.buysLess(f.money(-edge)) : t.charts.outcome.buysMore(f.money(edge))}
          </span>
        </>
      }
    >
      <Box>
        <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="year" {...AXIS} tickLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
          <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
          <Legend iconType="plainline" itemSorter={(item) => (item.dataKey === "real" ? 0 : 1)} {...LEGEND} />
          <Area type="monotone" dataKey={(row: YearRow) => [row.cashReal, row.real]} name={t.charts.outcome.gap} stroke="none" fill="var(--chart-interest)" fillOpacity={0.15} legendType="none" tooltipType="none" {...motion(2)} />
          <Line type="monotone" dataKey="cashReal" name={t.charts.outcome.cash} stroke="var(--chart-contributed)" strokeWidth={2.5} strokeDasharray="6 4" dot={false} {...motion(1)} />
          <Line type="monotone" dataKey="real" name={t.charts.outcome.investing} stroke="var(--chart-interest)" strokeWidth={2.5} dot={false} {...motion(0)} />
        </ComposedChart>
      </Box>
    </Panel>
  );
}
