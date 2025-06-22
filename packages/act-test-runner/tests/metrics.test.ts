import { describe, test, expect, beforeEach } from 'vitest'
import { createTestRunner } from '../src/core/runner.js'
import { MetricsPlugin } from '../src/plugins/metrics.js'

describe('Metrics Plugin', () => {
  let runner: ReturnType<typeof createTestRunner>
  let metricsPlugin: MetricsPlugin

  beforeEach(() => {
    runner = createTestRunner()
    metricsPlugin = new MetricsPlugin()
    document.body.innerHTML = ''
  })

  test('should track test statistics', async () => {
    metricsPlugin.install(runner)

    document.body.innerHTML = `
      <img src="test.jpg" alt="Test image">
      <button>Click me</button>
    `

    runner.describe('Metrics Test', () => {
      runner.test('should pass', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('img')
      }, 'img')

      runner.test('should also pass', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('button')
      }, 'button')
    })

    await runner.runTests()

    const data = metricsPlugin.getData()
    expect(data.total).toBe(2)
    expect(data.passed).toBe(2)
    expect(data.failed).toBe(0)
    expect(data.passRate).toBe(100)
    expect(data.duration).toBeGreaterThan(0)
  })

  test('should calculate pass rate correctly', async () => {
    metricsPlugin.install(runner)

    document.body.innerHTML = '<div>Test</div>'

    runner.describe('Pass Rate Test', () => {
      runner.test('should pass', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('div')
      }, 'div')

      runner.test('should fail', () => {
        expect(true).toBe(false)
      }, 'div')
    })

    await runner.runTests()

    const data = metricsPlugin.getData()
    expect(data.total).toBe(2)
    expect(data.passed).toBe(1)
    expect(data.failed).toBe(1)
    expect(data.passRate).toBe(50)
  })

  test('should reset metrics', () => {
    metricsPlugin.install(runner)

    // Manually set some data
    const initialData = metricsPlugin.getData()
    expect(initialData.total).toBe(0)

    metricsPlugin.reset()
    const resetData = metricsPlugin.getData()
    expect(resetData.total).toBe(0)
    expect(resetData.passed).toBe(0)
    expect(resetData.duration).toBe(0)
  })
})
