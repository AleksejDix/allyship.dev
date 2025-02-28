import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { getAccessibleName } from "../act-test-runner"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * Helper function to get heading level
 */
function getHeadingLevel(element: HTMLElement): number {
  return element.getAttribute("aria-level")
    ? parseInt(element.getAttribute("aria-level")!, 10)
    : parseInt(element.tagName.charAt(1), 10)
}

/**
 * ACT Rule: Headings must have accessible names
 */
const headingAccessibleNameRule = createACTRule(
  "heading-has-accessible-name",
  "Headings must have an accessible name",
  "This rule checks that all heading elements have non-empty accessible names.",
  {
    accessibility_requirements: getWCAGReference("2.4.6"),
    categories: [ACTRuleCategory.STRUCTURE],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are any heading elements
      const headings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, [role='heading']"
      )
      console.log(
        `🔍 [HEADING RULE] Found ${headings.length} headings in isApplicable check`
      )
      // Log each heading for debugging
      headings.forEach((h, index) => {
        const element = h as HTMLElement
        console.log(
          `🔍 [HEADING RULE] Heading ${index + 1}: ${element.tagName}, Text: "${element.textContent?.trim()}"`
        )
      })
      return headings.length > 0
    },

    // Execute the rule
    execute: async () => {
      console.log(
        "🔍 [HEADING RULE] Executing heading-has-accessible-name rule"
      )
      // Find all heading elements
      const headings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, [role='heading']"
      )
      console.log(
        `🔍 [HEADING RULE] Processing ${headings.length} headings in execute function`
      )

      // If no headings, rule is inapplicable
      if (headings.length === 0) {
        console.log("🔍 [HEADING RULE] No headings found, rule is inapplicable")
      }

      // Check each heading for an accessible name
      for (const heading of Array.from(headings)) {
        const element = heading as HTMLElement
        console.log(
          `[heading-accessible-name] Processing heading: ${element.tagName}, Text: "${element.textContent?.trim()}"`
        )

        const accessibleName = getAccessibleName(element)
        console.log(
          `[heading-accessible-name] Accessible name: "${accessibleName}"`
        )

        const passed = accessibleName.length > 0
        const message = passed
          ? `Heading has accessible name: "${accessibleName}"`
          : "Heading has no accessible name"

        console.log(
          `[heading-accessible-name] Test result: ${passed ? "PASSED" : "FAILED"}, message: ${message}`
        )

        const result = formatACTResult(
          "heading-has-accessible-name",
          "Headings must have an accessible name",
          element,
          getValidSelector(element),
          passed,
          message,
          "serious",
          ["WCAG2.1:2.4.6"],
          "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html"
        )

        console.log("[heading-accessible-name] Adding result to runner")
        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * ACT Rule: First heading must be h1
 */
const firstHeadingIsH1Rule = createACTRule(
  "page-has-heading-one",
  "First heading must be h1",
  "This rule checks that the first heading in the document is an h1.",
  {
    accessibility_requirements: getWCAGReference("1.3.1"),
    categories: [ACTRuleCategory.STRUCTURE],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are any heading elements
      const headings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, [role='heading']"
      )
      console.log(`[page-has-heading-one] Found ${headings.length} headings`)
      // Log the first heading if exists
      if (headings.length > 0) {
        const element = headings[0] as HTMLElement
        console.log(
          `[page-has-heading-one] First heading: ${element.tagName}, Text: "${element.textContent?.trim()}"`
        )
      }
      return headings.length > 0
    },

    // Execute the rule
    execute: async () => {
      // Find all heading elements
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
      ) as HTMLElement[]

      if (headings.length === 0) {
        return // No headings to check
      }

      // Get the first heading
      const firstHeading = headings[0]
      const level = getHeadingLevel(firstHeading)
      const selector = getValidSelector(firstHeading)

      // Determine if the first heading is an h1
      const passed = level === 1

      // Create a message based on the result
      let message = ""
      if (passed) {
        message = "Document starts with h1 heading"
      } else {
        message = `Document starts with h${level} - should start with h1`
      }

      // Format and add the result
      const result = formatACTResult(
        "page-has-heading-one",
        "First heading must be h1",
        firstHeading,
        selector,
        passed,
        message,
        passed ? "Low" : "Critical", // Use Critical severity for non-h1 start
        ["WCAG2.1:1.3.1", "WCAG2.1:2.4.6"], // WCAG criteria
        "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
      )

      // Add the result to the runner
      actRuleRunner.addResult(result)
    }
  }
)

