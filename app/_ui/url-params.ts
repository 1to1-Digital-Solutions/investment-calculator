"use client";

import { useSyncExternalStore } from "react";

import { DEFAULTS, parseParams, toQuery, type Params } from "@/lib/finance/params";

/**
 * The scenario lives in the URL: it is read from the query string the first time it is needed
 * and every change is written back with `replaceState`, so the address bar is always a link to
 * what is on screen. Read through `useSyncExternalStore` so the server (which has no URL to
 * look at) renders the defaults and the client takes over at hydration without a mismatch.
 */

let value: Params | undefined;
const listeners = new Set<() => void>();

function read(): Params {
  value ??= parseParams(window.location.search);
  return value;
}

function subscribe(notify: () => void): () => void {
  listeners.add(notify);
  return () => {
    listeners.delete(notify);
  };
}

/** The URL of a scenario on this page; without a query when it is the default one. */
export function linkTo(params: Params, base = `${window.location.origin}${window.location.pathname}`): string {
  const query = toQuery(params);
  return query ? `${base}?${query}` : base;
}

export function setParams(next: Params): void {
  value = next;
  window.history.replaceState(null, "", linkTo(next, window.location.pathname));
  for (const notify of listeners) notify();
}

/** The current scenario; the defaults on the server and during hydration. */
export function useParams(): Params {
  return useSyncExternalStore(subscribe, read, () => DEFAULTS);
}
