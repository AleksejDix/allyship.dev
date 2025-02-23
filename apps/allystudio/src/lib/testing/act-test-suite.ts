export interface TestResult {
  passed: boolean
  message: string
}

type TestEvaluator = (
  element: HTMLElement,
  signal: AbortSignal
) => TestResult | Promise<TestResult>

export interface ACTTest {
  name: string
  evaluate: TestEvaluator
  meta?: {
    description?: string
    severity?: "Critical" | "High" | "Medium" | "Low"
  }
}

export interface ACTSuite {
  name: string
  applicability: string
  testCases: {
    id: string
    name: string
    evaluate: TestEvaluator
    meta?: {
      description?: string
      severity?: "Critical" | "High" | "Medium" | "Low"
    }
  }[]
}

type TestContext = {
  currentSuite: ACTSuite | null
  currentTestId: number
}

const context: TestContext = {
  currentSuite: null,
  currentTestId: 0
}

export function suite(
  name: string,
  applicability: string,
  fn: () => void
): ACTSuite {
  const previousSuite = context.currentSuite
  context.currentSuite = {
    name,
    applicability,
    testCases: []
  }

  fn() // Run the test definitions

  const suite = context.currentSuite
  context.currentSuite = previousSuite
  return suite
}

export function describe(name: string, fn: () => void) {
  if (!context.currentSuite) {
    throw new Error("describe must be called within a suite")
  }

  // Save current name to prefix test names
  const previousName = context.currentSuite.name
  context.currentSuite.name = name

  fn() // Run the test definitions

  // Restore previous name
  context.currentSuite.name = previousName
}

export function test(
  name: string,
  evaluate: TestEvaluator,
  meta?: {
    description?: string
    severity?: "Critical" | "High" | "Medium" | "Low"
  }
) {
  if (!context.currentSuite) {
    throw new Error("test must be called within a suite")
  }

  context.currentTestId++
  context.currentSuite.testCases.push({
    id: `test-${context.currentTestId}`,
    name,
    evaluate: async (element: HTMLElement, signal: AbortSignal) => {
      if (!signal) {
        throw new Error("Test execution was cancelled")
      }
      return evaluate(element, signal)
    },
    meta
  })
}
