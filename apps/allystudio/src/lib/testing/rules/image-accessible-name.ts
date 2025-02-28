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
        const selector = getValidSelector(element)

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
 * Check if alt text appears to be placeholder text
 */
function isPlaceholderAltText(altText: string): boolean {
  // If alt text is reasonably long (more than 20 chars), it's probably not a placeholder
  if (altText.length > 20) {
    return false
  }

  // Convert to lowercase for case-insensitive comparison
  const text = altText.toLowerCase().trim()

  // Common placeholder patterns - only exact matches or isolated words
  const placeholders = [
    "image",
    "picture",
    "photo",
    "graphic",
    "placeholder",
    "img"
  ]

  // Check for exact matches (e.g., alt="image")
  if (placeholders.includes(text)) {
    return true
  }

  // Check for isolated use of the word "logo" - not brand names containing "logo"
  const words = text.split(/\s+/)
  if (words.length === 1 && words[0] === "logo") {
    return true
  }

  // Only check for "image of", not any phrase containing "image of"
  if (
    text === "image of" ||
    text === "picture of" ||
    text === "photo of" ||
    /^(image|picture|photo) of [a-z0-9]+$/.test(text)
  ) {
    return true
  }

  // Check if alt text is exactly a filename with extension
  if (/^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(text)) {
    return true
  }

  // Check for default CMS placeholder text - exact matches only
  if (
    text === "placeholder" ||
    text === "default image" ||
    text === "untitled"
  ) {
    return true
  }

  return false
}

// Register the rule
registerACTRule(imageAccessibleNameRule)

// Export the rule for testing
export { imageAccessibleNameRule }
