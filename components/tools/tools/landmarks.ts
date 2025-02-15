import { BaseTool } from "./base-tool"

export class LandmarksTool extends BaseTool {
  private hasIssues = false

  getSelector(): string {
    return `
      main, nav, header, footer, aside,
      [role='main'], [role='navigation'], [role='banner'],
      [role='contentinfo'], [role='complementary'],
      section[aria-label], section[aria-labelledby],
      article[aria-label], article[aria-labelledby],
      form[aria-label], form[aria-labelledby],
      [role='region'][aria-label], [role='region'][aria-labelledby]
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
        "Landmark Structure Check Started",
        "Checking landmark roles and structure..."
      )
    }

    const role = this.getElementRole(el)
    const isValid = this.validateLandmark(el, role)

    if (!isValid) {
      this.hasIssues = true
    }

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Landmark Structure Check Passed",
        "All landmarks have valid roles",
        "No duplicate landmark roles",
        "Main landmark is present",
        "Banner and contentinfo are properly used"
      )
    }

    return {
      isValid,
      message: isValid ? undefined : `Invalid ${role} landmark`,
    }
  }

  private validateLandmark(el: HTMLElement, role: string): boolean {
    const elements = Array.from(this.getElements())
    const mainElements = elements.filter(
      (e) => this.getElementRole(e) === "main"
    )
    const bannerElements = elements.filter(
      (e) => this.getElementRole(e) === "banner"
    )
    const contentinfoElements = elements.filter(
      (e) => this.getElementRole(e) === "contentinfo"
    )

    // Check for presence of main landmark
    if (mainElements.length === 0 && el === elements[elements.length - 1]) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "landmark-main-is-top-level",
        impact: "serious",
        description: "Document must have a main landmark",
        help: "Add a <main> element or element with role='main'",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/landmark-main-is-top-level",
        nodes: [
          {
            html: document.body.outerHTML,
            target: ["body"],
            failureSummary: "No main landmark found in document",
          },
        ],
      })
      return false
    }

    // Check for multiple main landmarks
    if (role === "main" && mainElements.length > 1) {
      this.logAxeIssue({
        id: "landmark-no-duplicate-main",
        impact: "moderate",
        description: "Document must not have more than one main landmark",
        help: "Remove duplicate main landmarks",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/landmark-no-duplicate-main",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: "Multiple main landmarks found",
          },
        ],
      })
      return false
    }

    // Check for multiple banner landmarks
    if (role === "banner" && bannerElements.length > 1) {
      this.logAxeIssue({
        id: "landmark-no-duplicate-banner",
        impact: "moderate",
        description: "Document must not have more than one banner landmark",
        help: "Remove duplicate banner landmarks",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/landmark-no-duplicate-banner",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: "Multiple banner landmarks found",
          },
        ],
      })
      return false
    }

    // Check for multiple contentinfo landmarks
    if (role === "contentinfo" && contentinfoElements.length > 1) {
      this.logAxeIssue({
        id: "landmark-no-duplicate-contentinfo",
        impact: "moderate",
        description:
          "Document must not have more than one contentinfo landmark",
        help: "Remove duplicate contentinfo landmarks",
        helpUrl:
          "https://dequeuniversity.com/rules/axe/4.6/landmark-no-duplicate-contentinfo",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: "Multiple contentinfo landmarks found",
          },
        ],
      })
      return false
    }

    this.highlightElement(el, true, role)
    return true
  }

  private getElementRole(el: HTMLElement): string {
    const explicitRole = el.getAttribute("role")
    if (explicitRole) return explicitRole

    // Map HTML elements to their implicit roles
    const roleMap: Record<string, string> = {
      main: "main",
      nav: "navigation",
      aside: "complementary",
      header: "banner",
      footer: "contentinfo",
    }

    return roleMap[el.tagName.toLowerCase()] || ""
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
const landmarksTool = new LandmarksTool()
export const checkLandmarks = (mode: "apply" | "cleanup" = "apply") =>
  landmarksTool.run(mode)
