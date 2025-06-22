import { describe, test, expect, beforeEach } from 'vitest'
import { configure, describe as apiDescribe, test as apiTest, runTests, clear, reset } from '../src/api'

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

    const results = await runTests()
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

    const results = await runTests()
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
})
