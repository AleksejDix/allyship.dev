import type { Runner, SuiteResult } from "../core/types.js"

interface PerformanceMetrics {
  testCount: number
  totalDuration: number
  averageDuration: number
  slowestTest: { name: string; duration: number } | null
  fastestTest: { name: string; duration: number } | null
  memoryUsage?: number
  domQueryCount?: number
}

/**
 * Performance monitoring plugin
 * Usage: runner.use(usePerformanceMonitor({ threshold: 1000 }))
 */
export function usePerformanceMonitor(
  options: {
    threshold?: number
    logSlow?: boolean
    trackMemory?: boolean
    trackDOMQueries?: boolean
  } = {}
) {
  const config = {
    threshold: 500, // ms
    logSlow: true,
    trackMemory: true,
    trackDOMQueries: true,
    ...options,
  }

  return function (runner: Runner): void {
    let metrics: PerformanceMetrics = {
      testCount: 0,
      totalDuration: 0,
      averageDuration: 0,
      slowestTest: null,
      fastestTest: null,
    }

    let domQueryCount = 0
    const originalQuerySelector = document.querySelector
    const originalQuerySelectorAll = document.querySelectorAll

    // Track DOM queries if enabled
    if (config.trackDOMQueries) {
      document.querySelector = function (selector: string) {
        domQueryCount++
        return originalQuerySelector.call(this, selector)
      }

      document.querySelectorAll = function (selector: string) {
        domQueryCount++
        return originalQuerySelectorAll.call(this, selector)
      }
    }

    // Hook into the run method to collect metrics
    const originalRun = runner.run
    runner.run = async function (): Promise<SuiteResult[]> {
      const startTime = performance.now()
      const startMemory = config.trackMemory ? getMemoryUsage() : undefined

      // Reset metrics
      metrics = {
        testCount: 0,
        totalDuration: 0,
        averageDuration: 0,
        slowestTest: null,
        fastestTest: null,
      }
      domQueryCount = 0

      const results = await originalRun.call(this)

      const endTime = performance.now()
      const endMemory = config.trackMemory ? getMemoryUsage() : undefined

      // Calculate metrics
      for (const suiteResult of results) {
        for (const testResult of suiteResult.tests) {
          metrics.testCount++
          metrics.totalDuration += testResult.duration

          // Track slowest test
          if (
            !metrics.slowestTest ||
            testResult.duration > metrics.slowestTest.duration
          ) {
            metrics.slowestTest = {
              name: testResult.name,
              duration: testResult.duration,
            }
          }

          // Track fastest test
          if (
            !metrics.fastestTest ||
            testResult.duration < metrics.fastestTest.duration
          ) {
            metrics.fastestTest = {
              name: testResult.name,
              duration: testResult.duration,
            }
          }

          // Log slow tests
          if (config.logSlow && testResult.duration > config.threshold) {
            console.warn(
              `🐌 Slow test: "${testResult.name}" took ${testResult.duration}ms`
            )
          }
        }
      }

      metrics.averageDuration =
        metrics.testCount > 0 ? metrics.totalDuration / metrics.testCount : 0

      if (config.trackMemory && startMemory && endMemory) {
        metrics.memoryUsage = endMemory - startMemory
      }

      if (config.trackDOMQueries) {
        metrics.domQueryCount = domQueryCount
      }

      // Log performance summary
      console.group("🔍 Performance Metrics")
      console.log(`Tests: ${metrics.testCount}`)
      console.log(`Total Duration: ${metrics.totalDuration.toFixed(2)}ms`)
      console.log(`Average Duration: ${metrics.averageDuration.toFixed(2)}ms`)

      if (metrics.slowestTest) {
        console.log(
          `Slowest Test: "${metrics.slowestTest.name}" (${metrics.slowestTest.duration}ms)`
        )
      }

      if (metrics.fastestTest) {
        console.log(
          `Fastest Test: "${metrics.fastestTest.name}" (${metrics.fastestTest.duration}ms)`
        )
      }

      if (metrics.memoryUsage !== undefined) {
        console.log(
          `Memory Usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
        )
      }

      if (metrics.domQueryCount !== undefined) {
        console.log(`DOM Queries: ${metrics.domQueryCount}`)
      }

      console.groupEnd()

      return results
    }

    // Add helper methods to the runner
    ;(runner as any).getPerformanceMetrics = () => metrics
    ;(runner as any).resetPerformanceMetrics = () => {
      metrics = {
        testCount: 0,
        totalDuration: 0,
        averageDuration: 0,
        slowestTest: null,
        fastestTest: null,
      }
      domQueryCount = 0
    }

    // Cleanup function
    ;(runner as any).cleanup = () => {
      if (config.trackDOMQueries) {
        document.querySelector = originalQuerySelector
        document.querySelectorAll = originalQuerySelectorAll
      }
    }
  }
}

/**
 * Get memory usage if available
 */
function getMemoryUsage(): number {
  if ("memory" in performance) {
    return (performance as any).memory.usedJSHeapSize
  }
  return 0
}
