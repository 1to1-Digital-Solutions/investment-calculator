"use client";

import { useEffect, useState } from "react";

import { GrowthChart, InflationChart, OutcomeChart } from "./charts";
import { PlanForm } from "./form";
import { LOCALES, setLocale, useLocale, useMessages, type Locale } from "./i18n/locale";
import { useScenario } from "./scenario";
import { button, control, muted } from "./styles";
import { Summary } from "./summary";
import { YearTable } from "./table";
import { setTheme, useTheme } from "./theme";

/** The company behind the tool: the credit links to its site so every app points at the same place. */
const COMPANY_URL = "https://1to1digital.solutions/";

const LINKS = [
  { name: "GitHub", href: "https://github.com/cpl121" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/c%C3%A9sar-pe%C3%B3n-lamparero/" },
] as const;

/** The page: header with language and theme, the form beside the results, and the footer. */
export function App() {
  const t = useMessages();
  const locale = useLocale();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  const scenario = useScenario();
  const [notice, setNotice] = useState("");

  // The server renders `lang="en"`; the remembered language takes over once on the client.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  async function share() {
    try {
      await navigator.clipboard.writeText(scenario.link());
      setNotice(t.share.copied);
    } catch {
      setNotice(t.share.failed);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-5 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-8 sm:px-6 sm:pt-8">
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

        <div className="grid gap-5 lg:grid-cols-[20rem_1fr] lg:items-start">
          <div className="flex flex-col gap-3 lg:sticky lg:top-6">
            <PlanForm scenario={scenario} />
            <div className="flex flex-wrap items-center gap-3">
              <button type="button" className={button} onClick={share}>
                {t.share.button}
              </button>
              <p role="status" className={`text-sm ${muted}`}>
                {notice}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-5">
            <Summary scenario={scenario} />
            <GrowthChart rows={scenario.rows} />
            <InflationChart rows={scenario.rows} />
            <OutcomeChart rows={scenario.rows} />
            <YearTable rows={scenario.rows} />
            <p className={`text-xs ${muted}`}>{t.disclaimer}</p>
          </div>
        </div>
      </main>

      <footer className="border-t border-border">
        <div
          className={`mx-auto flex max-w-6xl flex-col items-center gap-x-6 gap-y-2 px-4 pt-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center text-sm sm:flex-row sm:justify-between sm:px-6 sm:pt-5 sm:pb-[max(1.25rem,env(safe-area-inset-bottom))] ${muted}`}
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
