/**
 * Simple Core Runner Tests - All Functionality
 */

import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/index'

describe('TestRunner', () => {
  let runner: ReturnType<typeof createRunner>

  beforeEach(() => {
    document.body.innerHTML = ''
    runner = createRunner()
  })

  test('runs basic test', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    runner.describe('suite', () => {
      runner.test('test', () => { executed = true }, 'div')
    })

    const results = await runner.run()

    expect(executed).toBe(true)
    expect(results[0]?.passed).toBe(1)
  })

  test('handles selectors', async () => {
    document.body.innerHTML = '<button>btn</button><div>div</div>'

    let count = 0
    runner.describe('suite', () => {
      runner.test('test', () => { count++ }, 'button')
    })

    await runner.run()
    expect(count).toBe(1) // Only button, not div
  })

  test('provides context', async () => {
    document.body.innerHTML = '<span id="test">content</span>'

    let element: any
    runner.describe('suite', () => {
      runner.test('test', (ctx) => { element = ctx.element }, 'span')
    })

    await runner.run()
    expect(element?.tagName).toBe('SPAN')
  })

  test('handles errors', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('test', () => { throw new Error('fail') }, 'div')
    })

    const results = await runner.run()
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

    const results = await runner.run()
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

    const results = await runner.run()
    expect(results[0]?.failed).toBe(1)
  })

  test('skips at runtime', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('skip test', (ctx) => { ctx.skip() }, 'div')
    })

    const results = await runner.run()
    expect(results[0]?.skipped).toBe(1)
    expect(results[0]?.tests[0]?.outcome).toBe('skip')
  })

  test('handles todo at runtime', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('suite', () => {
      runner.test('todo test', (ctx) => { ctx.todo('not done') }, 'div')
    })

    const results = await runner.run()
    expect(results[0]?.todo).toBe(1)
    expect(results[0]?.tests[0]?.outcome).toBe('todo')
  })

  test('runs multiple tests in suite', async () => {
    document.body.innerHTML = '<div>one</div><div>two</div>'

    let count = 0
    runner.describe('multi-test suite', () => {
      runner.test('test1', () => { count++ }, 'div')
      runner.test('test2', () => { count++ }, 'div')
    })

    const results = await runner.run()
    expect(count).toBe(4) // 2 tests × 2 elements each
    expect(results[0]?.passed).toBe(4)
  })

  test('handles no elements found', async () => {
    document.body.innerHTML = '<div>test</div>'

    runner.describe('no match suite', () => {
      runner.test('no match test', () => {}, 'button') // No buttons exist
    })

    const results = await runner.run()
    expect(results[0]?.skipped).toBe(1)
    expect(results[0]?.tests[0]?.outcome).toBe('skip')
    expect(results[0]?.tests[0]?.message).toContain('No elements found')
  })

  test('clears state correctly', async () => {
    document.body.innerHTML = '<div>test</div>'

    // First run
    runner.describe('suite1', () => {
      runner.test('test1', () => {}, 'div')
    })

    let results = await runner.run()
    expect(results).toHaveLength(1)

    // Clear and second run
    runner.clear()

    runner.describe('suite2', () => {
      runner.test('test2', () => {}, 'div')
    })

    results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('suite2')
  })
})
