import { generateSelector } from "@allystudio/accessibility-utils"

import { withRetry } from "../utils/retry.js"
import { TimeoutError, withTimeout } from "../utils/timeout.js"
import type {
  ElementInfo,
  Plugin,
  Runner,
  RunnerConfig,
  SuiteResult,
  TestContext,
  TestDefinition,
  TestFunction,
  TestResult,
  TestRunnerState,
  TestSuite,
  WatchConfig,
  Watcher,
} from "./types.js"

/**
 * Creates a test runner using functional approach with closures
 */
export function createRunner(config: RunnerConfig = {}): Runner {
  // Configuration with defaults - simplified to essentials only
  const runnerConfig: RunnerConfig = {
    timeout: 5000,
    retry: 0,
    bail: false,
    ...config,
  }

  // Private state (removed listeners from state)
  let state: TestRunnerState = {
    suites: [],
    currentSuite: null,
    config: runnerConfig,
    hasFocused: false,
  }

  // Simple callback emission instead of complex event system
  function emitStart(suites: number): void {
    state.config.onStart?.(suites)
  }

  function emitComplete(results: SuiteResult[]): void {
    state.config.onComplete?.(results)
  }

  function emitError(error: Error): void {
    state.config.onError?.(error)
  }

  // Create element info - simplified without size limits
  function createElementInfo(element: HTMLElement): ElementInfo {
    return {
      selector: generateSelector(element),
      tagName: element.tagName,
      textContent: element.textContent || "",
      outerHTML: element.outerHTML,
    }
  }

  // Generic configuration resolution (test > suite > global > default)
  function getEffectiveConfig<T>(
    testValue: T | undefined,
    suiteValue: T | undefined,
    globalValue: T | undefined,
    defaultValue: T
  ): T {
    return testValue ?? suiteValue ?? globalValue ?? defaultValue
  }

  // Specific configuration getters using the generic function
  function getEffectiveTimeout(test: TestDefinition, suite: TestSuite): number {
    return getEffectiveConfig(
      test.timeout,
      suite.timeout,
      state.config.timeout,
      5000
    )
  }

  function getEffectiveRetry(test: TestDefinition, suite: TestSuite): number {
    return getEffectiveConfig(test.retry, suite.retry, state.config.retry, 0)
  }

  // Lifecycle hook execution with error handling
  async function executeLifecycleHook(
    hook: ((context: TestContext) => void | Promise<void>) | undefined,
    context: TestContext,
    _hookName: string,
    _testName: string,
    _suiteName: string
  ): Promise<Error | null> {
    if (!hook) return null

    try {
      await hook(context)
      return null
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      emitError(errorObj)
      return errorObj
    }
  }

  // Enhanced result creation with better message handling
  function createTestResult(
    suite: TestSuite,
    test: TestDefinition,
    element: HTMLElement,
    outcome: TestResult["outcome"],
    message: string,
    duration: number,
    error?: Error,
    retries?: number
  ): TestResult {
    return {
      id: `${suite.name}-${test.name}-${generateSelector(element)}`,
      name: test.name,
      outcome,
      message,
      duration,
      error,
      element: createElementInfo(element),
      retries,
    }
  }

  // Error message generation with retry information
  function createErrorMessage(
    baseMessage: string,
    attempts: number,
    maxRetries: number
  ): string {
    return maxRetries > 0
      ? `${baseMessage} (failed after ${attempts} attempts)`
      : baseMessage
  }

  // Success message generation with retry information
  function createSuccessMessage(attempts: number): string {
    return attempts > 1
      ? `Test passed after ${attempts} attempts`
      : "Test passed"
  }

  // Consolidated context creation
  function createTestContext(
    element: HTMLElement,
    skipFn: () => void,
    todoFn: (reason?: string) => void
  ): TestContext {
    return {
      element,
      selector: generateSelector(element),
      document: element.ownerDocument,
      skip: skipFn,
      todo: todoFn,
    }
  }

  // Execute the core test logic with timeout and hooks
  async function executeTestCore(
    test: TestDefinition,
    context: TestContext,
    suite: TestSuite,
    timeout: number
  ): Promise<{ skipped: boolean; todoReason: string | undefined }> {
    let skipped = false
    let todoReason: string | undefined

    // Update context callbacks for this execution
    context.skip = () => {
      skipped = true
    }
    context.todo = (reason?: string) => {
      todoReason = reason
    }

    await withTimeout(
      async () => {
        // Execute beforeEach hook
        const beforeEachError = await executeLifecycleHook(
          suite.beforeEach,
          context,
          "beforeEach",
          test.name,
          suite.name
        )
        if (beforeEachError) throw beforeEachError

        // Execute the test
        await test.fn(context)
      },
      timeout,
      test.name
    )

    return { skipped, todoReason }
  }

  // Create final test result based on execution outcome
  function createFinalResult(
    suite: TestSuite,
    test: TestDefinition,
    element: HTMLElement,
    duration: number,
    attempts: number,
    maxRetries: number,
    outcome: { skipped: boolean; todoReason: string | undefined },
    error?: Error
  ): TestResult {
    const retryInfo = attempts > 1 ? attempts - 1 : undefined

    if (error) {
      // Error result
      if (error instanceof TimeoutError) {
        return createTestResult(
          suite,
          test,
          element,
          "timeout",
          createErrorMessage(error.message, attempts, maxRetries),
          duration,
          error,
          retryInfo
        )
      } else {
        const isExpectationError = error.name === "ExpectationError"
        const baseMessage = isExpectationError
          ? error.message
          : "Test failed with unexpected error"
        return createTestResult(
          suite,
          test,
          element,
          "fail",
          createErrorMessage(baseMessage, attempts, maxRetries),
          duration,
          error,
          retryInfo
        )
      }
    }

    // Success results
    if (outcome.skipped) {
      return createTestResult(
        suite,
        test,
        element,
        "skip",
        "Test skipped at runtime",
        duration,
        undefined,
        retryInfo
      )
    } else if (outcome.todoReason !== undefined) {
      return createTestResult(
        suite,
        test,
        element,
        "todo",
        outcome.todoReason || "Test marked as todo",
        duration,
        undefined,
        retryInfo
      )
    } else {
      return createTestResult(
        suite,
        test,
        element,
        "pass",
        createSuccessMessage(attempts),
        duration,
        undefined,
        retryInfo
      )
    }
  }

  // Simplified and consolidated runTest function
  async function runTest(
    test: TestDefinition,
    element: HTMLElement,
    suite: TestSuite
  ): Promise<TestResult> {
    const startTime = performance.now()
    const timeout = getEffectiveTimeout(test, suite)
    const maxRetries = getEffectiveRetry(test, suite)

    // Early returns for skip/todo
    if (test.skip) {
      return createTestResult(suite, test, element, "skip", "Test skipped", 0)
    }

    if (test.todo) {
      const message =
        typeof test.todo === "string" ? test.todo : "Test not implemented"
      return createTestResult(suite, test, element, "todo", message, 0)
    }

    // Create test context
    const context = createTestContext(
      element,
      () => {},
      () => {}
    )

    try {
      // Execute test with retry logic
      const { result, attempts } = await withRetry(
        async () => {
          return await executeTestCore(test, context, suite, timeout)
        },
        maxRetries,
        test.name
      )

      const duration = performance.now() - startTime

      // Create final result
      let testResult = createFinalResult(
        suite,
        test,
        element,
        duration,
        attempts,
        maxRetries,
        result
      )

      // Execute afterEach hook
      const afterEachError = await executeLifecycleHook(
        suite.afterEach,
        context,
        "afterEach",
        test.name,
        suite.name
      )

      // Override result if afterEach failed
      if (afterEachError) {
        const retryInfo = maxRetries > 0 ? maxRetries : undefined
        testResult = createTestResult(
          suite,
          test,
          element,
          "fail",
          `afterEach hook failed: ${afterEachError.message}`,
          duration,
          afterEachError,
          retryInfo
        )
      }

      return testResult
    } catch (error) {
      const duration = performance.now() - startTime
      const errorObj = error instanceof Error ? error : new Error(String(error))
      const attempts = maxRetries + 1

      return createFinalResult(
        suite,
        test,
        element,
        duration,
        attempts,
        maxRetries,
        { skipped: false, todoReason: undefined },
        errorObj
      )
    }
  }

  // Consolidated focus logic
  function updateFocusTracking(): void {
    state.hasFocused = state.suites.some(
      (suite) => suite.only || suite.tests.some((test) => test.only)
    )
  }

  function shouldRun(
    item: TestSuite | TestDefinition,
    suite?: TestSuite
  ): boolean {
    if (!state.hasFocused) return true
    if ("tests" in item)
      return item.only || item.tests.some((test) => test.only) // Suite
    return suite?.only || item.only || false // Test
  }

  // Run all tests in a suite
  async function runSuite(suite: TestSuite): Promise<SuiteResult> {
    const startTime = performance.now()
    const suiteResult = createEmptySuiteResult(suite.name)

    try {
      emitStart(state.suites.length)

      // Run each test with its own selector
      for (const test of suite.tests) {
        // Skip test if not focused
        if (!shouldRun(test, suite)) {
          continue
        }

        try {
          // Determine the selector for this test
          const testSelector = test.selector || suite.selector || "body"
          const elements = document.querySelectorAll(testSelector)

          // If no elements found, create skip result
          if (elements.length === 0) {
            const skipResult: TestResult = {
              id: `${suite.name}-${test.name}-no-elements`,
              name: test.name,
              outcome: "skip",
              message: `No elements found for selector "${testSelector}"`,
              duration: 0,
              element: undefined,
            }

            suiteResult.tests.push(skipResult)
            updateSuiteCounters(suiteResult, "skip")

            continue
          }

          // Run the test on each matching element
          for (let i = 0; i < elements.length; i++) {
            const element = elements[i]
            if (!(element instanceof HTMLElement)) continue

            const result = await runTest(test, element, suite)
            suiteResult.tests.push(result)
            updateSuiteCounters(suiteResult, result.outcome)

            // Bail on first failure or timeout if configured
            if (shouldBailOnResult(result.outcome)) {
              suiteResult.duration = performance.now() - startTime
              return suiteResult
            }
          }
        } catch (error) {
          const errorObj =
            error instanceof Error ? error : new Error(String(error))
          emitError(errorObj)

          const failedResult: TestResult = {
            id: `${suite.name}-${test.name}-error`,
            name: test.name,
            outcome: "fail",
            message: "Test runner error",
            duration: 0,
            error: errorObj,
            element: undefined,
          }

          suiteResult.tests.push(failedResult)
          updateSuiteCounters(suiteResult, "fail")

          if (shouldBailOnResult("fail")) {
            suiteResult.duration = performance.now() - startTime
            return suiteResult
          }
        }
      }
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error))
      emitError(errorObj)
      throw errorObj
    }

    suiteResult.duration = performance.now() - startTime
    return suiteResult
  }

  // Simplified suite creation
  function createSuite(
    name: string,
    fn: () => void,
    selector?: string,
    only = false
  ): void {
    const suite: TestSuite = {
      name,
      tests: [],
      selector,
      only: only || undefined,
    }
    state.currentSuite = suite
    state.suites.push(suite)
    try {
      fn()
    } finally {
      state.currentSuite = null
    }
  }

  // Simplified test creation
  function createTest(
    name: string,
    fn: TestFunction,
    selector?: string,
    only = false
  ): void {
    if (!state.currentSuite) {
      throw new Error("test() must be called within a describe() block")
    }
    const test: TestDefinition = { name, fn, selector, only: only || undefined }
    state.currentSuite.tests.push(test)
  }

  // Suite result management utilities
  function createEmptySuiteResult(suiteName: string): SuiteResult {
    return {
      name: suiteName,
      tests: [],
      duration: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      todo: 0,
      timeout: 0,
    }
  }

  function updateSuiteCounters(
    suiteResult: SuiteResult,
    outcome: TestResult["outcome"]
  ): void {
    switch (outcome) {
      case "pass":
        suiteResult.passed++
        break
      case "fail":
        suiteResult.failed++
        break
      case "skip":
        suiteResult.skipped++
        break
      case "todo":
        suiteResult.todo++
        break
      case "timeout":
        suiteResult.timeout++
        break
    }
  }

  function shouldBailOnResult(outcome: TestResult["outcome"]): boolean {
    return !!(
      state.config.bail &&
      (outcome === "fail" || outcome === "timeout")
    )
  }

  // Public API
  return {
    // Vue Composition-style plugin system
    use(plugin: Plugin): Runner {
      plugin(this as Runner)
      return this as Runner
    },

    // Test definition
    describe: (name: string, fn: () => void, selector?: string) =>
      createSuite(name, fn, selector),
    "describe.only": (name: string, fn: () => void, selector?: string) =>
      createSuite(name, fn, selector, true),
    test: (name: string, fn: TestFunction, selector?: string) =>
      createTest(name, fn, selector),
    "test.only": (name: string, fn: TestFunction, selector?: string) =>
      createTest(name, fn, selector, true),

    // Test inspection - get structure without running
    inspect(): TestSuite[] {
      return state.suites.map((suite) => ({
        name: suite.name,
        tests: suite.tests.map((test) => ({
          name: test.name,
          fn: test.fn,
          selector: test.selector,
          skip: test.skip,
          todo: test.todo,
          only: test.only,
          timeout: test.timeout,
          retry: test.retry,
        })),
        selector: suite.selector,
        beforeEach: suite.beforeEach,
        afterEach: suite.afterEach,
        only: suite.only,
        timeout: suite.timeout,
        retry: suite.retry,
      }))
    },

    // Test execution - single method only
    async run(): Promise<SuiteResult[]> {
      // Update focus tracking before running tests
      updateFocusTracking()

      const results: SuiteResult[] = []

      emitStart(state.suites.length)

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

        emitComplete(results)
        return results
      } catch (error) {
        const errorObj =
          error instanceof Error ? error : new Error(String(error))
        emitError(errorObj)
        throw errorObj
      }
    },

    // Utility methods - single method only
    clear(): void {
      state.suites = []
      state.currentSuite = null
      state.hasFocused = false
    },

    // Watch mode with signal-based architecture
    async watch(config: WatchConfig = {}): Promise<Watcher> {
      const watchConfig = {
        debounce: 500,
        onResults: () => {},
        onError: (error: Error) => console.error("Watch mode error:", error),
        ...config,
      }

      let isRunning = true
      let debounceTimer: number | null = null

      // Run tests immediately
      try {
        const results = await this.run()
        watchConfig.onResults(results)
      } catch (error) {
        watchConfig.onError(
          error instanceof Error ? error : new Error(String(error))
        )
      }

      // Debounced test runner
      const scheduleRun = () => {
        if (!isRunning) return

        if (debounceTimer) {
          clearTimeout(debounceTimer)
        }

        debounceTimer = window.setTimeout(async () => {
          if (!isRunning) return

          try {
            const results = await this.run()
            watchConfig.onResults(results)
          } catch (error) {
            watchConfig.onError(
              error instanceof Error ? error : new Error(String(error))
            )
          }
        }, watchConfig.debounce)
      }

      return {
        // Signal the watcher to rerun tests
        trigger: scheduleRun,

        stop(): void {
          isRunning = false
          if (debounceTimer) {
            clearTimeout(debounceTimer)
            debounceTimer = null
          }
        },

        isRunning(): boolean {
          return isRunning
        },
      }
    },
  }
}
