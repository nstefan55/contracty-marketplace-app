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
    include: ["__tests__/unit/**/*.test.{js,mjs}"],
    exclude: ["node_modules/**", "__tests__/integration/**"],
    setupFiles: ["__tests__/helpers/unit-setup.mjs"],
    pool: "forks",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],
      reportsDirectory: "./coverage/unit",
      include: [
        "lib/zod.js",
        "lib/password.js",
        "lib/ratelimit.js",
        "lib/error.js",
        "app/api/register/route.js",
        "app/api/onboarding/set-role/route.js",
        "app/api/onboarding/verify-otp/route.js",
        "auth.config.js",
      ],
      exclude: [
        "node_modules/**",
        "__tests__/**",
        "scripts/**",
        ".next/**",
        "coverage/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
