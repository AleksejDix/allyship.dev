import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    includeSource: ["src/**/*.{js,ts}"],
    globals: true
  },
  define: {
    "import.meta.vitest": "undefined"
  }
})
