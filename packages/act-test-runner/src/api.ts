/**
 * Main API facade for the ACT Test Runner
 * Provides a simple interface that combines core, plugins, and reporters
 */

import { createTestRunner } from './core/runner.js'
import { expect } from './core/expectation.js'
import type { TestFunction, RunnerConfig, SuiteResult } from './core/types.js'

// Reporters
import { ConsoleReporter, JsonReporter, MinimalReporter } from './reporters/index.js'
import type { Reporter, ReporterConfig } from './reporters/types.js'

// Plugins
import { PerformancePlugin, AllyStudioPlugin, ExpectationsPlugin } from './plugins/index.js'
import type { Plugin, AllyStudioData } from './plugins/types.js'

/**
 * Global test runner instance
 */
let globalRunner: ReturnType<typeof createTestRunner> | null = null

/**
 * Configuration for the test runner
 */
export interface ACTConfig extends RunnerConfig {
  reporter?: 'console' | 'json' | 'minimal' | Reporter
  reporterConfig?: ReporterConfig
  plugins?: Plugin[]
  performance?: boolean
  allyStudio?: AllyStudioData
}

/**
 * Initialize the test runner with configuration
 */
export function configure(config: ACTConfig = {}): ReturnType<typeof createTestRunner> {
  globalRunner = createTestRunner(config)

  // Setup reporter
  let reporter: Reporter
  if (typeof config.reporter === 'object') {
    reporter = config.reporter
  } else {
    switch (config.reporter) {
      case 'json':
        reporter = new JsonReporter(config.reporterConfig)
        break
      case 'minimal':
        reporter = new MinimalReporter()
        break
      case 'console':
      default:
        reporter = new ConsoleReporter(config.reporterConfig)
        break
    }
  }

  // Connect reporter to runner
  globalRunner.on(event => reporter.onEvent(event))
  globalRunner.on(event => {
    if (event.type === 'test-complete') {
      reporter.onComplete(event.data.results)
    }
  })

  // Install default plugins
  const expectationsPlugin = new ExpectationsPlugin()
  expectationsPlugin.install(globalRunner)

  // Install performance plugin if requested
  if (config.performance) {
    const performancePlugin = new PerformancePlugin()
    performancePlugin.install(globalRunner)
  }

  // Install AllyStudio plugin if configured
  if (config.allyStudio) {
    const allyStudioPlugin = new AllyStudioPlugin(config.allyStudio)
    allyStudioPlugin.install(globalRunner)
  }

  // Install custom plugins
  if (config.plugins) {
    for (const plugin of config.plugins) {
      plugin.install(globalRunner)
    }
  }

  return globalRunner
}

/**
 * Get the current test runner instance
 */
function getRunner(): ReturnType<typeof createTestRunner> {
  if (!globalRunner) {
    // Auto-configure with defaults
    configure()
  }
  return globalRunner!
}

/**
 * Define a test suite (Vitest-style API)
 */
export function describe(name: string, fn: () => void, selector?: string): void {
  getRunner().describe(name, fn, selector)
}

/**
 * Define a test (Vitest-style API)
 */
export function test(name: string, fn: TestFunction, selector?: string): void {
  getRunner().test(name, fn, selector)
}

/**
 * Run all registered tests
 */
export async function runTests(): Promise<SuiteResult[]> {
  return getRunner().runTests()
}

/**
 * Clear all registered tests
 */
export function clear(): void {
  if (globalRunner) {
    globalRunner.clear()
  }
}

/**
 * Reset the test runner (clear tests and configuration)
 */
export function reset(): void {
  // NEW: Properly cleanup before resetting
  if (globalRunner) {
    globalRunner.dispose()
  }
  globalRunner = null
}

/**
 * Get memory usage information - NEW: Monitor global runner memory
 */
export function getMemoryUsage(): {
  suites: number
  listeners: number
  tests: number
  hasGlobalRunner: boolean
} {
  if (!globalRunner) {
    return {
      suites: 0,
      listeners: 0,
      tests: 0,
      hasGlobalRunner: false
    }
  }

  return {
    ...globalRunner.getMemoryUsage(),
    hasGlobalRunner: true
  }
}

// Re-export core utilities
export { expect }
export type { TestFunction, SuiteResult, TestContext } from './core/types.js'

// Re-export for advanced usage
export { createTestRunner, TestRunner } from './core/runner.js'
export * from './reporters/index.js'
export * from './plugins/index.js'
