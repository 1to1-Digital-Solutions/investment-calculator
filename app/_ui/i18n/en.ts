/**
 * Every text of the interface, in English. `es.ts` must have the same shape: TypeScript checks
 * it against this one.
 */
export const en = {
  title: "Investment Calculator",
  tagline: "See how your money grows with compound interest, what inflation takes from it and when you reach your goal.",
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
    target: "Target amount",
    euro: "€",
    percent: "%",
    mode: "What do you want to know?",
    modeYears: "How much will I have?",
    modeGoal: "When do I reach a goal?",
  },

  summary: {
    yearsTitle: (years: number) => `After ${years} ${years === 1 ? "year" : "years"}`,
    goalReached: (years: number, months: number) => {
      const y = years === 0 ? "" : `${years} ${years === 1 ? "year" : "years"}`;
      const m = months === 0 ? "" : `${months} ${months === 1 ? "month" : "months"}`;
      return `You reach your goal in ${[y, m].filter(Boolean).join(" and ") || "no time: you already have it"}`;
    },
    goalUnreachable: "With nothing added each month and no return, the balance never reaches that amount.",
    goalTooFar: "Not within a hundred years. Add more each month or set a closer goal.",
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
    },
    inflation: {
      title: "Against inflation",
      about: "The balance in the euros of each year, and what it is really worth in today's money. The grey line is the same money kept as cash, losing value to inflation.",
      nominal: "Balance",
      real: "Balance in today's money",
      cash: "Cash, in today's money",
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
    year: "Year",
    yearN: (year: number) => `Year ${year}`,
  },

  table: {
    summary: "Year by year",
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
    "A simplified projection: the return is taken as constant and no fees or taxes are included. Not financial advice.",

  footer: { madeBy: "Made by César Peón", company: "1to1 Digital Solutions", links: "Author links" },
};

export type Messages = typeof en;
