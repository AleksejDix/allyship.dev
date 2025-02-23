import { eventBus } from "@/lib/events/event-bus"

import type { ACTSuite, TestResult } from "./act-test-suite"
import type { TestType } from "./test-config"
import { TestLogger } from "./test-logger"

export interface ACTTestResult {
  id: string
  selector: string
  passed: boolean
  message: string
  severity: "Critical" | "High" | "Medium" | "Low"
  element: {
    tagName: string
    textContent: string
    xpath: string
  }
}

export interface TestProgress {
  type: "progress"
  total: number
  completed: number
  failed: number
}

export interface TestComplete {
  type: "complete"
  results: ACTTestResult[]
  stats: {
    total: number
    failed: number
  }
  cancelled?: boolean
}

export type TestUpdate = ACTTestResult | TestProgress | TestComplete

export class ACTTestRunner {
  private suites: ACTSuite[] = []
  private abortController: AbortController | null = null
  private logger: TestLogger

  constructor() {
    this.logger = new TestLogger()
  }

  clearSuites() {
    this.suites = []
  }

  addSuite(suite: ACTSuite) {
    // Clear existing suites of the same type to prevent duplicates
    this.suites = this.suites.filter((s) => s.name !== suite.name)
    this.suites.push(suite)
  }

  stopTests() {
    if (this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  }

  private getValidSelector(element: HTMLElement): string | null {
    try {
      const selector = getUniqueSelector(element)
      // Verify the selector works and returns the same element
      const found = document.querySelector(selector) as HTMLElement
      if (found && found === element) {
        return selector
      }
      return null
    } catch (error) {
      console.error("Error generating selector:", error)
      return null
    }
  }

  async *runTests(type: TestType): AsyncGenerator<TestUpdate, void, unknown> {
    // Create new abort controller for this test run
    this.abortController = new AbortController()
    const signal = this.abortController.signal

    const results: ACTTestResult[] = []
    let totalTests = 0
    let completedTests = 0
    let failedTests = 0

    try {
      // Clear existing highlights before running tests
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: Date.now(),
        data: {
          selector: "*",
          message:
            type === "headings"
              ? "Heading Structure"
              : type === "links"
                ? "Link Accessibility"
                : type === "alt"
                  ? "Alt Text Analysis"
                  : "Interactive Elements",
          isValid: true,
          clear: true
        }
      })

      // Log suite start
      this.logger.logSuiteStart(
        type === "headings"
          ? "Heading Structure"
          : type === "links"
            ? "Link Accessibility"
            : type === "alt"
              ? "Alt Text Analysis"
              : "Interactive Elements"
      )

      // First calculate total tests
      for (const suite of this.suites) {
        if (signal.aborted) {
          throw new Error("Test run cancelled")
        }

        const elements = Array.from(
          document.querySelectorAll(suite.applicability)
        ) as HTMLElement[]
        const validElements = elements.filter(
          (el) => this.getValidSelector(el) !== null
        )
        totalTests += validElements.length * suite.testCases.length
      }

      // Yield initial progress
      yield {
        type: "progress",
        total: totalTests,
        completed: 0,
        failed: 0
      }

      // Keep track of element results to aggregate messages
      const elementResults = new Map<
        string,
        {
          failures: string[]
          successes: string[]
          selector: string
          element: HTMLElement
        }
      >()

      for (const suite of this.suites) {
        if (signal.aborted) {
          throw new Error("Test run cancelled")
        }

        const elements = Array.from(
          document.querySelectorAll(suite.applicability)
        ) as HTMLElement[]

        // Filter out elements that we can't generate valid selectors for
        const elementsWithSelectors = elements
          .map((element) => ({
            element,
            selector: this.getValidSelector(element)
          }))
          .filter(
            (item): item is { element: HTMLElement; selector: string } =>
              item.selector !== null
          )

        for (const { element, selector } of elementsWithSelectors) {
          if (signal.aborted) {
            throw new Error("Test run cancelled")
          }

          // Initialize or get element results
          if (!elementResults.has(selector)) {
            elementResults.set(selector, {
              failures: [],
              successes: [],
              selector,
              element
            })
          }
          const elementResult = elementResults.get(selector)!

          for (const testCase of suite.testCases) {
            if (signal.aborted) {
              throw new Error("Test run cancelled")
            }

            // Handle both sync and async test evaluation
            let testResult: TestResult
            try {
              if (!signal) {
                throw new Error("Test execution was cancelled")
              }
              const result = await Promise.resolve(
                testCase.evaluate(element, signal)
              )
              testResult = result
            } catch (error) {
              if (
                error instanceof Error &&
                (error.message === "Test cancelled" ||
                  error.message === "Test execution was cancelled")
              ) {
                throw error
              }
              console.error(`Test "${testCase.name}" failed with error:`, error)
              testResult = {
                passed: false,
                message: `Test failed with error: ${error instanceof Error ? error.message : String(error)}`
              }
            }

            completedTests++
            const { passed, message } = testResult

            const fullTestResult: ACTTestResult = {
              id: testCase.id,
              selector,
              passed,
              message: `${suite.name}: ${message}`,
              severity: testCase.meta?.severity || "High",
              element: {
                tagName: element.tagName,
                textContent: element.textContent || "",
                xpath: element.id ? `//*[@id="${element.id}"]` : ""
              }
            }

            if (!passed) {
              failedTests++
              elementResult.failures.push(`${suite.name}: ${message}`)
            } else {
              elementResult.successes.push(`${suite.name}: ${message}`)
            }

            // Add to results and yield
            results.push(fullTestResult)
            yield fullTestResult

            // Yield progress update only
            yield {
              type: "progress",
              total: totalTests,
              completed: completedTests,
              failed: failedTests
            }
          }

          // After all tests for this element, publish highlight with aggregated messages
          if (!signal.aborted) {
            const allMessages = [
              ...elementResult.failures,
              ...elementResult.successes
            ]
            eventBus.publish({
              type: "HIGHLIGHT",
              timestamp: Date.now(),
              data: {
                selector,
                message: allMessages.join("\n"),
                isValid: elementResult.failures.length === 0
              }
            })
          }
        }
      }

      if (!signal.aborted) {
        // Log suite completion
        this.logger.logSuiteEnd({
          total: totalTests,
          failed: failedTests
        })

        // Publish analysis complete event
        publishResults(
          type,
          results.filter((r) => !r.passed),
          {
            total: totalTests,
            failed: failedTests
          }
        )

        // Yield final complete update
        yield {
          type: "complete",
          results: results.filter((r) => !r.passed), // Only send failed results
          stats: {
            total: totalTests,
            failed: failedTests
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Test cancelled") {
        // Clean up on cancellation
        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: Date.now(),
          data: {
            selector: "*",
            message: "",
            isValid: true,
            clear: true
          }
        })

        // Send cancelled complete event
        yield {
          type: "complete",
          results,
          stats: {
            total: totalTests,
            failed: failedTests
          },
          cancelled: true
        }
      } else {
        throw error
      }
    } finally {
      this.abortController = null
    }
  }
}

