import { BaseTool } from "./base-tool"

export class HeadingsTool extends BaseTool {
  private hasIssues = false
  private lastValidLevel = 0

  getSelector(): string {
    return "h1, h2, h3, h4, h5, h6, [role='heading']:not([role='presentation'])"
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Reset state at start of validation
    if (el === this.getElements()[0]) {
      this.hasIssues = false
      this.lastValidLevel = 0
      this.logInfo(
        "Heading Structure Check Started",
        "Checking heading levels and order..."
      )
    }

    const level = Number(
      el.tagName.toLowerCase().startsWith("h")
        ? el.tagName.charAt(1)
        : el.getAttribute("aria-level") || 6
    )

    // Get index of current element in the heading sequence
    const elements = Array.from(this.getElements())
    const currentIndex = elements.indexOf(el)

    // First heading should be h1
    if (currentIndex === 0 && level !== 1) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "page-has-heading-one",
        impact: "serious",
        description: "Page must start with a level-one heading",
        help: "First heading on the page should be an <h1>",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/page-has-heading-one",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="heading"]`],
            failureSummary: "First heading on the page is not h1",
          },
        ],
      })
      this.highlightElement(el, false, `H${level} (Should be H1)`)
      return {
        isValid: false,
        message: "First heading must be H1",
      }
    }

    // Check for valid heading level sequence
    const isValidSequence = level <= this.lastValidLevel + 1
    const isValid = currentIndex === 0 ? level === 1 : isValidSequence

    if (!isValid) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "heading-order",
        impact: "moderate",
        description: "Heading levels should only increase by one",
        help: `Heading level should be ${this.lastValidLevel + 1} instead of ${level}`,
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/heading-order",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="heading"]`],
            failureSummary: `Invalid heading sequence: H${this.lastValidLevel} to H${level}`,
          },
        ],
      })
    } else {
      this.lastValidLevel = level
    }

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Heading Structure Check Passed",
        "First heading is H1",
        "Heading levels increase by one",
        "All headings follow correct sequence"
      )
    }

    this.highlightElement(el, isValid, `H${level}`)
    return {
      isValid,
      message: isValid
        ? undefined
        : `Invalid heading sequence: H${this.lastValidLevel} to H${level}`,
    }
  }
}

// Export a singleton instance
const headingsTool = new HeadingsTool()
export const checkHeadings = (mode: "apply" | "cleanup" = "apply") =>
  headingsTool.run(mode)
