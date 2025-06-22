import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './demo/tests',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run demo',
    port: 3001,
    reuseExistingServer: true
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    }
  ]
})
