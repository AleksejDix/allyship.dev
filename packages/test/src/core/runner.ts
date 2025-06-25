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

  // Event emission
  function emit(type: TestEvent['type'], data: any): void {
    const event: TestEvent = {
      type,
      data,
      timestamp: performance.now()
    }

    for (const listener of state.listeners) {
      listener(event)
    }
  }

  // Create element info with size limits
  function createElementInfo(element: HTMLElement): ElementInfo | undefined {
    if (!state.config.storeElementInfo) {
      return undefined
    }

    const textContent = element.textContent || ''
    const outerHTML = element.outerHTML

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

  // Consolidated TestResult creation
  function createTestResult(
    suite: TestSuite,
    test: TestDefinition,
    element: HTMLElement,
    outcome: TestResult['outcome'],
    message: string,
    duration: number,
    error?: Error
  ): TestResult {
    const selector = generateSelector(element)
    return {
      id: `${suite.name}-${test.name}-${selector}`,
      name: test.name,
      outcome,
      message,
      duration,
      error,
      element: createElementInfo(element)
    }
  }

  // Consolidated context creation
  function createTestContext(element: HTMLElement, skipFn: () => void, todoFn: (reason?: string) => void): TestContext {
    return {
      element,
      selector: generateSelector(element),
      document: element.ownerDocument,
      skip: skipFn,
      todo: todoFn
    }
  }

  // Run a single test on an element
  async function runTest(
    test: TestDefinition,
    element: HTMLElement,
    suite: TestSuite
  ): Promise<TestResult> {
    const startTime = performance.now()

    // Early returns for skip/todo
    if (test.skip) {
      return createTestResult(suite, test, element, 'skip', 'Test skipped', 0)
    }

    if (test.todo) {
      const message = typeof test.todo === 'string' ? test.todo : 'Test not implemented'
      return createTestResult(suite, test, element, 'todo', message, 0)
    }

    let testResult: TestResult
    let afterEachError: Error | null = null

    try {
      let skipped = false
      let todoReason: string | undefined

      // Create test context
      const context = createTestContext(
        element,
        () => { skipped = true },
        (reason?: string) => { todoReason = reason }
      )

      // Run beforeEach if defined
      if (suite.beforeEach) {
        await suite.beforeEach(context)
      }

      // Run the test
      await test.fn(context)

      const duration = performance.now() - startTime

      // Handle runtime skip/todo/pass
      if (skipped) {
        testResult = createTestResult(suite, test, element, 'skip', 'Test skipped at runtime', duration)
      } else if (todoReason !== undefined) {
        testResult = createTestResult(suite, test, element, 'todo', todoReason || 'Test marked as todo', duration)
      } else {
        testResult = createTestResult(suite, test, element, 'pass', 'Test passed', duration)
      }

      // Run afterEach if defined
      if (suite.afterEach) {
        try {
          await suite.afterEach(context)
        } catch (error) {
          afterEachError = error instanceof Error ? error : new Error(String(error))
          emit('test-error', {
            error: afterEachError,
            suite: suite.name,
            test: test.name,
            phase: 'afterEach'
          })
        }
      }
    } catch (error) {
      const duration = performance.now() - startTime
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const isExpectationError = errorObj.name === 'ExpectationError'
      const message = isExpectationError ? errorObj.message : 'Test failed with unexpected error'

      testResult = createTestResult(suite, test, element, 'fail', message, duration, errorObj)

      // Still run afterEach even if test failed
      if (suite.afterEach) {
        try {
          const context = createTestContext(element, () => {}, () => {})
          await suite.afterEach(context)
        } catch (afterError) {
          afterEachError = afterError instanceof Error ? afterError : new Error(String(afterError))
          emit('test-error', {
            error: afterEachError,
            suite: suite.name,
            test: test.name,
            phase: 'afterEach'
          })
        }
      }
    }

    // If afterEach failed, override the test result
    if (afterEachError) {
      const duration = performance.now() - startTime
      testResult = createTestResult(suite, test, element, 'fail', `afterEach hook failed: ${afterEachError.message}`, duration, afterEachError)
    }

    return testResult
  }

  // Consolidated focus logic
  function updateFocusTracking(): void {
    state.hasFocused = state.suites.some(suite =>
      suite.only || suite.tests.some(test => test.only)
    )
  }

  function shouldRun(item: TestSuite | TestDefinition, suite?: TestSuite): boolean {
    if (!state.hasFocused) return true
    if ('tests' in item) return item.only || item.tests.some(test => test.only) // Suite
    return suite?.only || item.only || false // Test
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
                  if (!shouldRun(test, suite)) {
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

            emit('test-result', {
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

            // Emit test result event
            emit('test-result', {
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

  // Consolidated suite creation
  function createSuite(name: string, fn: () => void, selector?: string, only = false): void {
    const suite: TestSuite = { name, tests: [], selector, only: only || undefined }
    state.currentSuite = suite
    state.suites.push(suite)
    try {
      fn()
    } finally {
      state.currentSuite = null
    }
  }

  // Consolidated test creation
  function createTest(name: string, fn: TestFunction, selector?: string, only = false): void {
    if (!state.currentSuite) {
      throw new Error('test() must be called within a describe() block')
    }
    const test: TestDefinition = { name, fn, selector, only: only || undefined }
    state.currentSuite.tests.push(test)
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
    describe: (name: string, fn: () => void, selector?: string) => createSuite(name, fn, selector),
    'describe.only': (name: string, fn: () => void, selector?: string) => createSuite(name, fn, selector, true),
    test: (name: string, fn: TestFunction, selector?: string) => createTest(name, fn, selector),
    'test.only': (name: string, fn: TestFunction, selector?: string) => createTest(name, fn, selector, true),

    // Test execution
    async runTests(): Promise<SuiteResult[]> {
      // Update focus tracking before running tests
      updateFocusTracking()

      const results: SuiteResult[] = []

      emit('test-start', { suites: state.suites.length })

      try {
        for (const suite of state.suites) {
          if (shouldRun(suite)) {
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

    // Alias for runTests
    async run(): Promise<SuiteResult[]> {
      return this.runTests()
    },

    // Utility methods
    clear(): void {
      state.suites = []
      state.currentSuite = null
      state.hasFocused = false
    },

    dispose(): void {
      state.listeners = []
      state.suites = []
      state.currentSuite = null
    },

    // Watch mode
    async watch(config: WatchConfig = {}): Promise<Watcher> {
      const watchConfig = {
        debounce: 500,
        includeSelectors: [],
        excludeSelectors: ['.animation', '[data-animation]'],
        onResults: () => {},
        onError: (error: Error) => console.error('Watch mode error:', error),
        ...config
      }

      let isRunning = true
      let debounceTimer: number | null = null
      let domObserverCleanup: (() => void) | null = null

      // Run tests immediately
      try {
        const results = await this.runTests()
        watchConfig.onResults(results)
      } catch (error) {
        watchConfig.onError(error instanceof Error ? error : new Error(String(error)))
      }

      // Set up DOM monitoring (if available)
      if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined') {
        // Listen for DOM change events from AllyStudio
        const handleDOMChange = (event: any) => {
          if (!isRunning) return

          // Check if changes are relevant to our selectors
          const isRelevant = event.data?.elements?.some((element: any) => {
            const selector = element.selector || element.tagName

            // Check include list
            if (watchConfig.includeSelectors.length > 0) {
              const matches = watchConfig.includeSelectors.some(pattern =>
                selector.includes(pattern) || element.tagName === pattern.toUpperCase()
              )
              if (!matches) return false
            }

            // Check exclude list
            const excluded = watchConfig.excludeSelectors.some(pattern =>
              selector.includes(pattern) || element.tagName === pattern.toUpperCase()
            )
            if (excluded) return false

            return true
          })

          if (!isRelevant) return

          // Debounce test execution
          if (debounceTimer) {
            clearTimeout(debounceTimer)
          }

          debounceTimer = window.setTimeout(async () => {
            if (!isRunning) return

            try {
              const results = await this.runTests()
              watchConfig.onResults(results)
            } catch (error) {
              watchConfig.onError(error instanceof Error ? error : new Error(String(error)))
            }
          }, watchConfig.debounce)
        }

        // Listen for DOM change events
        window.addEventListener('message', (event) => {
          if (event.data?.type === 'DOM_CHANGE') {
            handleDOMChange(event.data)
          }
        })

        domObserverCleanup = () => {
          window.removeEventListener('message', handleDOMChange)
        }
      }

      return {
        stop(): void {
          isRunning = false
          if (debounceTimer) {
            clearTimeout(debounceTimer)
            debounceTimer = null
          }
          if (domObserverCleanup) {
            domObserverCleanup()
            domObserverCleanup = null
          }
        },
        isRunning(): boolean {
          return isRunning
        }
      }
    }
  }
}

// Backward compatibility

export interface WatchConfig {
  debounce?: number
  includeSelectors?: string[]
  excludeSelectors?: string[]
  onResults?: (results: SuiteResult[]) => void
  onError?: (error: Error) => void
}

export interface Watcher {
  stop(): void
  isRunning(): boolean
}

