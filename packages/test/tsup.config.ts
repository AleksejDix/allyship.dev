import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: false,
  minify: false,
  sourcemap: true,
  clean: true,
  target: "es2022",
  platform: "browser",
  external: [],
})
