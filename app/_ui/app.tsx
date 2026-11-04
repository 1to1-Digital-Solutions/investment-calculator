"use client";

import { useEffect, useRef, useState } from "react";

import type { Params } from "@/lib/finance/params";
import { GrowthChart, InflationChart, OutcomeChart } from "./charts";
import { PlanForm } from "./form";
import { LOCALES, setLocale, useLocale, useMessages, type Locale } from "./i18n/locale";
import { useScenario } from "./scenario";
import { button, control, muted } from "./styles";
import { Summary } from "./summary";
import { setTheme, useTheme } from "./theme";
import { setParams, useOpenedFromLink } from "./url-params";

/** The company behind the tool: the credit links to its site so every app points at the same place. */
const COMPANY_URL = "https://1to1digital.solutions/";

const LINKS = [
  { name: "GitHub", href: "https://github.com/cpl121" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/c%C3%A9sar-pe%C3%B3n-lamparero/" },
] as const;

/** Each block of results rises into view a beat after the one before. */
const STAGGER_MS = 150;

/** The page: header with language and theme, the form, the results below it once asked for, and the footer. */
export function App() {
  const t = useMessages();
  const locale = useLocale();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const scenario = useScenario();
  const openedFromLink = useOpenedFromLink();
  // Counts the calculations: each one remounts the results so the charts draw themselves again.
  const [run, setRun] = useState(0);
  const [notice, setNotice] = useState("");
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
    setNotice("");
    setRun((n) => n + 1);
  }

  async function share() {
    try {
      await navigator.clipboard.writeText(scenario.link());
      setNotice(t.share.copied);
    } catch {
      setNotice(t.share.failed);
    }
  }

  const blocks = [
    <Summary key="summary" scenario={scenario} />,
    <GrowthChart key="growth" rows={scenario.rows} />,
    <InflationChart key="inflation" rows={scenario.rows} />,
    <OutcomeChart key="outcome" rows={scenario.rows} />,
  ];

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-8 sm:px-6 sm:pt-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
            <div className="flex shrink-0 items-center gap-1">
              <fieldset className="flex gap-0.5" aria-label={t.language}>
                {(Object.keys(LOCALES) as Locale[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={control}
                    lang={value}
                    aria-pressed={locale === value}
                    aria-label={LOCALES[value]}
                    onClick={() => setLocale(value)}
                  >
                    {value.toUpperCase()}
                  </button>
                ))}
              </fieldset>
              <button
                type="button"
                className={control}
                aria-label={next === "dark" ? t.theme.toDark : t.theme.toLight}
                title={next === "dark" ? t.theme.toDark : t.theme.toLight}
                onClick={() => setTheme(next)}
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  {theme === "dark" ? "☀" : "☾"}
                </span>
              </button>
            </div>
          </div>
          <p className={muted}>{t.tagline}</p>
        </header>

        <PlanForm calculated={scenario.params} showing={showing} onCalculate={calculate} />

        {showing && (
          <div ref={results} key={run} className="flex scroll-mt-4 flex-col gap-5">
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
            <p className={`text-xs ${muted}`}>{t.disclaimer}</p>
          </div>
        )}
      </main>

      <footer className="border-t border-border">
        <div
          className={`mx-auto flex max-w-4xl flex-col items-center gap-x-6 gap-y-2 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm sm:flex-row sm:justify-between sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] ${muted}`}
        >
          <p>
            {t.footer.madeBy} ·{" "}
            <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="underline-offset-4 hover:text-accent hover:underline">
              {t.footer.company}
            </a>
          </p>
          <nav aria-label={t.footer.links} className="flex gap-x-5">
            {LINKS.map(({ name, href }) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-11 items-center underline-offset-4 hover:text-accent hover:underline pointer-fine:min-h-0"
              >
                {name}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
