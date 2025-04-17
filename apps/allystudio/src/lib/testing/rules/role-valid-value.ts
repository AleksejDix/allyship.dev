import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { isHiddenFromAT } from "../utils/accessibility-utils"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * List of valid role values according to WAI-ARIA 1.2 specification
 * @see https://www.w3.org/TR/wai-aria-1.2/#role_definitions
 */
const VALID_ROLE_VALUES = [
  // Landmark roles
  "banner",
  "complementary",
  "contentinfo",
  "form",
  "main",
  "navigation",
  "region",
  "search",

  // Document structure roles
  "application",
  "article",
  "cell",
  "columnheader",
  "definition",
  "directory",
  "document",
  "feed",
  "figure",
  "group",
  "heading",
  "img",
  "list",
  "listitem",
  "math",
  "none",
  "note",
  "presentation",
  "row",
  "rowgroup",
  "rowheader",
  "separator",
  "table",
  "term",
  "text",
  "toolbar",

  // Widget roles
  "alert",
  "alertdialog",
  "button",
  "checkbox",
  "combobox",
  "dialog",
  "gridcell",
  "grid",
  "link",
  "log",
  "marquee",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "progressbar",
  "radio",
  "radiogroup",
  "scrollbar",
  "searchbox",
  "slider",
  "spinbutton",
  "status",
  "switch",
  "tab",
  "tablist",
  "tabpanel",
  "textbox",
  "timer",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",

  // Live region roles
  "status",
  "timer",
  "alert",
  "log",
  "marquee",

  // Window roles
  "alertdialog",
  "dialog"
]

/**
 * List of deprecated roles that are still valid but should be avoided
 */
const DEPRECATED_ROLES = [
  "directory", // As of ARIA 1.2
  "document" // As of ARIA 1.2
]

/**
 * ACT Rule: Role attribute has valid value
 *
 * This rule checks that elements with role attributes have valid values
 * according to the WAI-ARIA specification.
 * Based on WCAG 2.1 Success Criterion 4.1.2: Name, Role, Value
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
 * @see https://www.w3.org/TR/wai-aria-1.2/#role_definitions
 */
const roleValidValueRule = createACTRule(
  "role-valid-value",
  "Role attribute has valid value",
  "Elements with role attributes must use values defined in the WAI-ARIA specification.",
  {
    accessibility_requirements: getWCAGReference("4.1.2"),
    categories: [ACTRuleCategory.ARIA],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html",

    // Applicability: Elements with role attribute that are not hidden from AT
    isApplicable: () => {
      // We should only consider elements with non-empty role attributes
      const candidates = document.querySelectorAll("[role]")
      const visibleElements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el) && el.getAttribute("role")?.trim() !== ""
      )

      return visibleElements.length > 0
    },

    execute: async () => {
      // Find all elements with non-empty role attribute
      const candidates = document.querySelectorAll("[role]")

      // Filter out elements that are hidden from AT or have empty role values
      const elements = Array.from(candidates).filter(
        (el) => !isHiddenFromAT(el) && el.getAttribute("role")?.trim() !== ""
      )

      elements.forEach((element) => {
        const htmlElement = element as HTMLElement
        const selector = getValidSelector(htmlElement)

        // Get role value and trim whitespace
        const roleValue =
          htmlElement.getAttribute("role")?.trim().toLowerCase() || ""

        // Handle multiple roles (space-separated, take the first valid one)
        const roleValues = roleValue.split(/\s+/)
        const validRoles = roleValues.filter((role) =>
          VALID_ROLE_VALUES.includes(role)
        )
        const invalidRoles = roleValues.filter(
          (role) => !VALID_ROLE_VALUES.includes(role)
        )
        const deprecatedRoles = roleValues.filter((role) =>
          DEPRECATED_ROLES.includes(role)
        )

        let passed = validRoles.length > 0
        let message = ""
        let severity = "Serious"

        if (invalidRoles.length > 0 && validRoles.length > 0) {
          // Has both valid and invalid roles
          message = `Element has both valid (${validRoles.join(", ")}) and invalid (${invalidRoles.join(", ")}) role values. Browsers will use the first valid role and ignore others.`
          severity = "Warning"
          passed = true
        } else if (invalidRoles.length > 0) {
          // Has only invalid roles
          message = `Element has invalid role value${invalidRoles.length > 1 ? "s" : ""}: "${invalidRoles.join(", ")}". Role values must be from the WAI-ARIA specification.`
          passed = false
        } else if (deprecatedRoles.length > 0) {
          // Has deprecated roles
          message = `Element uses deprecated role${deprecatedRoles.length > 1 ? "s" : ""}: "${deprecatedRoles.join(", ")}". While still valid, these roles should be avoided in favor of newer alternatives.`
          severity = "Warning"
          passed = true
        } else {
          // All roles are valid and not deprecated
          message = `Element has valid role value: "${validRoles.join(", ")}"`
        }

        const result = formatACTResult(
          "role-valid-value",
          "Role attribute has valid value",
          htmlElement,
          selector,
          passed,
          message,
          severity,
          ["WCAG2.1:4.1.2"],
          "https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html"
        )

        actRuleRunner.addResult(result)
      })
    }
  }
)

/**
 * Register all role attribute-related rules
 */
export function registerRoleRules(): void {
  console.log("[role-rules] Registering role rules")

  // Register all role rules explicitly to prevent tree-shaking
  registerACTRule(roleValidValueRule)

  console.log("[role-rules] Role rules registered")
}

// Export the rules for testing
export { roleValidValueRule }
