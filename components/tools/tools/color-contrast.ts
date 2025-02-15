import { colord, extend } from "colord"
import a11yPlugin from "colord/plugins/a11y"
import mixPlugin from "colord/plugins/mix"

import { BaseTool } from "./base-tool"

// Add plugins to colord
extend([a11yPlugin, mixPlugin])

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

    // Calculate contrast using relative luminance
    const textLuminance = this.getLuminance(textColor)
    const bgLuminance = this.getLuminance(bgColor)

    // Use the formula: (L1 + 0.05) / (L2 + 0.05)
    // where L1 is the lighter of the two luminances
    const contrast =
      textLuminance > bgLuminance
        ? (textLuminance + 0.05) / (bgLuminance + 0.05)
        : (bgLuminance + 0.05) / (textLuminance + 0.05)

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
    const bgColors = this.getBackgroundColors(el)

    if (!bgColors.length) {
      return "rgb(255, 255, 255)"
    }

    if (bgColors.length === 1) {
      return bgColors[0]
    }

    // Now mix will work correctly
    return bgColors.reduce((prev, curr) => {
      const prevColor = colord(prev)
      const currColor = colord(curr)
      return prevColor.mix(currColor).toRgbString()
    })
  }

  private getBackgroundColors(el: HTMLElement): string[] {
    const colors: string[] = []
    let currentElement: HTMLElement | null = el

    // Walk up the DOM tree
    while (currentElement && currentElement !== document.body) {
      const computedStyle = window.getComputedStyle(currentElement)

      // Check if element is visually rendered
      if (
        computedStyle.display === "none" ||
        computedStyle.visibility === "hidden"
      ) {
        break
      }

      // Get background color considering color-scheme
      const bgcolor = computedStyle.backgroundColor
      const colorScheme = computedStyle.colorScheme

      // If color-scheme is dark and no background is set, use black
      if (
        (bgcolor === "transparent" || bgcolor === "rgba(0, 0, 0, 0)") &&
        colorScheme === "dark"
      ) {
        colors.push("rgb(0, 0, 0)") // Use black for dark scheme
        break
      }

      if (bgcolor !== "transparent" && bgcolor !== "rgba(0, 0, 0, 0)") {
        colors.push(bgcolor)
      }

      // Check background image
      const bgImage = computedStyle.backgroundImage
      if (bgImage && bgImage !== "none") {
        if (colors.length === 0) {
          colors.push(
            colorScheme === "dark" ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"
          )
        }
        break
      }

      // Check opacity
      const opacity = parseFloat(computedStyle.opacity)
      if (opacity < 1 && colors.length > 0) {
        colors[colors.length - 1] = colord(colors[colors.length - 1])
          .alpha(opacity)
          .toRgbString()
      }

      currentElement = currentElement.parentElement
    }

    // Check body and html with color-scheme consideration
    if (colors.length === 0) {
      const rootColorScheme = window.getComputedStyle(
        document.documentElement
      ).colorScheme
      const bodyColorScheme = window.getComputedStyle(document.body).colorScheme

      if (rootColorScheme === "dark" || bodyColorScheme === "dark") {
        return ["rgb(0, 0, 0)"]
      }
    }

    return colors.length > 0 ? colors : ["rgb(255, 255, 255)"]
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
  }

  private getLuminance(color: string): number {
    const rgb = colord(color).toRgb()

    // Convert to relative luminance using sRGB
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
      const sRGB = c / 255
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4)
    })

    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
}

// Export a singleton instance
const colorContrastTool = new ColorContrastTool()
export const checkColorContrast = (mode: "apply" | "cleanup" = "apply") =>
  colorContrastTool.run(mode)
