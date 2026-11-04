/**
 * The classes of the elements that repeat, in one place so they look the same. They only use the
 * colour tokens from `app/globals.css`.
 *
 * Touch targets are 44 px with a finger (phone and tablet) and a bit less with a mouse
 * (`pointer-fine`), whatever the width.
 */

export const card = "rounded-lg border border-border bg-surface";

export const muted = "text-muted";

export const label = "text-sm font-medium";

/** A numeric field: big enough to tap, inputmode decimal so phones show a numeric keyboard. */
export const field =
  "min-h-11 w-full rounded-md border border-field-border bg-field px-3 text-base tabular-nums text-text focus-visible:border-accent pointer-fine:min-h-10";

/** A segmented control: two buttons, the pressed one in green. */
export const segment =
  "inline-flex min-h-11 flex-1 items-center justify-center rounded-md px-3 text-sm font-medium text-muted transition-colors hover:bg-raised hover:text-text aria-pressed:bg-accent-soft aria-pressed:text-accent pointer-fine:min-h-9";

export const button =
  "inline-flex min-h-11 items-center justify-center gap-1 rounded-md border border-field-border bg-surface px-3.5 text-sm font-medium whitespace-nowrap text-text transition-colors hover:border-accent hover:bg-raised disabled:cursor-not-allowed disabled:opacity-50 pointer-fine:min-h-9";

/** An icon-only control in the header. */
export const control =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 text-sm font-medium text-muted hover:bg-raised hover:text-text aria-pressed:bg-accent-soft aria-pressed:text-accent pointer-fine:min-h-8 pointer-fine:min-w-8";
