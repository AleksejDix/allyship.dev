import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
// Import accessible name utility from npm package
import { getAccessibleName } from "@allystudio/accessibility-utils"

import type { ACTSuite, TestResult } from "./act-test-suite"
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
  private elementResults: Map<
    string,
    {
      failures: string[]
      successes: string[]
      selector: string
      element: HTMLElement
    }
  > = new Map()
  private currentTestType: TestType | null = null

  constructor() {
    this.logger = new TestLogger()
  }

  clearSuites() {
    this.suites = []
    this.elementResults.clear()
    this.currentTestType = null
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

  private clearHighlights() {
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector: "*",
        message: "",
        isValid: true,
        clear: true,
        layer: this.currentTestType || ""
      }
    })
  }

  private updateHighlights() {
    // Publish all highlights in one batch
    for (const elementResult of this.elementResults.values()) {
      // Only show highlights for failures
      if (elementResult.failures.length > 0) {
        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: Date.now(),
          data: {
            selector: elementResult.selector,
            message: elementResult.failures.join("\n"),
            isValid: false, // Always false since we only show failures
            layer: this.currentTestType || ""
          }
        })
      }
    }
  }

  async *runTests(type: TestType): AsyncGenerator<TestUpdate, void, unknown> {
    try {
      // Clear existing state
      this.clearSuites()
      this.currentTestType = type
      this.clearHighlights()
      this.addSuite(TEST_CONFIGS[type].suite)

      // Create new abort controller for this test run
      this.abortController = new AbortController()
      const signal = this.abortController.signal

      const results: ACTTestResult[] = []
      let totalTests = 0
      let completedTests = 0
      let failedTests = 0

      // Log suite start
      this.logger.logSuiteStart(TEST_CONFIGS[type].displayName)
      console.log(`Starting ${type} tests`) // Debug log

      // First calculate total tests
      for (const suite of this.suites) {
        if (signal.aborted) throw new Error("Test run cancelled")

        const elements = Array.from(
          document.querySelectorAll(suite.applicability)
        ) as HTMLElement[]
        console.log(`Found ${elements.length} elements for ${suite.name}`) // Debug log

        const validElements = elements.filter(
          (el) => this.getValidSelector(el) !== null
        )
        console.log(
          `Found ${validElements.length} valid elements for ${suite.name}`
        ) // Debug log

        totalTests += validElements.length * suite.testCases.length
      }

      // Yield initial progress
      yield {
        type: "progress",
        total: totalTests,
        completed: 0,
        failed: 0
      }

      for (const suite of this.suites) {
        if (signal.aborted) throw new Error("Test run cancelled")

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
          if (signal.aborted) throw new Error("Test run cancelled")

          // Initialize or get element results
          if (!this.elementResults.has(selector)) {
            this.elementResults.set(selector, {
              failures: [],
              successes: [],
              selector,
              element
            })
          }
          const elementResult = this.elementResults.get(selector)!

          for (const testCase of suite.testCases) {
            if (signal.aborted) throw new Error("Test run cancelled")

            // Handle both sync and async test evaluation
            let testResult: TestResult
            try {
              if (!signal) throw new Error("Test execution was cancelled")
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

            // Add to results and yield progress
            results.push(fullTestResult)
            yield {
              type: "progress",
              total: totalTests,
              completed: completedTests,
              failed: failedTests
            }
          }

          // Update highlights after each element is fully tested
          if (!signal.aborted) {
            this.updateHighlights()
          }
        }
      }

      if (!signal.aborted) {
        // Log suite completion
        this.logger.logSuiteEnd({
          total: totalTests,
          failed: failedTests
        })

        // Log results for debugging
        console.log(`Completing ${type} tests:`, {
          total: totalTests,
          failed: failedTests,
          results: results.length,
          failedResults: results.filter((r) => !r.passed).length
        })

        // Yield final complete update with failed results only
        yield {
          type: "complete",
          results: results.filter((r) => !r.passed),
          stats: {
            total: totalTests,
            failed: failedTests
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.message === "Test run cancelled") {
        this.clearHighlights()
        // Send cancelled complete event with failed results only
        yield {
          type: "complete",
          results: [],
          stats: {
            total: 0,
            failed: 0
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

// Re-export for backward compatibility
export { getAccessibleName }
