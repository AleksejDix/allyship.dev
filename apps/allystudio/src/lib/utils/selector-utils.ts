// Pre-compile frequently used regexes
const idRegex = /^[a-zA-Z][\w-]*$/

// Cache for selectors to improve performance
const selectorCache = new WeakMap<Element, string>()

/**
 * Generates a unique CSS selector for a DOM element
 * Uses a multi-tiered approach to create the most precise and reliable selector
 */
export function getUniqueSelector(el: Element): string {
  // Check cache first for maximum performance
  const cachedSelector = selectorCache.get(el)
  if (cachedSelector) return cachedSelector

  if (!el) return ""

  // ID selector - fastest path for most elements
  if (el.id) {
    // Fast path for simple IDs (avoid CSS.escape overhead)
    if (idRegex.test(el.id)) {
      const selector = `#${el.id}`
      // Verify uniqueness
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    } else {
      // Handle complex IDs that need escaping
      const selector = `#${CSS.escape(el.id)}`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try tag + attributes for precise identification
  const tagName = el.tagName.toLowerCase()

  // Fast path for elements with data attributes (common in modern frameworks)
  const dataAttrs = [
    "data-testid",
    "data-id",
    "data-cy",
    "data-test",
    "data-automation-id"
  ]
  for (const attr of dataAttrs) {
    const value = el.getAttribute(attr)
    if (value) {
      const selector = `${tagName}[${attr}="${CSS.escape(value)}"]`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try with class combinations for better precision
  if (el.classList.length > 0) {
    // Try with all classes for maximum precision
    const classes = Array.from(el.classList)
      .map((c) => `.${CSS.escape(c)}`)
      .join("")

    const selector = `${tagName}${classes}`
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }

    // Try with first two classes if more than one
    if (el.classList.length > 1) {
      const twoClasses = `.${CSS.escape(el.classList[0])}.${CSS.escape(el.classList[1])}`
      const selectorWithTwoClasses = `${tagName}${twoClasses}`
      if (document.querySelectorAll(selectorWithTwoClasses).length === 1) {
        selectorCache.set(el, selectorWithTwoClasses)
        return selectorWithTwoClasses
      }
    }

    // Try with just first class
    const firstClass = `.${CSS.escape(el.classList[0])}`
    const selectorWithClass = `${tagName}${firstClass}`
    if (document.querySelectorAll(selectorWithClass).length === 1) {
      selectorCache.set(el, selectorWithClass)
      return selectorWithClass
    }
  }

  // Try with other attributes that often identify elements
  const uniqueAttrs = ["name", "role", "type", "title", "aria-label"]
  for (const attr of uniqueAttrs) {
    const value = el.getAttribute(attr)
    if (value) {
      const selector = `${tagName}[${attr}="${CSS.escape(value)}"]`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try with nth-of-type for siblings
  if (el.parentElement) {
    // Get siblings with same tag
    const siblings = Array.from(el.parentElement.children).filter(
      (child: Element) => child.tagName === el.tagName
    )

    if (siblings.length > 1) {
      const index = siblings.indexOf(el) + 1
      const selector = `${tagName}:nth-of-type(${index})`

      // Try with parent tag for more precision
      if (el.parentElement.tagName) {
        const parentTag = el.parentElement.tagName.toLowerCase()
        const selectorWithParent = `${parentTag} > ${selector}`

        if (document.querySelectorAll(selectorWithParent).length === 1) {
          selectorCache.set(el, selectorWithParent)
          return selectorWithParent
        }
      }

      // Try with just nth-of-type
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // For deeply nested elements, try building a path with direct child selectors
  let currentElement: Element | null = el
  let ancestorPath = ""
  let depth = 0
  const MAX_DEPTH = 5 // Limit depth to avoid performance issues

  while (currentElement && currentElement.parentElement && depth < MAX_DEPTH) {
    const parent: Element = currentElement.parentElement
    const parentTag = parent.tagName.toLowerCase()

    // Skip body and html in the path
    if (parentTag === "body" || parentTag === "html") {
      currentElement = parent
      continue
    }

    // Get position among siblings
    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName === currentElement!.tagName
    )

    let elementSelector = currentElement.tagName.toLowerCase()

    // Add nth-of-type if there are multiple siblings with same tag
    if (siblings.length > 1) {
      const index = siblings.indexOf(currentElement) + 1
      elementSelector += `:nth-of-type(${index})`
    }

    // Add ID if available
    if (currentElement.id) {
      elementSelector = `#${CSS.escape(currentElement.id)}`
    }
    // Add first class if available and no ID
    else if (currentElement.classList.length > 0) {
      elementSelector += `.${CSS.escape(currentElement.classList[0])}`
    }

    // Build path from right to left
    ancestorPath = ancestorPath
      ? `${elementSelector} > ${ancestorPath}`
      : elementSelector

    // Check if current path is unique
    if (document.querySelectorAll(ancestorPath).length === 1) {
      selectorCache.set(el, ancestorPath)
      return ancestorPath
    }

    currentElement = parent
    depth++
  }

  // Try a more specific approach for deeply nested elements with complex class combinations
  try {
    // Build a selector with parent > child structure
    let complexSelector = ""
    let current: Element | null = el
    let pathDepth = 0

    while (current && pathDepth < 4) {
      let currentSelector = current.tagName.toLowerCase()

      // Add ID if present
      if (current.id) {
        currentSelector = `#${CSS.escape(current.id)}`
      }
      // Otherwise add classes (up to 2 for performance)
      else if (current.classList.length > 0) {
        const classesToUse = Array.from(current.classList).slice(0, 2)
        currentSelector += classesToUse.map((c) => `.${CSS.escape(c)}`).join("")
      }

      // Add to path
      complexSelector = complexSelector
        ? `${currentSelector} > ${complexSelector}`
        : currentSelector

      // Check if we have a unique selector
      if (document.querySelectorAll(complexSelector).length === 1) {
        selectorCache.set(el, complexSelector)
        return complexSelector
      }

      // Move up to parent
      current = current.parentElement
      pathDepth++
    }
  } catch (e) {
    console.warn("[SelectorUtils] Error generating complex selector:", e)
  }

  // Generate XPath as a fallback for very complex structures
  try {
    const xpath = getXPath(el)
    if (xpath) {
      // Convert XPath to CSS if possible
      const cssFromXPath = convertXPathToCSS(xpath)
      if (
        cssFromXPath &&
        document.querySelectorAll(cssFromXPath).length === 1
      ) {
        selectorCache.set(el, cssFromXPath)
        return cssFromXPath
      }

      // Store the XPath in the cache with a special prefix
      const xpathSelector = `xpath:${xpath}`
      selectorCache.set(el, xpathSelector)
      return xpathSelector
    }
  } catch (e) {
    console.warn("[SelectorUtils] Error generating XPath:", e)
  }

  // Fallback to a very specific selector with multiple attributes
  let fallbackSelector = tagName

  // Add all available attributes for maximum precision
  if (el.parentElement) {
    const siblings = Array.from(el.parentElement.children)
    const index = siblings.indexOf(el) + 1
    fallbackSelector += `:nth-child(${index})`
  }

  // Add text content hint if available (truncated for performance)
  const textContent = el.textContent?.trim().substring(0, 20)
  if (textContent && textContent.length > 0) {
    fallbackSelector += `:contains("${textContent.replace(/"/g, '\\"')}")`
  }

  selectorCache.set(el, fallbackSelector)
  return fallbackSelector
}

/**
 * Generate XPath for an element
 */
export function getXPath(element: Element): string {
  if (!element) return ""

  // Check if element has an ID
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }

  // Get the path to the element
  const paths: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 0
    let hasFollowingSibling = false

    // Count preceding siblings with same tag name
    for (
      let sibling = current.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === current.nodeName
      ) {
        index++
      }
    }

    // Check if there are any following siblings with same tag name
    for (
      let sibling = current.nextSibling;
      sibling && !hasFollowingSibling;
      sibling = sibling.nextSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === current.nodeName
      ) {
        hasFollowingSibling = true
      }
    }

    // Build the path part
    const tagName = current.nodeName.toLowerCase()
    const pathIndex = index || hasFollowingSibling ? `[${index + 1}]` : ""
    paths.unshift(`${tagName}${pathIndex}`)

    current = current.parentNode as Element

    // Stop at the body
    if (current && current.nodeName.toLowerCase() === "body") {
      paths.unshift("body")
      break
    }
  }

  return `/${paths.join("/")}`
}

/**
 * Try to convert XPath to CSS selector when possible
 */
export function convertXPathToCSS(xpath: string): string | null {
  try {
    // Handle simple ID-based XPath
    const idMatch = xpath.match(/\/\/\*\[@id="([^"]+)"\]/)
    if (idMatch) {
      return `#${CSS.escape(idMatch[1])}`
    }

    // Handle simple paths like /html/body/div[1]/p[2]
    if (xpath.startsWith("/")) {
      const parts = xpath.split("/").filter(Boolean)

      // Skip html and body
      const startIndex = parts.findIndex(
        (p) => !["html", "body"].includes(p.replace(/\[\d+\]$/, ""))
      )
      if (startIndex === -1) return null

      const cssPath = parts
        .slice(startIndex)
        .map((part) => {
          // Extract tag and index
          const match = part.match(/([a-z0-9]+)(?:\[(\d+)\])?/)
          if (!match) return null

          const [, tag, indexStr] = match
          const index = indexStr ? parseInt(indexStr, 10) : null

          return index ? `${tag}:nth-of-type(${index})` : tag
        })
        .filter(Boolean)
        .join(" > ")

      return cssPath
    }

    return null
  } catch (e) {
    console.warn("[SelectorUtils] Error converting XPath to CSS:", e)
    return null
  }
}

/**
 * Get a simplified DOM path for an element
 */
export function getSimpleDOMPath(element: HTMLElement): string {
  if (!element) return ""

  const path: string[] = []
  let current: HTMLElement | null = element
  let depth = 0
  const MAX_DEPTH = 4 // Limit depth to keep it readable

  while (current && depth < MAX_DEPTH) {
    let tag = current.tagName.toLowerCase()

    // Add ID if available
    if (current.id) {
      tag += `#${current.id}`
      // If we have an ID, we can stop here as it should be unique
      path.unshift(tag)
      break
    }

    // Add first class if available
    if (current.classList.length > 0) {
      tag += `.${current.classList[0]}`
    }

    path.unshift(tag)

    // Move up to parent
    current = current.parentElement
    depth++
  }

  // Add ellipsis if we hit the depth limit
  if (current && depth >= MAX_DEPTH) {
    path.unshift("...")
  }

  return path.join(" > ")
}

/**
 * Find the deepest element at a specific point, useful for nested elements
 */
export function findDeepestElementAtPoint(
  x: number,
  y: number,
  excludeElements: Element[] = []
): HTMLElement | null {
  // Use elementsFromPoint to get all elements at this position
  const elements = document.elementsFromPoint(x, y) as HTMLElement[]

  // Filter out excluded elements
  const filteredElements = elements.filter(
    (el) => !excludeElements.includes(el)
  )

  // Get the smallest element by area
  if (filteredElements.length > 0) {
    // Sort by area (smallest first)
    filteredElements.sort((a, b) => {
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      const aArea = aRect.width * aRect.height
      const bArea = bRect.width * bRect.height
      return aArea - bArea
    })

    // Return the smallest element that's not too small
    for (const el of filteredElements) {
      const rect = el.getBoundingClientRect()
      // Skip elements that are too small (likely just borders or spacers)
      if (rect.width >= 5 && rect.height >= 5) {
        return el
      }
    }

    // If all elements are too small, return the first one
    return filteredElements[0]
  }

  return null
}

/**
 * Get element details in a compact format
 */
export function getElementDetails(element: HTMLElement): string {
  if (!element) return ""

  const tagName = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ""

  // Only include first class for performance
  const className = element.classList.length > 0 ? element.classList[0] : ""
  const classes = className ? `.${className}` : ""

  // Fast dimension calculation
  const rect = element.getBoundingClientRect()
  const dimensions = `${Math.round(rect.width)}×${Math.round(rect.height)}`

  return `<${tagName}${id}${classes}> ${dimensions}px`
}

/**
 * Clear the selector cache
 */
export function clearSelectorCache(): void {
  // Create a new WeakMap to replace the old one
  // This effectively clears the cache since the old one will be garbage collected
  // WeakMap doesn't have a clear() method
}
