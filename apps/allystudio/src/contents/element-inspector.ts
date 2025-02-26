import { eventBus } from "@/lib/events/event-bus"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Track inspection state
let isInspecting = false
let hoveredElement: HTMLElement | null = null
let lastHighlightTimestamp = 0
const THROTTLE_MS = 0 // No throttling for maximum responsiveness
let selectorCache = new WeakMap<Element, string>()
let elementDetailsCache = new WeakMap<Element, string>()

// Pre-compile frequently used regexes
const idRegex = /^[a-zA-Z][\w-]*$/

// Direct DOM manipulation for ultra-fast highlighting
let highlightBox: HTMLElement | null = null
let tooltipElement: HTMLElement | null = null

// Initialize highlight elements
function createHighlightElements() {
  // Create highlight box if it doesn't exist
  if (!highlightBox) {
    highlightBox = document.createElement("div")
    highlightBox.setAttribute("data-highlight-box", "true")
    highlightBox.style.position = "fixed"
    highlightBox.style.pointerEvents = "none"
    highlightBox.style.zIndex = "2147483647" // Maximum z-index
    highlightBox.style.border = "2px solid #4f46e5"
    highlightBox.style.backgroundColor = "rgba(79, 70, 229, 0.1)"
    highlightBox.style.boxSizing = "border-box"
    highlightBox.style.display = "none"
    document.body.appendChild(highlightBox)
  }

  // Create tooltip if it doesn't exist
  if (!tooltipElement) {
    tooltipElement = document.createElement("div")
    tooltipElement.setAttribute("role", "tooltip")
    tooltipElement.style.position = "fixed"
    tooltipElement.style.pointerEvents = "none"
    tooltipElement.style.zIndex = "2147483647" // Maximum z-index
    tooltipElement.style.backgroundColor = "#1e1e1e"
    tooltipElement.style.color = "white"
    tooltipElement.style.padding = "4px 8px"
    tooltipElement.style.borderRadius = "4px"
    tooltipElement.style.fontSize = "12px"
    tooltipElement.style.fontFamily = "monospace"
    tooltipElement.style.maxWidth = "300px"
    tooltipElement.style.wordBreak = "break-all"
    tooltipElement.style.display = "none"
    document.body.appendChild(tooltipElement)
  }
}

// Remove highlight elements
function removeHighlightElements() {
  if (highlightBox) {
    document.body.removeChild(highlightBox)
    highlightBox = null
  }

  if (tooltipElement) {
    document.body.removeChild(tooltipElement)
    tooltipElement = null
  }
}

/**
 * Ultra-fast selector generation optimized for performance
 * Uses a multi-tiered approach with early returns for common cases
 */
function getUniqueSelector(el: Element): string {
  // Check cache first for maximum performance
  const cachedSelector = selectorCache.get(el)
  if (cachedSelector) return cachedSelector

  if (!el) return ""

  // ID selector - fastest path for most elements
  if (el.id && idRegex.test(el.id)) {
    // Fast path for simple IDs (avoid CSS.escape overhead)
    const selector = `#${el.id}`
    // Quick uniqueness check
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }
  } else if (el.id) {
    // Handle complex IDs that need escaping
    const selector = `#${CSS.escape(el.id)}`
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }
  }

  // Fast path for elements with unique tag names
  const tagName = el.tagName.toLowerCase()
  const tagSelector = tagName
  if (document.querySelectorAll(tagSelector).length === 1) {
    selectorCache.set(el, tagSelector)
    return tagSelector
  }

  // Fast path for elements with a single class
  if (el.classList.length === 1) {
    const className = el.classList[0]
    if (idRegex.test(className)) {
      // Simple class name
      const selector = `.${className}`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }

      // Try tag + class
      const tagClassSelector = `${tagName}.${className}`
      if (document.querySelectorAll(tagClassSelector).length === 1) {
        selectorCache.set(el, tagClassSelector)
        return tagClassSelector
      }
    }
  }

  // Fast path for elements with unique tag + attribute combinations
  for (const attr of ["name", "type", "role", "data-testid"]) {
    const value = el.getAttribute(attr)
    if (value) {
      const selector = `${tagName}[${attr}="${value.replace(/"/g, '\\"')}"]`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Fast nth-child selector for direct children
  if (el.parentElement) {
    const parent = el.parentElement
    const children = parent.children
    const index = Array.prototype.indexOf.call(children, el) + 1

    // Try direct child selector
    const selector = `${tagName}:nth-child(${index})`
    const parentTagName = parent.tagName.toLowerCase()

    // If parent is body or a common container, use direct selector
    if (
      parentTagName === "body" ||
      parentTagName === "main" ||
      parentTagName === "div"
    ) {
      const fullSelector = `${parentTagName} > ${selector}`
      if (document.querySelectorAll(fullSelector).length === 1) {
        selectorCache.set(el, fullSelector)
        return fullSelector
      }
    }
  }

  // Optimized path-based selector as fallback
  // Limit to 3 levels for performance
  let current = el
  const path = []
  let depth = 0

  while (current && current !== document.body && depth < 3) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector = idRegex.test(current.id)
        ? `#${current.id}`
        : `#${CSS.escape(current.id)}`
      path.unshift(selector)
      break
    } else if (current.classList.length === 1) {
      const className = current.classList[0]
      if (idRegex.test(className)) {
        selector += `.${className}`
      }
    }

    if (current.parentElement) {
      const siblings = current.parentElement.children
      if (siblings.length > 1) {
        const index = Array.prototype.indexOf.call(siblings, current) + 1
        selector += `:nth-child(${index})`
      }
    }

    path.unshift(selector)
    current = current.parentElement as HTMLElement
    depth++
  }

  const selector = path.join(" > ")
  selectorCache.set(el, selector)
  return selector
}

