import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { getAccessibleName } from "../act-test-runner"
import { isHiddenFromAT } from "../utils/accessibility-utils"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * ACT Rule: Image has non-empty accessible name
 *
 * This rule checks that all non-decorative image elements have a non-empty accessible name.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 * @see https://act-rules.github.io/rules/e086e5 (Image has accessible name)
 */
const imageHasNonEmptyAccessibleNameRule = createACTRule(
  "image-has-non-empty-accessible-name",
  "Image has non-empty accessible name",
  "This rule checks that all non-decorative image elements have a non-empty accessible name.",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Applicability: Only non-decorative images that don't have presentation role
    // and are not hidden from assistive technology
    isApplicable: () => {
      // First select all potential candidate elements
      const candidates = document.querySelectorAll(
        'img:not([role="presentation"]):not([role="none"]):not([alt=""]), [role="img"]'
      )

      // Then filter out elements that are hidden from AT
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all non-decorative images that are not marked as presentational
      // and not hidden from assistive technology
      const candidates = document.querySelectorAll(
        'img:not([role="presentation"]):not([role="none"]):not([alt=""]), [role="img"]'
      )

      // Filter out elements that are hidden from AT
      const images = Array.from(candidates).filter((el) => !isHiddenFromAT(el))

      images.forEach((image) => {
        const element = image as HTMLElement
        const accessibleName = getAccessibleName(element).trim()
        const selector = getValidSelector(element)

        // Get alt text directly for debug comparison
        const altText =
          element.tagName.toLowerCase() === "img"
            ? (element as HTMLImageElement).alt.trim()
            : null

        // Handle special case for images in picture elements
        let finalAccessibleName = accessibleName

        // For images in picture elements, if accessibleName is empty but alt exists, use alt
        if (!finalAccessibleName && altText && element.closest("picture")) {
          finalAccessibleName = altText
        }

        const passed = finalAccessibleName.length > 0
        const message = passed
          ? `Image has accessible name: "${finalAccessibleName}"`
          : `Image does not have an accessible name. ${
              altText
                ? `Alt text "${altText}" is present but not being correctly calculated as the accessible name.`
                : `No alt text was found. If this image conveys meaning, add alt text.`
            }`

        const result = formatACTResult(
          "image-has-non-empty-accessible-name",
          "Image has non-empty accessible name",
          element,
          selector,
          passed,
          message,
          "Serious",
          ["WCAG2.1:1.1.1"],
          "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html"
        )

        actRuleRunner.addResult(result)
      })
    }
  }
)

/**
 * ACT Rule: Decorative images properly hidden
 *
 * This rule checks that images marked as decorative are properly hidden from assistive technology.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 * @see https://act-rules.github.io/rules/23a2a8 (Image is decorative)
 */
