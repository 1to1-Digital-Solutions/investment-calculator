/**
 * Every text of the interface, in English. `es.ts` must have the same shape: TypeScript checks
 * it against this one.
 */
export const en = {
  title: "Investment Calculator",
  tagline: "See how your money grows with compound interest and what inflation takes from it.",
  language: "Language",
  theme: { toLight: "Switch to light theme", toDark: "Switch to dark theme" },

  form: {
    legend: "Your plan",
    initial: "Initial capital",
    monthly: "Monthly contribution",
    rate: "Annual return",
    inflation: "Annual inflation",
    inflationHint: (value: string, period: string, source: string) =>
      `Default: ${value}, Spain's CPI for ${period} (${source}). Change it if you prefer another figure.`,
    years: "Years",
    euro: "€",
    percent: "%",
    calculate: "Calculate",
    recalculate: "Recalculate",
  },

  summary: {
    title: (years: number) => `After ${years} ${years === 1 ? "year" : "years"}`,
    balance: "Final balance",
    contributed: "What you put in",
    interest: "What it earned",
    real: "In today's money",
    realHint: "What the final balance buys today, after inflation.",
    realRate: (rate: string) => `Real return: ${rate} a year`,
  },

  charts: {
    growth: {
      title: "Growth",
      about: "Each year: what you have put in and what the investment has earned on top. The interest grows faster every year: that is compound interest.",
      contributed: "Put in",
      interest: "Earned",
      showTable: "See year by year",
      showChart: "See the chart",
    },
    inflation: {
      title: "Against inflation",
      about: "The green line is your balance each year. The amber one is what that balance would buy today. The shaded gap between them is what inflation eats.",
      nominal: "Balance",
      real: "What it buys today",
      gap: "Eaten by inflation",
    },
    outcome: {
      title: "Real result",
      about: "At the end: what you put in, what you have, and what it is really worth once inflation is taken into account.",
      contributed: "Put in",
      balance: "Balance",
      real: "In today's money",
      lostToInflation: (amount: string) => `Inflation takes ${amount} of purchasing power.`,
      realGain: (amount: string) => `Real gain: ${amount}.`,
      realLoss: (amount: string) => `Real loss: ${amount}. The return does not keep up with inflation.`,
    },
    yearN: (year: number) => `Year ${year}`,
  },

  table: {
    year: "Year",
    contributed: "Put in",
    interest: "Earned",
    balance: "Balance",
    real: "In today's money",
    download: "Download CSV",
    fileName: "investment.csv",
  },

  share: {
    button: "Copy link",
    copied: "Link copied. Anyone who opens it sees this scenario.",
    failed: "Could not copy. Copy the address of this page instead.",
  },

  disclaimer:
    "A simplified projection, not a forecast: the return is taken as constant, and no fees or taxes are included. This tool is not financial advice and does not recommend any investment; it only draws the numbers you type.",

  footer: { madeBy: "Made by César Peón", company: "1to1 Digital Solutions", links: "Author links" },
};

export type Messages = typeof en;
