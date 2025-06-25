import { describe, test, expect, beforeEach } from 'vitest'
import { describe as apiDescribe, test as apiTest, run, clear } from '../src/index.js'

describe('API Layer', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    clear()   // Clear tests
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

  test('singleton API works without explicit configuration', async () => {
    document.body.innerHTML = '<div>test</div>'

    let executed = false
    apiDescribe('auto suite', () => {
      apiTest('auto test', () => { executed = true }, 'div')
    })

    await run()
    expect(executed).toBe(true)
  })

  test('clears tests', () => {
    apiDescribe('suite', () => {
      apiTest('test', () => {})
    })

    expect(() => clear()).not.toThrow()
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

  test('only methods work through singleton API', async () => {
    clear()

    document.body.innerHTML = '<div>test</div>'

    let normalRan = false
    let focusedRan = false

    // Use the singleton API methods
    apiDescribe('Normal Suite', () => {
      apiTest('normal test', () => {
        normalRan = true
      }, 'div')
    })

    apiDescribe.only('Focused Suite', () => {
      apiTest('focused test', () => {
        focusedRan = true
      }, 'div')
    })

    const results = await run()

    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('Focused Suite')
    expect(normalRan).toBe(false)
    expect(focusedRan).toBe(true)
  })
})
