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
 * ACT Rule: Images must have an accessible name
 *
 * This rule checks that all image elements have an accessible name.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 */
const imageAccessibleNameRule = createACTRule(
  "image-has-accessible-name",
  "Images must have an accessible name",
  "This rule checks that all image elements have an accessible name.",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are any image elements
      const images = document.querySelectorAll(
        'img:not([role="presentation"]):not([role="none"]), [role="img"]'
      )
      return images.length > 0
    },

    // Execute the rule
    execute: async () => {
      // Find all image elements that are not presentational
      const images = document.querySelectorAll(
        'img:not([role="presentation"]):not([role="none"]), [role="img"]'
      )

      // Check each image for an accessible name
      for (const image of Array.from(images)) {
        const element = image as HTMLElement
        const accessibleName = getAccessibleName(element)
        const selector = getCssSelector(element)

        // Get alt text specifically for additional checks
        const altText =
          element.tagName.toLowerCase() === "img"
            ? (element as HTMLImageElement).alt
            : null

        // Determine if the image passes or fails
        const passed = accessibleName.trim().length > 0

        // Create a message based on the result
        let message = ""
        if (passed) {
          message = `Image has accessible name: "${accessibleName}"`

          // Additional check for placeholder alt text
          if (altText && isPlaceholderAltText(altText)) {
            message = `Image has suspicious alt text that may be placeholder content: "${altText}"`
          }
        } else {
          message = "Image does not have an accessible name"
        }

        // Format and add the result
        const result = formatACTResult(
          "image-has-accessible-name",
          "Images must have an accessible name",
          element,
          selector,
          passed && !(altText && isPlaceholderAltText(altText)),
          message,
          "Serious", // Severity
          ["WCAG2.1:1.1.1"], // WCAG criteria
          "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html" // Help URL
        )

        // Add the result to the runner
        actRuleRunner.addResult(result)
      }
    }
  }
)

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

  // Add attribute selectors for role if present
  if (element.getAttribute("role")) {
    selector += `[role="${element.getAttribute("role")}"]`
  }

  return selector
}

/**
 * Check if alt text appears to be a placeholder
 */
function isPlaceholderAltText(altText: string): boolean {
  const lowerAlt = altText.toLowerCase()

  // Common placeholder patterns
  const placeholders = [
    "image",
    "picture",
    "photo",
    "graphic",
    "logo",
    "icon",
    "img",
    "pic",
    "placeholder",
    "temp",
    "alt",
    "description",
    "untitled",
    "dsc",
    "jpg",
    "jpeg",
    "png",
    "gif",
    "figure",
    "screenshot",
    "screen shot",
    "snapshot",
    "banner"
  ]

  // Check for exact matches or patterns that suggest placeholders
  return placeholders.some(
    (placeholder) =>
      lowerAlt === placeholder ||
      lowerAlt === `${placeholder}.jpg` ||
      lowerAlt === `${placeholder}.png` ||
      lowerAlt === `${placeholder}.gif` ||
      lowerAlt === `${placeholder} ${placeholder}` ||
      lowerAlt === `${placeholder}1` ||
      lowerAlt === `${placeholder}2` ||
      lowerAlt === `${placeholder}3` ||
      lowerAlt === `${placeholder}_1` ||
      lowerAlt === `${placeholder}_2` ||
      lowerAlt === `${placeholder}_3`
  )
}

// Register the rule
registerACTRule(imageAccessibleNameRule)

// Export the rule for testing
export { imageAccessibleNameRule }
