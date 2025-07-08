/**
 * Generate a simple CSS selector for an element
 */
export function defaultSelectorGenerator(element: HTMLElement): string {
  if (element.id) {
    return `#${element.id}`
  }

  if (element.className) {
    const classes = element.className.split(" ").filter(Boolean)
    if (classes.length > 0) {
      return `${element.tagName.toLowerCase()}.${classes.join(".")}`
    }
  }

  return element.tagName.toLowerCase()
}

/**
 * Check if an element should be ignored
 */
export function shouldIgnoreElement(element: HTMLElement): boolean {
  // Ignore script and style elements
  if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) {
    return true
  }

  // Ignore elements with data-ignore attribute
  if (element.hasAttribute("data-ignore")) {
    return true
  }

  return false
}

/**
 * Check if an element is hidden
 */
export function isElementHidden(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  return (
    style.display === "none" ||
    style.visibility === "hidden" ||
    style.opacity === "0"
  )
}

/**
 * Simple throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null
  let lastExecTime = 0

  return ((...args: Parameters<T>) => {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else if (!timeoutId) {
      timeoutId = setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
          timeoutId = null
        },
        delay - (currentTime - lastExecTime)
      )
    }
  }) as T
}
