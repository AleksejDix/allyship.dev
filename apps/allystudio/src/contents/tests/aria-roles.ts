/**
 * ARIA Roles accessibility tests using ACT rule 674b10
 * Tests that role attributes have valid values according to WAI-ARIA specification
 */
export function defineAriaRolesTests(runner: any) {
  runner.describe("ARIA Roles Accessibility", () => {
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
