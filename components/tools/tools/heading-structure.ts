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

export class HeadingsTool extends BaseTool {
  getSelector(): string {
    return "h1, h2, h3, h4, h5, h6, [role='heading']:not([role='presentation'])"
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const level = Number(
      el.tagName.toLowerCase().startsWith("h")
        ? el.tagName.charAt(1)
        : el.getAttribute("aria-level") || 6
    )

    // Get index of current element in the heading sequence
    const elements = Array.from(this.getElements())
    const currentIndex = elements.indexOf(el)

    // Find the last valid heading level before this one
    let lastValidLevel = 0
    for (let i = 0; i < currentIndex; i++) {
      const prevEl = elements[i]
      const prevLevel = Number(
        prevEl.tagName.toLowerCase().startsWith("h")
          ? prevEl.tagName.charAt(1)
          : prevEl.getAttribute("aria-level") || 6
      )
      if (prevEl.dataset.allyState === "valid") {
        lastValidLevel = prevLevel
      }
    }

    // Validation rules
    const isFirstHeadingH1 = currentIndex === 0 && level === 1
    const isValidSequence =
      currentIndex === 0 || // First heading
      level === lastValidLevel || // Same level as last valid
      level === lastValidLevel + 1 || // One level deeper than last valid
      level < lastValidLevel // Moving back up is valid

    const content = el.textContent || ""
    const hasContent = content.trim().length > 0

    const isValid = hasContent && (isFirstHeadingH1 || isValidSequence)

    let message: string | undefined
    if (!hasContent) {
      message = "Heading has no content"
      this.logAxeIssue({
        id: "empty-heading",
        impact: "serious",
        description: "Heading has no content",
        help: "Headings must have discernible text",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/empty-heading",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="heading"]`],
            failureSummary: "Fix any of the following: Heading has no content",
          },
        ],
      })
    } else if (currentIndex === 0 && !isFirstHeadingH1) {
      message = "First heading must be H1"
      this.logAxeIssue({
        id: "page-has-heading-one",
        impact: "moderate",
        description: "Page must have a level-one heading",
        help: "Page should begin with an h1 heading",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/page-has-heading-one",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="heading"]`],
            failureSummary:
              "Fix any of the following: First heading on the page is not h1",
          },
        ],
      })
    } else if (!isValidSequence) {
      message = `Invalid heading level sequence: H${lastValidLevel} to H${level}`
      this.logAxeIssue({
        id: "heading-order",
        impact: "moderate",
        description: "Heading levels should only increase by one",
        help: "Heading levels should not be skipped",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/heading-order",
        nodes: [
          {
            html: el.outerHTML,
            target: [`${el.tagName.toLowerCase()}[role="heading"]`],
            failureSummary: `Fix any of the following: Heading level should be ${lastValidLevel + 1} instead of ${level}`,
          },
        ],
      })
    }

    const label = `H${level}`
    this.highlightElement(el, isValid, label)

    return { isValid, message }
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
const headingsTool = new HeadingsTool()
export const checkHeadings = (mode: "apply" | "cleanup" = "apply") =>
  headingsTool.run(mode)
