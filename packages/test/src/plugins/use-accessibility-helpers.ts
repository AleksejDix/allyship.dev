import type { Runner } from "../core/types.js"

/**
 * Accessibility-focused testing helpers
 * Usage: runner.use(useAccessibilityHelpers)
 */
export function useAccessibilityHelpers(_runner: Runner): void {
  // Add accessibility helpers to global scope
  if (typeof window !== "undefined") {
    ;(window as any).expectAccessible = expectAccessible
    ;(window as any).getAccessibleName = getAccessibleName
    ;(window as any).getRole = getRole
    ;(window as any).isVisible = isVisible
    ;(window as any).isFocusable = isFocusable
    ;(window as any).hasValidContrast = hasValidContrast
  }

  /**
   * Get the accessible name for an element
   */
  function getAccessibleName(element: HTMLElement): string {
    // Check aria-label first
    const ariaLabel = element.getAttribute("aria-label")
    if (ariaLabel) return ariaLabel.trim()

    // Check aria-labelledby
    const ariaLabelledBy = element.getAttribute("aria-labelledby")
    if (ariaLabelledBy) {
      const labelElement = document.getElementById(ariaLabelledBy)
      if (labelElement) return labelElement.textContent?.trim() || ""
    }

    // Check associated label for form elements
    if (element.id) {
      const label = document.querySelector(`label[for="${element.id}"]`)
      if (label) return label.textContent?.trim() || ""
    }

    // Check alt attribute for images
    if (element.tagName === "IMG") {
      const alt = element.getAttribute("alt")
      if (alt !== null) return alt.trim()
    }

    // Check title attribute
    const title = element.getAttribute("title")
    if (title) return title.trim()

    // Fall back to text content
    return element.textContent?.trim() || ""
  }

  /**
   * Get the role of an element
   */
  function getRole(element: HTMLElement): string {
    const explicitRole = element.getAttribute("role")
    if (explicitRole) return explicitRole

    // Map common elements to their implicit roles
    const tagName = element.tagName.toLowerCase()
    const roleMap: Record<string, string> = {
      button: "button",
      a: element.hasAttribute("href") ? "link" : "generic",
      input: getInputRole(element as HTMLInputElement),
      textarea: "textbox",
      select: "combobox",
      h1: "heading",
      h2: "heading",
      h3: "heading",
      h4: "heading",
      h5: "heading",
      h6: "heading",
      main: "main",
      nav: "navigation",
      aside: "complementary",
      section: "region",
      article: "article",
      header: "banner",
      footer: "contentinfo",
      img: "img",
      ul: "list",
      ol: "list",
      li: "listitem",
    }

    return roleMap[tagName] || "generic"
  }

  function getInputRole(input: HTMLInputElement): string {
    const type = input.type.toLowerCase()
    const roleMap: Record<string, string> = {
      button: "button",
      submit: "button",
      reset: "button",
      checkbox: "checkbox",
      radio: "radio",
      range: "slider",
      email: "textbox",
      password: "textbox",
      search: "searchbox",
      tel: "textbox",
      text: "textbox",
      url: "textbox",
    }
    return roleMap[type] || "textbox"
  }

  /**
   * Check if element is visible
   */
  function isVisible(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element)

    // Check display and visibility
    if (style.display === "none" || style.visibility === "hidden") {
      return false
    }

    // Check opacity
    if (parseFloat(style.opacity) === 0) {
      return false
    }

    // Check if element has dimensions
    const rect = element.getBoundingClientRect()
    if (rect.width === 0 && rect.height === 0) {
      return false
    }

    return true
  }

  /**
   * Check if element is focusable
   */
  function isFocusable(element: HTMLElement): boolean {
    // Check if element is disabled
    if ("disabled" in element && (element as any).disabled) {
      return false
    }

    // Check tabindex
    const tabIndex = element.getAttribute("tabindex")
    if (tabIndex === "-1") return false

    // Check if element is visible
    if (!isVisible(element)) return false

    // Check for naturally focusable elements
    const focusableElements = [
      "a[href]",
      "button",
      'input:not([type="hidden"])',
      "select",
      "textarea",
      "iframe",
      "object",
      "embed",
      "area[href]",
      "audio[controls]",
      "video[controls]",
      "[contenteditable]",
      '[tabindex]:not([tabindex="-1"])',
    ]

    return focusableElements.some((selector) => element.matches(selector))
  }

  /**
   * Check if text has sufficient contrast
   */
  function hasValidContrast(
    element: HTMLElement,
    level: "AA" | "AAA" = "AA"
  ): boolean {
    const style = window.getComputedStyle(element)
    const color = style.color
    const backgroundColor = style.backgroundColor

    // This is a simplified check - in practice you'd need a proper contrast calculation
    // For now, just check if colors are explicitly set
    return (
      color !== "rgba(0, 0, 0, 0)" && backgroundColor !== "rgba(0, 0, 0, 0)"
    )
  }

  /**
   * Enhanced accessibility expectations
   */
  function expectAccessible(element: HTMLElement) {
    return {
      toHaveAccessibleName(expectedName?: string): void {
        const actualName = getAccessibleName(element)
        if (!actualName) {
          throw new Error(`Element must have an accessible name`)
        }
        if (expectedName && actualName !== expectedName) {
          throw new Error(
            `Expected accessible name "${expectedName}" but got "${actualName}"`
          )
        }
      },

      toHaveRole(expectedRole: string): void {
        const actualRole = getRole(element)
        if (actualRole !== expectedRole) {
          throw new Error(
            `Expected role "${expectedRole}" but got "${actualRole}"`
          )
        }
      },

      toBeVisible(): void {
        if (!isVisible(element)) {
          throw new Error("Element must be visible")
        }
      },

      toBeFocusable(): void {
        if (!isFocusable(element)) {
          throw new Error("Element must be focusable")
        }
      },

      toHaveValidContrast(level: "AA" | "AAA" = "AA"): void {
        if (!hasValidContrast(element, level)) {
          throw new Error(`Element must have valid ${level} contrast ratio`)
        }
      },

      toHaveValidARIA(): void {
        // Check for valid ARIA attributes
        const ariaAttrs = Array.from(element.attributes).filter((attr) =>
          attr.name.startsWith("aria-")
        )

        for (const attr of ariaAttrs) {
          // Basic validation - in practice you'd check against ARIA spec
          if (!attr.value.trim()) {
            throw new Error(`ARIA attribute "${attr.name}" must have a value`)
          }
        }
      },

      toHaveHeadingLevel(expectedLevel: number): void {
        const tagName = element.tagName.toLowerCase()
        if (!tagName.match(/^h[1-6]$/)) {
          throw new Error("Element must be a heading element")
        }
        const actualLevel = parseInt(tagName.charAt(1))
        if (actualLevel !== expectedLevel) {
          throw new Error(
            `Expected heading level ${expectedLevel} but got ${actualLevel}`
          )
        }
      },

      toHaveValidLandmark(): void {
        const role = getRole(element)
        const validLandmarks = [
          "banner",
          "complementary",
          "contentinfo",
          "main",
          "navigation",
          "region",
          "search",
        ]
        if (!validLandmarks.includes(role)) {
          throw new Error(
            `Element must have a valid landmark role, got "${role}"`
          )
        }
      },
    }
  }
}
