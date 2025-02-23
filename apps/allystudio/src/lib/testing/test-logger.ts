import { eventBus } from "@/lib/events/event-bus"

import type { ACTTestResult } from "./act-test-runner"

const styles = {
  // Vitest-like colors
  suite: "color: #7C3AED; font-weight: bold;", // Vitest purple
  pass: "color: #10B981; font-weight: bold;", // Vitest green
  fail: "color: #EF4444; font-weight: bold;", // Vitest red
  info: "color: #6B7280;", // Subtle gray
  element: "color: #64748B; font-style: italic;",
  url: "color: #3B82F6;",
  severity: {
    Critical:
      "background: #EF4444; color: white; padding: 2px 6px; border-radius: 4px;",
    High: "background: #F97316; color: white; padding: 2px 6px; border-radius: 4px;",
    Medium:
      "background: #EAB308; color: white; padding: 2px 6px; border-radius: 4px;",
    Low: "background: #10B981; color: white; padding: 2px 6px; border-radius: 4px;"
  }
}

export class TestLogger {
  private hoveredElement: HTMLElement | null = null
  private originalStyles: string | null = null
  private _suiteStartTime: number = 0

  constructor() {
    // Add mouseover listener to console
    this.setupConsoleHoverListener()
  }

  private setupConsoleHoverListener() {
    // Listen for DevTools hover events
    // This is a non-standard feature that works in Chrome DevTools
    if ((window as any).DevToolsAPI) {
      console.log(
        "%c▶ Hover over test results to highlight elements",
        "color: #7C3AED; font-weight: bold;"
      )
    }
  }

  private highlightElement(element: HTMLElement) {
    if (this.hoveredElement === element) return

    // Reset previous highlight
    this.resetHighlight()

    // Store current element and its original styles
    this.hoveredElement = element
    this.originalStyles = element.getAttribute("style")

    // Add highlight styles
    element.style.outline = "2px solid #7C3AED"
    element.style.outlineOffset = "2px"
    element.scrollIntoView({ behavior: "smooth", block: "center" })

    // Also trigger highlight overlay
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector: this.getSelector(element),
        message: "Inspecting element",
        isValid: true
      }
    })
  }

  private resetHighlight() {
    if (this.hoveredElement) {
      if (this.originalStyles) {
        this.hoveredElement.setAttribute("style", this.originalStyles)
      } else {
        this.hoveredElement.removeAttribute("style")
      }
      this.hoveredElement = null
      this.originalStyles = null

      // Clear highlight overlay
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
    }
  }

  private getSelector(element: HTMLElement): string {
    if (element.id) {
      return `#${CSS.escape(element.id)}`
    }

    const path: string[] = []
    let current: Element | null = element

    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase()

      if (current.id) {
        path.unshift(`#${CSS.escape(current.id)}`)
        break
      }

      const parent = current.parentElement
      if (!parent) break

      const siblings = Array.from(parent.children).filter(
        (child) => child.tagName === current!.tagName
      )

      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-of-type(${index})`
      }

      path.unshift(selector)
      current = parent
    }

    return path.join(" > ")
  }

  logTestResult(result: ACTTestResult) {
    const element = document.querySelector(result.selector) as HTMLElement
    if (!element) return

    // Use Vitest-like icons
    const icon = result.passed ? "✓" : "×"
    const style = result.passed ? styles.pass : styles.fail

    // For passed tests, use a more compact format
    if (result.passed) {
      console.log(`%c${icon} %c${result.message}`, style, "color: #6B7280")
      return
    }

    // For failed tests, show detailed information in a group
    console.group(`%c${icon} %c${result.message}`, style, "color: #6B7280")

    // Log element details with improved formatting
    console.log(
      "%c▸ Element:%c %s",
      styles.info,
      styles.element,
      result.element.tagName.toLowerCase()
    )

    console.log(
      "%c▸ Severity:%c %s",
      styles.info,
      styles.severity[result.severity],
      result.severity
    )

    if (element) {
      console.log(
        "%c▸ %cHover to inspect element%c\n%o",
        styles.info,
        "color: #7C3AED; font-style: italic;",
        "",
        element
      )

      const elementRef = element
      console.log = new Proxy(console.log, {
        apply: (target, thisArg, args) => {
          const result = Reflect.apply(target, thisArg, args)
          if (args[0] === element) {
            this.highlightElement(elementRef)
          }
          return result
        }
      })
    }

    console.log(
      "%c▸ Right-click element above to capture screenshot",
      "color: #7C3AED; font-style: italic;"
    )

    console.groupEnd()
  }

  logSuiteStart(name: string) {
    this._suiteStartTime = Date.now()
    console.group(`%c▶ ${name} Tests`, styles.suite)
  }

  logSuiteEnd(stats: { total: number; failed: number }) {
    const passed = stats.total - stats.failed
    const duration = Date.now() - this._suiteStartTime

    console.log(
      "%c▸ Test Results:%c %d total%c | %c%d passed%c | %c%d failed%c | %dms",
      styles.info,
      "color: #6B7280",
      stats.total,
      "color: #6B7280",
      styles.pass,
      passed,
      "color: #6B7280",
      styles.fail,
      stats.failed,
      "color: #6B7280",
      duration
    )
    console.groupEnd()
  }
}