/**
 * ACT Rule: Heading levels must follow proper hierarchy
 */
const headingOrderRule = createACTRule(
  "heading-order",
  "Heading levels must follow proper hierarchy",
  "This rule checks that heading levels follow a proper hierarchical structure without skipping levels.",
  {
    accessibility_requirements: getWCAGReference("1.3.1"),
    categories: [ACTRuleCategory.STRUCTURE],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are at least two heading elements
      const headings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, [role='heading']"
      )
      console.log(`[heading-order] Found ${headings.length} headings`)
      // Log each heading for debugging
      Array.from(headings).forEach((h, index) => {
        const element = h as HTMLElement
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)
        console.log(
          `[heading-order] Heading ${index + 1}: h${level}, Text: "${element.textContent?.trim()}"`
        )
      })
      return headings.length >= 2
    },

    // Execute the rule
    execute: async () => {
      // Find all heading elements
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
      ) as HTMLElement[]

      if (headings.length < 2) {
        console.log(
          `[heading-order] Not enough headings to check order: ${headings.length}`
        )
        return // Not enough headings to check order
      }

      console.log(
        `[heading-order] Checking hierarchy for ${headings.length} headings`
      )

      // Track the lowest level seen so far to detect improper hierarchy
      let lowestLevelSeen = 6 // Start with highest possible level (h6)

      // Check each heading (except the first) for proper order
      for (let i = 1; i < headings.length; i++) {
        const currentHeading = headings[i]
        const previousHeading = headings[i - 1]

        const currentLevel = getHeadingLevel(currentHeading)
        const previousLevel = getHeadingLevel(previousHeading)

        const selector = getValidSelector(currentHeading)

        // Update lowest level seen
        if (previousLevel < lowestLevelSeen) {
          lowestLevelSeen = previousLevel
        }

        // Case 1: Check if heading level increases by more than one
        const isSkippingLevel = currentLevel > previousLevel + 1

        // Case 2: Check if heading level decreases below a previously established level
        // This checks if we're creating a subsection that's not properly nested
        const isImproperNesting =
          currentLevel > previousLevel && currentLevel > lowestLevelSeen + 1

        const passed = !isSkippingLevel && !isImproperNesting

        // Create a detailed message based on the result
        let message = ""
        if (passed) {
          message = `Level ${currentLevel} heading follows h${previousLevel} correctly`
        } else if (isSkippingLevel) {
          message = `Skipped heading level: h${previousLevel} is followed by h${currentLevel} - can only increase by one level`
        } else if (isImproperNesting) {
          message = `Improper heading structure: h${currentLevel} appears after seeing h${lowestLevelSeen} earlier in the document`
        }

        // Format and add the result
        const result = formatACTResult(
          "heading-order",
          "Heading levels must follow proper hierarchy",
          currentHeading,
          selector,
          passed,
          message,
          passed ? "Low" : "High", // Set severity based on pass/fail
          ["WCAG2.1:1.3.1", "WCAG2.1:2.4.6"], // WCAG criteria
          "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
        )

        // Add the result to the runner
        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * ACT Rule: Only one h1 heading per page
 */
const singleH1Rule = createACTRule(
  "page-has-single-h1",
  "Only one h1 heading per page",
  "This rule checks that each page has exactly one h1 heading.",
  {
    accessibility_requirements: getWCAGReference("1.3.1"),
    categories: [ACTRuleCategory.STRUCTURE],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are any h1 elements
      const h1Headings = document.querySelectorAll(
        "h1, [role='heading'][aria-level='1']"
      )
      return h1Headings.length > 0
    },

    // Execute the rule
    execute: async () => {
      // Find all h1 headings
      const h1Headings = Array.from(
        document.querySelectorAll("h1, [role='heading'][aria-level='1']")
      ) as HTMLElement[]

      // This is a page-level test, so we'll use the first h1 as our target element
      const targetElement =
        h1Headings.length > 0 ? h1Headings[0] : document.body
      const selector =
        h1Headings.length > 0 ? getValidSelector(h1Headings[0]) : "body"

      // Determine if there's exactly one h1
      const passed = h1Headings.length === 1

      // Create a message based on the result
      let message = ""
      if (passed) {
        message = "Page has exactly one h1 heading"
      } else {
        message = `Page has ${h1Headings.length} h1 headings - should have exactly one`
      }

      // Format and add the result
      const result = formatACTResult(
        "page-has-single-h1",
        "Only one h1 heading per page",
        targetElement,
        selector,
        passed,
        message,
        "High", // Severity
        ["WCAG2.1:1.3.1", "WCAG2.1:2.4.6"], // WCAG criteria
        "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
      )

      // Add the result to the runner
      actRuleRunner.addResult(result)
    }
  }
)