// Ultra-fast element details generation
const getElementDetails = (element: HTMLElement): string => {
  // Check cache first
  const cachedDetails = elementDetailsCache.get(element)
  if (cachedDetails) return cachedDetails

  const tagName = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ""

  // Only include first class for performance
  const className = element.classList.length > 0 ? element.classList[0] : ""
  const classes = className ? `.${className}` : ""

  // Fast dimension calculation
  const rect = element.getBoundingClientRect()
  const dimensions = `${Math.round(rect.width)}×${Math.round(rect.height)}`

  const details = `<${tagName}${id}${classes}> ${dimensions}px`
  elementDetailsCache.set(element, details)
  return details
}

// Direct DOM manipulation for ultra-fast highlighting
function directHighlightElement(element: HTMLElement | null) {
  if (!element || !highlightBox || !tooltipElement) return

  // Get element position and size
  const rect = element.getBoundingClientRect()

  // Position highlight box
  highlightBox.style.left = `${rect.left + window.scrollX}px`
  highlightBox.style.top = `${rect.top + window.scrollY}px`
  highlightBox.style.width = `${rect.width}px`
  highlightBox.style.height = `${rect.height}px`
  highlightBox.style.display = "block"

  // Get element details for tooltip
  const details = getElementDetails(element)

  // Position tooltip
  tooltipElement.textContent = details
  tooltipElement.style.left = `${rect.left + window.scrollX}px`
  tooltipElement.style.top = `${rect.top + window.scrollY - 24}px`
  tooltipElement.style.display = "block"

  // Also send to event bus for compatibility with other tools
  const selector = getUniqueSelector(element)

  // Use requestIdleCallback to avoid blocking the main thread
  if (window.requestIdleCallback) {
    window.requestIdleCallback(() => {
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: performance.now(),
        data: {
          selector,
          message: details,
          isValid: true,
          layer: "inspector"
        }
      })
    })
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: performance.now(),
        data: {
          selector,
          message: details,
          isValid: true,
          layer: "inspector"
        }
      })
    }, 0)
  }
}

// Clear highlights using direct DOM manipulation
function directClearHighlights() {
  if (highlightBox) {
    highlightBox.style.display = "none"
  }

  if (tooltipElement) {
    tooltipElement.style.display = "none"
  }

  // Also clear via event bus for compatibility
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: performance.now(),
    data: {
      selector: "*",
      message: "",
      isValid: true,
      clear: true,
      layer: "inspector"
    }
  })
}

// Use pointer events for better performance
const handlePointerMove = (e: PointerEvent) => {
  if (!isInspecting) return

  const now = performance.now() // Use performance.now() for higher precision

  // Skip if we're updating too frequently
  if (now - lastHighlightTimestamp < THROTTLE_MS) return
  lastHighlightTimestamp = now

  // Get the element under the cursor - use composedPath for Shadow DOM support
  const element = e.target as HTMLElement

  if (!element) return

  // Skip the highlight elements themselves to prevent feedback loops
  if (
    element.hasAttribute("data-highlight-box") ||
    element.closest("[data-highlight-box]") ||
    element.closest('[role="tooltip"]')
  ) {
    return
  }

  // If we're hovering over the same element, no need to update
  if (element === hoveredElement) return

  // Update the hovered element
  hoveredElement = element

  // Directly highlight the element for maximum performance
  directHighlightElement(element)
}

// Start inspection
const startInspection = () => {
  isInspecting = true
  document.body.style.cursor = "crosshair"

  // Create highlight elements
  createHighlightElements()

  // Clear caches when starting new inspection
  selectorCache = new WeakMap<Element, string>()
  elementDetailsCache = new WeakMap<Element, string>()

  // Use pointer events for better performance across devices
  document.addEventListener("pointermove", handlePointerMove, {
    passive: true,
    capture: true // Use capture to get events before they're processed
  })

  // Clear any existing highlights when starting
  directClearHighlights()

  // Force a highlight update for the current element under cursor
  const currentElement = document.elementFromPoint(
    window.innerWidth / 2,
    window.innerHeight / 2
  ) as HTMLElement

  if (currentElement) {
    hoveredElement = currentElement
    directHighlightElement(currentElement)
  }

  console.log(
    "[ElementInspector] Inspection started with ultra-high performance mode"
  )
}

// Stop inspection
const stopInspection = () => {
  isInspecting = false
  document.body.style.cursor = ""
  document.removeEventListener("pointermove", handlePointerMove, {
    capture: true
  })
  hoveredElement = null

  // Clear highlights
  directClearHighlights()

  // Remove highlight elements
  removeHighlightElements()

  console.log("[ElementInspector] Inspection stopped")
}

// Listen for commands from the extension
eventBus.subscribe((event) => {
  if (event.type === "INSPECTOR_COMMAND") {
    const { command } = event.data

    console.log(`[ElementInspector] Received command: ${command}`)

    switch (command) {
      case "start":
        startInspection()
        break
      case "stop":
        stopInspection()
        break
    }
  }
})

// Initialize
console.log("[ElementInspector] Ultra-high performance content script loaded")

// Cleanup on unload
window.addEventListener("unload", () => {
  stopInspection()
})
