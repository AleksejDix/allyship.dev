import { BaseTool } from "./base-tool"

export class ImageAltTool extends BaseTool {
  private hasIssues = false

  getSelector(): string {
    return `
      img,
      [role="img"],
      area[href],
      input[type="image"],
      svg:not([aria-hidden="true"])
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
        "Image Alt Text Check Started",
        "Checking image descriptions..."
      )
    }

    const altText = this.getAltText(el)
    const isDecorative = this.isDecorativeImage(el)
    const isValid = isDecorative || Boolean(altText)

    if (!isValid) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "image-alt",
        impact: "critical",
        description: "Images must have alternate text",
        help: "Add alt text or mark as decorative",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/image-alt",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary: "Image has no alt text or aria-label",
          },
        ],
      })
    }

    // Show alt text or decorative status in highlight
    const label = isDecorative ? "Decorative" : altText || "Missing alt text"
    this.highlightElement(el, isValid, label)

    // If this is the last element and no issues were found, log success
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Image Alt Text Check Passed",
        "All images have descriptions",
        "Decorative images properly marked",
        "Alt text is meaningful"
      )
    }

    return {
      isValid,
      message: isValid
        ? undefined
        : `Missing alt text for ${this.getElementSelector(el)}`,
    }
  }

  private getAltText(el: HTMLElement): string {
    // Check alt attribute
    if (el instanceof HTMLImageElement || el instanceof HTMLInputElement) {
      const alt = el.getAttribute("alt")
      if (alt !== null) return alt
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

    // Check SVG title
    if (el instanceof SVGElement) {
      const title = el.querySelector("title")
      if (title) return title.textContent?.trim() || ""
    }

    return ""
  }

  private isDecorativeImage(el: HTMLElement): boolean {
    return (
      el.getAttribute("role") === "presentation" ||
      el.getAttribute("aria-hidden") === "true" ||
      (el instanceof HTMLImageElement && el.alt === "")
    )
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
const imageAltTool = new ImageAltTool()
export const checkImageAlt = (mode: "apply" | "cleanup" = "apply") =>
  imageAltTool.run(mode)
