import type { Messages } from "./en";

export const es: Messages = {
  title: "Calculadora de inversión",
  tagline: "Mira cómo crece tu dinero con el interés compuesto y cuánto le quita la inflación.",
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
    yearsBelow: "Los años están en la barra de abajo: muévela y los gráficos la siguen.",
    euro: "€",
    percent: "%",
    calculate: "Calcular",
    recalculate: "Recalcular",
  },

  summary: {
    title: (years) => `Al cabo de ${years} ${years === 1 ? "año" : "años"}`,
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
      contributed: "Aportado",
      interest: "Generado",
      showTable: "Ver año a año",
      showChart: "Ver el gráfico",
    },
    inflation: {
      title: "Frente a la inflación",
      nominal: "Saldo",
      real: "Lo que ese saldo compra hoy",
      gap: "Se lo come la inflación",
    },
    outcome: {
      title: "Diferencia de invertir junto a la inflación",
      investing: "Invirtiendo, en dinero de hoy",
      cash: "Guardado sin invertir, en dinero de hoy",
      gap: "Lo que añade invertir",
      lostToInflation: (amount) => `La inflación le quita ${amount} de poder de compra al saldo.`,
      buysMore: (amount) => `Invirtiendo, al final tu dinero compra ${amount} más que guardado sin invertir.`,
      buysLess: (amount) => `Invirtiendo, al final tu dinero compra ${amount} menos que guardado sin invertir: la rentabilidad es negativa.`,
    },
    yearN: (year) => `Año ${year}`,
  },

  table: {
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
    "Una proyección simplificada, no una previsión: la rentabilidad se toma como constante y no se incluyen comisiones ni impuestos. Esta herramienta no es asesoramiento financiero ni recomienda ninguna inversión; solo dibuja los números que escribes.",

  footer: { madeBy: "Hecho por César Peón", company: "1to1 Digital Solutions", links: "Enlaces del autor", legal: "Aviso legal" },

  legal: {
    title: "Aviso legal",
    back: "← Volver a la calculadora",
    identity: (p) => [
      ["Titular", p.name],
      ["NIF", p.taxId],
      ["Domicilio", p.address],
      ["Correo", p.email],
      ["Web", p.site],
    ],
    sections: [
      {
        title: "Qué es esta herramienta",
        body: [
          "Una calculadora que dibuja cómo crecería una cantidad de dinero a una rentabilidad anual constante, con aportaciones mensuales, y cuánto le quitaría la inflación. Es una proyección simplificada, sin comisiones, sin impuestos y con una rentabilidad que nunca cambia: las inversiones reales no se comportan así.",
          "No es asesoramiento financiero ni recomienda ningún producto, entidad o inversión. No sabe quién eres ni adapta nada a tu situación. Cualquier decisión que tomes es tuya; el titular no garantiza la exactitud de las cifras ni responde del uso que se haga de ellas.",
        ],
      },
      {
        title: "Tus datos",
        body: [
          "La calculadora funciona por completo en tu navegador. Los números que escribes no se envían a ningún sitio: no hay servidor nuestro, ni cuenta, ni formulario que mande nada, ni analítica.",
          "La página la sirve un proveedor de alojamiento (Vercel Inc.) que, como cualquier servidor web, procesa la dirección IP de cada petición en sus registros de acceso por seguridad y operación. No usamos esos registros para identificar a nadie.",
          "El idioma y el tema que eliges se guardan en el almacenamiento local de tu navegador para que la página los recuerde. No se guarda nada más ni se lee nada de tu dispositivo. Puedes borrarlos desde el navegador cuando quieras.",
        ],
      },
      {
        title: "Cookies",
        body: [
          "Este sitio no instala cookies. Las dos preferencias anteriores se guardan porque las has elegido tú, lo que la guía de cookies de la AEPD exime de consentimiento, así que no hay banner de cookies.",
        ],
      },
      {
        title: "Propiedad intelectual y ley aplicable",
        body: [
          "El diseño, los textos y el código de esta herramienta son del titular. Puedes usar la calculadora libremente y compartir enlaces a tus escenarios. Se aplica la legislación española.",
        ],
      },
    ],
  },
};
