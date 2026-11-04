"use client";

import Link from "next/link";

import { useMessages } from "./i18n/locale";
import { muted } from "./styles";

/** The company behind the tool: the credit links to its site so every app points at the same place. */
const COMPANY_URL = "https://1to1digital.solutions/";

const LINKS = [
  { name: "GitHub", href: "https://github.com/cpl121" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/c%C3%A9sar-pe%C3%B3n-lamparero/" },
] as const;

const linkClass = "inline-flex min-h-11 items-center underline-offset-4 hover:text-accent hover:underline pointer-fine:min-h-0";

export function Footer() {
  const t = useMessages();
  return (
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
          <Link href="/legal" className={linkClass}>
            {t.footer.legal}
          </Link>
          {LINKS.map(({ name, href }) => (
            <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {name}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
