import type { Messages } from "./en";

export const es: Messages = {
  title: "Calculadora de inversión",
  tagline: "Mira cómo crece tu dinero con el interés compuesto, cuánto le quita la inflación y cuándo llegas a tu objetivo.",
  language: "Idioma",
  theme: { toLight: "Cambiar a tema claro", toDark: "Cambiar a tema oscuro" },

  form: {
    legend: "Tu plan",
    initial: "Capital inicial",
    monthly: "Aportación mensual",
    rate: "Rentabilidad anual",
    inflation: "Inflación anual",
    inflationHint: (value, period, source) =>
      `Por defecto: ${value}, el IPC de España de ${period} (${source}). Cámbialo si prefieres otra cifra.`,
    years: "Años",
    target: "Cantidad objetivo",
    euro: "€",
    percent: "%",
    mode: "¿Qué quieres saber?",
    modeYears: "¿Cuánto tendré?",
    modeGoal: "¿Cuándo llego a una cifra?",
  },

  summary: {
    yearsTitle: (years) => `Al cabo de ${years} ${years === 1 ? "año" : "años"}`,
    goalReached: (years, months) => {
      const y = years === 0 ? "" : `${years} ${years === 1 ? "año" : "años"}`;
      const m = months === 0 ? "" : `${months} ${months === 1 ? "mes" : "meses"}`;
      return `Llegas a tu objetivo en ${[y, m].filter(Boolean).join(" y ") || "nada: ya lo tienes"}`;
    },
    goalUnreachable: "Sin aportar nada cada mes y sin rentabilidad, el saldo nunca llega a esa cifra.",
    goalTooFar: "No en cien años. Aporta más cada mes o pon un objetivo más cercano.",
    balance: "Saldo final",
    contributed: "Lo que has puesto",
    interest: "Lo que ha generado",
    real: "En dinero de hoy",
    realHint: "Lo que compra hoy el saldo final, descontada la inflación.",
    realRate: (rate) => `Rentabilidad real: ${rate} al año`,
  },

  charts: {
    growth: {
      title: "Crecimiento",
      about: "Cada año: lo que has puesto y lo que la inversión ha generado encima. Los intereses crecen más deprisa cada año: eso es el interés compuesto.",
      contributed: "Aportado",
      interest: "Generado",
    },
    inflation: {
      title: "Frente a la inflación",
      about: "El saldo en los euros de cada año y lo que vale de verdad en dinero de hoy. La línea gris es el mismo dinero guardado en efectivo, perdiendo valor con la inflación.",
      nominal: "Saldo",
      real: "Saldo en dinero de hoy",
      cash: "Efectivo, en dinero de hoy",
    },
    outcome: {
      title: "Resultado real",
      about: "Al terminar: lo que has puesto, lo que tienes y lo que vale de verdad una vez descontada la inflación.",
      contributed: "Aportado",
      balance: "Saldo",
      real: "En dinero de hoy",
      lostToInflation: (amount) => `La inflación se lleva ${amount} de poder de compra.`,
      realGain: (amount) => `Ganancia real: ${amount}.`,
      realLoss: (amount) => `Pérdida real: ${amount}. La rentabilidad no alcanza a la inflación.`,
    },
    year: "Año",
    yearN: (year) => `Año ${year}`,
  },

  table: {
    summary: "Año a año",
    year: "Año",
    contributed: "Aportado",
    interest: "Generado",
    balance: "Saldo",
    real: "En dinero de hoy",
    download: "Descargar CSV",
    fileName: "inversion.csv",
  },

  share: {
    button: "Copiar enlace",
    copied: "Enlace copiado. Quien lo abra verá este escenario.",
    failed: "No se pudo copiar. Copia la dirección de esta página.",
  },

  disclaimer:
    "Una proyección simplificada: la rentabilidad se toma como constante y no se incluyen comisiones ni impuestos. No es asesoramiento financiero.",

  footer: { madeBy: "Hecho por César Peón", company: "1to1 Digital Solutions", links: "Enlaces del autor" },
};
