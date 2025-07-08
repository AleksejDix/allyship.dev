import { describe, test, expect, beforeEach, vi } from 'vitest'
import { createRunner } from '../src/core/runner.js'
import { useMetrics } from '../src/plugins/use-metrics.js'

describe('useMetrics Plugin', () => {
  let runner: ReturnType<typeof createRunner>
  let consoleSpy: any

  beforeEach(() => {
    runner = createRunner()
    document.body.innerHTML = ''
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  test('should provide metrics logging', async () => {
    runner.use(useMetrics)

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

    await runner.run()

    // Check that metrics were logged
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Test Metrics:')
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('• Tests: 2')
    )
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('• Duration:')
    )
  })

  test('should track elements during test execution', async () => {
    runner.use(useMetrics)

    document.body.innerHTML = '<div>Test</div><span>Another</span>'

    runner.describe('Element Tracking', () => {
      runner.test('should track div', () => {}, 'div')
    }, 'div')

    await runner.run()

    // Check that element counting was included in metrics
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('• Elements:')
    )
  })

  test('should calculate average time per test', async () => {
    runner.use(useMetrics)

    document.body.innerHTML = '<div>Test</div>'

    runner.describe('Average Test', () => {
      runner.test('test 1', () => {}, 'div')
      runner.test('test 2', () => {}, 'div')
    })

    await runner.run()

    // Check that average per test was calculated
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('• Avg per test:')
    )
  })

  test('should work with composition chaining', async () => {
    document.body.innerHTML = '<div>Test</div>'

    // Test chaining with useMetrics
    const result = runner.use(useMetrics)
    expect(result).toBe(runner) // Should return runner for chaining

    runner.describe('Chain Test', () => {
      runner.test('should work', () => {}, 'div')
    })

    await runner.run()

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('📊 Test Metrics:')
    )
  })
})
