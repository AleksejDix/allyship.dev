import { getFocusableElements, sortByTabOrder } from "@allystudio/focus-order-visualizer"
import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

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
      // This rule applies if there are focusable elements on the page
      const focusableElements = getFocusableElements(document, false)
      console.log(
        `[focus-visibility] Found ${focusableElements.length} focusable elements`
      )
      return focusableElements.length > 0
    },

    execute: async () => {
      // Get all focusable elements using the published package
      const focusableElements = getFocusableElements(document, false)

      // We'll test a sample of elements (up to 10) to avoid excessive test duration
      const samplesToTest = Math.min(focusableElements.length, 10)
      const elementsToTest = focusableElements.slice(0, samplesToTest)

      for (const element of elementsToTest) {
        const htmlElement = element as HTMLElement
        const selector = getValidSelector(htmlElement)

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
      // This rule applies if there are multiple focusable elements
      const focusableElements = getFocusableElements(document, false)
      console.log(
        `[focus-order] Found ${focusableElements.length} focusable elements`
      )
      return focusableElements.length > 1
    },

    execute: async () => {
      // Use the published package for better focus element detection
      const focusableElements = getFocusableElements(document, false)
      const sortedElements = sortByTabOrder(focusableElements)

      // If there are too many elements, just sample a few
      const elementsToTest =
        sortedElements.length > 15
          ? sortedElements.slice(0, 15)
          : sortedElements

      // Function to get tabindex
      const getTabIndex = (el: HTMLElement) => {
        const tabindex = el.getAttribute("tabindex")
        return tabindex !== null ? parseInt(tabindex, 10) : 0
      }

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

        const selector = getValidSelector(current)
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
