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
      reporter: ["text"],
      include: ["src/**/*.ts"],
      exclude: [
        "node_modules/",
        "dist/",
        "tests/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/*.test.ts",
        "**/*.spec.ts",
      ],
    },

    // Reduced timeouts
    testTimeout: 5000,
    hookTimeout: 2000,
  },

  server: {
    port: 3002,
  },

  optimizeDeps: {
    exclude: ["fsevents"],
  },
})
