import type { Runner, SuiteResult } from '../core/types.js'

/**
 * Vue Composition-style plugin for performance metrics
 * Usage: runner.use(useMetrics)
 */
export function useMetrics(runner: Runner): void {
  let startTime = 0
  let elementCount = 0

  // Track performance when tests start
  const originalRun = runner.run
  runner.run = async function(): Promise<SuiteResult[]> {
    startTime = performance.now()
    elementCount = 0

    const results = await originalRun.call(this)

    // Log metrics
    const duration = performance.now() - startTime
    const testCount = results.reduce((sum, suite) => sum + suite.tests.length, 0)

    console.log(`📊 Test Metrics:
  • Duration: ${duration.toFixed(2)}ms
  • Tests: ${testCount}
  • Elements: ${elementCount}
  • Avg per test: ${(duration / testCount).toFixed(2)}ms`)

    return results
  }

  // Count elements during test execution
  const originalDescribe = runner.describe
  runner.describe = function(name: string, fn: () => void, selector?: string): void {
    if (selector) {
      elementCount += document.querySelectorAll(selector).length
    }
    return originalDescribe.call(this, name, fn, selector)
  }
}
