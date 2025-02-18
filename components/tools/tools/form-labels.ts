import { BaseTool } from "./base-tool"

export class FormLabelsTool extends BaseTool {
  private hasIssues = false

  getSelector(): string {
    return `
      input:not([type="hidden"]),
      select,
      textarea,
      [role="textbox"],
      [role="combobox"],
      [role="listbox"],
      [role="slider"],
      [role="spinbutton"]
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
      this.logInfo(
        "Form Labels Check Started",
        "Checking form control labels..."
      )
    }

    // Check for explicit label
    const hasExplicitLabel = Boolean(
      el.id && document.querySelector(`label[for="${el.id}"]`)
    )

    // Check for implicit label (wrapped in label element)
    const hasImplicitLabel = Boolean(el.closest("label"))

    // Check for aria-label or aria-labelledby
    const hasAriaLabel = Boolean(
      el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")
    )

    const isValid: boolean =
      hasExplicitLabel || hasImplicitLabel || hasAriaLabel

    if (!isValid) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "label",
        impact: "critical",
        description: "Form element must have a label",
        help: "Add a label element with matching 'for' attribute, wrap in label, or use aria-label/aria-labelledby",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/label",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: `Fix any of the following:
              - Element does not have a label
              - Form element is not labeled by any other element
              - No aria-label or aria-labelledby present`,
          },
        ],
      })
    }

    // Get label text for display
    const labelText = this.getLabelText(el)
    this.highlightElement(el, isValid, labelText || "No label")

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Form Labels Check Passed",
        "All form controls have labels",
        "Labels are properly associated",
        "ARIA labeling is valid"
      )
    }

    return {
      isValid,
      message: isValid
        ? undefined
        : `Missing label for ${el.tagName.toLowerCase()}`,
    }
  }

  private getLabelText(el: HTMLElement): string {
    // Check explicit label
    if (el.id) {
      const label = document.querySelector(`label[for="${el.id}"]`)
      if (label) return label.textContent?.trim() || ""
    }

    // Check implicit label
    const parentLabel = el.closest("label")
    if (parentLabel) {
      const labelText = Array.from(parentLabel.childNodes)
        .filter((node) => node !== el && node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent?.trim())
        .join(" ")
      if (labelText) return labelText
    }

    // Check aria-label
    const ariaLabel = el.getAttribute("aria-label")
    if (ariaLabel) return ariaLabel

    // Check aria-labelledby
    const labelledBy = el.getAttribute("aria-labelledby")
    if (labelledBy) {
      return labelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id)?.textContent?.trim())
        .filter(Boolean)
        .join(" ")
    }

    return ""
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const type = el.getAttribute("type")
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${type ? `[type="${type}"]` : ""}${id}${classes}`
  }
}

// Export a singleton instance
const formLabelsTool = new FormLabelsTool()
export const checkFormLabels = (mode: "apply" | "cleanup" = "apply") =>
  formLabelsTool.run(mode)
