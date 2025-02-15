import { BaseTool } from "./base-tool"

interface AxeIssue {
  id: string
  impact: "minor" | "moderate" | "serious" | "critical"
  description: string
  help: string
  helpUrl: string
  nodes: {
    html: string
    target: string[]
    failureSummary: string
  }[]
}

export class CursorRuleTool extends BaseTool {
  getSelector(): string {
    return `
      a, button, [role="button"],
      [role="link"], [role="tab"],
      input, select, textarea,
      [tabindex]:not([tabindex="-1"])
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const computedStyle = window.getComputedStyle(el)
    const cursor = computedStyle.cursor
    const role = el.getAttribute("role") || this.getImplicitRole(el)

    // Interactive elements should have pointer cursor
    const shouldHavePointer = [
      "button",
      "link",
      "tab",
      "checkbox",
      "radio",
      "textbox",
      "combobox",
      "listbox",
    ].includes(role)

    const isValid = !shouldHavePointer || cursor === "pointer"

    if (!isValid) {
      this.logAxeIssue({
        id: "cursor-pointer",
        impact: "moderate",
        description: "Interactive elements should have pointer cursor",
        help: `Element with role '${role}' should have cursor: pointer`,
        helpUrl: "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="${role}"]`],
            failureSummary: `Fix any of the following: Element with role '${role}' has cursor: ${cursor}`,
          },
        ],
      })
    }

    this.highlightElement(el, isValid, `${role}: ${cursor}`)

    return {
      isValid,
      message: isValid
        ? undefined
        : `Invalid cursor style for ${role}: ${cursor}`,
    }
  }

  private getImplicitRole(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const type = el.getAttribute("type")

    const roleMap: Record<string, string> = {
      a: "link",
      button: "button",
      input:
        type === "radio"
          ? "radio"
          : type === "checkbox"
            ? "checkbox"
            : "textbox",
      select: "combobox",
      textarea: "textbox",
    }

    return roleMap[tag] || "generic"
  }

  private logAxeIssue(issue: AxeIssue) {
    console.group(
      `%cAxe Issue: ${issue.id}`,
      "color: #d93251; font-weight: bold;"
    )
    console.log("Impact:", issue.impact)
    console.log("Description:", issue.description)
    console.log("Help:", issue.help)
    console.log("Help URL:", issue.helpUrl)
    console.log("Nodes:", issue.nodes)
    console.groupEnd()
  }
}

// Export a singleton instance
const cursorRuleTool = new CursorRuleTool()
export const checkCursorRules = (mode: "apply" | "cleanup" = "apply") =>
  cursorRuleTool.run(mode)
