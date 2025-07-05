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

// Listen for test requests via event bus
eventBus.subscribe((event) => {
  if (event.type === "TEST_ANALYSIS_REQUEST") {
    const { testId } = event.data
    console.log(`[test-runner] Received test request for: ${testId}`)
    runTestSuiteById(testId)
  }
})

/**
 * Run a test suite by ID
 */
async function runTestSuiteById(suiteId: string) {
  try {
    console.log(`[test-runner] Running test suite: ${suiteId}`)

    // Clear previous highlights for this test type
    clearHighlights(suiteId)

    // Run test suite using new API
    const results = await runTestSuite(suiteId)
    console.log(`[test-runner] Test results for ${suiteId}:`, results)

    // Process results for highlighting
    const failedElements = extractFailedElements(results)

    // Highlight failed elements
    if (failedElements.length > 0) {
      highlightElements(suiteId, failedElements)
    }

    // Publish results via event system
    publishTestResults(suiteId, results, failedElements)

    console.log(`[test-runner] ${suiteId} test completed:`, {
      tests: results.length,
      failed: failedElements.length,
      highlighted:
        failedElements.length > 0 ? `${failedElements.length} elements` : "none"
    })
  } catch (error) {
    console.error(`[test-runner] ${suiteId} test execution failed:`, error)
  }
}

/**
 * Extract failed elements from test results
 */
function extractFailedElements(results: any[]) {
  console.log("[test-runner] Extracting failed elements from results:", results)

  const failedElements: Array<{
    element: HTMLElement
    error: string
    selector: string
  }> = []

  results.forEach((test, testIndex) => {
    console.log(`[test-runner] Processing test ${testIndex}:`, test)
    console.log(`[test-runner] Test status: ${test.status}`)

    if (test.status === "fail") {
      console.log(`[test-runner] Found failed test: ${test.message}`)

      // For failed tests, find the element or use fallback
      let element: HTMLElement | null = null
      let selector = "html" // fallback

      // Try to find the element based on test type
      if (test.name.includes("language")) {
        element = document.documentElement
        selector = "html"
      } else if (test.name.includes("button")) {
        const buttons = document.querySelectorAll("button")
        element = buttons[0] as HTMLElement // Use first button as example
        selector = "button"
      } else if (test.name.includes("role")) {
        const roleElements = document.querySelectorAll("[role]")
        element = roleElements[0] as HTMLElement // Use first role element as example
        selector = "[role]"
      }

      if (element) {
        failedElements.push({
          element: element,
          error: test.message || "Test failed",
          selector: selector
        })
      }
    }
  })

  console.log(
    `[test-runner] Extracted ${failedElements.length} failed elements:`,
    failedElements
  )
  return failedElements
}

/**
 * Highlight failed elements using layer system
 */
function highlightElements(
  testType: string,
  failedElements: Array<{
    element: HTMLElement
    error: string
    selector: string
  }>
) {
  failedElements.forEach(({ element, error, selector }) => {
    // Publish highlight event for layer system
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        clear: false,
        layer: testType,
        selector: selector,
        message: error,
        isValid: false
      }
    })
  })
}

/**
 * Clear existing highlights for a specific test type
 */
function clearHighlights(testType: string) {
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: Date.now(),
    data: {
      clear: true,
      layer: testType,
      selector: "",
      message: "",
      isValid: true
    }
  })
}

/**
 * Publish test results via event system
 */
function publishTestResults(
  testType: string,
  results: any[],
  failedElements: any[]
) {
  // Transform failed elements into the format expected by UI
  const issues = failedElements.map(({ element, error, selector }) => ({
    message: error,
    selector: selector,
    element: element
      ? element.outerHTML.substring(0, 200) +
        (element.outerHTML.length > 200 ? "..." : "")
      : undefined
  }))

  // Send TEST_ANALYSIS_COMPLETE event
  eventBus.publish({
    type: "TEST_ANALYSIS_COMPLETE",
    timestamp: Date.now(),
    data: {
      testId: testType,
      issues: issues,
      timestamp: new Date().toISOString()
    }
  })
}

console.log("[test-runner] Content script loaded successfully")
