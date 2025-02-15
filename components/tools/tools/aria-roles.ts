import { BaseTool } from "./base-tool"

export class AriaRolesTool extends BaseTool {
  private hasIssues = false

  getSelector(): string {
    return `
      [role],
      button, a[href], input, select, textarea,
      video, audio, img[alt], dialog,
      header, footer, main, nav, aside
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Reset state at start of validation
    if (el === this.getElements()[0]) {
      this.hasIssues = false
      this.logInfo("ARIA Roles Check Started", "Checking ARIA role usage...")
    }

    const explicitRole = el.getAttribute("role")
    const implicitRole = this.getImplicitRole(el)
    const isValid = this.validateRole(el, explicitRole, implicitRole)

    if (!isValid) {
      this.hasIssues = true
    }

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "ARIA Roles Check Passed",
        "All ARIA roles are valid",
        "No conflicting implicit/explicit roles",
        "All required attributes present"
      )
    }

    return {
      isValid,
      message: isValid ? undefined : `Invalid ARIA role usage`,
    }
  }

  private validateRole(
    el: HTMLElement,
    explicitRole: string | null,
    implicitRole: string
  ): boolean {
    // Check for invalid role values
    if (explicitRole && !this.isValidRole(explicitRole)) {
      this.logAxeIssue({
        id: "aria-roles",
        impact: "serious",
        description: "ARIA roles must be valid",
        help: `Role "${explicitRole}" is not a valid ARIA role`,
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/aria-roles",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: `Invalid ARIA role: ${explicitRole}`,
          },
        ],
      })
      this.highlightElement(el, false, `Invalid role: ${explicitRole}`)
      return false
    }

    // Check for conflicting roles
    if (explicitRole && implicitRole && explicitRole !== implicitRole) {
      // Allow some common valid overrides
      const validOverrides: Record<string, string[]> = {
        button: ["menuitem", "tab", "radio", "switch"],
        a: ["button", "menuitem", "tab"],
        img: ["button", "presentation"],
      }

      const tagName = el.tagName.toLowerCase()
      const allowedOverrides = validOverrides[tagName] || []

      if (!allowedOverrides.includes(explicitRole)) {
        this.logAxeIssue({
          id: "aria-allowed-role",
          impact: "moderate",
          description: "ARIA role must be appropriate for the element",
          help: `Role "${explicitRole}" conflicts with implicit role "${implicitRole}"`,
          helpUrl:
            "https://dequeuniversity.com/rules/axe/4.6/aria-allowed-role",
          nodes: [
            {
              html: el.outerHTML,
              target: [this.getElementSelector(el)],
              failureSummary: `Conflicting roles: ${explicitRole} vs ${implicitRole}`,
            },
          ],
        })
        this.highlightElement(
          el,
          false,
          `Conflict: ${explicitRole} vs ${implicitRole}`
        )
        return false
      }
    }

    // Check for required attributes
    const requiredAttrs = this.getRequiredAttributes(
      explicitRole || implicitRole
    )
    const missingAttrs = requiredAttrs.filter(
      (attr) => !el.hasAttribute(attr) && !el.hasAttribute(`aria-${attr}`)
    )

    if (missingAttrs.length > 0) {
      this.logAxeIssue({
        id: "aria-required-attr",
        impact: "serious",
        description: "Required ARIA attributes must be provided",
        help: `Missing required attributes: ${missingAttrs.join(", ")}`,
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/aria-required-attr",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: `Missing attributes: ${missingAttrs.join(", ")}`,
          },
        ],
      })
      this.highlightElement(el, false, `Missing: ${missingAttrs.join(", ")}`)
      return false
    }

    // Valid role usage
    this.highlightElement(
      el,
      true,
      explicitRole || implicitRole || "No role needed"
    )
    return true
  }

  private isValidRole(role: string): boolean {
    const validRoles = new Set([
      "alert",
      "alertdialog",
      "application",
      "article",
      "banner",
      "button",
      "cell",
      "checkbox",
      "columnheader",
      "combobox",
      "complementary",
      "contentinfo",
      "definition",
      "dialog",
      "directory",
      "document",
      "feed",
      "figure",
      "form",
      "grid",
      "gridcell",
      "group",
      "heading",
      "img",
      "link",
      "list",
      "listbox",
      "listitem",
      "log",
      "main",
      "marquee",
      "math",
      "menu",
      "menubar",
      "menuitem",
      "menuitemcheckbox",
      "menuitemradio",
      "navigation",
      "none",
      "note",
      "option",
      "presentation",
      "progressbar",
      "radio",
      "radiogroup",
      "region",
      "row",
      "rowgroup",
      "rowheader",
      "scrollbar",
      "search",
      "searchbox",
      "separator",
      "slider",
      "spinbutton",
      "status",
      "switch",
      "tab",
      "table",
      "tablist",
      "tabpanel",
      "term",
      "textbox",
      "timer",
      "toolbar",
      "tooltip",
      "tree",
      "treegrid",
      "treeitem",
    ])

    return validRoles.has(role.toLowerCase())
  }

  private getImplicitRole(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const type = el.getAttribute("type")

    // Map of elements to their implicit roles
    const roleMap: Record<string, string> = {
      a: el.hasAttribute("href") ? "link" : "",
      article: "article",
      aside: "complementary",
      button: "button",
      dialog: "dialog",
      footer: "contentinfo",
      form: "form",
      header: "banner",
      img: "img",
      input: this.getInputRole(type),
      main: "main",
      nav: "navigation",
      select: "listbox",
      textarea: "textbox",
    }

    return roleMap[tag] || ""
  }

  private getInputRole(type: string | null): string {
    const inputRoles: Record<string, string> = {
      button: "button",
      checkbox: "checkbox",
      radio: "radio",
      range: "slider",
      search: "searchbox",
      text: "textbox",
    }

    return type ? inputRoles[type] || "textbox" : "textbox"
  }

  private getRequiredAttributes(role: string): string[] {
    const requiredAttrs: Record<string, string[]> = {
      checkbox: ["checked"],
      combobox: ["expanded"],
      listbox: ["expanded"],
      radiogroup: ["aria-required"],
      scrollbar: [
        "controls",
        "orientation",
        "valuemax",
        "valuemin",
        "valuenow",
      ],
      slider: ["valuemax", "valuemin", "valuenow"],
      spinbutton: ["valuemax", "valuemin", "valuenow"],
    }

    return requiredAttrs[role] || []
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
  }
}

// Export a singleton instance
const ariaRolesTool = new AriaRolesTool()
export const checkAriaRoles = (mode: "apply" | "cleanup" = "apply") =>
  ariaRolesTool.run(mode)
