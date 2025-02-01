import { expect, test } from "@playwright/test"

export interface ContrastTestResult {
  element: {
    selector: string
    tagName: string
    role?: string
    className?: string
    id?: string
  }
  colors: {
    foreground: string
    background: string
  }
  position?: {
    x: number
    y: number
  }
  contrastRatio: number
  isLargeText: boolean
  passes: {
    AA: boolean
    AAA: boolean
  }
}

export interface ContrastViolation extends ContrastTestResult {
  html: string
}
export class ContrastChecker {
  /**
   * Calculates the relative luminance of an RGB color
   */
  private static getLuminance([r, g, b]: number[]): number {
    const [rs, gs, bs] = [r, g, b].map((channel) => {
      channel = channel / 255
      return channel <= 0.03928
        ? channel / 12.92
        : Math.pow((channel + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  /**
   * Converts various color formats to RGB array
   */
  private static parseColor(color: string): number[] {
    // Handle rgba format
    if (color.startsWith("rgba")) {
      const values = color.match(/[\d.]+/g)
      if (!values || values.length < 3)
        throw new Error(`Invalid color format: ${color}`)
      return values.slice(0, 3).map(Number)
    }

    // Handle rgb format
    if (color.startsWith("rgb")) {
      const values = color.match(/\d+/g)
      if (!values || values.length < 3)
        throw new Error(`Invalid color format: ${color}`)
      return values.map(Number)
    }

    // Handle hex format
    if (color.startsWith("#")) {
      const hex = color.slice(1)
      const rgb =
        hex.length === 3
          ? hex.split("").map((c) => parseInt(c + c, 16))
          : hex.match(/.{2}/g)?.map((c) => parseInt(c, 16))
      if (!rgb || rgb.length < 3) throw new Error(`Invalid hex color: ${color}`)
      return rgb
    }

    throw new Error(`Unsupported color format: ${color}`)
  }

  /**
   * Calculates contrast ratio between two colors
   */
  static getContrastRatio(foreground: string, background: string): number {
    try {
      const fgLuminance = this.getLuminance(this.parseColor(foreground))
      const bgLuminance = this.getLuminance(this.parseColor(background))

      const lighter = Math.max(fgLuminance, bgLuminance)
      const darker = Math.min(fgLuminance, bgLuminance)

      return (lighter + 0.05) / (darker + 0.05)
    } catch (error) {
      console.error("Error calculating contrast ratio:", error)
      return 0
    }
  }

  /**
   * Checks if the contrast ratio meets WCAG requirements
   */
  static meetsWCAGRequirements(
    contrastRatio: number,
    level: "AA" | "AAA" = "AA",
    isLargeText: boolean = false
  ): boolean {
    const minimumRatios = {
      AA: { normal: 4.5, large: 3 },
      AAA: { normal: 7, large: 4.5 },
    }

    const requiredRatio = minimumRatios[level][isLargeText ? "large" : "normal"]
    return contrastRatio >= requiredRatio
  }
}

test.describe("WCAG Color Contrast Requirements", () => {
  test("elements should meet AA contrast requirements", async ({ page }) => {
    // Navigate to the page and wait for network idle
    await page.goto("/")
    await page.waitForLoadState("networkidle")

    const violations: ContrastViolation[] = []
    const results: ContrastTestResult[] = []

    // Get all visible text elements
    const elements = await page.$$eval(
      "body *:not(script):not(style)",
      (nodes) => {
        return nodes
          .filter((node) => {
            const style = window.getComputedStyle(node)
            return (
              style.display !== "none" &&
              style.visibility !== "hidden" &&
              style.opacity !== "0" &&
              node.textContent?.trim()
            )
          })
          .map((node) => ({
            selector:
              node.tagName.toLowerCase() +
              (node.id ? `#${node.id}` : "") +
              (node.className ? `.${node.className.split(" ").join(".")}` : ""),
            tagName: node.tagName.toLowerCase(),
            role: node.getAttribute("role"),
            className: node.className,
            id: node.id,
          }))
      }
    )

    // Test each element
    for (const elementInfo of elements) {
      const element = await page.$(elementInfo.selector)
      if (!element) continue

      const styles = await element.evaluate((el) => {
        const style = window.getComputedStyle(el)
        const fontSize = parseFloat(style.fontSize)
        const fontWeight = style.fontWeight

        return {
          color: style.color,
          backgroundColor: style.backgroundColor,
          fontSize,
          fontWeight,
          isLargeText:
            fontSize >= 24 ||
            (fontSize >= 18.66 && parseInt(fontWeight) >= 700),
        }
      })

      const contrastRatio = ContrastChecker.getContrastRatio(
        styles.color,
        styles.backgroundColor
      )

      const bbox = await element.boundingBox()

      const result: ContrastTestResult = {
        element: elementInfo,
        colors: {
          foreground: styles.color,
          background: styles.backgroundColor,
        },
        position: bbox
          ? {
              x: Math.round(bbox.x),
              y: Math.round(bbox.y),
            }
          : undefined,
        contrastRatio,
        isLargeText: styles.isLargeText,
        passes: {
          AA: ContrastChecker.meetsWCAGRequirements(
            contrastRatio,
            "AA",
            styles.isLargeText
          ),
          AAA: false, // Set to false since we're not checking AAA
        },
      }

      results.push(result)

      // If element fails AA requirements, add to violations
      if (!result.passes.AA) {
        violations.push({
          ...result,
          html: await element.evaluate((el) => el.outerHTML),
        })
      }
    }

    // Generate detailed report
    const report = {
      url: page.url(),
      timestamp: new Date().toISOString(),
      totalElements: results.length,
      passedAA: results.filter((r) => r.passes.AA).length,
      passedAAA: 0, // Set to 0 since we're not checking AAA
      violations,
    }

    // Output report to console in a readable format
    console.log(JSON.stringify(report, null, 2))

    // Assert no violations
    expect(violations, "Found contrast violations").toHaveLength(0)
  })
})
