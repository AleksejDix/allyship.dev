import type { Runner } from "../core/types.js"

/**
 * Color contrast analyzer plugin
 * Usage: runner.use(useContrastAnalyzer)
 */
export function useContrastAnalyzer(_runner: Runner): void {
  // Add contrast analyzer to global scope
  if (typeof window !== "undefined") {
    ;(window as any).analyzeContrast = analyzeContrast
    ;(window as any).getColorContrast = getColorContrast
  }

  /**
   * Convert RGB to relative luminance
   */
  function getRelativeLuminance(r: number, g: number, b: number): number {
    const normalize = (c: number) => {
      c = c / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    }
    const rs = normalize(r)
    const gs = normalize(g)
    const bs = normalize(b)
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
  }

  /**
   * Calculate contrast ratio between two colors
   */
  function getContrastRatio(
    color1: [number, number, number],
    color2: [number, number, number]
  ): number {
    const l1 = getRelativeLuminance(...color1)
    const l2 = getRelativeLuminance(...color2)
    const lighter = Math.max(l1, l2)
    const darker = Math.min(l1, l2)
    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * Parse CSS color to RGB
   */
  function parseColor(color: string): [number, number, number] | null {
    // Create a temporary element to parse the color
    const div = document.createElement("div")
    div.style.color = color
    document.body.appendChild(div)

    const computedColor = window.getComputedStyle(div).color
    document.body.removeChild(div)

    // Parse rgb() or rgba() format
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
    if (match && match[1] && match[2] && match[3]) {
      return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])]
    }

    return null
  }

  /**
   * Get effective background color by traversing up the DOM
   */
  function getEffectiveBackgroundColor(
    element: HTMLElement
  ): [number, number, number] {
    let current: HTMLElement | null = element

    while (current && current !== document.body) {
      const style = window.getComputedStyle(current)
      const bgColor = style.backgroundColor

      if (
        bgColor &&
        bgColor !== "rgba(0, 0, 0, 0)" &&
        bgColor !== "transparent"
      ) {
        const parsed = parseColor(bgColor)
        if (parsed) return parsed
      }

      current = current.parentElement
    }

    // Default to white background
    return [255, 255, 255]
  }

  /**
   * Analyze contrast for an element
   */
  function analyzeContrast(element: HTMLElement): {
    ratio: number
    passesAA: boolean
    passesAAA: boolean
    foreground: [number, number, number]
    background: [number, number, number]
    isLargeText: boolean
  } {
    const style = window.getComputedStyle(element)

    // Get text color
    const textColor = parseColor(style.color)
    if (!textColor) {
      return {
        ratio: 0,
        passesAA: false,
        passesAAA: false,
        foreground: [0, 0, 0],
        background: [255, 255, 255],
        isLargeText: false,
      }
    }

    // Get background color
    const backgroundColor = getEffectiveBackgroundColor(element)

    // Calculate contrast ratio
    const ratio = getContrastRatio(textColor, backgroundColor)

    // Determine if text is large
    const fontSize = parseFloat(style.fontSize)
    const fontWeight = style.fontWeight
    const isLargeText =
      fontSize >= 18 ||
      (fontSize >= 14 && (fontWeight === "bold" || parseInt(fontWeight) >= 700))

    // WCAG requirements
    const aaThreshold = isLargeText ? 3 : 4.5
    const aaaThreshold = isLargeText ? 4.5 : 7

    return {
      ratio,
      passesAA: ratio >= aaThreshold,
      passesAAA: ratio >= aaaThreshold,
      foreground: textColor,
      background: backgroundColor,
      isLargeText,
    }
  }

  /**
   * Get color contrast ratio between two elements
   */
  function getColorContrast(
    element1: HTMLElement,
    element2: HTMLElement
  ): number {
    const style1 = window.getComputedStyle(element1)
    const style2 = window.getComputedStyle(element2)

    const color1 = parseColor(style1.color)
    const color2 = parseColor(style2.color)

    if (!color1 || !color2) return 0

    return getContrastRatio(color1, color2)
  }
}
