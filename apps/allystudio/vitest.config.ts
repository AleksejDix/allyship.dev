import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: true,
    setupFiles: ["./src/vitest.setup.ts"]
  },
  define: {
    "import.meta.vitest": "undefined"
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  }
})
