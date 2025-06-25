import { describe, test, expect } from 'vitest'
import { createRunner } from '../src/core/runner'

describe('Focus Functionality', () => {
  test('should only run focused suites and tests', async () => {
    const runner = createRunner()
    document.body.innerHTML = '<div>test</div>'

    let normalSuiteRan = false
    let focusedSuiteRan = false
    let normalTestRan = false
    let focusedTestRan = false

    // Normal suite (should not run)
    runner.describe('Normal Suite', () => {
      runner.test('normal test', () => {
        normalSuiteRan = true
        normalTestRan = true
      }, 'div')
    })

    // Focused suite (should run)
    runner['describe.only']('Focused Suite', () => {
      runner.test('focused test', () => {
        focusedSuiteRan = true
        focusedTestRan = true
      }, 'div')
    })

    const results = await runner.run()

    expect(results).toHaveLength(1)
    expect(results[0]?.name).toBe('Focused Suite')
    expect(results[0]?.passed).toBe(1)
    expect(normalSuiteRan).toBe(false)
    expect(focusedSuiteRan).toBe(true)
    expect(normalTestRan).toBe(false)
    expect(focusedTestRan).toBe(true)
  })

  test('should only run focused tests within a suite', async () => {
    const runner = createRunner()
    document.body.innerHTML = '<div>test</div>'

    let normalTestRan = false
    let focusedTestRan = false

    runner.describe('Mixed Suite', () => {
      runner.test('normal test', () => {
        normalTestRan = true
      }, 'div')

      runner['test.only']('focused test', () => {
        focusedTestRan = true
      }, 'div')
    })

    const results = await runner.run()

    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(1)
    expect(results[0]?.tests[0]?.name).toBe('focused test')
    expect(normalTestRan).toBe(false)
    expect(focusedTestRan).toBe(true)
  })

  test('API methods should exist', () => {
    const runner = createRunner()

    // Check that the methods exist
    expect(typeof runner['describe.only']).toBe('function')
    expect(typeof runner['test.only']).toBe('function')
  })
})
