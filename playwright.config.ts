import type { PlaywrightTestConfig } from "@playwright/test"
import { devices } from "@playwright/test"
import { defineConfig } from '@playwright/test'

// Reference: https://playwright.dev/docs/test-configuration
const config: PlaywrightTestConfig = {
  // Timeout per test
  timeout: 30 * 1000,
  // Test directory
  testDir: "e2e",
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir:
    "./test-results/" /* Fail the build on CI if you accidentally left test.only in the source code. */,
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  globalSetup: "./e2e/setup/globalSetup.ts",

  reporter: [["html", { open: "onFirstRun" }]],

  use: {
    // Retry a test if its failing with enabled tracing. This allows you to analyse the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",
    storageState: "./e2e/setup/storageState.json",
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: "http://127.0.0.1:3000",
    // Capture screenshot on failure
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
}

export default defineConfig(config)
