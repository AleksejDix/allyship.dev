import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { getAccessibleName } from "../act-test-runner"
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

  // Add attribute selectors for role and aria-level if present
  if (element.getAttribute("role")) {
    selector += `[role="${element.getAttribute("role")}"]`
  }

  if (element.getAttribute("aria-level")) {
    selector += `[aria-level="${element.getAttribute("aria-level")}"]`
  }

  return selector
}

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
      return headings.length > 0
    },

    // Execute the rule
    execute: async () => {
      // Find all heading elements
      const headings = document.querySelectorAll(
        "h1, h2, h3, h4, h5, h6, [role='heading']"
      )

      // Check each heading for an accessible name
      for (const heading of Array.from(headings)) {
        const element = heading as HTMLElement
        const accessibleName = getAccessibleName(element)
        const selector = getCssSelector(element)
        const level = getHeadingLevel(element)

        // Determine if the heading passes or fails
        const passed = accessibleName.trim().length > 0

        // Create a message based on the result
        let message = ""
        if (passed) {
          message = `Level ${level} heading has accessible name: "${accessibleName}"`
        } else {
          message = `Level ${level} heading is empty`
        }

        // Format and add the result
        const result = formatACTResult(
          "heading-has-accessible-name",
          "Headings must have an accessible name",
          element,
          selector,
          passed,
          message,
          "High", // Severity
          ["WCAG2.1:2.4.6", "WCAG2.1:1.3.1"], // WCAG criteria
          "https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels.html" // Help URL
        )

        // Add the result to the runner
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
      const selector = getCssSelector(firstHeading)

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
        "Critical", // Severity
        ["WCAG2.1:1.3.1", "WCAG2.1:2.4.6"], // WCAG criteria
        "https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships.html" // Help URL
      )

      // Add the result to the runner
      actRuleRunner.addResult(result)
    }
  }
)

/**
 * ACT Rule: Heading levels must increase by only one
 */
const headingOrderRule = createACTRule(
  "heading-order",
  "Heading levels must increase by only one",
  "This rule checks that heading levels only increase by one at a time.",
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
      return headings.length >= 2
    },

    // Execute the rule
    execute: async () => {
      // Find all heading elements
      const headings = Array.from(
        document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
      ) as HTMLElement[]

      if (headings.length < 2) {
        return // Not enough headings to check order
      }

      // Check each heading (except the first) for proper order
      for (let i = 1; i < headings.length; i++) {
        const currentHeading = headings[i]
        const previousHeading = headings[i - 1]

        const currentLevel = getHeadingLevel(currentHeading)
        const previousLevel = getHeadingLevel(previousHeading)

        const selector = getCssSelector(currentHeading)

        // Check if heading level increases by more than one
        const isSkippingLevel = currentLevel > previousLevel + 1
        const passed = !isSkippingLevel

        // Create a message based on the result
        let message = ""
        if (passed) {
          message = `Level ${currentLevel} heading follows h${previousLevel} correctly`
        } else {
          message = `Invalid heading structure: h${previousLevel} is followed by h${currentLevel} - can only increase by one level`
        }

        // Format and add the result
        const result = formatACTResult(
          "heading-order",
          "Heading levels must increase by only one",
          currentHeading,
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
        h1Headings.length > 0 ? getCssSelector(h1Headings[0]) : "body"

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

// Function to register all heading rules
export function registerHeadingRules() {
  registerACTRule(headingAccessibleNameRule)
  registerACTRule(firstHeadingIsH1Rule)
  registerACTRule(headingOrderRule)
  registerACTRule(singleH1Rule)
}

// Export the rules for direct use
export {
  headingAccessibleNameRule,
  firstHeadingIsH1Rule,
  headingOrderRule,
  singleH1Rule
}
