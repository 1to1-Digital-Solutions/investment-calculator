# Estado — calculadora-inversion

> **Cómo continuar:** «lee `ESTADO.md` y sigue con el siguiente paso».

## Qué es y dónde está

- Calculadora de inversión: capital inicial, aportación mensual, rentabilidad e inflación; modo
  «¿cuánto tendré?» (años) o «¿cuándo llego a X?» (objetivo). Tres gráficos (crecimiento, frente a
  la inflación, resultado real), tabla anual con CSV, enlace compartible, ES/EN, claro/oscuro.
- **Repo privado:** https://github.com/1to1-Digital-Solutions/investment-calculator
- **Producción:** https://inversion-calculadora.vercel.app (proyecto `investment-calculator` del equipo
  `1to1-digital-solutions`; `investment-calculator.vercel.app` y `calculadora-inversion.vercel.app` los
  tiene otra gente). El alias corto va dado de alta como dominio del proyecto: un alias suelto
  quedaba detrás del login de Vercel.
- **Carpeta local:** `~/Proyectos/1to1DigitalSolutions/calculadora-inversion`.
- Molde: `formato-linkedin` (misma estructura, tokens de color, i18n, tema). Diferencias: el repo
  es privado, así que `ESTADO.md` y `.claude/rules/` sí van en git.

## ⏭️ Siguiente paso

Terminada la primera versión. Pendiente de comprobar a mano en el móvil (deslizador de años,
teclado numérico en los campos, tooltips de los gráficos al tocar).

Ideas que quedaron fuera a propósito (v1 simple): comisiones anuales, impuestos sobre la
ganancia, aportación que crece cada año, escenarios predefinidos. Si alguna entra, va en
`lib/finance/` con su test y en el formulario como opción plegada.

## ▶️ Cómo arrancar

```sh
pnpm install
pnpm dev                     # http://127.0.0.1:3500
lsof -ti :3500 | xargs kill  # al terminar (nunca pkill)
```

Gates: `pnpm typecheck && pnpm lint && pnpm coverage && pnpm build` (`lib/` al 100 %). La CI de
GitHub corre lo mismo en `main`, `develop` y PRs. Sin variables de entorno. `next dev` genera
`AGENTS.md`; se deja y se commitea.

Capturas en móvil: Playwright no está en este repo; se usa el de `../axe-throwing/node_modules/playwright`
con un script suelto (viewport iPhone 13, claro y oscuro).

## 📌 Reglas que no se deducen del repo

- **Código, UI, docs y commits en inglés**; este fichero en español.
- **Nada sale del navegador**: ni servidor, ni analítica, ni nada remoto (CSP en `lib/headers.ts`).
- **Una dependencia fuera del framework**: `recharts` (gráficos responsive, accesibles, con
  tooltip). Cualquier otra, justificarla.
- **Inflación por defecto con fecha** (`INFLATION_DEFAULT`): IPC adelantado de octubre de 2026 del
  INE, 4,9 %. Al actualizarla, cambiar valor y periodo a la vez.
- Commits manuales, Conventional Commits, atómicos. `develop` y `main` van a la par; se publica
  desde la CLI de Vercel (`npx vercel deploy --prod --yes --scope 1to1-digital-solutions`).

## 🗂️ Decisiones

- **Ganancia real** = saldo en dinero de hoy − cada aportación deflactada desde su mes. Comparar
  contra el aportado nominal daba «pérdida real» con un 2 % de rentabilidad real: contaba un euro
  del año 19 como un euro de hoy.
- **El escenario vive en la URL** (`useSyncExternalStore`, `replaceState`), no en estado de React:
  así el enlace siempre es el escenario y no hay desajuste de hidratación.
- **Los campos numéricos** guardan el texto mientras se escribe y el número aparte: un
  `<input type="number">` controlado no deja borrar para reescribir.
- **Comisiones e impuestos fuera** a petición de César: la herramienta enseña el mecanismo de
  forma simplificada.
