import { describe, test, expect, beforeEach } from 'vitest'
import { configure, describe as apiDescribe, test as apiTest, run, clear, reset, stream } from '../src/api.js'

describe('API Layer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    reset() // Clear any existing configuration
  })

  test('configures with defaults', () => {
    const runner = configure()
    expect(runner).toBeDefined()
  })

  test('configures with console reporter', () => {
    const runner = configure({ reporter: 'console' })
    expect(runner).toBeDefined()
  })

  test('configures with json reporter', () => {
    const runner = configure({ reporter: 'json' })
    expect(runner).toBeDefined()
  })

  test('configures with minimal reporter', () => {
    const runner = configure({ reporter: 'minimal' })
    expect(runner).toBeDefined()
  })

  test('configures with performance plugin', () => {
    const runner = configure({ performance: true })
    expect(runner).toBeDefined()
  })

  test('configures with custom plugins', () => {
    const mockPlugin = {
      name: 'test-plugin',
      install: () => {}
    }
    const runner = configure({ plugins: [mockPlugin] })
    expect(runner).toBeDefined()
  })

  test('global describe and test work', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    apiDescribe('global suite', () => {
      apiTest('global test', () => { executed = true }, 'div')
    })

    const results = await run()
    expect(executed).toBe(true)
    expect(results[0]?.passed).toBe(1)
  })

  test('auto-configures when not configured', async () => {
    document.body.innerHTML = '<div>test</div>'

    // Don't call configure() - should auto-configure
    let executed = false
    apiDescribe('auto suite', () => {
      apiTest('auto test', () => { executed = true }, 'div')
    })

    const results = await run()
    expect(executed).toBe(true)
  })

  test('clears tests', () => {
    apiDescribe('suite', () => {
      apiTest('test', () => {})
    })

    expect(() => clear()).not.toThrow()
  })

  test('resets configuration', () => {
    configure({ performance: true })
    expect(() => reset()).not.toThrow()
  })

  test('handles errors', async () => {
    clear()

    document.body.innerHTML = '<div>test</div>'

    apiDescribe('Error Suite', () => {
      apiTest('error test', () => { throw new Error('test error') }, 'div')
    })

    const results = await run()

    expect(results).toHaveLength(1)
    expect(results[0]?.failed).toBe(1)
  })

  test('only methods work through API', async () => {
    // Import the API functions
    const { describe, test } = await import('../src/api.js')

    // Reset any existing configuration
    const { reset } = await import('../src/api.js')
    reset()

    document.body.innerHTML = '<div>test</div>'

    let normalRan = false
    let focusedRan = false

    // Use the API methods
    describe('Normal Suite', () => {
      test('normal test', () => {
        normalRan = true
      }, 'div')
    })

    describe.only('Focused Suite', () => {
      test('focused test', () => {
        focusedRan = true
      }, 'div')
    })

    const { run } = await import('../src/api.js')
    const results = await run()

    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('Focused Suite')
    expect(normalRan).toBe(false)
    expect(focusedRan).toBe(true)
  })

      test('stream API works', async () => {
    clear()

    document.body.innerHTML = '<div>test</div>'

    apiDescribe('Stream Suite', () => {
      apiTest('stream test', () => {}, 'div')
    })

    const events: any[] = []

    // Collect events from stream
    for await (const event of stream()) {
      events.push(event)
    }

    expect(events.length).toBeGreaterThan(0)
    expect(events.some(e => e.type === 'test-complete')).toBe(true)
  })
})
