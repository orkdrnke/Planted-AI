import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the "@/*" path alias from tsconfig.json
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  // tsconfig keeps "jsx": "preserve" for Next.js; tests need JSX compiled
  oxc: {
    jsx: { runtime: "automatic" },
  },
  test: {
    // Component tests (*.test.tsx) opt into jsdom with a `@vitest-environment jsdom` docblock
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules/**", ".next/**"],
  },
});
