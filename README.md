# Investment Calculator

See how an investment grows with compound interest, what inflation takes from it and when it
reaches a goal. Initial capital, a monthly contribution and an annual return in; three charts and
a yearly table out.

Everything runs in the browser. There is no server, no database and no analytics: the numbers
never leave the page, and a scenario can be shared because it lives in the URL.

## What it does

- **Two questions.** *How much will I have?* with a years slider, or *When do I reach a goal?*
  with a target amount: the tool finds the month the balance first gets there, or says why it
  never will.
- **Growth**: what was put in and what the investment earned, stacked by year. The green wedge
  that widens every year is compound interest.
- **Against inflation**: the balance in the euros of each year, the same balance in today's
  money, and what the money would be worth had it stayed as cash.
- **Real result**: at the end, what was put in, what there is and what it buys today, with the
  purchasing power lost to inflation and the real gain (or loss) spelled out.
- **Inflation with a date.** The default is the latest annual CPI of Spain published when the
  tool was written (INE, October 2026); it is shown with that date and can be changed.
- **Year by year** as a folded table, downloadable as CSV.
- **Share a scenario**: the parameters are in the URL, so copying the link copies the plan.
- **English or Spanish interface** and **light or dark theme**, following the browser until you
  pick one. Both choices are remembered.

## How the numbers are made

The annual return is an effective rate (7 % means ×1.07 in a year) compounded monthly through the
equivalent monthly rate. Contributions go in at the end of each month, after that month's
interest. Inflation deflates a nominal amount to today's money by dividing by (1 + i)^years, and
the real return follows Fisher, (1 + r) / (1 + i) − 1, not a subtraction. The real gain compares
the final balance in today's money with each contribution valued in the euros of the month it
was made. No fees and no taxes: it is a simplified projection, not advice. The conventions are
written at the top of `lib/finance/simulate.ts` and every one has a test.

## Development

```sh
nvm use        # Node 24
pnpm install
pnpm dev       # http://127.0.0.1:3500
```

| Command | What it does |
|---|---|
| `pnpm dev` / `build` / `start` | Next.js on port 3500 |
| `pnpm typecheck` / `lint` | TypeScript and ESLint |
| `pnpm test` / `coverage` | Vitest; `lib/` is required to stay at 100 % coverage |

The maths live in `lib/finance/` and are pure and fully tested: `simulate.ts` (the yearly rows),
`goal.ts` (months to a target), `params.ts` (defaults, bounds and the URL shape) and `format.ts`
(money, percentages, CSV). `app/` is the wrapper: the form, the three charts (Recharts), the
table and the URL sync; the interface texts live in `app/_ui/i18n/`.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts and Vitest. Deployed on
Vercel.
