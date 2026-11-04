"use client";

import { useEffect, useRef, useState } from "react";

import type { Params } from "@/lib/finance/params";
import { GrowthChart, InflationChart, OutcomeChart } from "./charts";
import { HeaderControls } from "./controls";
import { Footer } from "./footer";
import { PlanForm } from "./form";
import { useLocale, useMessages } from "./i18n/locale";
import { useScenario, type Scenario } from "./scenario";
import { button, muted } from "./styles";
import { Summary } from "./summary";
import { setParams, useOpenedFromLink } from "./url-params";
import { YearsBar } from "./years-bar";

/** Each block of results rises into view a beat after the one before. */
const STAGGER_MS = 150;

/** When the last chart has finished drawing itself; after that, changes show at once. */
const SETTLE_MS = 2000;

/** The page: header, the form, the results below it once asked for, and the footer. */
export function App() {
  const t = useMessages();
  const locale = useLocale();
  const scenario = useScenario();
  const openedFromLink = useOpenedFromLink();
  // Counts the calculations: each one remounts the results so the charts draw themselves again.
  const [run, setRun] = useState(0);
  const results = useRef<HTMLDivElement>(null);
  const showing = openedFromLink || run > 0;

  // The server renders `lang="en"`; the remembered language takes over once on the client.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  // On a phone the form fills the screen: bring the fresh results into view.
  useEffect(() => {
    if (run > 0) results.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [run]);

  function calculate(params: Params) {
    setParams(params);
    setRun((n) => n + 1);
  }

  return (
    // Room at the bottom for the floating years bar, so it never covers the footer.
    <div className={`flex min-h-dvh flex-col ${showing ? "pb-20" : ""}`}>
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-8 sm:px-6 sm:pt-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <HeaderControls />
          </div>
          <p className={muted}>{t.tagline}</p>
        </header>

        <PlanForm calculated={scenario.params} showing={showing} onCalculate={calculate} />
        <p className={`text-xs ${muted}`}>{t.disclaimer}</p>

        {showing && (
          <div ref={results} key={run} className="scroll-mt-4">
            <Results scenario={scenario} />
          </div>
        )}
      </main>

      {showing && <YearsBar years={scenario.params.years} onChange={(years) => setParams({ ...scenario.params, years })} />}
      <Footer />
    </div>
  );
}

/** The summary, the charts and the share button. Mounted afresh on every calculation. */
function Results({ scenario }: { scenario: Scenario }) {
  const t = useMessages();
  const [notice, setNotice] = useState("");
  const [settled, setSettled] = useState(false);

  // Once the charts have drawn themselves, the slider moves them with no animation in the way.
  useEffect(() => {
    const timer = window.setTimeout(() => setSettled(true), SETTLE_MS);
    return () => window.clearTimeout(timer);
  }, []);

  async function share() {
    try {
      await navigator.clipboard.writeText(scenario.link());
      setNotice(t.share.copied);
    } catch {
      setNotice(t.share.failed);
    }
  }

  const animate = !settled;
  const blocks = [
    <Summary key="summary" scenario={scenario} />,
    <GrowthChart key="growth" rows={scenario.rows} animate={animate} />,
    <InflationChart key="inflation" rows={scenario.rows} animate={animate} />,
    <OutcomeChart key="outcome" rows={scenario.rows} animate={animate} />,
  ];

  return (
    <div className="flex flex-col gap-5">
      {blocks.map((block, index) => (
        <div key={block.key} className="animate-rise" style={{ animationDelay: `${index * STAGGER_MS}ms` }}>
          {block}
        </div>
      ))}
      <div className="animate-rise flex flex-wrap items-center gap-3" style={{ animationDelay: `${blocks.length * STAGGER_MS}ms` }}>
        <button type="button" className={button} onClick={share}>
          {t.share.button}
        </button>
        <p role="status" className={`text-sm ${muted}`}>
          {notice}
        </p>
      </div>
    </div>
  );
}
