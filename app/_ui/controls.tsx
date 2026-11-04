"use client";

import { LOCALES, setLocale, useLocale, useMessages, type Locale } from "./i18n/locale";
import { control } from "./styles";
import { setTheme, useTheme } from "./theme";

/** The language buttons and the theme switch, shared by every page's header. */
export function HeaderControls() {
  const t = useMessages();
  const locale = useLocale();
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <div className="flex shrink-0 items-center gap-1">
      <fieldset className="flex gap-0.5" aria-label={t.language}>
        {(Object.keys(LOCALES) as Locale[]).map((value) => (
          <button
            key={value}
            type="button"
            className={control}
            lang={value}
            aria-pressed={locale === value}
            aria-label={LOCALES[value]}
            onClick={() => setLocale(value)}
          >
            {value.toUpperCase()}
          </button>
        ))}
      </fieldset>
      <button
        type="button"
        className={control}
        aria-label={next === "dark" ? t.theme.toDark : t.theme.toLight}
        title={next === "dark" ? t.theme.toDark : t.theme.toLight}
        onClick={() => setTheme(next)}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          {theme === "dark" ? "☀" : "☾"}
        </span>
      </button>
    </div>
  );
}
