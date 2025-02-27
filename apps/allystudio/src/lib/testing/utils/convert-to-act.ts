import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import type { ACTSuite, TestResult } from "../act-test-suite"
import type { AccessibilityRequirement } from "../act-types"
import { formatACTResult } from "./act-result-formatter"

/**
 * Converts an old-style test suite to a new ACT rule
 *
 * @param suite The old test suite to convert
 * @param wcagCriteria The WCAG criteria this rule tests (e.g., "1.1.1")
 * @param categories The categories this rule belongs to
 * @param helpUrl The URL for more information about this rule
 */
export function convertSuiteToACTRule(
  suite: ACTSuite,
  wcagCriteria: string[],
  categories: ACTRuleCategory[],
  helpUrl: string
) {
  // Create a unique ID based on the suite name
  const ruleId = suite.name.toLowerCase().replace(/\s+/g, "-")

  // Create the ACT rule
  const rule = createACTRule(
    ruleId,
    suite.name,
    suite.testCases[0]?.meta?.description || `Tests for ${suite.name}`,
    {
      // Use the first WCAG criteria as the main requirement
      accessibility_requirements:
        wcagCriteria.length > 0 ? getWCAGReference(wcagCriteria[0]) : undefined,
      categories,
      implementation_url: helpUrl,

      // Check if the rule is applicable to the current page
      isApplicable: () => {
        // Rule applies if there are any elements matching the applicability selector
        const elements = document.querySelectorAll(suite.applicability)
        return elements.length > 0
      },

      // Execute the rule
      execute: async () => {
        // Find all applicable elements
        const elements = document.querySelectorAll(suite.applicability)

        // Run each test case on each element
        for (const element of Array.from(elements)) {
          const htmlElement = element as HTMLElement

          // Create an abort controller for timeouts
          const controller = new AbortController()
          const timeoutId = setTimeout(() => controller.abort(), 5000)

          // Run each test case
          for (const testCase of suite.testCases) {
            try {
              // Run the test
              const result = await Promise.resolve(
                testCase.evaluate(htmlElement, controller.signal)
              )

              // Map severity from old format to new format
              const severityMap: Record<string, string> = {
                Critical: "critical",
                High: "serious",
                Medium: "moderate",
                Low: "minor"
              }

              const severity =
                severityMap[testCase.meta?.severity || "Medium"] || "moderate"

              // Format and add the result
              const formattedResult = formatACTResult(
                `${ruleId}-${testCase.id}`,
                testCase.name,
                htmlElement,
                getCssSelector(htmlElement),
                result.passed,
                result.message,
                severity as any,
                wcagCriteria.map((c) => `WCAG2.1:${c}`),
                helpUrl
              )

              // Add the result to the runner
              actRuleRunner.addResult(formattedResult)
            } catch (error) {
              console.error(`Error running test ${testCase.name}:`, error)
            }
          }

          clearTimeout(timeoutId)
        }
      }
    }
  )

  // Register the rule
  registerACTRule(rule)

  // Return the rule for testing
  return rule
}

/**
 * Generates a CSS selector for an element based on its ID, class, and role attributes
 *
 * @param element The element to generate a selector for
 * @returns A CSS selector that uniquely identifies the element
 */
function getCssSelector(element: HTMLElement): string {
  // If the element has an ID, use that
  if (element.id) {
    return `#${element.id}`
  }

  // If the element has classes, use those
  if (element.className && typeof element.className === "string") {
    const classes = element.className
      .split(" ")
      .filter((c) => c.trim().length > 0)
      .map((c) => `.${c}`)
      .join("")

    if (classes) {
      return `${element.tagName.toLowerCase()}${classes}`
    }
  }

  // If the element has a role, use that
  if (element.getAttribute("role")) {
    return `${element.tagName.toLowerCase()}[role="${element.getAttribute("role")}"]`
  }

  // Otherwise, use the tag name
  return element.tagName.toLowerCase()
}
