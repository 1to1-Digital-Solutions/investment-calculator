# Investment Calculator

See how an investment grows with compound interest and what inflation takes from it. Initial
capital, a monthly contribution and an annual return in; press *Calculate* and three charts draw
themselves below the form.

Everything runs in the browser. There is no server, no database and no analytics: the numbers
never leave the page, and a scenario can be shared because it lives in the URL.

Live at https://inversion-calculadora.vercel.app.

## What it does

- **The form first, the results on demand.** Nothing moves while a number is half typed: the
  charts appear, one after the other, when *Calculate* is pressed, and again on *Recalculate*.
- **The years follow a floating slider** over the bottom of the screen once there are results:
  move it from anywhere on the page and every chart redraws at once.
- **Growth**: what was put in and what the investment earned, stacked by year. The green wedge
  that widens every year is compound interest. The same figures as a year-by-year table, with a
  switch inside the chart, downloadable as CSV.
- **Against inflation**: the balance of each year and what that balance buys today; the shaded
  gap between the two lines is what inflation eats.
- **The difference investing makes, with inflation**: what the same money buys over time,
  invested and kept as cash, both in today's money; the shaded gap is what investing adds, and
  the note under the chart says how much more (or less) it buys at the end.
- **Inflation with a date.** The default is the latest annual CPI of Spain published when the
  tool was written (INE, October 2026); it is shown with that date and can be changed.
- **Share a scenario**: the parameters are in the URL, so copying the link copies the plan.
- **English or Spanish interface** and **light or dark theme**, following the browser until you
  pick one. Both choices are remembered.
- **A legal notice** (`/legal`): who publishes the tool, that it is not advice, and what it does
  with your data (nothing leaves the browser; no cookies).

## How the numbers are made

The annual return is an effective rate (7 % means ×1.07 in a year) compounded monthly through the
equivalent monthly rate. Contributions go in at the end of each month, after that month's
interest. Inflation deflates a nominal amount to today's money by dividing by (1 + i)^years, and
the real return follows Fisher, (1 + r) / (1 + i) − 1, not a subtraction. "Kept as cash" is the
sum of what was put in, deflated the same way. No fees and no taxes: it is a simplified projection, not advice. The conventions are
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
`params.ts` (defaults, bounds and the URL shape) and `format.ts` (money, percentages, CSV). `app/` is the wrapper: the form, the three charts (Recharts), the
table and the URL sync; the interface texts live in `app/_ui/i18n/`.

Built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts and Vitest. Deployed on
Vercel.

## License

[MIT](LICENSE). The numbers are a simplified projection, not financial advice: see the legal
notice in the app.
