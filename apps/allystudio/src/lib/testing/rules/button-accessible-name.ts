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
 * ACT Rule: Buttons must have an accessible name
 *
 * This rule checks that all button elements have an accessible name.
 * Based on WCAG 2.1 Success Criterion 4.1.2: Name, Role, Value
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
 */
const buttonAccessibleNameRule = createACTRule(
  "button-has-accessible-name",
  "Buttons must have an accessible name",
  "This rule checks that all button elements have an accessible name.",
  {
    accessibility_requirements: getWCAGReference("4.1.2"),
    categories: [ACTRuleCategory.FORMS, ACTRuleCategory.ARIA],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html",

    // Check if the rule is applicable to the current page
    isApplicable: () => {
      // Rule applies if there are any button elements or elements with role="button"
      const buttons = document.querySelectorAll('button, [role="button"]')
      return buttons.length > 0
    },

    // Execute the rule
    execute: async () => {
      // Find all button elements and elements with role="button"
      const buttons = document.querySelectorAll('button, [role="button"]')

      // Check each button for an accessible name
      for (const button of Array.from(buttons)) {
        const element = button as HTMLElement
        const accessibleName = getAccessibleName(element)
        const selector = getValidSelector(element)

        // Determine if the button passes or fails
        const passed = accessibleName.trim().length > 0

        // Create a message based on the result
        let message = ""
        if (passed) {
          message = `Button has accessible name: "${accessibleName}"`
        } else {
          message = "Button does not have an accessible name"
        }

        // Format and add the result
        const result = formatACTResult(
          "button-has-accessible-name",
          "Buttons must have an accessible name",
          element,
          selector,
          passed,
          message,
          "Serious", // Severity
          ["WCAG2.1:4.1.2"], // WCAG criteria
          "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html" // Help URL
        )

        // Add the result to the runner
        actRuleRunner.addResult(result)
      }
    }
  }
)

// Register the rule
registerACTRule(buttonAccessibleNameRule)

/**
 * Register all button-related rules
 */
export function registerButtonRules(): void {
  console.log("[button-rules] Registering button rules")

  // Register all button rules explicitly to prevent tree-shaking
  registerACTRule(buttonAccessibleNameRule)

  console.log("[button-rules] Button rules registered")
}

// Export the rule for testing
export { buttonAccessibleNameRule }
