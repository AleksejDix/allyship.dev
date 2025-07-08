import { eventBus } from "@/lib/events/event-bus"
import type { PlasmoCSConfig } from "plasmo"

import { getTestSuites, runTestSuite } from "./tests/registry"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

console.log("[test-runner] Content script starting to load...")

/**
 * Content script test runner using new registry API
 * Handles test execution requests from the werkzeug UI
 */

// Listen for test requests from the werkzeug component
eventBus.subscribe(async (event) => {
  if (event.type === "TEST_ANALYSIS_REQUEST") {
    const { testId } = event.data

    try {
      // Get the suite ID from the test ID
      // For now, we assume testId is the suite ID
      const suiteId = testId

      // Run the test suite
      const results = await runTestSuite(suiteId)

      // Extract failed elements for highlighting
      const issues = extractFailedElements(results)

      // Send results back to werkzeug
      eventBus.publish({
        type: "TEST_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          testId: suiteId,
          issues
        }
      })

      // Highlight failed elements
      if (issues.length > 0) {
        highlightFailedElements(issues, suiteId)
      } else {
        // Clear highlights if no issues
        clearHighlights(suiteId)
      }
    } catch (error) {
      console.error("Test execution failed:", error)

      // Send error back to werkzeug
      eventBus.publish({
        type: "TEST_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          testId,
          issues: []
        }
      })
    }
  }
})

/**
 * Extract failed elements from test results
 */
function extractFailedElements(results: any[]): any[] {
  const failedElements: any[] = []

  results.forEach((test, testIndex) => {
    if (test.status === "fail") {
      // If the test has an element selector, find the element
      if (test.selector) {
        try {
          const elements = document.querySelectorAll(test.selector)
          elements.forEach((element, elementIndex) => {
            failedElements.push({
              element,
              message: test.message || "Test failed",
              selector: test.selector,
              testName: test.name || `Test ${testIndex + 1}`,
              elementIndex,
              html: element.outerHTML.substring(0, 200) + "..."
            })
          })
        } catch (error) {
          // If selector is invalid, create a generic issue
          failedElements.push({
            element: null,
            message: test.message || "Test failed",
            selector: test.selector,
            testName: test.name || `Test ${testIndex + 1}`,
            elementIndex: 0,
            html: "Unable to locate element"
          })
        }
      } else {
        // For tests without specific elements (like language test)
        failedElements.push({
          element: document.documentElement,
          message: test.message || "Test failed",
          selector: "html",
          testName: test.name || `Test ${testIndex + 1}`,
          elementIndex: 0,
          html: "<html> element"
        })
      }
    }
  })

  return failedElements
}

/**
 * Highlight failed elements on the page
 */
function highlightFailedElements(issues: any[], testType: string) {
  // Clear previous highlights for this test type
  clearHighlights(testType)

  // Highlight each failed element
  issues.forEach((issue) => {
    if (issue.element && issue.selector) {
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: Date.now(),
        data: {
          selector: issue.selector,
          message: issue.message,
          isValid: false,
          layer: testType
        }
      })
    }
  })
}

/**
 * Clear highlights for a specific test type
 */
function clearHighlights(testType: string) {
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: Date.now(),
    data: {
      selector: "",
      message: "",
      isValid: true,
      clear: true,
      layer: testType
    }
  })
}

console.log("[test-runner] Content script loaded successfully")
