/**
 * Core types for the ACT test runner - Functional approach
 */

/**
 * Test context passed to test functions
 */
export type TestContext = {
  element: HTMLElement
  selector: string
  document: Document
  skip: () => void
  todo: (reason?: string) => void
}

/**
 * Test function signature
 */
export type TestFunction = (context: TestContext) => void | Promise<void>

/**
 * Test definition
 */
export type TestDefinition = {
  name: string
  fn: TestFunction
  selector?: string
  skip?: boolean
  todo?: boolean | string
  only?: boolean
  timeout?: number
  retry?: number
}

/**
 * Test suite definition
 */
export type TestSuite = {
  name: string
  tests: TestDefinition[]
  selector?: string
  beforeEach?: (context: TestContext) => void | Promise<void>
  afterEach?: (context: TestContext) => void | Promise<void>
  only?: boolean
  timeout?: number
  retry?: number
}

/**
 * Test result outcomes
 */
export type TestOutcome = "pass" | "fail" | "skip" | "todo" | "timeout"

/**
 * Element information
 */
export type ElementInfo = {
  selector: string
  tagName: string
  textContent: string
  outerHTML: string
}

/**
 * Test result
 */
export type TestResult = {
  id: string
  name: string
  outcome: TestOutcome
  message: string
  duration: number
  error?: Error
  element?: ElementInfo
  retries?: number
}

/**
 * Suite result
 */
export type SuiteResult = {
  name: string
  tests: TestResult[]
  duration: number
  passed: number
  failed: number
  skipped: number
  todo: number
  timeout: number
}

/**
 * Runner configuration - simplified to essential options only
 */
export type RunnerConfig = {
  // Core test execution (3 essential options)
  timeout?: number
  retry?: number
  bail?: boolean

  // Simple event callbacks (3 useful callbacks)
  onStart?: (suites: number) => void
  onComplete?: (results: SuiteResult[]) => void
  onError?: (error: Error) => void
}

/**
 * Composition-style plugin (Vue-inspired)
 */
export type Plugin = (runner: Runner) => void

/**
 * Runner interface for plugins
 */
export type Runner = {
  use: (plugin: Plugin) => Runner
  describe: (name: string, fn: () => void, selector?: string) => void
  "describe.only": (name: string, fn: () => void, selector?: string) => void
  test: (name: string, fn: TestFunction, selector?: string) => void
  "test.only": (name: string, fn: TestFunction, selector?: string) => void
  inspect: () => TestSuite[]
  run: () => Promise<SuiteResult[]>
  clear: () => void
  watch: (config?: WatchConfig) => Promise<Watcher>
}

/**
 * Test runner state (simplified)
 */
export type TestRunnerState = {
  suites: TestSuite[]
  currentSuite: TestSuite | null
  config: RunnerConfig
  hasFocused: boolean
}

/**
 * Watch configuration
 */
export type WatchConfig = {
  debounce?: number
  onResults?: (results: SuiteResult[]) => void
  onError?: (error: Error) => void
}

/**
 * Watcher interface
 */
export type Watcher = {
  trigger(): void
  stop(): void
  isRunning(): boolean
}

/**
 * Basic expectation type
 */
export type Expectation<T> = {
  toBe(expected: T): void
  not: {
    toBe(expected: T): void
  }
}
