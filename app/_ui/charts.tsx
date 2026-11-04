"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact, formatMoney } from "@/lib/finance/format";
import { outcome, type YearRow } from "@/lib/finance/simulate";
import { useLocale, useMessages, type Locale } from "./i18n/locale";
import { card, link, muted } from "./styles";
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

/** How each series draws itself: a second, easing out, one after the other. */
function useMotion() {
  const animated = useAnimated();
  return (order = 0) => ({ isAnimationActive: animated, animationDuration: 1000, animationBegin: order * 250, animationEasing: "ease-out" as const });
}

function useAxes(locale: Locale) {
  const t = useMessages();
  return {
    money: (value: number) => formatMoney(value, locale),
    compact: (value: number) => formatCompact(value, locale),
    year: (year: number) => t.charts.yearN(year),
  };
}

/** A chart with its title, the one-line note on what it shows and, if any, an action in the corner. */
function Panel({ title, about, action, note, children }: { title: string; about: string; action?: ReactNode; note?: ReactNode; children: ReactNode }) {
  return (
    <section className={`${card} p-4 sm:p-5`}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-base font-semibold">{title}</h2>
        {action}
      </div>
      <p className={`mt-1 mb-4 text-sm ${muted}`}>{about}</p>
      {children}
      {note && <p className={`mt-3 text-sm ${muted}`}>{note}</p>}
    </section>
  );
}

/** What was put in and what it earned, stacked: the green wedge is compound interest. The same figures as a table on request. */
export function GrowthChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion();
  const [view, setView] = useState<"chart" | "table">("chart");
  const other = view === "chart" ? "table" : "chart";
  return (
    <Panel
      title={t.charts.growth.title}
      about={t.charts.growth.about}
      action={
        <button type="button" className={`${link} -mr-2 -mt-2 shrink-0`} onClick={() => setView(other)}>
          {view === "chart" ? t.charts.growth.showTable : t.charts.growth.showChart}
        </button>
      }
    >
      {view === "chart" ? (
        <div style={{ height: HEIGHT }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="year" {...AXIS} tickLine={false} />
              <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
              <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
              <Legend iconType="square" />
              <Area type="monotone" dataKey="contributed" name={t.charts.growth.contributed} stackId="1" stroke="var(--chart-contributed)" strokeWidth={2} fill="var(--chart-contributed)" fillOpacity={0.25} {...motion(0)} />
              <Area type="monotone" dataKey="interest" name={t.charts.growth.interest} stackId="1" stroke="var(--chart-interest)" strokeWidth={2} fill="var(--chart-interest)" fillOpacity={0.25} {...motion(1)} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <YearTable rows={rows} />
      )}
    </Panel>
  );
}

/** The balance against what it buys today; the shaded gap between the two lines is what inflation eats. */
export function InflationChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion();
  return (
    <Panel title={t.charts.inflation.title} about={t.charts.inflation.about}>
      <div style={{ height: HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="year" {...AXIS} tickLine={false} />
            <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
            <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
            <Legend iconType="plainline" itemSorter="dataKey" />
            <Area type="monotone" dataKey={(row: YearRow) => [row.real, row.balance]} name={t.charts.inflation.gap} stroke="none" fill="var(--chart-real)" fillOpacity={0.12} legendType="none" tooltipType="none" {...motion(2)} />
            <Line type="monotone" dataKey="balance" name={t.charts.inflation.nominal} stroke="var(--chart-interest)" strokeWidth={2.5} dot={false} {...motion(0)} />
            <Line type="monotone" dataKey="real" name={t.charts.inflation.real} stroke="var(--chart-real)" strokeWidth={2.5} dot={false} {...motion(1)} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

/** The end of the road in three bars, with what inflation took written underneath. */
export function OutcomeChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  const motion = useMotion();
  const last = outcome(rows);
  const bars = [
    { name: t.charts.outcome.contributed, value: last.contributed, fill: "var(--chart-contributed)" },
    { name: t.charts.outcome.balance, value: last.balance, fill: "var(--chart-interest)" },
    { name: t.charts.outcome.real, value: last.real, fill: "var(--chart-real)" },
  ];
  const realGain = last.real - last.contributedReal;
  return (
    <Panel
      title={t.charts.outcome.title}
      about={t.charts.outcome.about}
      note={
        <>
          {t.charts.outcome.lostToInflation(f.money(last.balance - last.real))}{" "}
          <span className={realGain < 0 ? "text-danger" : "text-accent"}>
            {realGain < 0 ? t.charts.outcome.realLoss(f.money(-realGain)) : t.charts.outcome.realGain(f.money(realGain))}
          </span>
        </>
      }
    >
      <div style={{ height: HEIGHT }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="25%">
            <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
            <XAxis dataKey="name" {...AXIS} tickLine={false} interval={0} />
            <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
            <Tooltip {...TOOLTIP} cursor={{ fill: "var(--raised)" }} formatter={(value) => f.money(Number(value))} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} {...motion(0)} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}