/**
 * Rule: Page has only one h1 heading
 */
export const pageSingleH1Rule = createACTRule(
  "page-single-h1",
  "Page should have only one h1 heading",
  "This rule checks that the page has exactly one h1 heading.",
  {
    accessibility_requirements: getWCAGReference("1.3.1"),
    categories: [ACTRuleCategory.HEADINGS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // This rule always applies to any page
      return true
    },

    // Execute the rule
    execute: async () => {
      // Find all h1 headings
      const h1Headings = document.querySelectorAll(
        "h1, [role='heading'][aria-level='1']"
      )

      // Target element is either the first h1 or the body
      const targetElement =
        h1Headings.length > 0 ? (h1Headings[0] as HTMLElement) : document.body
      const selector =
        h1Headings.length > 0
          ? getValidSelector(h1Headings[0] as HTMLElement)
          : "body"

      // Determine if there's exactly one h1
      const passed = h1Headings.length === 1

      // Create a message based on the result
      let message = ""
      if (passed) {
        message = "Page has exactly one h1 heading"
      } else if (h1Headings.length === 0) {
        message = "Page does not have any h1 headings"
      } else {
        message = `Page has ${h1Headings.length} h1 headings (should have exactly one)`
      }

      // Format and add the result
      const result = formatACTResult(
        "page-single-h1",
        "Page should have only one h1 heading",
        targetElement,
        selector,
        passed,
        message,
        "Moderate", // Severity
        ["WCAG2.1:1.3.1"], // WCAG criteria
        "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
      )

      // Add the result to the runner
      actRuleRunner.addResult(result)
    }
  }
)

/**
 * Rule: Page must have at least one h1 heading
 */
export const pageHasH1Rule = createACTRule(
  "page-has-h1",
  "Page must have at least one h1 heading",
  "This rule checks that the page has at least one h1 heading.",
  {
    accessibility_requirements: getWCAGReference("1.3.1"),
    categories: [ACTRuleCategory.HEADINGS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // This rule always applies to any page
      return true
    },

    // Execute the rule
    execute: async () => {
      // Find all h1 headings
      const h1Headings = document.querySelectorAll(
        "h1, [role='heading'][aria-level='1']"
      )

      // Determine if the page passes or fails
      const passed = h1Headings.length > 0

      // Create a message based on the result
      let message = ""
      if (passed) {
        message = `Page has ${h1Headings.length} h1 heading(s)`
      } else {
        message = "Page does not have an h1 heading"
      }

      // Find the first heading or use body as fallback for selector
      const targetElement =
        h1Headings.length > 0 ? (h1Headings[0] as HTMLElement) : document.body

      const selector =
        h1Headings.length > 0
          ? getValidSelector(h1Headings[0] as HTMLElement)
          : "body"

      // Format and add the result
      const result = formatACTResult(
        "page-has-h1",
        "Page must have at least one h1 heading",
        targetElement,
        selector,
        passed,
        message,
        "Serious", // Severity
        ["WCAG2.1:1.3.1"], // WCAG criteria
        "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
      )

      // Add the result to the runner
      actRuleRunner.addResult(result)
    }
  }
)

/**
 * Register all heading-related ACT rules
 */
export function registerHeadingRules(): void {
  console.log("🔍 [HEADING RULES] Registering heading rules")

  // Register accessible name rule
  console.log(
    "🔍 [HEADING RULES] Registering rule: heading-has-accessible-name"
  )
  registerACTRule(headingAccessibleNameRule)

  // Register first heading is h1 rule
  console.log("🔍 [HEADING RULES] Registering rule: first-heading-is-h1")
  registerACTRule(firstHeadingIsH1Rule)

  // Register heading order rule
  console.log("🔍 [HEADING RULES] Registering rule: heading-order")
  registerACTRule(headingOrderRule)

  // Register single h1 rule
  console.log("🔍 [HEADING RULES] Registering rule: single-h1")
  registerACTRule(singleH1Rule)

  console.log("🔍 [HEADING RULES] All heading rules registered")
}

// Export the rules for direct use
export {
  headingAccessibleNameRule,
  firstHeadingIsH1Rule,
  headingOrderRule,
  singleH1Rule
}
