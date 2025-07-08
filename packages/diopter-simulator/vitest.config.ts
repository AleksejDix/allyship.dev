import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
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
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "test/**",
        "**/*.config.*",
        "**/*.test.*",
      ],
    },
  },
})
