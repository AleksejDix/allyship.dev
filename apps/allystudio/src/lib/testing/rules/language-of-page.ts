import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"

/**
 * ACT Rule: Language of Page (WCAG 3.1.1)
 *
 * Checks if the HTML element has a valid lang attribute
 */
const languageOfPageRule = createACTRule(
  "language-of-page",
  "Language of Page",
  "The default human language of each Web page can be programmatically determined",
  {
    accessibility_requirements: getWCAGReference("3.1.1"),
    categories: [ACTRuleCategory.LANGUAGE],
    input_aspects: ["DOM Tree"],
    execute: async () => {
      // Get the HTML element
      const htmlElement = document.documentElement

      // Check if lang attribute exists
      const langAttribute = htmlElement.getAttribute("lang")

      if (!langAttribute) {
        // No lang attribute found - this is a failure
        actRuleRunner.addResult({
          rule: {
            id: "language-of-page",
            name: "Language of Page"
          },
          outcome: "failed",
          element: {
            selector: "html",
            html: htmlElement.outerHTML.substring(0, 100) + "..."
          },
          message: "The HTML element does not have a lang attribute",
          impact: "serious",
          remediation:
            "Add a lang attribute to the HTML element with the appropriate language code",
          wcagCriteria: ["3.1.1"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html"
        })
        return
      }

      // Check if lang attribute is valid
      // BCP 47 language tags typically follow patterns like 'en', 'en-US', 'fr', 'de-DE', etc.
      const validLangPattern = /^[a-zA-Z]{2,3}(-[a-zA-Z]{2,3})?$/

      if (!validLangPattern.test(langAttribute)) {
        // Invalid lang attribute format
        actRuleRunner.addResult({
          rule: {
            id: "language-of-page",
            name: "Language of Page"
          },
          outcome: "failed",
          element: {
            selector: "html",
            html: htmlElement.outerHTML.substring(0, 100) + "...",
            attributes: { lang: langAttribute }
          },
          message: `The lang attribute value "${langAttribute}" is not a valid BCP 47 language tag`,
          impact: "moderate",
          remediation:
            "Use a valid BCP 47 language tag (e.g., 'en', 'en-US', 'fr', 'de-DE')",
          wcagCriteria: ["3.1.1"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html"
        })
        return
      }

      // Check for empty lang attribute
      if (langAttribute.trim() === "") {
        actRuleRunner.addResult({
          rule: {
            id: "language-of-page",
            name: "Language of Page"
          },
          outcome: "failed",
          element: {
            selector: "html",
            html: htmlElement.outerHTML.substring(0, 100) + "...",
            attributes: { lang: langAttribute }
          },
          message: "The lang attribute is empty",
          impact: "serious",
          remediation: "Add a valid language code to the lang attribute",
          wcagCriteria: ["3.1.1"],
          helpUrl:
            "https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html"
        })
        return
      }

      // If we get here, the test passed
      actRuleRunner.addResult({
        rule: {
          id: "language-of-page",
          name: "Language of Page"
        },
        outcome: "passed",
        element: {
          selector: "html",
          html: htmlElement.outerHTML.substring(0, 100) + "...",
          attributes: { lang: langAttribute }
        },
        message: `The page correctly specifies its language as "${langAttribute}"`,
        wcagCriteria: ["3.1.1"]
      })
    }
  }
)

// Register the rule
registerACTRule(languageOfPageRule)

/**
 * Register all language-related rules
 */
export function registerLanguageRules(): void {
  console.log("[language-rules] Registering language rules")

  // Register all language rules explicitly to prevent tree-shaking
  registerACTRule(languageOfPageRule)

  console.log("[language-rules] Language rules registered")
}

// Export the rule for testing
export { languageOfPageRule }
