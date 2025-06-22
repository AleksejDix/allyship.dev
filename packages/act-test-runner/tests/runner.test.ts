/**
 * Simple Core Runner Tests - All Functionality
 */

import { describe, test, expect, beforeEach } from 'vitest'
import { createTestRunner } from '../src/index'

describe('TestRunner', () => {
  let runner: ReturnType<typeof createTestRunner>

  beforeEach(() => {
    document.body.innerHTML = ''
    runner = createTestRunner()
  })

  test('runs basic test', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    runner.describe('suite', () => {
      runner.test('test', () => { executed = true }, 'div')
    })

    const results = await runner.runTests()

    expect(executed).toBe(true)
    expect(results[0]?.passed).toBe(1)
  })

  test('handles selectors', async () => {
    document.body.innerHTML = '<button>btn</button><div>div</div>'

    let count = 0
    runner.describe('suite', () => {
      runner.test('test', () => { count++ }, 'button')
    })

    await runner.runTests()
    expect(count).toBe(1) // Only button, not div
  })

  test('provides context', async () => {
    document.body.innerHTML = '<span id="test">content</span>'

    let element: any
    runner.describe('suite', () => {
      runner.test('test', (ctx) => { element = ctx.element }, 'span')
    })

    await runner.runTests()
    expect(element?.tagName).toBe('SPAN')
  })

  test('handles errors', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('test', () => { throw new Error('fail') }, 'div')
    })

    const results = await runner.runTests()
    expect(results[0]?.failed).toBe(1)
  })

  test('supports async tests', async () => {
    document.body.innerHTML = '<div>test</div>'

    let asyncValue = ''
    runner.describe('suite', () => {
      runner.test('async test', async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        asyncValue = 'completed'
      }, 'div')
    })

    const results = await runner.runTests()
    expect(asyncValue).toBe('completed')
    expect(results[0]?.passed).toBe(1)
  })

  test('handles async errors', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('async error', async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
        throw new Error('async fail')
      }, 'div')
    })

    const results = await runner.runTests()
    expect(results[0]?.failed).toBe(1)
  })

  test('skips at runtime', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('skip test', (ctx) => { ctx.skip() }, 'div')
    })

    const results = await runner.runTests()
    expect(results[0]?.skipped).toBe(1)
    expect(results[0]?.tests[0]?.outcome).toBe('skip')
  })

  test('handles todo at runtime', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('todo test', (ctx) => { ctx.todo('not done') }, 'div')
    })

    const results = await runner.runTests()
    expect(results[0]?.todo).toBe(1)
    expect(results[0]?.tests[0]?.outcome).toBe('todo')
  })

  test('skips at definition time', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    runner.describe('suite', () => {
      runner.test('skip test', () => { executed = true }, 'div')
    })

    // Access suite after describe completes using new helper
    const suites = runner.getSuites()
    const suite = suites[suites.length - 1]
    if (suite && suite.tests.length > 0) {
      suite.tests[suite.tests.length - 1].skip = true
    }

    const results = await runner.runTests()
    expect(executed).toBe(false)
    expect(results[0]?.skipped).toBe(1)
  })

  test('handles todo at definition time', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    runner.describe('suite', () => {
      runner.test('todo test', () => { executed = true }, 'div')
    })

    // Access suite after describe completes using new helper
    const suites = runner.getSuites()
    const suite = suites[suites.length - 1]
    if (suite && suite.tests.length > 0) {
      suite.tests[suite.tests.length - 1].todo = 'not implemented'
    }

    const results = await runner.runTests()
    expect(executed).toBe(false)
    expect(results[0]?.todo).toBe(1)
  })

  test('runs beforeEach hooks', async () => {
    document.body.innerHTML = '<div>test</div>'

    let hookRan = false
    runner.describe('suite', () => {
      runner.setCurrentSuiteHooks({
        beforeEach: () => { hookRan = true }
      })

      runner.test('test', () => {}, 'div')
    })

    await runner.runTests()
    expect(hookRan).toBe(true)
  })

  test('runs afterEach hooks', async () => {
    document.body.innerHTML = '<div>test</div>'

    let hookRan = false
    runner.describe('suite', () => {
      runner.setCurrentSuiteHooks({
        afterEach: () => { hookRan = true }
      })

      runner.test('test', () => {}, 'div')
    })

    await runner.runTests()
    expect(hookRan).toBe(true)
  })

  test('handles hook errors', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.setCurrentSuiteHooks({
        beforeEach: () => { throw new Error('hook error') }
      })

      runner.test('test', () => {}, 'div')
    })

    const results = await runner.runTests()
    expect(results[0]?.failed).toBe(1)
  })

  test('emits events', async () => {
    document.body.innerHTML = '<div>test</div>'

    const events: string[] = []
    runner.on((event) => { events.push(event.type) })

    runner.describe('suite', () => {
      runner.test('test', () => {}, 'div')
    })

    await runner.runTests()
    expect(events).toContain('test-start')
  })

  test('clears state', () => {
    runner.describe('suite', () => {
      runner.test('test', () => {})
    })

    runner.clear()
    // Should not throw when adding new tests after clear
    runner.describe('new', () => {
      runner.test('new', () => {})
    })
  })
})
