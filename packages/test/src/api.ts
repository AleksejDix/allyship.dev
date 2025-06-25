/**
 * Main API facade for the test runner
 * Provides a simple interface that combines core, plugins, and reporters
 */

import { createRunner } from './core/runner.js'
import { expect } from './core/expectation.js'
import type { TestFunction, RunnerConfig, SuiteResult } from './core/types.js'

// Reporters
import { ConsoleReporter, JsonReporter, MinimalReporter } from './reporters/index.js'
import type { Reporter, ReporterConfig } from './reporters/types.js'

// Plugins
import { PerformancePlugin, ExpectationsPlugin } from './plugins/index.js'
import type { Plugin } from './plugins/types.js'

/**
 * Global test runner instance
 */
let globalRunner: ReturnType<typeof createRunner> | null = null

/**
 * Configuration for the test runner
 */
export interface TestConfig extends RunnerConfig {
  reporter?: 'console' | 'json' | 'minimal' | Reporter
  reporterConfig?: ReporterConfig
  plugins?: Plugin[]
  performance?: boolean
}

/**
 * Initialize the test runner with configuration
 */
export function configure(config: TestConfig = {}): ReturnType<typeof createRunner> {
  globalRunner = createRunner(config)

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
function getRunner(): ReturnType<typeof createRunner> {
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
 * Define a focused test suite - only focused suites/tests will run
 */
describe.only = function(name: string, fn: () => void, selector?: string): void {
  getRunner()['describe.only'](name, fn, selector)
}

/**
 * Define a test (Vitest-style API)
 */
export function test(name: string, fn: TestFunction, selector?: string): void {
  getRunner().test(name, fn, selector)
}

/**
 * Define a focused test - only focused suites/tests will run
 */
test.only = function(name: string, fn: TestFunction, selector?: string): void {
  getRunner()['test.only'](name, fn, selector)
}

/**
 * Run all registered tests
 */
export async function run(): Promise<SuiteResult[]> {
  return getRunner().runTests()
}

/**
 * Stream test execution events in real-time
 */
export async function* stream(): AsyncGenerator<any, void, unknown> {
  const runner = getRunner()
  const events: any[] = []
  let isComplete = false

  // Create event listener
  const listener = (event: any) => {
    events.push(event)
    if (event.type === 'test-complete') {
      isComplete = true
    }
  }

  // Add listener BEFORE starting tests
  runner.on(listener)

  try {
    // Start test execution (don't await yet)
    const resultsPromise = runner.runTests()

    // Yield events as they come
    let eventIndex = 0

    while (!isComplete || eventIndex < events.length) {
      // Yield any new events
      if (eventIndex < events.length) {
        yield events[eventIndex]
        eventIndex++
      } else {
        // Small delay to prevent busy waiting
        await new Promise(resolve => setTimeout(resolve, 1))
      }
    }

    // Wait for final results
    await resultsPromise
  } finally {
    // Clean up listener
    runner.off(listener)
  }
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
export { createRunner } from './core/runner.js'
export * from './reporters/index.js'
export * from './plugins/index.js'
