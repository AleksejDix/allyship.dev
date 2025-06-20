/**
 * Element visibility utilities
 */

/**
 * Check if element is visible in viewport and not hidden by CSS
 */
export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const computedStyle = window.getComputedStyle(element)

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    computedStyle.visibility !== 'hidden' &&
    computedStyle.display !== 'none' &&
    parseFloat(computedStyle.opacity) > 0
  )
}

/**
 * Check if element is in the viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Check if element is partially in viewport
 */
export function isPartiallyInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  return (
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < windowHeight &&
    rect.left < windowWidth
  )
}

/**
 * Get element visibility ratio (0-1)
 */
export function getVisibilityRatio(element: HTMLElement): number {
  if (!isElementVisible(element)) {
    return 0
  }

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  const visibleTop = Math.max(0, rect.top)
  const visibleLeft = Math.max(0, rect.left)
  const visibleBottom = Math.min(windowHeight, rect.bottom)
  const visibleRight = Math.min(windowWidth, rect.right)

  const visibleWidth = Math.max(0, visibleRight - visibleLeft)
  const visibleHeight = Math.max(0, visibleBottom - visibleTop)
  const visibleArea = visibleWidth * visibleHeight

  const totalArea = rect.width * rect.height

  return totalArea > 0 ? visibleArea / totalArea : 0
}
