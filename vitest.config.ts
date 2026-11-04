import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

/**
 * **What is measured and the floor.** The maths live in `lib/` and are what is measured, at
 * 100 %: a calculator that is wrong by a rounding is worse than no calculator. `app/` stays out:
 * the form, the charts and the URL sync are the wrapper around `lib/` and need a browser. They
 * are checked by hand with `pnpm dev`.
 *
 * A threshold below what is measured prevents nothing: if it ever has to go down, let it be
 * with the reason written here.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
    restoreMocks: true,
    coverage: {
      provider: "v8",
      include: ["lib/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "html"],
      thresholds: { lines: 100, statements: 100, functions: 100, branches: 100 },
    },
  },
});
