import { colord, extend } from "colord"
import a11yPlugin from "colord/plugins/a11y"

import { BaseTool } from "./base-tool"

// Add a11y plugin to colord
extend([a11yPlugin])

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

export class ColorContrastTool extends BaseTool {
  getSelector(): string {
    return `
      p, h1, h2, h3, h4, h5, h6,
      span, a, button, label,
      [role="button"], [role="link"],
      [role="heading"], [role="tab"],
      input, select, textarea
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    const style = window.getComputedStyle(el)
    const textColor = style.color
    const bgColor = this.getBackgroundColor(el)

    // Skip if element or its text is hidden
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0" ||
      !el.textContent?.trim()
    ) {
      return { isValid: true }
    }

    const fontSize = parseFloat(style.fontSize)
    const fontWeight = style.fontWeight
    const isLargeText =
      fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= "700")

    const contrast = colord(textColor).contrast(bgColor)
    const requiredRatio = isLargeText ? 3 : 4.5

    const isValid = contrast >= requiredRatio

    if (!isValid) {
      this.logAxeIssue({
        id: "color-contrast",
        impact: "serious",
        description: "Elements must have sufficient color contrast",
        help: `Contrast ratio should be at least ${requiredRatio}:1`,
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/color-contrast",
        nodes: [
          {
            html: el.outerHTML,
            target: [this.getElementSelector(el)],
            failureSummary:
              `Fix any of the following:\n` +
              `Element has insufficient color contrast of ${contrast.toFixed(2)} ` +
              `(foreground color: ${textColor}, background color: ${bgColor}, ` +
              `required ratio: ${requiredRatio}:1)`,
          },
        ],
      })
    }

    this.highlightElement(
      el,
      isValid,
      `${contrast.toFixed(2)}:1 ${isLargeText ? "(large)" : ""}`
    )

    return {
      isValid,
      message: isValid
        ? undefined
        : `Insufficient contrast (${contrast.toFixed(2)}:1)`,
    }
  }

  private getBackgroundColor(el: HTMLElement): string {
    const style = window.getComputedStyle(el)

    // If element has solid background, return it
    if (style.backgroundColor !== "rgba(0, 0, 0, 0)") {
      return style.backgroundColor
    }

    // Walk up the DOM tree to find background color
    let parent = el.parentElement
    while (parent) {
      const parentStyle = window.getComputedStyle(parent)
      if (parentStyle.backgroundColor !== "rgba(0, 0, 0, 0)") {
        return parentStyle.backgroundColor
      }
      parent = parent.parentElement
    }

    // Default to white if no background found
    return "rgb(255, 255, 255)"
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
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
const colorContrastTool = new ColorContrastTool()
export const checkColorContrast = (mode: "apply" | "cleanup" = "apply") =>
  colorContrastTool.run(mode)
