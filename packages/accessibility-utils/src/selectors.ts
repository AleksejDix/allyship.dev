/**
 * CSS selector utilities for DOM elements
 * Leverages focusable-selectors for reliable focusable element detection
 */

// Import focusable-selectors with proper ES modules
import focusableSelectors from 'focusable-selectors'

/**
 * CSS escape fallback for environments without CSS.escape
 */
function cssEscape(value: string): string {
  if (typeof CSS !== 'undefined' && CSS.escape) {
    return CSS.escape(value)
  }

  // Simple fallback implementation
  return value.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
}

/**
 * Generate a unique CSS selector for an element
 */
export function generateSelector(element: HTMLElement): string {
  if (element.id) {
    return `#${cssEscape(element.id)}`
  }

  const path: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector += `#${cssEscape(current.id)}`
      path.unshift(selector)
      break
    }

    if (current.className) {
      const classes = Array.from(current.classList)
        .filter(cls => cls && !cls.startsWith('_')) // Filter out CSS-in-JS classes
        .slice(0, 3) // Limit to first 3 classes
        .map(cls => `.${cssEscape(cls)}`)
        .join('')

      if (classes) {
        selector += classes
      }
    }

    // Add nth-child if there are siblings with the same tag
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      )

      if (siblings.length > 1) {
        const index = siblings.indexOf(current as Element) + 1
        selector += `:nth-child(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement
  }

  return path.join(' > ')
}

/**
 * Generate XPath for an element
 */
export function generateXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }

  const path: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    const tagName = current.tagName.toLowerCase()
    const parent = current.parentElement

    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      )

      if (siblings.length === 1) {
        path.unshift(tagName)
      } else {
        const index = siblings.indexOf(current as Element) + 1
        path.unshift(`${tagName}[${index}]`)
      }
    } else {
      path.unshift(tagName)
    }

    current = current.parentElement
  }

  return '/' + path.join('/')
}

/**
 * Find element by XPath
 */
export function findElementByXPath(xpath: string): HTMLElement | null {
  const result = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  )
  return result.singleNodeValue as HTMLElement | null
}

/**
 * Get all focusable elements using the focusable-selectors library
 * This replaces our custom focusable element detection
 */
export function getFocusableElements(root: Document | Element = document): HTMLElement[] {
  const selector = focusableSelectors.join(',')
  return Array.from(root.querySelectorAll(selector)) as HTMLElement[]
}

/**
 * Get all visible focusable elements
 */
export function getVisibleFocusableElements(root: Document | Element = document): HTMLElement[] {
  return getFocusableElements(root).filter(element => {
    const rect = element.getBoundingClientRect()
    const computedStyle = window.getComputedStyle(element)

    return (
      rect.width > 0 &&
      rect.height > 0 &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.display !== 'none' &&
      parseFloat(computedStyle.opacity) > 0
    )
  })
}

/**
 * Check if an element matches any focusable selector
 * More reliable than our custom implementation
 */
export function isFocusableBySelector(element: HTMLElement): boolean {
  return focusableSelectors.some(selector => {
    try {
      return element.matches(selector)
    } catch {
      return false
    }
  })
}

/**
 * Export the focusable selectors for direct use
 */
export { focusableSelectors }
export { cssEscape }
