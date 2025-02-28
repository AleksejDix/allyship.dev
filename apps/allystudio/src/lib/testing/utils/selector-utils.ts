import { getUniqueSelector, getXPath } from "@/lib/utils/selector-utils"

/**
 * Get a unique CSS selector for an element that works reliably for highlighting
 *
 * This is a wrapper around the main selector utility that ensures we get valid
 * selectors that work for highlighting elements in the DOM.
 */
export function getValidSelector(element: HTMLElement): string {
  try {
    // Use the main selector utility to get a robust selector
    return getUniqueSelector(element)
  } catch (error) {
    console.warn("[Testing] Error getting unique selector:", error)

    // Fallbacks if the main utility fails
    // Try ID with proper escaping
    if (element.id) {
      try {
        return `#${CSS.escape(element.id)}`
      } catch (e) {
        // If CSS.escape fails, try a simpler approach
      }
    }

    // Fall back to tag and role
    let selector = element.tagName.toLowerCase()

    if (element.getAttribute("role")) {
      selector += `[role="${element.getAttribute("role")}"]`
    }

    // Add position if we have a parent
    if (element.parentElement) {
      const siblings = Array.from(element.parentElement.children).filter(
        (child) => child.tagName === element.tagName
      )

      if (siblings.length > 1) {
        const index = siblings.indexOf(element) + 1
        selector += `:nth-child(${index})`
      }
    }

    return selector
  }
}

// Re-export the main selector utility functions for convenience
export { getUniqueSelector, getXPath }
