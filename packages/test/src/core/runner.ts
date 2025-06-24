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
export function createRunner(config: RunnerConfig = {}) {
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
    config: runnerConfig,
    hasFocused: false
  }

  // 🚀 MEMORY OPTIMIZATION: Reusable objects to reduce allocations
  const reusableEvent: TestEvent = {
    type: 'test-start',
    data: {},
    timestamp: 0
  } as TestEvent

  const reusableContext: TestContext = {
    element: null as any,
    selector: '',
    document: document,
    skip: (): void => {},
    todo: (reason?: string): void => {}
  }

  const reusableTestResult: TestResult = {
    id: '',
    name: '',
    outcome: 'pass',
    message: '',
    duration: 0,
    element: undefined
  }

  // 🚀 MEMORY OPTIMIZATION: Reusable emit function with object reuse
  function emit(type: TestEvent['type'], data: any): void {
    // Reuse the same event object instead of creating new ones
    reusableEvent.type = type
    reusableEvent.data = data
    reusableEvent.timestamp = performance.now()

    // Call listeners with the reused object
    for (let i = 0; i < state.listeners.length; i++) {
      const listener = state.listeners[i]
      if (listener) {
        listener(reusableEvent)
      }
    }
  }

  // 🚀 MEMORY OPTIMIZATION: Object pool for ElementInfo
  const elementInfoPool: ElementInfo[] = []
  let elementInfoPoolIndex = 0

  function getPooledElementInfo(): ElementInfo {
    if (elementInfoPoolIndex >= elementInfoPool.length) {
      elementInfoPool.push({
        selector: '',
        tagName: '',
        textContent: '',
        outerHTML: ''
      })
    }
    return elementInfoPool[elementInfoPoolIndex++]!
  }

  function resetElementInfoPool(): void {
    elementInfoPoolIndex = 0
  }

  // Create element info with memory limits and object reuse
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

    // 🚀 MEMORY OPTIMIZATION: Reuse pooled object
    const info = getPooledElementInfo()
    info.selector = generateSelector(element)
    info.tagName = element.tagName
    info.textContent = limitedTextContent + (textContent.length > limitedTextContent.length ? '...' : '')
    info.outerHTML = limitedOuterHTML + (outerHTML.length > limitedOuterHTML.length ? '...' : '')

    return info
  }

  // 🚀 MEMORY OPTIMIZATION: Cached selector generation
  const selectorCache = new Map<HTMLElement, string>()

  function getCachedSelector(element: HTMLElement): string {
    let selector = selectorCache.get(element)
    if (!selector) {
      selector = generateSelector(element)
      // Limit cache size to prevent memory leaks
      if (selectorCache.size > 1000) {
        selectorCache.clear()
      }
      selectorCache.set(element, selector)
    }
    return selector
  }

  // Run a single test on an element
  async function runTest(
    test: TestDefinition,
    element: HTMLElement,
    suite: TestSuite
  ): Promise<TestResult> {
    const startTime = performance.now()

    // 🚀 MEMORY OPTIMIZATION: Reuse cached selector
    const selector = getCachedSelector(element)
    const id = `${suite.name}-${test.name}-${selector}`

    // Check if test should be skipped
    if (test.skip) {
      // 🚀 MEMORY OPTIMIZATION: Reuse result object
      reusableTestResult.id = id
      reusableTestResult.name = test.name
      reusableTestResult.outcome = 'skip'
      reusableTestResult.message = 'Test skipped'
      reusableTestResult.duration = 0
      reusableTestResult.element = createElementInfo(element)
      reusableTestResult.error = undefined

      // Return a copy to avoid mutation
      return { ...reusableTestResult }
    }

    // Check if test is todo
    if (test.todo) {
      const message = typeof test.todo === 'string' ? test.todo : 'Test not implemented'

      reusableTestResult.id = id
      reusableTestResult.name = test.name
      reusableTestResult.outcome = 'todo'
      reusableTestResult.message = message
      reusableTestResult.duration = 0
      reusableTestResult.element = createElementInfo(element)
      reusableTestResult.error = undefined

      return { ...reusableTestResult }
    }

    try {
      let skipped = false
      let todoReason: string | undefined

      // 🚀 MEMORY OPTIMIZATION: Reuse context object
      reusableContext.element = element
      reusableContext.selector = selector
      reusableContext.document = element.ownerDocument
      reusableContext.skip = () => { skipped = true }
      reusableContext.todo = (reason?: string) => { todoReason = reason }

      // Run beforeEach if defined
      if (suite.beforeEach) {
        await suite.beforeEach(reusableContext)
      }

      // Run the test
      await test.fn(reusableContext)

      // Run afterEach if defined
      if (suite.afterEach) {
        await suite.afterEach(reusableContext)
      }

      const duration = performance.now() - startTime

      // Handle runtime skip/todo
      if (skipped) {
        reusableTestResult.id = id
        reusableTestResult.name = test.name
        reusableTestResult.outcome = 'skip'
        reusableTestResult.message = 'Test skipped at runtime'
        reusableTestResult.duration = duration
        reusableTestResult.element = createElementInfo(element)
        reusableTestResult.error = undefined

        return { ...reusableTestResult }
      }

      if (todoReason !== undefined) {
        reusableTestResult.id = id
        reusableTestResult.name = test.name
        reusableTestResult.outcome = 'todo'
        reusableTestResult.message = todoReason || 'Test marked as todo'
        reusableTestResult.duration = duration
        reusableTestResult.element = createElementInfo(element)
        reusableTestResult.error = undefined

        return { ...reusableTestResult }
      }

      reusableTestResult.id = id
      reusableTestResult.name = test.name
      reusableTestResult.outcome = 'pass'
      reusableTestResult.message = 'Test passed'
      reusableTestResult.duration = duration
      reusableTestResult.element = createElementInfo(element)
      reusableTestResult.error = undefined

      return { ...reusableTestResult }
    } catch (error) {
      const duration = performance.now() - startTime
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const isExpectationError = errorObj.name === 'ExpectationError'

      reusableTestResult.id = id
      reusableTestResult.name = test.name
      reusableTestResult.outcome = 'fail'
      reusableTestResult.message = isExpectationError ? errorObj.message : 'Test failed with unexpected error'
      reusableTestResult.duration = duration
      reusableTestResult.error = errorObj
      reusableTestResult.element = createElementInfo(element)

      return { ...reusableTestResult }
    }
  }

  // Focus tracking functions
  function updateFocusTracking(): void {
    state.hasFocused = state.suites.some(suite =>
      suite.only || suite.tests.some(test => test.only)
    )
  }

  function shouldRunSuite(suite: TestSuite): boolean {
    if (!state.hasFocused) return true
    return suite.only || suite.tests.some(test => test.only)
  }

  function shouldRunTest(test: TestDefinition, suite: TestSuite): boolean {
    if (!state.hasFocused) return true
    // Suite focus takes precedence
    if (suite.only) return true
    return test.only || false
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
        // Skip test if not focused
        if (!shouldRunTest(test, suite)) {
          continue
        }

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

          // 🚀 MEMORY OPTIMIZATION: Avoid Array.from() allocation
          // Run the test on each matching element
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
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

            // 🚀 MEMORY OPTIMIZATION: Reuse cached selector
            // Emit progress event
            emit('element-tested', {
              element: getCachedSelector(element),
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

    'describe.only'(name: string, fn: () => void, selector?: string): void {
      const suite: TestSuite = {
        name,
        tests: [],
        selector,
        only: true
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

    'test.only'(name: string, fn: TestFunction, selector?: string): void {
      if (!state.currentSuite) {
        throw new Error('test.only() must be called within a describe() block')
      }

      const test: TestDefinition = {
        name,
        fn,
        selector,
        only: true
      }

      state.currentSuite.tests.push(test)
    },

    // Test execution
    async runTests(): Promise<SuiteResult[]> {
      // Update focus tracking before running tests
      updateFocusTracking()

      const results: SuiteResult[] = []

      emit('test-start', { suites: state.suites.length })

      try {
        for (const suite of state.suites) {
          if (shouldRunSuite(suite)) {
            const result = await runSuite(suite)
            results.push(result)

            if (state.config.bail && result.failed > 0) {
              break
            }
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

    // Shorter alias for runTests
    async run(): Promise<SuiteResult[]> {
      return this.runTests()
    },

    // Utility methods
    clear(): void {
      state.suites = []
      state.currentSuite = null
      state.hasFocused = false

      // 🚀 MEMORY OPTIMIZATION: Reset pools and caches
      resetElementInfoPool()
      selectorCache.clear()
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
        config: { ...state.config },
        hasFocused: state.hasFocused
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

