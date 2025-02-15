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
    const textColor = this.getEffectiveColor(el)
    const backgroundColor = this.getEffectiveBackgroundColor(el)

    // Calculate contrast ratio using relative luminance
    const textLuminance = this.getLuminance(textColor)
    const bgLuminance = this.getLuminance(backgroundColor)

    const contrast =
      (Math.max(textLuminance, bgLuminance) + 0.05) /
      (Math.min(textLuminance, bgLuminance) + 0.05)

    // Get text size for WCAG level
    const fontSize = parseFloat(style.fontSize)
    const fontWeight = style.fontWeight
    const isLargeText =
      fontSize >= 18 ||
      (fontSize >= 14 && ["bold", "700", "800", "900"].includes(fontWeight))

    const requiredContrast = isLargeText ? 3 : 4.5
    const isValid = contrast >= requiredContrast

    // Create label with actual contrast ratio
    const label = `${contrast.toFixed(2)}:1 ${isValid ? "(Pass)" : "(Fail)"}`

    this.highlightElement(el, isValid, label)

    return {
      isValid,
      message: isValid
        ? undefined
        : `Insufficient contrast (${contrast.toFixed(2)}:1)`,
    }
  }

  private getEffectiveColor(el: HTMLElement): string {
    let colorObj = colord(window.getComputedStyle(el).color)
    let currentEl: HTMLElement | null = el

    // Handle opacity inheritance
    while (currentEl && currentEl !== document.body) {
      const style = window.getComputedStyle(currentEl)
      const opacity = parseFloat(style.opacity)
      if (opacity < 1) {
        colorObj = colorObj.alpha(colorObj.alpha() * opacity)
      }
      currentEl = currentEl.parentElement
    }

    return colorObj.toRgbString()
  }

  private getEffectiveBackgroundColor(el: HTMLElement): string {
    let currentEl: HTMLElement | null = el
    let bgColor = "transparent"
    let parentBgColor = "transparent"

    // Find closest parent with background
    let parent = el.parentElement
    while (parent) {
      const style = window.getComputedStyle(parent)
      if (
        style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
        style.backgroundColor !== "transparent"
      ) {
        parentBgColor = style.backgroundColor
        break
      }
      parent = parent.parentElement
    }

    // Check element itself
    const style = window.getComputedStyle(el)
    if (
      style.backgroundColor !== "rgba(0, 0, 0, 0)" &&
      style.backgroundColor !== "transparent"
    ) {
      bgColor = style.backgroundColor
    } else {
      bgColor = parentBgColor
    }

    // Fallback to theme colors if needed
    if (bgColor === "transparent") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      bgColor = isDark ? "rgb(24, 24, 27)" : "rgb(255, 255, 255)"
    }

    return bgColor
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

    // Convert to relative luminance using WCAG formula
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
