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
  console.log("[registry] Registering tests...")

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

  console.log("[registry] Tests registered successfully")
}

/**
 * Get all test suites with enhanced metadata and control capabilities
 */
export async function getTestSuites(): Promise<EnhancedTestSuite[]> {
  try {
    console.log("[registry] Getting enhanced test suites...")

    // Register tests first
    registerTests()

    // Get test structure using inspect()
    const testSuites = inspect()
    console.log("[registry] Raw inspect result:", testSuites)

    // Convert to enhanced format
    const enhancedSuites: EnhancedTestSuite[] = testSuites.map((suite) => ({
      id: suite.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      name: suite.name,
      status: "pending" as const,
      canToggle: true,
      isOnly: suite.only || false,
      tests: suite.tests.map((test: any) => ({
        id: test.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        name: test.name,
        status: "pending" as const,
        message: undefined,
        canToggle: true,
        isSkipped: test.skip || false,
        isTodo: test.todo || false,
        isOnly: test.only || false,
        // Add WCAG metadata
        wcagLevel:
          WCAG_METADATA[test.name as keyof typeof WCAG_METADATA]?.wcagLevel,
        guideline:
          WCAG_METADATA[test.name as keyof typeof WCAG_METADATA]?.guideline,
        impact: WCAG_METADATA[test.name as keyof typeof WCAG_METADATA]?.impact,
        actRule: WCAG_METADATA[test.name as keyof typeof WCAG_METADATA]?.actRule
      }))
    }))

    console.log("[registry] Enhanced test suites:", enhancedSuites)
    return enhancedSuites
  } catch (error) {
    console.error("[registry] Error getting test suites:", error)
    return []
  }
}

/**
 * Run a specific test suite
 */
export async function runTestSuite(
  suiteId: string
): Promise<EnhancedTestResult[]> {
  console.log(`[registry] Running test suite: ${suiteId}`)

  try {
    // Register tests first to ensure they're available
    registerTests()

    const results: any[] = await run()
    console.log(`[registry] Raw results for ${suiteId}:`, results)

    // Debug: Log all available suite names and their generated IDs
    console.log(`[registry] Available suites:`)
    results.forEach((suite) => {
      const generatedId = suite.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
      console.log(`  - "${suite.name}" -> ID: "${generatedId}"`)
    })

    const targetSuite = results.find(
      (suite) =>
        suite.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "") === suiteId
    )

    if (!targetSuite) {
      throw new Error(`Test suite not found: ${suiteId}`)
    }

    return targetSuite.tests.map((testResult: any) => {
      console.log(`[registry] Processing test result:`, testResult)

      // Extract the actual error message from the test result
      let message = testResult.message || ""

      // If there's an error object, extract the message
      if (testResult.error) {
        if (typeof testResult.error === "string") {
          message = testResult.error
        } else if (testResult.error.message) {
          message = testResult.error.message
        } else {
          message = String(testResult.error)
        }
      }

      // Add element information to the error message for better debugging
      if (testResult.outcome === "fail" && testResult.element) {
        const element = testResult.element
        const elementInfo: string[] = []

        // Add tag name
        if (element.tagName) {
          elementInfo.push(`<${element.tagName.toLowerCase()}>`)
        }

        // Add ID if present
        if (element.id) {
          elementInfo.push(`#${element.id}`)
        }

        // Add classes if present
        if (element.className && typeof element.className === "string") {
          const classes = element.className
            .split(" ")
            .filter((c: string) => c.trim())
          if (classes.length > 0) {
            elementInfo.push(
              `.${classes.slice(0, 2).join(".")}${classes.length > 2 ? "..." : ""}`
            )
          }
        }

        // Add text content if present and short enough
        if (element.textContent && element.textContent.trim()) {
          const text = element.textContent.trim()
          if (text.length <= 30) {
            elementInfo.push(`"${text}"`)
          } else {
            elementInfo.push(`"${text.substring(0, 27)}..."`)
          }
        }

        // Add attributes that might be relevant
        if (element.getAttribute) {
          const role = element.getAttribute("role")
          const ariaLabel = element.getAttribute("aria-label")
          const lang = element.getAttribute("lang")

          if (role) elementInfo.push(`[role="${role}"]`)
          if (ariaLabel) elementInfo.push(`[aria-label="${ariaLabel}"]`)
          if (lang) elementInfo.push(`[lang="${lang}"]`)
        }

        // Prepend element info to the message
        if (elementInfo.length > 0) {
          message = `${elementInfo.join(" ")}: ${message}`
        }
      }

      return {
        id: testResult.id || testResult.name,
        name: testResult.name,
        status:
          testResult.outcome === "pass"
            ? "pass"
            : testResult.outcome === "fail"
              ? "fail"
              : "skip",
        message: message,
        canToggle: true,
        isSkipped: false,
        isTodo: false,
        isOnly: false,
        // Add WCAG metadata
        wcagLevel:
          WCAG_METADATA[testResult.name as keyof typeof WCAG_METADATA]
            ?.wcagLevel,
        guideline:
          WCAG_METADATA[testResult.name as keyof typeof WCAG_METADATA]
            ?.guideline,
        impact:
          WCAG_METADATA[testResult.name as keyof typeof WCAG_METADATA]?.impact,
        actRule:
          WCAG_METADATA[testResult.name as keyof typeof WCAG_METADATA]?.actRule
      }
    })
  } catch (error) {
    console.error(`[registry] Error running test suite ${suiteId}:`, error)
    throw error
  }
}
