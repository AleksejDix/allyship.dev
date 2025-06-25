/**
 * @allystudio/test - Minimal DOM element test runner
 */

import { createRunner } from './core/runner.js'
import { expect } from './core/expectation.js'
import type { TestFunction, SuiteResult } from './core/types.js'
import { ExpectationsPlugin } from './plugins/index.js'

/**
 * Default singleton instance
 */
const runner = createRunner()

// Install default plugins
const expectationsPlugin = new ExpectationsPlugin()
expectationsPlugin.install(runner)

// Create describe function with .only property
const describe = ((name: string, fn: () => void, selector?: string) => {
  runner.describe(name, fn, selector)
}) as typeof runner.describe & { only: typeof runner['describe.only'] }

describe.only = (name: string, fn: () => void, selector?: string) => {
  runner['describe.only'](name, fn, selector)
}

// Create test function with .only property
const test = ((name: string, fn: TestFunction, selector?: string) => {
  runner.test(name, fn, selector)
}) as typeof runner.test & { only: typeof runner['test.only'] }

test.only = (name: string, fn: TestFunction, selector?: string) => {
  runner['test.only'](name, fn, selector)
}

// Export singleton API (like Vitest)
export { describe, test }
export const run = runner.run.bind(runner)
export const watch = runner.watch.bind(runner)
export const clear = runner.clear.bind(runner)

// Re-exports
export { expect }
export type { TestFunction, SuiteResult }
export type { TestContext } from './core/types.js'
export type { WatchConfig, Watcher } from './core/runner.js'

// Advanced usage
export { createRunner } from './core/runner.js'
export * from './plugins/index.js'
