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
}

/**
 * Test result outcomes
 */
export type TestOutcome = 'pass' | 'fail' | 'skip' | 'todo'

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
}

/**
 * Runner configuration
 */
export type RunnerConfig = {
  timeout?: number
  bail?: boolean
  maxTextContentLength?: number // Limit text content storage
  maxOuterHTMLLength?: number   // Limit HTML storage
  storeElementInfo?: boolean    // Option to disable element storage
}

/**
 * Test events
 */
export type TestEvent =
  | { type: 'test-start'; data: { suites: number }; timestamp: number }
  | { type: 'test-progress'; data: { suite: string; tests: number; elements?: number }; timestamp: number }
  | { type: 'test-result'; data: { element: string; test: string; result: TestOutcome }; timestamp: number }
  | { type: 'test-complete'; data: { results: SuiteResult[] }; timestamp: number }
  | { type: 'test-error'; data: { error: Error; suite?: string; test?: string }; timestamp: number }

/**
 * Basic expectation type
 */
export type Expectation<T> = {
  toBe(expected: T): void
  not: {
    toBe(expected: T): void
  }
}

/**
 * Event listener function
 */
export type EventListener = (event: TestEvent) => void

/**
 * Test runner state
 */
export type TestRunnerState = {
  suites: TestSuite[]
  currentSuite: TestSuite | null
  listeners: EventListener[]
  config: RunnerConfig
  hasFocused: boolean
}
