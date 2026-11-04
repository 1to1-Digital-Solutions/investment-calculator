"use client";

import Link from "next/link";
import { useEffect } from "react";

import { HeaderControls } from "./controls";
import { Footer } from "./footer";
import { useLocale, useMessages } from "./i18n/locale";
import { muted } from "./styles";

/**
 * Who publishes the tool and on what terms: the identification the Spanish LSSI asks of any
 * company site (art. 10), that this is not advice, and what the page does and does not do with
 * the visitor's data. The identity figures are the company's public ones.
 */
export const PUBLISHER = {
  name: "1TO1 DIGITAL SOLUTIONS SL",
  taxId: "B27630136",
  address: "Avda. de Buendía, 11, 19005 Guadalajara, España",
  email: "info@1to1digital.solutions",
  site: "https://1to1digital.solutions/",
} as const;

export function Legal() {
  const t = useMessages();
  const locale = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 pt-[max(2rem,env(safe-area-inset-top))] pb-10 sm:px-6 sm:pt-8">
        <header className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">{t.legal.title}</h1>
            <HeaderControls />
          </div>
          <Link href="/" className="text-sm text-accent underline-offset-4 hover:underline">
            {t.legal.back}
          </Link>
        </header>

        <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-1 text-sm">
          {t.legal.identity(PUBLISHER).map(([term, value]) => (
            <div key={term} className="contents">
              <dt className={muted}>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        {t.legal.sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-2">
            <h2 className="text-base font-semibold">{section.title}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </main>
      <Footer />
    </div>
  );
}
