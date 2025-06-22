/**
 * Generate CSS selector for an element
 */
export function generateSelector(element: HTMLElement): string {
  // Use ID if available and unique
  if (element.id) {
    const idSelector = `#${element.id}`
    if (document.querySelectorAll(idSelector).length === 1) {
      return idSelector
    }
  }

  // Build path from element to root
  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    // Add class if available
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.trim().split(/\s+/).filter(Boolean)
      if (classes.length > 0) {
        selector += '.' + classes.join('.')
      }
    }

    // Add nth-child if needed for uniqueness
    const parent = current.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === current!.tagName
      )
      if (siblings.length > 1) {
        const index = siblings.indexOf(current) + 1
        selector += `:nth-child(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement
  }

  return path.join(' > ')
}
