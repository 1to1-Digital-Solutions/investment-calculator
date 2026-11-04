"use client";

import type { ReactNode } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatCompact, formatMoney } from "@/lib/finance/format";
import { outcome, type YearRow } from "@/lib/finance/simulate";
import { useLocale, useMessages, type Locale } from "./i18n/locale";
import { card, muted } from "./styles";

const HEIGHT = 260;

/** The tooltip and the axes in the page's colours; Recharts' defaults are white on white in dark mode. */
const TOOLTIP = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" },
  labelStyle: { color: "var(--muted)", marginBottom: 4 },
  itemStyle: { color: "var(--text)", padding: 0 },
  cursor: { stroke: "var(--muted)", strokeDasharray: "3 3" },
};
const AXIS = { stroke: "var(--muted)", fontSize: 12 };

function useAxes(locale: Locale) {
  const t = useMessages();
  return {
    money: (value: number) => formatMoney(value, locale),
    compact: (value: number) => formatCompact(value, locale),
    year: (year: number) => t.charts.yearN(year),
  };
}

/** A chart with its title and the one-line note on what it shows. */
function Panel({ title, about, note, children }: { title: string; about: string; note?: ReactNode; children: ReactNode }) {
  return (
    <section className={`${card} p-4 sm:p-5`}>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className={`mt-1 mb-4 text-sm ${muted}`}>{about}</p>
      <div style={{ height: HEIGHT }}>{children}</div>
      {note && <p className={`mt-3 text-sm ${muted}`}>{note}</p>}
    </section>
  );
}

/** What was put in and what it earned, stacked: the green wedge is compound interest. */
export function GrowthChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  return (
    <Panel title={t.charts.growth.title} about={t.charts.growth.about}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="year" {...AXIS} tickLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
          <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
          <Legend iconType="square" />
          <Area type="monotone" dataKey="contributed" name={t.charts.growth.contributed} stackId="1" stroke="var(--chart-contributed)" fill="var(--chart-contributed)" fillOpacity={0.55} isAnimationActive={false} />
          <Area type="monotone" dataKey="interest" name={t.charts.growth.interest} stackId="1" stroke="var(--chart-interest)" fill="var(--chart-interest)" fillOpacity={0.75} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </Panel>
  );
}

/** The balance in each year's euros against the same balance in today's, plus the cash that was never invested. */
export function InflationChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
  return (
    <Panel title={t.charts.inflation.title} about={t.charts.inflation.about}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="year" {...AXIS} tickLine={false} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
          <Tooltip {...TOOLTIP} formatter={(value) => f.money(Number(value))} labelFormatter={(year) => f.year(Number(year))} />
          <Legend iconType="plainline" />
          <Line type="monotone" dataKey="balance" name={t.charts.inflation.nominal} stroke="var(--chart-interest)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="real" name={t.charts.inflation.real} stroke="var(--chart-real)" strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="cashReal" name={t.charts.inflation.cash} stroke="var(--chart-cash)" strokeWidth={2} strokeDasharray="6 4" dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </Panel>
  );
}

/** The end of the road in three bars, with what inflation took written underneath. */
export function OutcomeChart({ rows }: { rows: YearRow[] }) {
  const t = useMessages();
  const locale = useLocale();
  const f = useAxes(locale);
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
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bars} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap="25%">
          <CartesianGrid stroke="var(--chart-grid)" vertical={false} />
          <XAxis dataKey="name" {...AXIS} tickLine={false} interval={0} />
          <YAxis {...AXIS} tickLine={false} axisLine={false} tickFormatter={f.compact} width={56} />
          <Tooltip {...TOOLTIP} cursor={{ fill: "var(--raised)" }} formatter={(value) => f.money(Number(value))} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} isAnimationActive={false} />
        </BarChart>
      </ResponsiveContainer>
    </Panel>
  );
}
