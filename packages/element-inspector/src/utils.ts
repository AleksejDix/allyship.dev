/**
 * Inspector-specific utility functions
 */

// Import shared utilities from accessibility-utils
import {
  generateSelector,
  generateXPath,
  findElementByXPath,
  isElementVisible,
  getAccessibilityInfo
} from '@allystudio/accessibility-utils'

// Re-export for backward compatibility
export {
  generateSelector,
  generateXPath,
  findElementByXPath,
  isElementVisible,
  getAccessibilityInfo
}

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
 * Find the deepest element at a given point
 * This is inspector-specific logic for point-based element finding
 */
export function findDeepestElementAtPoint(
  x: number,
  y: number,
  excludeElements: Element[] = []
): HTMLElement | null {
  const elements = document.elementsFromPoint(x, y) as HTMLElement[]

  // Filter out excluded elements
  const validElements = elements.filter(el =>
    !excludeElements.includes(el) &&
    el.nodeType === Node.ELEMENT_NODE &&
    !isExcludedElement(el)
  )

  if (validElements.length === 0) return null

  // Sort by area (smallest first) to find the most specific element
  validElements.sort((a, b) => {
    const aRect = a.getBoundingClientRect()
    const bRect = b.getBoundingClientRect()
    const aArea = aRect.width * aRect.height
    const bArea = bRect.width * bRect.height
    return aArea - bArea
  })

  // Find the smallest element that meets minimum size requirements
  for (const element of validElements) {
    const rect = element.getBoundingClientRect()
    if (rect.width >= 5 && rect.height >= 5) {
      return element
    }
  }

  return validElements[0] || null
}

/**
 * Check if element should be excluded from inspection
 * This is inspector-specific logic for overlay exclusion
 */
export function isExcludedElement(element: HTMLElement): boolean {
  // Handle null/undefined elements
  if (!element || !element.tagName) {
    return true
  }

  // Exclude script and style elements
  if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE'].includes(element.tagName)) {
    return true
  }

  // Exclude elements with data attributes indicating they're overlays/highlights
  if (element.hasAttribute('data-highlight-box') ||
      element.hasAttribute('data-inspector-overlay')) {
    return true
  }

  // Exclude common overlay classes
  const overlayClasses = [
    'highlight-overlay',
    'inspector-overlay',
    'tooltip',
    'popover',
    'modal-backdrop'
  ]

  return overlayClasses.some(cls => element.classList.contains(cls))
}

/**
 * Get comprehensive element information
 * Combines inspector-specific data with accessibility info
 */
export function getElementInfo(element: HTMLElement): {
  element: HTMLElement
  selector: string
  xpath: string
  tagName: string
  textContent: string
  attributes: Record<string, string>
  rect: DOMRect
  computedStyles?: CSSStyleDeclaration
} {
  const rect = element.getBoundingClientRect()
  const attributes: Record<string, string> = {}

  // Collect all attributes
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i]
    if (attr) {
      attributes[attr.name] = attr.value
    }
  }

  return {
    element,
    selector: generateSelector(element),
    xpath: generateXPath(element),
    tagName: element.tagName.toLowerCase(),
    textContent: element.textContent?.trim() || '',
    attributes,
    rect,
    computedStyles: window.getComputedStyle(element)
  }
}

/**
 * Throttle function for performance optimization
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean

  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>

  return function(this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}
