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
    yearsBelow: "The years are in the bar at the bottom: move it and the charts follow.",
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
      contributed: "Put in",
      interest: "Earned",
      showTable: "See year by year",
      showChart: "See the chart",
    },
    inflation: {
      title: "Against inflation",
      nominal: "Balance",
      real: "What that balance buys today",
      gap: "Eaten by inflation",
    },
    outcome: {
      title: "Investing or not: what it buys",
      investing: "Investing, in today's money",
      cash: "Kept as cash, in today's money",
      gap: "What investing adds",
      lostToInflation: (amount: string) => `Inflation takes ${amount} of purchasing power from the balance.`,
      buysMore: (amount: string) => `Investing, your money buys ${amount} more at the end than kept as cash.`,
      buysLess: (amount: string) => `Investing, your money buys ${amount} less at the end than kept as cash: the return is negative.`,
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

  footer: { madeBy: "Made by César Peón", company: "1to1 Digital Solutions", links: "Author links", legal: "Legal notice" },

  legal: {
    title: "Legal notice",
    back: "← Back to the calculator",
    identity: (p: Publisher): [string, string][] => [
      ["Publisher", p.name],
      ["Tax ID (NIF)", p.taxId],
      ["Address", p.address],
      ["Email", p.email],
      ["Website", p.site],
    ],
    sections: [
      {
        title: "What this tool is",
        body: [
          "A calculator that draws how an amount of money would grow at a constant annual return, with monthly contributions, and what inflation would take from it. It is a simplified projection with no fees, no taxes and a return that never changes: real investments do not behave like that.",
          "It is not financial advice and it does not recommend any product, provider or investment. It does not know who you are and does not adapt anything to your situation. Any decision you take is yours; the publisher does not guarantee the accuracy of the figures and accepts no liability for their use.",
        ],
      },
      {
        title: "Your data",
        body: [
          "The calculator runs entirely in your browser. The numbers you type are never sent anywhere: there is no server of ours, no account, no form that posts anything, and no analytics.",
          "The page is served by a hosting provider (Vercel Inc.) which, like any web server, processes the IP address of each request in its access logs for security and operation. We do not use those logs to identify visitors.",
          "Your language and theme choices are kept in your browser's local storage so the page remembers them. Nothing else is stored, and nothing is read from your device. You can clear them from your browser at any time.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "This site sets no cookies. The two preferences above are stored because you chose them, which the Spanish data protection authority's cookie guidance exempts from consent, so there is no cookie banner.",
        ],
      },
      {
        title: "Intellectual property and applicable law",
        body: [
          "The design, texts and code of this tool belong to the publisher. You may use the calculator freely and share links to your scenarios. Spanish law applies.",
        ],
      },
    ],
  },
};

export interface Publisher {
  name: string;
  taxId: string;
  address: string;
  email: string;
  site: string;
}

export type Messages = typeof en;
