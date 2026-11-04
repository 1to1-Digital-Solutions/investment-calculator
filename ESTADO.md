# Estado — calculadora-inversion

> **Cómo continuar:** «lee `ESTADO.md` y sigue con el siguiente paso».

## Qué es y dónde está

- Calculadora de inversión: capital inicial, aportación mensual, rentabilidad, inflación y años;
  al pulsar «Calcular» aparecen debajo del formulario, animados, el resumen y tres gráficos
  (crecimiento con tabla año a año dentro y CSV, frente a la inflación, resultado real). Enlace
  compartible, ES/EN, claro/oscuro.
- **Repo privado:** https://github.com/1to1-Digital-Solutions/investment-calculator
- **Producción:** https://inversion-calculadora.vercel.app (proyecto `investment-calculator` del equipo
  `1to1-digital-solutions`; `investment-calculator.vercel.app` y `calculadora-inversion.vercel.app` los
  tiene otra gente). El alias corto va dado de alta como dominio del proyecto: un alias suelto
  quedaba detrás del login de Vercel.
- **Carpeta local:** `~/Proyectos/1to1DigitalSolutions/calculadora-inversion`.
- Molde: `formato-linkedin` (misma estructura, tokens de color, i18n, tema). Diferencias: el repo
  es privado, así que `ESTADO.md` y `.claude/rules/` sí van en git.

## ⏭️ Siguiente paso

Segunda vuelta (simplificación pedida por César el 4/11/2026) hecha y verificada en local
(escritorio y móvil, claro y oscuro): sin modo objetivo, formulario arriba y resultados al pulsar
«Calcular», tabla dentro de «Crecimiento», inflación en dos líneas con la brecha sombreada,
relleno translúcido. **Sin commitear ni publicar**: falta su visto bueno.

Ideas que quedaron fuera a propósito (v1 simple): modo «¿cuándo llego a X?» (se quitó en la
segunda vuelta), comisiones anuales, impuestos sobre la ganancia, aportación que crece cada año,
escenarios predefinidos. Si alguna entra, va en `lib/finance/` con su test y en el formulario
como opción plegada.

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
- **El escenario calculado vive en la URL** (`useSyncExternalStore`, `replaceState`); el
  formulario guarda las ediciones aparte hasta «Calcular». Así el enlace siempre es lo que hay en
  pantalla, no hay desajuste de hidratación y un enlace compartido abre ya con los resultados.
- **Los gráficos se dibujan al aparecer** (Recharts anima cada serie, escalonadas, y cada bloque
  sube con `animate-rise`); cada «Calcular» remonta los resultados para repetirlo. Con
  `prefers-reduced-motion`, nada se mueve.
- **La leyenda de Recharts ordena por nombre** por defecto; en «Frente a la inflación» va
  `itemSorter="dataKey"` para que «Saldo» salga primero, como en el texto.
- **Los campos numéricos** guardan el texto mientras se escribe y el número aparte: un
  `<input type="number">` controlado no deja borrar para reescribir.
- **Comisiones e impuestos fuera** a petición de César: la herramienta enseña el mecanismo de
  forma simplificada.