const decorativeImagesHiddenRule = createACTRule(
  "decorative-images-hidden",
  "Decorative images must be properly hidden",
  "Images with empty alt text (alt=\"\") are considered decorative. For additional clarity, role='presentation' or role='none' can be added.",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Applicability: Images with empty alt text that are not hidden from AT
    isApplicable: () => {
      const candidates = document.querySelectorAll('img[alt=""]')
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all images with empty alt text
      const candidates = document.querySelectorAll('img[alt=""]')

      // Filter out elements that are hidden from AT
      const images = Array.from(candidates).filter((el) => !isHiddenFromAT(el))

      images.forEach((image) => {
        const element = image as HTMLElement
        const selector = getValidSelector(element)

        // Check if properly hidden with presentation role
        const hasHidingRole =
          element.getAttribute("role") === "presentation" ||
          element.getAttribute("role") === "none"

        // Empty alt is valid by itself according to spec, but roles provide additional clarity
        const passed = true // Always pass with alt="" as it's valid per spec
        let message
        let severity = "None"

        if (hasHidingRole) {
          message = `Decorative image is properly hidden with empty alt text and ${element.getAttribute("role")} role`
        } else {
          message = `Image with empty alt text should also use role="presentation" or role="none" for better compatibility with assistive technology`
          severity = "Warning" // Just a best practice recommendation, not a failure
        }

        const result = formatACTResult(
          "decorative-images-hidden",
          "Decorative images must be properly hidden",
          element,
          selector,
          passed,
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
 * ACT Rule: Missing alt attribute
 *
 * This rule checks for images that are missing the alt attribute completely.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 */
const missingAltRule = createACTRule(
  "missing-alt-attribute",
  "Images must have an alt attribute",
  "All images should have an alt attribute, even if title or other attributes provide an accessible name. Images with role='presentation' or role='none' are exempt.",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Applicability: Images without alt attribute, excluding those with presentation role
    // and those hidden from assistive technology
    isApplicable: () => {
      const candidates = document.querySelectorAll(
        'img:not([alt]):not([role="presentation"]):not([role="none"])'
      )
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all images without alt attribute, excluding those with presentation role
      const candidates = document.querySelectorAll(
        'img:not([alt]):not([role="presentation"]):not([role="none"])'
      )

      // Filter out elements that are hidden from AT
      const images = Array.from(candidates).filter((el) => !isHiddenFromAT(el))

      images.forEach((image) => {
        const element = image as HTMLElement
        const selector = getValidSelector(element)

        // Check if it has a title or other attributes that might provide an accessible name
        const accessibleName = getAccessibleName(element).trim()
        const hasAccessibleName = accessibleName.length > 0

        // Get title for message
        const title = element.getAttribute("title")

        let message
        let severity = "Critical"
        let passed = false

        if (hasAccessibleName) {
          // Has a name from title or other attributes - technically passes but warn about best practices
          if (title) {
            message = `Image has a title "${title}" but is missing the alt attribute. While title provides an accessible name, using alt is required for best accessibility support.`
            severity = "Warning"
            passed = true // Pass but with a warning
          } else {
            message = `Image has an accessible name from other attributes, but is missing the alt attribute. Using alt is required for best accessibility support.`
            severity = "Warning"
            passed = true // Pass but with a warning
          }
        } else {
          // No accessible name at all - critical failure
          message = `Image is missing the alt attribute and has no accessible name. All images must have an alt attribute, either with a description (if meaningful) or empty alt="" (if decorative).`
          passed = false
        }

        const result = formatACTResult(
          "missing-alt-attribute",
          "Images must have an alt attribute",
          element,
          selector,
          passed,
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
 * ACT Rule: Alt text quality
 *
 * This rule checks that alt text is meaningful and not just placeholder content.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 */
const altTextQualityRule = createACTRule(
  "alt-text-quality",
  "Alt text must be descriptive",
  "Alt text should be descriptive and not contain placeholder content like filenames.",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Applicability: Images with alt text that are not hidden from AT
    isApplicable: () => {
      const candidates = document.querySelectorAll('img[alt]:not([alt=""])')
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all images with non-empty alt text
      const candidates = document.querySelectorAll('img[alt]:not([alt=""])')

      // Filter out elements that are hidden from AT
      const images = Array.from(candidates).filter((el) => !isHiddenFromAT(el))

      images.forEach((image) => {
        const element = image as HTMLImageElement
        const altText = element.alt.trim()
        const selector = getValidSelector(element)

        const isPlaceholder = isPlaceholderAltText(altText)
        const passed = !isPlaceholder

        const message = passed
          ? `Alt text "${altText}" appears to be descriptive`
          : `Alt text "${altText}" appears to be placeholder content. Use descriptive alt text.`

        const result = formatACTResult(
          "alt-text-quality",
          "Alt text must be descriptive",
          element,
          selector,
          passed,
          message,
          "Warning",
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

  // FUTURE: AI INTEGRATION POINT
  // For more complex analysis, we could call an AI service here
  // to evaluate the quality of alt text across multiple languages.
  //
  // For now, we return false for any alt text that passes our basic checks
  return false
}

/**
 * ACT Rule: Presentation role correctly used
 *
 * This rule checks that elements with role="presentation" or role="none" are correctly used
 * to mark decorative elements, including those using CSS background images.
 * Based on WCAG 2.1 Success Criterion 1.1.1: Non-text Content
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html
 */
const presentationRoleRule = createACTRule(
  "presentation-role-usage",
  "Elements with presentation role are properly used",
  "Elements with role='presentation' or role='none' should be used for decorative content like CSS background images. Images with these roles must also have alt=\"\".",
  {
    accessibility_requirements: getWCAGReference("1.1.1"),
    categories: [ACTRuleCategory.IMAGES],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html",

    // Applicability: Elements with presentation or none role that are not hidden from AT
    isApplicable: () => {
      const candidates = document.querySelectorAll(
        '[role="presentation"], [role="none"]'
      )
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all elements with presentation roles
      const candidates = document.querySelectorAll(
        '[role="presentation"], [role="none"]'
      )

      // Filter out elements that are hidden from AT
      const elements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el)
      )

      elements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const selector = getValidSelector(htmlElement)

        // Check if it's an image with an alt attribute
        const isImg = htmlElement.tagName.toLowerCase() === "img"
        const hasAltAttr = htmlElement.hasAttribute("alt")
        const hasEmptyAlt = isImg && htmlElement.getAttribute("alt") === ""

        // Check if it has a background image via CSS
        const computedStyle = window.getComputedStyle(htmlElement)
        const hasBgImage =
          computedStyle.backgroundImage &&
          computedStyle.backgroundImage !== "none"

        let passed = true
        let message = ""
        let severity = "None"

        // Determine message based on element type
        if (isImg) {
          if (hasEmptyAlt) {
            // Valid: img with both alt="" and presentation role
            message = `Image with empty alt text and ${htmlElement.getAttribute("role")} role is properly marked as decorative`
          } else if (hasAltAttr) {
            // Warning: img with non-empty alt and presentation role (conflicting)
            message = `Image has both a non-empty alt attribute and role="${htmlElement.getAttribute("role")}" which is contradictory`
            severity = "Warning"
          } else {
            // Invalid: img with presentation role but missing alt=""
            message = `Image with ${htmlElement.getAttribute("role")} role must also have alt="" for compatibility with assistive technologies`
            severity = "Serious"
            passed = false
          }
        } else if (hasBgImage) {
          // Valid: non-img element with bg image and presentation role
          message = `Element with CSS background image is properly marked as decorative with ${htmlElement.getAttribute("role")} role`
        } else {
          // Valid: any other element with presentation role
          message = `Element is marked as decorative with ${htmlElement.getAttribute("role")} role`
        }

        const result = formatACTResult(
          "presentation-role-usage",
          "Elements with presentation role are properly used",
          htmlElement,
          selector,
          passed,
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
 * Register all image-related rules
 */
export function registerImageRules(): void {
  console.log("[image-rules] Registering image rules")

  // Register all image rules explicitly to prevent tree-shaking
  registerACTRule(imageHasNonEmptyAccessibleNameRule)
  registerACTRule(decorativeImagesHiddenRule)
  registerACTRule(missingAltRule)
  registerACTRule(altTextQualityRule)
  registerACTRule(presentationRoleRule)

  console.log("[image-rules] Image rules registered")
}

// Export the rules for testing
export {
  imageHasNonEmptyAccessibleNameRule,
  decorativeImagesHiddenRule,
  missingAltRule,
  altTextQualityRule,
  presentationRoleRule
}
