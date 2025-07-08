/**
 * @allystudio/test - Minimal DOM element test runner
 */

import { expect } from "./core/expectation.js"
import { createRunner } from "./core/runner.js"
import type { SuiteResult, TestFunction } from "./core/types.js"
import { useExpectations } from "./plugins/index.js"

/**
 * Default singleton instance with composition-style plugins
 */
const runner = createRunner()

// Use composition-style plugins
runner.use(useExpectations)

// Create describe function with .only property
const describe = ((name: string, fn: () => void, selector?: string) => {
  runner.describe(name, fn, selector)
}) as typeof runner.describe & { only: (typeof runner)["describe.only"] }

describe.only = (name: string, fn: () => void, selector?: string) => {
  runner["describe.only"](name, fn, selector)
}

// Create test function with .only property
const test = ((name: string, fn: TestFunction, selector?: string) => {
  runner.test(name, fn, selector)
}) as typeof runner.test & { only: (typeof runner)["test.only"] }

test.only = (name: string, fn: TestFunction, selector?: string) => {
  runner["test.only"](name, fn, selector)
}

// Simplified API - direct function calls instead of method binding
export { describe, test }

export async function run(): Promise<SuiteResult[]> {
  return runner.run()
}

export function inspect(): import("./core/types.js").TestSuite[] {
  return runner.inspect()
}

export async function watch(
  config?: import("./core/types.js").WatchConfig
): Promise<import("./core/types.js").Watcher> {
  return runner.watch(config)
}

export function clear(): void {
  return runner.clear()
}

// Re-exports
export { expect }
export type { TestFunction, SuiteResult }
export type { TestContext, WatchConfig, Watcher } from "./core/types.js"

// Advanced usage
export { createRunner } from "./core/runner.js"
export * from "./plugins/index.js"

// Timeout utilities
export { withTimeout, TimeoutError } from "./utils/timeout.js"

// Retry utilities
export { withRetry } from "./utils/retry.js"
