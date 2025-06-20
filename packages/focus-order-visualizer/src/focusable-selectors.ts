/**
 * Comprehensive focusable element selectors with improved stability
 * Based on WHATWG HTML specification and real-world testing
 */

import focusableSelectors from 'focusable-selectors'

/**
 * Re-export focusable selectors from the well-maintained library
 */
export { default as focusableSelectors } from 'focusable-selectors'

/**
 * Get all focusable elements on the page using the focusable-selectors library
 */
export function getFocusableElements(
  root: Document | Element = document,
  includeHidden: boolean = false
): HTMLElement[] {
  try {
    const selector = focusableSelectors.join(', ')
    const elements = Array.from(root.querySelectorAll<HTMLElement>(selector))

    if (includeHidden) {
      return elements
    }

    // Filter out hidden elements
    return elements.filter(element => isElementVisible(element))
  } catch (error) {
    console.error('[focus-order-visualizer] Error getting focusable elements:', error)
    return []
  }
}

/**
 * Check if an element is actually visible and focusable
 */
export function isElementVisible(element: HTMLElement): boolean {
  // Check if element is hidden via HTML attributes
  if (element.hidden) {
    return false
  }

  // Check if element is disabled
  if ('disabled' in element && (element as any).disabled) {
    return false
  }

  // Check if element has negative tabindex
  const tabIndex = element.getAttribute('tabindex')
  if (tabIndex && parseInt(tabIndex, 10) < 0) {
    return false
  }

  // Check if element is inside an inert container
  let parent = element.parentElement
  while (parent) {
    if (parent.hasAttribute('inert')) {
      return false
    }
    parent = parent.parentElement
  }

  // Check computed styles for visibility
  const computedStyle = window.getComputedStyle(element)
  if (computedStyle.visibility === 'hidden' ||
      computedStyle.display === 'none' ||
      computedStyle.opacity === '0') {
    return false
  }

  // Check if element has zero dimensions (but allow for edge cases)
  const rect = element.getBoundingClientRect()
  if (rect.width === 0 && rect.height === 0) {
    // Some elements like <input type="hidden"> will have zero dimensions
    // but might still be programmatically focusable
    return (element as HTMLInputElement).type !== 'hidden'
  }

  return true
}

/**
 * Sort focusable elements by their tab order according to HTML specification
 */
export function sortByTabOrder(elements: HTMLElement[]): HTMLElement[] {
  // Create array with elements and their original document order
  const elementsWithIndex = elements.map((element, index) => ({
    element,
    tabIndex: getTabIndex(element),
    documentOrder: index
  }))

  return elementsWithIndex.sort((a, b) => {
    // Both have positive tabindex - sort by tabindex value, then document order
    if (a.tabIndex > 0 && b.tabIndex > 0) {
      if (a.tabIndex !== b.tabIndex) {
        return a.tabIndex - b.tabIndex
      }
      return a.documentOrder - b.documentOrder
    }

    // One positive, one zero/negative - positive comes first
    if (a.tabIndex > 0 && b.tabIndex <= 0) return -1
    if (a.tabIndex <= 0 && b.tabIndex > 0) return 1

    // Both zero/negative - maintain document order
    return a.documentOrder - b.documentOrder
  }).map(item => item.element)
}

/**
 * Get the effective tab index of an element
 */
function getTabIndex(element: HTMLElement): number {
  const tabIndexAttr = element.getAttribute('tabindex')
  if (tabIndexAttr !== null) {
    const parsed = parseInt(tabIndexAttr, 10)
    return isNaN(parsed) ? 0 : parsed
  }

  // Default tabindex for naturally focusable elements
  const tagName = element.tagName.toLowerCase()
  const naturallyFocusable = ['a', 'button', 'input', 'select', 'textarea', 'iframe']

  if (naturallyFocusable.includes(tagName)) {
    // Special cases
    if (tagName === 'a' && !element.hasAttribute('href')) return -1
    if (tagName === 'input' && (element as HTMLInputElement).type === 'hidden') return -1
    return 0
  }

  return -1
}


