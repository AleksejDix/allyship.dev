import { BaseTool } from "./base-tool"

interface ExternalLinkInfo {
  element: HTMLElement
  href: string
  accessibleName: string
  target: string | null
  rel: string | null
  isExternal: boolean
  hasSecureRel: boolean
}

function isExternalLink(href: string): boolean {
  try {
    if (
      href.startsWith("/") ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return false
    }

    const currentDomain = window.location.hostname
    const url = new URL(href)
    const linkDomain = url.hostname

    const normalizedCurrent = currentDomain.replace("www.", "")
    const normalizedLink = linkDomain.replace("www.", "")

    return normalizedCurrent !== normalizedLink
  } catch (error) {
    console.warn("Error parsing URL:", error)
    return false
  }
}

export class ExternalLinksTool extends BaseTool {
  private links: ExternalLinkInfo[] = []
  private currentIndex: number = 0
  private hasIssues: boolean = false

  getSelector(): string {
    return "a[href]"
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Reset state when checking first element
    if (el === this.getElements()[0]) {
      this.links = []
      this.hasIssues = false
      this.logInfo(
        "External Links Check",
        "Checking external links for proper configuration...",
        "WCAG 3.2.5 Level A: Changes on Request"
      )
    }

    const href = el.getAttribute("href") || ""
    const accessibleName = el.textContent || ""
    const target = el.getAttribute("target")
    const rel = el.getAttribute("rel")
    const isExternal = isExternalLink(href)
    const hasSecureRel = !!(
      rel?.includes("noopener") && rel?.includes("noreferrer")
    )

    // Skip non-external links
    if (!isExternal) {
      return { isValid: true }
    }

    const issues: string[] = []
    let isValid = true

    // Check target attribute
    if (target !== "_blank") {
      isValid = false
      issues.push("✕ Should open in new window (target='_blank')")
      this.hasIssues = true
      this.logAxeIssue({
        id: "external-link-target",
        impact: "moderate",
        description: "External links should open in new window",
        help: "Add target='_blank' to external links",
        nodes: [
          {
            html: el.outerHTML,
            target: ["a"],
            failureSummary: "External link missing target='_blank'",
          },
        ],
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/link-in-text-block-without-heading",
      })
    }

    // Check security attributes
    if (!hasSecureRel) {
      isValid = false
      issues.push("✕ Missing security attributes (rel='noopener noreferrer')")
      this.hasIssues = true
      this.logAxeIssue({
        id: "external-link-security",
        impact: "serious",
        description: "External links need security attributes",
        help: "Add rel='noopener noreferrer' to external links",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/link-in-text-block-without-heading",
        nodes: [
          {
            html: el.outerHTML,
            target: ["a"],
            failureSummary: "External link missing security attributes",
          },
        ],
      })
    }

    // Log success if this is the last element and no issues were found
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "External Links Check Passed",
        "All external links open in new window",
        "All external links have security attributes",
        "All external links are properly configured"
      )
    }

    // Highlight the element with appropriate message and color
    this.highlightElement(
      el,
      isValid,
      issues.length > 0
        ? issues.join(" | ")
        : `✓ Valid external link: ${accessibleName}`
    )

    return {
      isValid,
      message: isValid ? undefined : `Invalid external link: ${accessibleName}`,
    }
  }
}
const externalLinksTool = new ExternalLinksTool()
export const checkExternalLinks = (mode: "apply" | "cleanup") =>
  externalLinksTool.run(mode)
