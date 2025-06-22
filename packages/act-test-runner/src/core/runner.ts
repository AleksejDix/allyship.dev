import type {
  TestSuite,
  TestDefinition,
  TestResult,
  SuiteResult,
  TestContext,
  TestEvent,
  RunnerConfig,
  TestFunction,
  ElementInfo,
  EventListener,
  TestRunnerState
} from './types.js'
import { ExpectationError } from './expectation.js'
import { generateSelector } from './selector.js'

/**
 * Creates a test runner using functional approach with closures
 */
export function createTestRunner(config: RunnerConfig = {}) {
  // Configuration with defaults
  const runnerConfig: RunnerConfig = {
    timeout: 5000,
    bail: false,
    maxTextContentLength: 1000,
    maxOuterHTMLLength: 5000,
    storeElementInfo: true,
    ...config
  }

  // Private state
  let state: TestRunnerState = {
    suites: [],
    currentSuite: null,
    listeners: [],
    config: runnerConfig
  }

  // Emit event to all listeners
  function emit(type: TestEvent['type'], data: any): void {
    const event: TestEvent = {
      type,
      data,
      timestamp: performance.now()
    } as TestEvent

    state.listeners.forEach(listener => listener(event))
  }

  // Create element info with memory limits
  function createElementInfo(element: HTMLElement): ElementInfo | undefined {
    if (!state.config.storeElementInfo) {
      return undefined
    }

    const textContent = element.textContent || ''
    const outerHTML = element.outerHTML

    // Apply size limits to prevent memory issues
    const limitedTextContent = state.config.maxTextContentLength
      ? textContent.substring(0, state.config.maxTextContentLength)
      : textContent

    const limitedOuterHTML = state.config.maxOuterHTMLLength
      ? outerHTML.substring(0, state.config.maxOuterHTMLLength)
      : outerHTML

    return {
      selector: generateSelector(element),
      tagName: element.tagName,
      textContent: limitedTextContent + (textContent.length > limitedTextContent.length ? '...' : ''),
      outerHTML: limitedOuterHTML + (outerHTML.length > limitedOuterHTML.length ? '...' : '')
    }
  }

  // Run a single test on an element
  async function runTest(
    test: TestDefinition,
    element: HTMLElement,
    suite: TestSuite
  ): Promise<TestResult> {
    const startTime = performance.now()
    const id = `${suite.name}-${test.name}-${generateSelector(element)}`

    // Check if test should be skipped
    if (test.skip) {
      return {
        id,
        name: test.name,
        outcome: 'skip',
        message: 'Test skipped',
        duration: 0,
        element: createElementInfo(element)
      }
    }

    // Check if test is todo
    if (test.todo) {
      const message = typeof test.todo === 'string' ? test.todo : 'Test not implemented'
      return {
        id,
        name: test.name,
        outcome: 'todo',
        message,
        duration: 0,
        element: createElementInfo(element)
      }
    }

    try {
      let skipped = false
      let todoReason: string | undefined

      const context: TestContext = {
        element,
        selector: generateSelector(element),
        document: element.ownerDocument,
        skip: () => { skipped = true },
        todo: (reason?: string) => { todoReason = reason }
      }

      // Run beforeEach if defined
      if (suite.beforeEach) {
        await suite.beforeEach(context)
      }

      // Run the test
      await test.fn(context)

      // Run afterEach if defined
      if (suite.afterEach) {
        await suite.afterEach(context)
      }

      const duration = performance.now() - startTime

      // Handle runtime skip/todo
      if (skipped) {
        return {
          id,
          name: test.name,
          outcome: 'skip',
          message: 'Test skipped at runtime',
          duration,
          element: createElementInfo(element)
        }
      }

      if (todoReason !== undefined) {
        return {
          id,
          name: test.name,
          outcome: 'todo',
          message: todoReason || 'Test marked as todo',
          duration,
          element: createElementInfo(element)
        }
      }

      return {
        id,
        name: test.name,
        outcome: 'pass',
        message: 'Test passed',
        duration,
        element: createElementInfo(element)
      }
    } catch (error) {
      const duration = performance.now() - startTime
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const isExpectationError = errorObj.name === 'ExpectationError'

      return {
        id,
        name: test.name,
        outcome: 'fail',
        message: isExpectationError ? errorObj.message : 'Test failed with unexpected error',
        duration,
        error: errorObj,
        element: createElementInfo(element)
      }
    }
  }

  // Run all tests in a suite
  async function runSuite(suite: TestSuite): Promise<SuiteResult> {
    const startTime = performance.now()
    const suiteResult: SuiteResult = {
      name: suite.name,
      tests: [],
      duration: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      todo: 0
    }

    try {
      emit('test-progress', {
        suite: suite.name,
        tests: suite.tests.length
      })

      // Run each test with its own selector
      for (const test of suite.tests) {
        try {
          // Determine the selector for this test
          const testSelector = test.selector || suite.selector || 'body'
          const elements = document.querySelectorAll(testSelector)

          // If no elements found, skip the test
          if (elements.length === 0) {
            const skipResult: TestResult = {
              id: `${suite.name}-${test.name}-no-elements`,
              name: test.name,
              outcome: 'skip',
              message: `No elements found for selector "${testSelector}"`,
              duration: 0,
              element: undefined
            }

            suiteResult.tests.push(skipResult)
            suiteResult.skipped++

            emit('element-tested', {
              element: testSelector,
              test: test.name,
              result: 'skip'
            })

            continue
          }

          // Run the test on each matching element
          for (const element of Array.from(elements)) {
            if (!(element instanceof HTMLElement)) continue

            const result = await runTest(test, element, suite)
            suiteResult.tests.push(result)

            // Update counters
            switch (result.outcome) {
              case 'pass': suiteResult.passed++; break
              case 'fail': suiteResult.failed++; break
              case 'skip': suiteResult.skipped++; break
              case 'todo': suiteResult.todo++; break
            }

            // Emit progress event
            emit('element-tested', {
              element: generateSelector(element),
              test: test.name,
              result: result.outcome
            })

            // Bail on first failure if configured
            if (state.config.bail && result.outcome === 'fail') {
              suiteResult.duration = performance.now() - startTime
              return suiteResult
            }
          }
        } catch (error) {
          const errorObj = error instanceof Error ? error : new Error(String(error))
          emit('test-error', {
            error: errorObj,
            suite: suite.name,
            test: test.name
          })

          const failedResult: TestResult = {
            id: `${suite.name}-${test.name}-error`,
            name: test.name,
            outcome: 'fail',
            message: 'Test runner error',
            duration: 0,
            error: errorObj,
            element: undefined
          }

          suiteResult.tests.push(failedResult)
          suiteResult.failed++

          if (state.config.bail) {
            suiteResult.duration = performance.now() - startTime
            return suiteResult
          }
        }
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      emit('test-error', { error: errorObj, suite: suite.name })
      throw errorObj
    }

    suiteResult.duration = performance.now() - startTime
    return suiteResult
  }

  // Public API
  return {
    // Event handling
    on(listener: EventListener): void {
      state.listeners.push(listener)
    },

    off(listener: EventListener): void {
      const index = state.listeners.indexOf(listener)
      if (index > -1) {
        state.listeners.splice(index, 1)
      }
    },

    removeAllListeners(): void {
      state.listeners = []
    },

    // Test definition
    describe(name: string, fn: () => void, selector?: string): void {
      const suite: TestSuite = {
        name,
        tests: [],
        selector
      }

      // Set as current suite
      state.currentSuite = suite
      state.suites.push(suite)

      // Execute the describe block to collect tests
      try {
        fn()
      } finally {
        // Reset current suite
        state.currentSuite = null
      }
    },

    test(name: string, fn: TestFunction, selector?: string): void {
      if (!state.currentSuite) {
        throw new Error('test() must be called within a describe() block')
      }

      const test: TestDefinition = {
        name,
        fn,
        selector
      }

      state.currentSuite.tests.push(test)
    },

    // Test execution
    async runTests(): Promise<SuiteResult[]> {
      const results: SuiteResult[] = []

      emit('test-start', { suites: state.suites.length })

      try {
        for (const suite of state.suites) {
          const result = await runSuite(suite)
          results.push(result)

          if (state.config.bail && result.failed > 0) {
            break
          }
        }

        emit('test-complete', { results })
        return results
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error))
        emit('test-error', { error: errorObj })
        throw errorObj
      }
    },

    // Utility methods
    clear(): void {
      state.suites = []
      state.currentSuite = null
    },

    dispose(): void {
      state.listeners = []
      state.suites = []
      state.currentSuite = null
    },

    // Memory monitoring
    getMemoryUsage(): {
      suites: number
      listeners: number
      tests: number
    } {
      const totalTests = state.suites.reduce((acc, suite) => acc + suite.tests.length, 0)

      return {
        suites: state.suites.length,
        listeners: state.listeners.length,
        tests: totalTests
      }
    },

    // State access for testing
    getState(): TestRunnerState {
      return {
        suites: [...state.suites],
        currentSuite: state.currentSuite ? { ...state.currentSuite } : null,
        listeners: [...state.listeners],
        config: { ...state.config }
      }
    },

    // Helper methods for testing
    getCurrentSuite(): TestSuite | null {
      return state.currentSuite
    },

    getSuites(): TestSuite[] {
      return [...state.suites]
    },

    setCurrentSuiteHooks(hooks: {
      beforeEach?: (context: TestContext) => void | Promise<void>
      afterEach?: (context: TestContext) => void | Promise<void>
    }): void {
      if (state.currentSuite) {
        if (hooks.beforeEach) state.currentSuite.beforeEach = hooks.beforeEach
        if (hooks.afterEach) state.currentSuite.afterEach = hooks.afterEach
      }
    }
  }
}

// Backward compatibility
export const TestRunner = createTestRunner
