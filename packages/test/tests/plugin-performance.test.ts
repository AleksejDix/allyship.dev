import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/core/runner.js'
import { PerformancePlugin } from '../src/plugins/performance.js'

describe('Performance Plugin', () => {
  let runner: ReturnType<typeof createRunner>
  let performancePlugin: PerformancePlugin

  beforeEach(() => {
    runner = createRunner()
    performancePlugin = new PerformancePlugin()
    document.body.innerHTML = ''
  })

  test('should install and track performance data', () => {
    performancePlugin.install(runner)

    expect(performancePlugin.name).toBe('performance')

    // Initially no data
    const data = performancePlugin.getData()
    expect(data).toBeNull()
  })

  test('should track test execution performance', async () => {
    performancePlugin.install(runner)

    document.body.innerHTML = `
      <div>Test 1</div>
      <div>Test 2</div>
      <div>Test 3</div>
      <div>Test 4</div>
      <div>Test 5</div>
    `

    runner.describe('Performance Test', () => {
      runner.test('should track timing', (ctx) => {
        // Simulate some work
        const start = performance.now()
        while (performance.now() - start < 1) {
          // Small delay to create measurable execution time
        }
        expect(ctx.element.tagName.toLowerCase()).toBe('div')
      }, 'div')
    })

    await runner.run()

    const data = performancePlugin.getData()
    expect(data).not.toBeNull()
    expect(data!.duration).toBeGreaterThan(0)
    expect(data!.elementsProcessed).toBe(5)
    expect(data!.testsRun).toBe(5)
    expect(data!.startTime).toBeGreaterThan(0)
    expect(data!.endTime).toBeGreaterThan(0)
  })

  test('should track memory usage when available', async () => {
    performancePlugin.install(runner)

    document.body.innerHTML = '<span>Memory test</span>'

    runner.describe('Memory Test', () => {
      runner.test('should track memory', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('span')
      }, 'span')
    })

    await runner.run()

    const data = performancePlugin.getData()
    expect(data).not.toBeNull()

    // Memory tracking is only available in Chrome/V8
    if ('memory' in performance) {
      expect(data!.memoryUsage).toBeDefined()
      expect(typeof data!.memoryUsage!.used).toBe('number')
      expect(typeof data!.memoryUsage!.total).toBe('number')
      expect(data!.memoryUsage!.used).toBeGreaterThan(0)
      expect(data!.memoryUsage!.total).toBeGreaterThan(0)
    }
  })

  test('should provide detailed metrics when enabled', async () => {
    const detailedPlugin = new PerformancePlugin({
      collectDetailedMetrics: true
    })
    detailedPlugin.install(runner)

    document.body.innerHTML = '<button>Test</button>'

    runner.describe('Detailed Metrics Test', () => {
      runner.test('should collect detailed metrics', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('button')
      }, 'button')
    })

    await runner.run()

    const detailedMetrics = detailedPlugin.getDetailedMetrics()
    expect(detailedMetrics).toBeDefined()
    expect(detailedMetrics instanceof Map).toBe(true)
  })

  test('should handle threshold configuration', () => {
    let thresholdExceeded = false
    const configuredPlugin = new PerformancePlugin({
      enabled: true,
      collectDetailedMetrics: true,
      thresholds: {
        maxExecutionTime: 1, // Very low threshold to trigger
        maxMemoryUsage: 1024,
        minTestsPerSecond: 1000000 // Very high threshold to trigger
      },
      onThresholdExceeded: (metric, value, threshold) => {
        thresholdExceeded = true
        expect(typeof metric).toBe('string')
        expect(typeof value).toBe('number')
        expect(typeof threshold).toBe('number')
      }
    })

    configuredPlugin.install(runner)
    expect(configuredPlugin.name).toBe('performance')
  })

  test('should reset performance data', () => {
    performancePlugin.install(runner)

    // Reset should not throw
    expect(() => {
      performancePlugin.reset()
    }).not.toThrow()

    // Data should be null after reset
    const data = performancePlugin.getData()
    expect(data).toBeNull()
  })

  test('should format memory correctly', () => {
    const formatted1 = performancePlugin.formatMemory(1024)
    expect(formatted1).toBe('1 KB')

    const formatted2 = performancePlugin.formatMemory(1024 * 1024)
    expect(formatted2).toBe('1 MB')

    const formatted3 = performancePlugin.formatMemory(500)
    expect(formatted3).toBe('500 B')
  })

  test('should format time correctly', () => {
    const formatted1 = performancePlugin.formatTime(500)
    expect(formatted1).toBe('500ms')

    const formatted2 = performancePlugin.formatTime(1500)
    expect(formatted2).toBe('1.5s')

    const formatted3 = performancePlugin.formatTime(100.567)
    expect(formatted3).toBe('100.57ms')
  })

  test('should be disabled when configured', async () => {
    const disabledPlugin = new PerformancePlugin({ enabled: false })
    disabledPlugin.install(runner)

    document.body.innerHTML = '<div>Test</div>'

    runner.describe('Disabled Test', () => {
      runner.test('should not track when disabled', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('div')
      }, 'div')
    })

    await runner.run()

    // Should not track anything when disabled
    const data = disabledPlugin.getData()
    expect(data).toBeNull()
  })
})
