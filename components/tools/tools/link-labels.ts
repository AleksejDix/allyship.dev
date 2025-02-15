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

interface LinkInfo {
  url: string
  labels: Set<string>
  elements: HTMLElement[]
}

export class LinkLabelsTool extends BaseTool {
  getSelector(): string {
    return `
      a[href]:not([role="button"]),
      [role="link"][href]
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const url = this.getNormalizedUrl(el.getAttribute("href") || "")
    const label = this.getAccessibleLabel(el)

    // Skip empty or javascript: URLs
    if (!url || url.startsWith("javascript:")) {
      return { isValid: true }
    }

    // Get all links with the same URL
    const similarLinks = Array.from(this.getElements()).filter(
      (link) => this.getNormalizedUrl(link.getAttribute("href") || "") === url
    )

    const labels = new Set(
      similarLinks.map((link) => this.getAccessibleLabel(link))
    )

    const isValid = labels.size === 1 // All labels should be identical

    if (!isValid) {
      this.logAxeIssue({
        id: "consistent-link-labels",
        impact: "moderate",
        description: "Links to the same URL should have consistent labels",
        help: "Ensure that links with the same destination have the same label",
        helpUrl:
          "https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary:
              `Fix any of the following:\n` +
              `Links to ${url} have inconsistent labels:\n` +
              `${Array.from(labels).join("\n")}`,
          },
        ],
      })
    }

    this.highlightElement(el, isValid, `${label} → ${url}`)

    return {
      isValid,
      message: isValid ? undefined : `Inconsistent labels for ${url}`,
    }
  }

  private getNormalizedUrl(url: string): string {
    try {
      // Remove trailing slashes and hash
      return url.replace(/\/$/, "").replace(/#.*$/, "").toLowerCase()
    } catch {
      return url.toLowerCase()
    }
  }

  private getAccessibleLabel(el: HTMLElement): string {
    // Check aria-label
    const ariaLabel = el.getAttribute("aria-label")
    if (ariaLabel?.trim()) {
      return ariaLabel.trim()
    }

    // Check aria-labelledby
    const labelledBy = el.getAttribute("aria-labelledby")
    if (labelledBy) {
      const labelElements = labelledBy
        .split(/\s+/)
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null)
      if (labelElements.length > 0) {
        return labelElements
          .map((el) => el.textContent)
          .join(" ")
          .trim()
      }
    }

    // Get visible text content
    return el.textContent?.trim() || ""
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
const linkLabelsTool = new LinkLabelsTool()
export const checkLinkLabels = (mode: "apply" | "cleanup" = "apply") =>
  linkLabelsTool.run(mode)