// Helper function to create unique selectors
export function getUniqueSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }

  const getElementSelector = (el: Element): string => {
    const tag = el.tagName.toLowerCase()
    const parent = el.parentElement
    if (!parent) return tag

    const sameTypeSiblings = Array.from(parent.children).filter(
      (child) => child.tagName === el.tagName
    )
    const index = sameTypeSiblings.indexOf(el) + 1

    return `${tag}:nth-of-type(${index})`
  }

  const path: string[] = []
  let current: Element | null = element

  while (
    current &&
    current !== document.body &&
    current !== document.documentElement
  ) {
    path.unshift(getElementSelector(current))
    current = current.parentElement
  }

  return path.join(" > ")
}

// Helper function to get accessible name
export function getAccessibleName(element: HTMLElement): string {
  // Check aria-labelledby first
  const labelledBy = element.getAttribute("aria-labelledby")
  if (labelledBy) {
    const labelElements = labelledBy
      .split(" ")
      .map((id) => document.getElementById(id))
    const labelText = labelElements
      .filter((el) => el && !el.hidden)
      .map((el) => el?.textContent || "")
      .join(" ")
    if (labelText.trim()) return labelText
  }

  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label")
  if (ariaLabel?.trim()) return ariaLabel

  // Check for img alt text
  const img = element.querySelector("img")
  if (img && !img.matches('[role="presentation"], [role="none"]')) {
    const altText = img.getAttribute("alt")
    if (altText?.trim()) return altText
  }

  // Check visible text content
  return element.textContent?.trim() || ""
}

function publishResults(
  type: TestType,
  results: ACTTestResult[],
  stats: { total: number; failed: number }
) {
  const eventType =
    type === "headings"
      ? "HEADING_ANALYSIS_COMPLETE"
      : type === "links"
        ? "LINK_ANALYSIS_COMPLETE"
        : type === "alt"
          ? "ALT_ANALYSIS_COMPLETE"
          : "INTERACTIVE_ANALYSIS_COMPLETE"

  eventBus.publish({
    type: eventType,
    timestamp: Date.now(),
    data: {
      issues: results.filter((r) => !r.passed),
      stats: {
        total: stats.total,
        invalid: stats.failed
      }
    }
  })
}
