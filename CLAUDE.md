# CLAUDE.md — Investment Calculator

**What it is:** a single-page calculator of compound interest against inflation. Initial capital,
monthly contribution and annual return in; a summary, three charts (growth, against inflation,
real result) and a yearly table out. Either "how much after N years" or "when do I reach X".
See `README.md` for the feature list and how the numbers are made.

**Local context:** `ESTADO.md` carries the current state, what is pending and the operational
decisions, in Spanish. Read it first.

**Stack:** Next.js 16 (App Router), React 19, strict TypeScript, Tailwind 4, Recharts, pnpm,
Node 24, Vitest. No server of its own, no database, no environment variables: the page is static
and the numbers never leave the browser (the scenario lives in the URL; language and theme in
`localStorage`).

**How the code is split:**
- `lib/finance/` is the maths, pure and DOM-free: `simulate.ts` (yearly rows, with the
  conventions written at the top), `goal.ts` (months to a target), `params.ts` (defaults, bounds,
  URL shape) and `format.ts` (Intl formatting, CSV). Tested at 100 %.
- `app/` is the wrapper: `_ui/url-params.ts` keeps the scenario in the URL, `_ui/scenario.ts`
  derives everything from it, `_ui/form.tsx`, `_ui/summary.tsx`, `_ui/charts.tsx` and
  `_ui/table.tsx` show it. No maths go there. Every interface text lives in `_ui/i18n/en.ts` and
  `es.ts` (same shape, checked by TypeScript).

**Run and check:** `pnpm dev` (http://127.0.0.1:3500). Gates: `pnpm typecheck && pnpm lint &&
pnpm coverage && pnpm build`, all green before finishing. Kill the dev server by port
(`lsof -ti :3500 | xargs kill`), never by name.

**Handle with care:**
- **The conventions in `simulate.ts`** (effective annual rate, contribution at the end of the
  month, Fisher for the real rate, each contribution deflated from its own month) are what make
  the numbers comparable with other calculators. Changing one changes every result: do it with
  its test and say so.
- **The default inflation is a dated figure** (`INFLATION_DEFAULT` in `params.ts`): update value
  and period together.
- **Nothing remote at runtime** (fonts, analytics, calls): the CSP in `lib/headers.ts` forbids it.

**Conventions:** everything in English (code, comments, UI, docs, commits); `ESTADO.md` in
Spanish. Conventional Commits, one logical change per commit, no temporal references in
comments. Keep functions short, no dead code, no speculative abstractions. Tests check behaviour,
not implementation, and new logic ships with tests that would fail without it. Commits are
manual: do not commit unless asked.
