import { eventBus } from "@/lib/events/event-bus"

export interface ACTTestCase {
  id: string
  description: string
  evaluate: (element: HTMLElement) => {
    passed: boolean
    message: string
  }
}

export interface ACTTestResult {
  id: string
  selector: string
  passed: boolean
  message: string
  severity: "Critical" | "High" | "Medium"
  element: {
    tagName: string
    textContent: string
    xpath: string
  }
}

export interface ACTTestSuite {
  name: string
  description: string
  applicability: string
  testCases: ACTTestCase[]
}

export class ACTTestRunner {
  private suites: ACTTestSuite[] = []

  clearSuites() {
    this.suites = []
  }

  addSuite(suite: ACTTestSuite) {
    // Clear existing suites of the same type to prevent duplicates
    this.suites = this.suites.filter((s) => s.name !== suite.name)
    this.suites.push(suite)
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

  async runTests(type: "headings" | "links") {
    const results: ACTTestResult[] = []
    let totalTests = 0
    let failedTests = 0

    // Clear existing highlights before running tests
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector: "*",
        message:
          type === "headings" ? "Heading Structure" : "Link Accessibility",
        isValid: true,
        clear: true
      }
    })

    for (const suite of this.suites) {
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

      totalTests += elementsWithSelectors.length * suite.testCases.length

      for (const { element, selector } of elementsWithSelectors) {
        for (const testCase of suite.testCases) {
          const { passed, message } = testCase.evaluate(element)
          if (!passed) failedTests++

          // Highlight the element with suite name prefix
          eventBus.publish({
            type: "HIGHLIGHT",
            timestamp: Date.now(),
            data: {
              selector,
              message: `${suite.name}: ${message}`,
              isValid: passed
            }
          })

          if (!passed) {
            results.push({
              id: testCase.id,
              selector,
              passed,
              message: `${suite.name}: ${message}`,
              severity: "High",
              element: {
                tagName: element.tagName,
                textContent: element.textContent || "",
                xpath: element.id ? `//*[@id="${element.id}"]` : ""
              }
            })
          }
        }
      }
    }

    // Publish analysis complete event
    eventBus.publish({
      type:
        type === "headings"
          ? "HEADING_ANALYSIS_COMPLETE"
          : "LINK_ANALYSIS_COMPLETE",
      timestamp: Date.now(),
      data: {
        issues: results,
        stats: {
          total: totalTests,
          invalid: failedTests
        }
      }
    })

    return {
      results,
      stats: {
        total: totalTests,
        failed: failedTests
      }
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
