import { clear, describe, inspect, run, test } from "@allystudio/test"

import { defineACTRule_97a4e1 } from "./act-97a4e1"
import { defineACTRule_674b10 } from "./act-674b10"
import { defineACTRule_bf051a } from "./act-bf051a"

/**
 * WCAG metadata for test results - organized by ACT rules
 */
const WCAG_METADATA = {
  "should have valid language tag": {
    wcagLevel: "A",
    guideline: "3.1.1 Language of Page",
    impact: "serious",
    actRule: "bf051a"
  },
  "should have accessible name": {
    wcagLevel: "A",
    guideline: "4.1.2 Name, Role, Value",
    impact: "serious",
    actRule: "97a4e1"
  },
  "role attribute has valid value": {
    wcagLevel: "A",
    guideline: "4.1.2 Name, Role, Value",
    impact: "serious",
    actRule: "674b10"
  }
} as const

/**
 * Enhanced test result with additional metadata and control capabilities
 */
export type EnhancedTestResult = {
  id: string
  name: string
  status: "pending" | "running" | "pass" | "fail" | "skip" | "todo"
  message?: string
  canToggle: boolean
  isSkipped: boolean
  isTodo: boolean | string
  isOnly: boolean
  // WCAG metadata
  wcagLevel?: string
  guideline?: string
  impact?: string
  actRule?: string
  // Add selector for highlighting
  selector?: string
}

/**
 * Enhanced test suite with additional metadata and control capabilities
 */
export type EnhancedTestSuite = {
  id: string
  name: string
  status: "pending" | "running" | "pass" | "fail" | "skip" | "todo"
  tests: EnhancedTestResult[]
  canToggle: boolean
  isOnly: boolean
}

/**
 * Register all tests with the test runner
 * Each ACT rule is defined in its own file
 */
function registerTests() {
  // Clear any existing tests
  clear()

  // Register ACT rules - each in its own file
  defineACTRule_bf051a({ describe, test }) // Language of Page
  defineACTRule_97a4e1({ describe, test }) // Button has accessible name
  defineACTRule_674b10({ describe, test }) // Role attribute has valid value
}

/**
 * Get all test suites with enhanced metadata and control capabilities
 */
export async function getTestSuites(): Promise<EnhancedTestSuite[]> {
  try {
    // Register tests first
    registerTests()

    // Get test structure using inspect()
    const testSuites = inspect()

    // Convert to enhanced format
    const enhancedSuites: EnhancedTestSuite[] = testSuites.map(
      (suite: any) => ({
        id: suite.name.toLowerCase().replace(/\s+/g, "-"),
        name: suite.name,
        status: "pending",
        tests: suite.tests.map((test: any) => ({
          id: test.name.toLowerCase().replace(/\s+/g, "-"),
          name: test.name,
          status: "pending",
          canToggle: false,
          isSkipped: false,
          isTodo: false,
          isOnly: false,
          // Add WCAG metadata if available
          ...(WCAG_METADATA[test.name as keyof typeof WCAG_METADATA] || {})
        })),
        canToggle: false,
        isOnly: false
      })
    )

    return enhancedSuites
  } catch (error) {
    console.error("Failed to get test suites:", error)
    return []
  }
}

/**
 * Run a specific test suite and return enhanced results
 */
export async function runTestSuite(
  suiteId: string
): Promise<EnhancedTestResult[]> {
  try {
    // Register tests to ensure they're available
    registerTests()

    // Run tests and get results
    const suiteResults = await run()

    // Find the matching suite result
    const matchingSuiteResult = suiteResults.find(
      (suiteResult: any) =>
        suiteResult.name.toLowerCase().replace(/\s+/g, "-") === suiteId
    )

    if (!matchingSuiteResult) {
      throw new Error(`Test suite not found: ${suiteId}`)
    }

    // Process test results from the suite
    const enhancedResults: EnhancedTestResult[] = matchingSuiteResult.tests.map(
      (testResult: any) => {
        return {
          id: testResult.name.toLowerCase().replace(/\s+/g, "-"),
          name: testResult.name,
          status:
            testResult.outcome === "pass"
              ? "pass"
              : testResult.outcome === "fail"
                ? "fail"
                : "pending",
          message: testResult.message,
          canToggle: false,
          isSkipped: false,
          isTodo: false,
          isOnly: false,
          // Add WCAG metadata if available
          ...(WCAG_METADATA[testResult.name as keyof typeof WCAG_METADATA] ||
            {}),
          // Add selector for highlighting
          selector: getTestSelector(testResult.name)
        }
      }
    )

    return enhancedResults
  } catch (error) {
    console.error(`Failed to run test suite ${suiteId}:`, error)
    return []
  }
}

/**
 * Get the appropriate selector for a test based on its name
 */
function getTestSelector(testName: string): string {
  if (testName.includes("language")) {
    return "html"
  } else if (testName.includes("button")) {
    return "button"
  } else if (testName.includes("role")) {
    return "[role]"
  }
  return "html" // fallback
}
