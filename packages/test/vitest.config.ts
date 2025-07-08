/// <reference types="vitest" />
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    // Browser mode for DOM testing
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [
        {
          browser: "chromium",
        },
      ],
    },

    // Global test configuration
    globals: true,
    setupFiles: ["./tests/test-setup.ts"],

    // Coverage configuration
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/",
        "dist/",
        "benchmarks/",
        "demo/",
        "examples/",
        "docs/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.test.ts",
        "**/*.spec.ts",
        "src/utils/screenshot.ts", // Browser-specific utility
        "playwright.config.ts",
        "tsup.config.ts",
        "vite.config.benchmark.js",
      ],
      thresholds: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85,
        },
      },
    },

    // Performance testing timeouts
    testTimeout: 30000,
    hookTimeout: 10000,
  },

  server: {
    port: 3001,
  },

  optimizeDeps: {
    exclude: ["fsevents"],
  },
})
