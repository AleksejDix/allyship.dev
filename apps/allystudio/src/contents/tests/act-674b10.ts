/**
 * ACT Rule 674b10: Role attribute has valid value
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
 * @see https://act-rules.github.io/rules/674b10
 *
 * WCAG Success Criteria:
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * This rule checks that each role attribute has a valid value according to
 * the WAI-ARIA 1.2 specification.
 */
export function defineACTRule_674b10(runner: any) {
  runner.describe("ACT 674b10: Valid ARIA Role", () => {
    runner.test(
      "role attribute has valid value",
      ({ element }: { element: HTMLElement }) => {
        const roleAttribute = element.getAttribute("role")

        if (!roleAttribute) {
          return // No role attribute is fine
        }

        // Valid ARIA roles according to WAI-ARIA 1.2 specification
        const validRoles = new Set([
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
          "toolbar",
          "tooltip",

          // Widget roles
          "button",
          "checkbox",
          "gridcell",
          "link",
          "menuitem",
          "menuitemcheckbox",
          "menuitemradio",
          "option",
          "progressbar",
          "radio",
          "scrollbar",
          "searchbox",
          "slider",
          "spinbutton",
          "switch",
          "tab",
          "tabpanel",
          "textbox",
          "treeitem",

          // Composite widget roles
          "combobox",
          "grid",
          "listbox",
          "menu",
          "menubar",
          "radiogroup",
          "tablist",
          "tree",
          "treegrid",

          // Live region roles
          "alert",
          "log",
          "marquee",
          "status",
          "timer",

          // Window roles
          "alertdialog",
          "dialog"
        ])

        // Split role attribute by spaces to handle multiple roles
        const roles = roleAttribute.trim().split(/\s+/)

        // Check each role
        for (const role of roles) {
          if (!validRoles.has(role.toLowerCase())) {
            throw new Error(
              `Invalid ARIA role "${role}". Role attribute must contain only valid ARIA roles. Found: "${roleAttribute}"`
            )
          }
        }
      },
      "[role]"
    )
  })
}
