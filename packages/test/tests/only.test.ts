import { describe, test, expect } from 'vitest'
import { createRunner } from '../src/core/runner'

describe('Focus Functionality', () => {
  test('should track focused suites correctly', () => {
    const runner = createRunner()

    // Add normal suite
    runner.describe('Normal Suite', () => {
      runner.test('normal test', () => {}, '*')
    })

    // Add focused suite
    runner['describe.only']('Focused Suite', () => {
      runner.test('focused test', () => {}, '*')
    })

    const state = runner.getState()

    // Check that focus tracking works
    expect(state.suites).toHaveLength(2)
    expect(state.suites.find(s => s.name === 'Focused Suite')?.only).toBe(true)
    expect(state.suites.find(s => s.name === 'Normal Suite')?.only).toBeUndefined()
    expect(state.hasFocused).toBe(false) // Not updated until run()
  })

  test('should track focused tests correctly', () => {
    const runner = createRunner()

    runner.describe('Suite with mixed tests', () => {
      runner.test('normal test', () => {}, '*')
      runner['test.only']('focused test', () => {}, '*')
    })

    const state = runner.getState()
    const suite = state.suites[0]

    expect(suite?.tests).toHaveLength(2)
    expect(suite?.tests.find(t => t.name === 'focused test')?.only).toBe(true)
    expect(suite?.tests.find(t => t.name === 'normal test')?.only).toBeUndefined()
  })

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
