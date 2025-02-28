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

    // Optimized applicability check
    isApplicable: () => {
      return !!document.querySelector(
        'img:not([role="presentation"]):not([role="none"]), [role="img"]'
      )
    },

    // Optimized rule execution
    execute: async () => {
      const images = document.querySelectorAll(
        'img:not([role="presentation"]):not([role="none"]), [role="img"]'
      )

      images.forEach((image) => {
        const element = image as HTMLElement
        const accessibleName = getAccessibleName(element).trim()
        const selector = getValidSelector(element)

        // Get alt text directly for debug comparison
        const altText =
          element.tagName.toLowerCase() === "img"
            ? (element as HTMLImageElement).alt.trim()
            : null

        // Debug information to understand why accessible name might be empty
        console.debug(`[Image Rule Debug]`, {
          element,
          selector,
          accessibleName: accessibleName || "(empty)",
          directAltText: altText || "(none)",
          inPictureElement: !!element.closest("picture"),
          ariaLabel: element.getAttribute("aria-label"),
          ariaLabelledby: element.getAttribute("aria-labelledby")
        })

        // Handle special case for images in picture elements
        let finalAccessibleName = accessibleName

        // For images in picture elements, if accessibleName is empty but alt exists, use alt
        if (!finalAccessibleName && altText && element.closest("picture")) {
          finalAccessibleName = altText
          console.debug(
            `[Image Rule] Using direct alt text for image in picture element: "${altText}"`
          )
        }

        let message = ""
        let passed = finalAccessibleName.length > 0
        let severity = "Serious"

        if (passed) {
          message = `Image has accessible name: "${finalAccessibleName}"`

          // Check for placeholder alt text
          if (altText && isPlaceholderAltText(altText)) {
            message = `Image has suspicious alt text that may be placeholder content: "${altText}"`
            severity = "Warning"
          }
        } else {
          // More detailed failure message for debugging
          message = `Image does not have an accessible name. `
          if (altText) {
            message += `Alt text "${altText}" is present but not being correctly calculated as the accessible name.`
          } else {
            message += `No alt text was found.`
          }
        }

        const result = formatACTResult(
          "image-has-accessible-name",
          "Images must have an accessible name",
          element,
          selector,
          passed && !(altText && isPlaceholderAltText(altText)),
          message,
          severity,
          ["WCAG2.1:1.1.1"],
          "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html"
        )

        actRuleRunner.addResult(result)
      })
    }
  }
)

/**
 * Check if alt text appears to be placeholder text
 *
 * This function is designed to be language-agnostic and identify common
 * placeholder patterns that indicate low-quality alt text.
 *
 * @future This function is designed to be extended with AI capabilities
 * to better analyze alt text quality across multiple languages.
 */
function isPlaceholderAltText(altText: string): boolean {
  // Empty or whitespace-only alt text is considered a failure
  if (!altText || altText.trim().length === 0) return true

  // If alt text is reasonably long (more than 20 chars), it's probably meaningful
  if (altText.length > 20) {
    return false
  }

  const text = altText.trim().toLowerCase()

  // Early return for likely portrait/person descriptions
  if (
    text.includes("portrait") ||
    text.includes(" photo of ") ||
    // Check for likely name patterns (First Last format)
    /^[A-Z][a-z]+ [A-Z][a-z]+$/.test(altText) ||
    // Check for possessive name patterns (John's photo)
    /^[A-Z][a-z]+('s| s) (photo|picture|portrait|headshot)$/i.test(altText)
  ) {
    return false
  }

  // Universal placeholder terms (language-agnostic where possible)
  // These are terms that by themselves don't provide useful descriptions
  const universalPlaceholders = [
    "image",
    "img",
    "photo",
    "picture",
    "graphic",
    "placeholder",
    "default",
    "temp",
    "untitled"
  ]

  // "logo" is only a placeholder when it's used alone
  if (text === "logo") {
    return true
  }

  // Check for exact matches with common placeholder terms
  // Only flag if the entire text matches one of these terms
  if (universalPlaceholders.includes(text)) {
    return true
  }

  // Check for filename patterns (e.g., "image.png", "logo.jpg")
  if (
    /^[a-zA-Z0-9_-]+\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff|avif)$/i.test(text)
  ) {
    return true
  }

  // Detect numeric placeholders like "12345" or "0001"
  if (/^\d{3,}$/.test(text)) {
    return true
  }

  // More precise check for problematic "X of Y" patterns
  // Only flag very simple generic patterns, not descriptive ones
  if (/^(image|picture|photo) of (a|the|an) [a-z0-9]+$/i.test(text)) {
    return true
  }

  // FUTURE: AI INTEGRATION POINT
  // For more complex analysis, we could call an AI service here
  // to evaluate the quality of alt text across languages.
  //
  // For now, we return false for any alt text that passes our basic checks
  return false
}

// Register the rule
registerACTRule(imageAccessibleNameRule)

// Export the rule for testing
export { imageAccessibleNameRule }
