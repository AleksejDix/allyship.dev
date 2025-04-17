import { validate } from "bcp47-validate"

import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { isHiddenFromAT } from "../utils/accessibility-utils"
import { formatACTResult } from "../utils/act-result-formatter"
import { getLanguageDisplayName } from "../utils/language-utils"
import { getValidSelector } from "../utils/selector-utils"

/**
 * Checks if an element has direct text content (not inside child elements)
 * @param element The element to check
 * @returns true if the element has direct text content
 */
function hasDirectTextContent(element: Element): boolean {
  // Check all child nodes
  for (const node of Array.from(element.childNodes)) {
    // If there's a text node with non-whitespace content, return true
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() !== "") {
      return true
    }
  }
  return false
}

/**
 * ACT Rule: Valid Language Tag for Elements
 *
 * This rule checks that all elements with lang attributes have valid BCP 47 language tags.
 * Based on WCAG 2.1 Success Criterion 3.1.2: Language of Parts
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html
 * @see https://www.rfc-editor.org/info/bcp47
 */
const elementValidLangRule = createACTRule(
  "element-valid-lang",
  "Element lang attribute has valid value",
  "Elements with lang attributes must use valid BCP 47 language tags.",
  {
    accessibility_requirements: getWCAGReference("3.1.2"),
    categories: [ACTRuleCategory.LANGUAGE],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html",

    // Applicability: Elements with lang attribute that are not hidden from AT
    isApplicable: () => {
      // We should only consider elements with non-empty lang attributes
      const candidates = document.querySelectorAll("[lang]")
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el) && el.getAttribute("lang")?.trim() !== ""
      )

      // Skip HTML element as it's covered by the language-of-page rule
      const nonHtmlElements = visibleElements.filter(
        (el) => el.tagName.toLowerCase() !== "html"
      )

      return nonHtmlElements.length > 0
    },

    execute: async () => {
      // Find all elements with non-empty lang attribute
      const candidates = document.querySelectorAll("[lang]")

      // Filter out elements that are hidden from AT, have empty lang values, or are the HTML element
      const elements = Array.from(candidates).filter(
        (el) =>
          !isHiddenFromAT(el) &&
          el.getAttribute("lang")?.trim() !== "" &&
          el.tagName.toLowerCase() !== "html"
      )

      elements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const selector = getValidSelector(htmlElement)

        // Get lang value and trim whitespace
        const langValue = htmlElement.getAttribute("lang")?.trim() || ""

        // Validate the language tag using BCP 47 standards
        const isValidLang = validate(langValue)

        // Check if the element has direct text content
        const hasDirectText = hasDirectTextContent(htmlElement)

        // The test passes if:
        // 1. The language tag is valid, OR
        // 2. The element doesn't have direct text content (text is in child elements)
        let passed = isValidLang || !hasDirectText
        let message = ""
        let severity = "Serious"

        if (isValidLang) {
          // Valid language tag
          const displayName = getLanguageDisplayName(langValue)
          message = `Element has valid language tag: "${langValue}" (${displayName})`
        } else if (!hasDirectText) {
          // Invalid language tag, but no direct text content
          message = `Element has invalid language tag: "${langValue}", but contains no direct text content, so it passes.`
          severity = "Moderate"
        } else {
          // Invalid language tag with direct text content
          message = `Element has invalid language tag: "${langValue}". Language tags must be valid BCP 47 language tags (e.g., 'en', 'en-US', 'fr', 'de-DE').`
        }

        const result = formatACTResult(
          "element-valid-lang",
          "Element lang attribute has valid value",
          htmlElement,
          selector,
          passed,
          message,
          severity,
          ["WCAG2.1:3.1.2"],
          "https://www.w3.org/WAI/WCAG21/Understanding/language-of-parts.html"
        )

        actRuleRunner.addResult(result)
      })
    }
  }
)

/**
 * Register all language-related element rules
 */
export function registerElementLangRules(): void {
  console.log("[element-lang-rules] Registering element language rules")

  // Register all language-related element rules explicitly to prevent tree-shaking
  registerACTRule(elementValidLangRule)

  console.log("[element-lang-rules] Element language rules registered")
}

// Export the rules for testing
export { elementValidLangRule }
