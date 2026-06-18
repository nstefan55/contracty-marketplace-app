import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": root,
    },
  },
  test: {
    environment: "node",
    globals: false,
    include: ["__tests__/integration/**/*.test.{js,mjs}"],
    exclude: ["node_modules/**", "__tests__/unit/**"],
    setupFiles: ["__tests__/helpers/integration-setup.mjs"],
    pool: "forks",
    forks: { singleFork: true },
    testTimeout: 60000,
    hookTimeout: 60000,
    // Integration stage does NOT enforce a coverage threshold — that gate
    // belongs to the unit stage in the Build phase of the pipeline.
  },
});
