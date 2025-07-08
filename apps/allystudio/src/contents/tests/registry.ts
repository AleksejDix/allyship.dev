import { clear, describe, inspect, run, test } from "@allystudio/test"

import { defineLanguageTests } from "./language"

/**
 * WCAG metadata for test results
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
 */
function registerTests() {
  // Clear any existing tests
  clear()

  // Register language tests
  defineLanguageTests({ describe, test })

  // Register button tests
  describe("Buttons", () => {
    test(
      "should have accessible name",
      ({ element }: any) => {
        const accessibleName =
          element.getAttribute("aria-label") ||
          element.getAttribute("aria-labelledby") ||
          element.textContent?.trim()

        if (!accessibleName) {
          throw new Error("Button must have an accessible name")
        }
      },
      "button"
    )
  })

  // Register ARIA tests
  describe("ARIA Roles", () => {
    test(
      "role attribute has valid value",
      ({ element }: any) => {
        const role = element.getAttribute("role")

        if (!role) {
          return // No role attribute is fine
        }

        const validRoles = [
          "alert",
          "alertdialog",
          "application",
          "article",
          "banner",
          "button",
          "cell",
          "checkbox",
          "columnheader",
          "combobox",
          "complementary",
          "contentinfo",
          "definition",
          "dialog",
          "directory",
          "document",
          "feed",
          "figure",
          "form",
          "grid",
          "gridcell",
          "group",
          "heading",
          "img",
          "link",
          "list",
          "listbox",
          "listitem",
          "log",
          "main",
          "marquee",
          "math",
          "menu",
          "menubar",
          "menuitem",
          "menuitemcheckbox",
          "menuitemradio",
          "navigation",
          "none",
          "note",
          "option",
          "presentation",
          "progressbar",
          "radio",
          "radiogroup",
          "region",
          "row",
          "rowgroup",
          "rowheader",
          "scrollbar",
          "search",
          "searchbox",
          "separator",
          "slider",
          "spinbutton",
          "status",
          "switch",
          "tab",
          "table",
          "tablist",
          "tabpanel",
          "term",
          "textbox",
          "timer",
          "toolbar",
          "tooltip",
          "tree",
          "treegrid",
          "treeitem"
        ]

        if (!validRoles.includes(role)) {
          throw new Error(`Invalid ARIA role: "${role}"`)
        }
      },
      "[role]"
    )
  })
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
