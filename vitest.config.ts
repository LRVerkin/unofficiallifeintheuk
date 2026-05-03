import { defineConfig } from "vitest/config";
import path from "node:path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage/unit",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Astro virtual modules don't exist outside the Astro build; stub them
      // for Vitest so component tests can import (or lazy-import) actions.
      "astro:actions": path.resolve(__dirname, "./tests/stubs/astro-actions.ts"),
      "astro:schema": path.resolve(__dirname, "./tests/stubs/astro-schema.ts"),
    },
  },
});
