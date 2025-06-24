/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Browser mode for DOM testing
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true
    },

    // Global test configuration
    globals: true,
    setupFiles: ['./tests/test-setup.ts'],

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'benchmarks/',
        'demo/',
        'examples/',
        '**/*.d.ts',
        '**/*.config.*',
        'tests/test-setup.ts'
      ],
      thresholds: {
        global: {
          branches: 90,
          functions: 90,
          lines: 90,
          statements: 90
        }
      }
    },

    // Performance testing timeouts
    testTimeout: 30000,
    hookTimeout: 10000,

  },

  server: {
    port: 3001
  },

  optimizeDeps: {
    exclude: ['fsevents']
  }
})
