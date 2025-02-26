// This file is now deprecated and only contains utility functions
// for compatibility with existing code. The layer system should be used
// for all highlighting functionality.

/**
 * Checks if an element has zero dimensions
 */
export function hasZeroDimensions(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect()
  return rect.width === 0 || rect.height === 0
}

/**
 * Verifies if the highlight is correctly positioned
 * Returns true if there's a potential targeting issue
 */
export function verifyHighlightPosition(
  element: HTMLElement,
  x: number,
  y: number
): boolean {
  // Check if the element at the current mouse position is what we expect
  const elementAtPoint = document.elementFromPoint(x, y) as HTMLElement

  // If the element at the point is not the same as our target or a child of it
  if (
    elementAtPoint &&
    elementAtPoint !== element &&
    !element.contains(elementAtPoint) &&
    !elementAtPoint.contains(element) &&
    !elementAtPoint.hasAttribute("data-highlight-box")
  ) {
    return true // Targeting issue detected
  }

  return false
}

// Deprecated functions that now do nothing
export function createHighlightBox(): HTMLElement | null {
  console.warn(
    "createHighlightBox is deprecated. Use the layer system instead."
  )
  return null
}

export function removeHighlightBox(): void {
  console.warn(
    "removeHighlightBox is deprecated. Use the layer system instead."
  )
}

export function highlightElement(element: HTMLElement | null): void {
  console.warn("highlightElement is deprecated. Use the layer system instead.")
}

export function clearHighlight(): void {
  console.warn("clearHighlight is deprecated. Use the layer system instead.")
}

export function isHighlightVisible(): boolean {
  console.warn(
    "isHighlightVisible is deprecated. Use the layer system instead."
  )
  return false
}

export function getHighlightBox(): HTMLElement | null {
  console.warn("getHighlightBox is deprecated. Use the layer system instead.")
  return null
}
