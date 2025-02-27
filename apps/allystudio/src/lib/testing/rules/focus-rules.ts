import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { formatACTResult } from "../utils/act-result-formatter"

/**
 * Helper function to get a CSS selector for an element
 */
function getCssSelector(element: HTMLElement): string {
  // If the element has an ID, use that
  if (element.id) {
    return `#${element.id}`
  }

  // Otherwise, create a selector based on tag name and classes
  let selector = element.tagName.toLowerCase()

  if (element.className) {
    const classes = element.className.split(/\s+/).filter(Boolean)
    if (classes.length > 0) {
      selector += `.${classes.join(".")}`
    }
  }

  return selector
}

/**
 * Rule: Interactive elements have visible focus indicator
 */
export const focusVisibilityRule = createACTRule(
  "focus-visibility",
  "Interactive elements have visible focus indicator",
  "Interactive elements must have a visible focus indicator when focused via keyboard",
  {
    accessibility_requirements: getWCAGReference("2.4.7"),
    categories: [ACTRuleCategory.FOCUS, ACTRuleCategory.KEYBOARD],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html",

    isApplicable: () => {
      // This rule applies if there are interactive elements on the page
      const interactiveElements = document.querySelectorAll(
        "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      )
      console.log(
        `[focus-visibility] Found ${interactiveElements.length} interactive elements`
      )
      return interactiveElements.length > 0
    },

    execute: async () => {
      // Get all interactive elements
      const interactiveElements = document.querySelectorAll(
        "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      )

      // We'll test a sample of elements (up to 10) to avoid excessive test duration
      const samplesToTest = Math.min(interactiveElements.length, 10)
      const elementsToTest = Array.from(interactiveElements).slice(
        0,
        samplesToTest
      )

      for (const element of elementsToTest) {
        const htmlElement = element as HTMLElement
        const selector = getCssSelector(htmlElement)

        // Store original styles
        const originalOutline = window.getComputedStyle(htmlElement).outline
        const originalBoxShadow = window.getComputedStyle(htmlElement).boxShadow

        // Focus the element
        htmlElement.focus()

        // Get computed styles after focusing
        const focusedOutline = window.getComputedStyle(htmlElement).outline
        const focusedBoxShadow = window.getComputedStyle(htmlElement).boxShadow

        // Check if there's a visible focus indicator
        const hasVisibleOutlineChange =
          focusedOutline !== "none" && focusedOutline !== originalOutline
        const hasVisibleBoxShadowChange =
          focusedBoxShadow !== "none" &&
          focusedBoxShadow !== "rgba(0, 0, 0, 0) none 0px 0px 0px 0px" &&
          focusedBoxShadow !== originalBoxShadow

        // Check for outline:0 or outline:none with no alternative focus styles
        const hasOutlineNone =
          focusedOutline === "none" ||
          focusedOutline === "0px none rgb(0, 0, 0)"

        // Check if there's any CSS custom property that might be used for focus
        const computedStyle = window.getComputedStyle(htmlElement)
        const hasFocusCustomProperty = !!(
          computedStyle.getPropertyValue("--focus-ring") ||
          computedStyle.getPropertyValue("--focus-outline") ||
          computedStyle.getPropertyValue("--focus-shadow")
        )

        // Determine if the element has a visible focus indicator
        const passed =
          hasVisibleOutlineChange ||
          hasVisibleBoxShadowChange ||
          hasFocusCustomProperty ||
          !hasOutlineNone

        // Create an appropriate message based on the result
        let message = ""
        if (passed) {
          message = "Element has visible focus indicator"
        } else {
          message = hasOutlineNone
            ? "Element has outline:none without alternative focus styles"
            : "Element doesn't have a visible focus indicator"
        }

        const result = formatACTResult(
          "focus-visibility",
          "Interactive elements have visible focus indicator",
          htmlElement,
          selector,
          passed,
          message,
          "serious", // Focus visibility is a serious issue for keyboard users
          ["WCAG2.1:2.4.7"],
          "https://www.w3.org/WAI/WCAG21/Understanding/focus-visible.html"
        )

        actRuleRunner.addResult(result)

        // Remove focus if needed
        htmlElement.blur()
      }
    }
  }
)

/**
 * Rule: Focus order is logical
 */
export const focusOrderRule = createACTRule(
  "focus-order",
  "Focus order is logical",
  "Tab order through interactive elements should follow a logical sequence matching visual layout",
  {
    accessibility_requirements: getWCAGReference("2.4.3"),
    categories: [ACTRuleCategory.FOCUS, ACTRuleCategory.KEYBOARD],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html",

    isApplicable: () => {
      // This rule applies if there are multiple interactive elements
      const interactiveElements = document.querySelectorAll(
        "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
      )
      console.log(
        `[focus-order] Found ${interactiveElements.length} interactive elements`
      )
      return interactiveElements.length > 1
    },

    execute: async () => {
      // Get all interactive elements
      const interactiveElements = Array.from(
        document.querySelectorAll(
          "a[href], button, input, select, textarea, [tabindex]:not([tabindex='-1'])"
        )
      ) as HTMLElement[]

      // Track the tab order
      const tabOrder: HTMLElement[] = []

      // Function to get tabindex
      const getTabIndex = (el: HTMLElement) => {
        const tabindex = el.getAttribute("tabindex")
        return tabindex !== null ? parseInt(tabindex, 10) : 0
      }

      // Sort by tabindex (positive values first, then document order)
      const elementsByTabIndex = [...interactiveElements].sort((a, b) => {
        const aTabIndex = getTabIndex(a)
        const bTabIndex = getTabIndex(b)

        // Both have positive tabindex, compare numerically
        if (aTabIndex > 0 && bTabIndex > 0) {
          return aTabIndex - bTabIndex
        }

        // a has positive tabindex, it comes first
        if (aTabIndex > 0) {
          return -1
        }

        // b has positive tabindex, it comes first
        if (bTabIndex > 0) {
          return 1
        }

        // Both have tabindex 0 or none, use document order
        return interactiveElements.indexOf(a) - interactiveElements.indexOf(b)
      })

      // If there are too many elements, just sample a few
      const elementsToTest =
        elementsByTabIndex.length > 15
          ? elementsByTabIndex.slice(0, 15)
          : elementsByTabIndex

      // Check for common tab order issues
      for (let i = 1; i < elementsToTest.length; i++) {
        const current = elementsToTest[i]
        const previous = elementsToTest[i - 1]

        // Get positions
        const currentRect = current.getBoundingClientRect()
        const previousRect = previous.getBoundingClientRect()

        // Simplistic check: Down is logical, big jumps up/sideways might not be
        // This is a simplified check and won't catch all illogical orders
        const isDownwards = currentRect.top >= previousRect.bottom - 5 // 5px overlap allowed
        const isRightwards =
          Math.abs(currentRect.left - previousRect.left) < 100 ||
          (currentRect.left > previousRect.left &&
            Math.abs(currentRect.top - previousRect.top) < 50)

        // Check for tabindex that might cause illogical order
        const hasExplicitTabIndex =
          getTabIndex(current) > 0 || getTabIndex(previous) > 0

        // Basic heuristic for logical order
        const seemsLogical = isDownwards || isRightwards || hasExplicitTabIndex

        // For very simple checks, we'll be lenient and only flag clearly problematic cases
        const passed =
          seemsLogical ||
          // Don't flag elements that are close to each other
          (Math.abs(currentRect.top - previousRect.top) < 100 &&
            Math.abs(currentRect.left - previousRect.left) < 200)

        const selector = getCssSelector(current)
        let message = ""

        if (passed) {
          message = "Element follows a logical focus order"
        } else {
          message = hasExplicitTabIndex
            ? `Element has tabindex=${getTabIndex(current)} which may disrupt the logical focus order`
            : "Element may not follow logical focus order based on visual layout"
        }

        const result = formatACTResult(
          "focus-order",
          "Focus order is logical",
          current,
          selector,
          passed,
          message,
          "moderate",
          ["WCAG2.1:2.4.3"],
          "https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Register all focus-related rules
 */
export function registerFocusRules(): void {
  console.log("[focus-rules] Registering focus ACT rules")

  // Register focus visibility rule
  console.log("[focus-rules] Registering focus-visibility rule")
  registerACTRule(focusVisibilityRule)

  // Register focus order rule
  console.log("[focus-rules] Registering focus-order rule")
  registerACTRule(focusOrderRule)

  console.log("[focus-rules] All focus rules registered successfully")
}
