import { eventBus } from "@/lib/events/event-bus"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Track inspection state
let isInspecting = false
let hoveredElement: HTMLElement | null = null
let lastHighlightTimestamp = 0
const THROTTLE_MS = 5 // Reduce throttling for higher FPS (120 FPS target)
const HIGHLIGHT_DELAY = 0 // Remove delay for immediate feedback

// Cache for selectors to avoid recalculating
let selectorCache = new WeakMap<Element, string>()

/**
 * Generate a unique CSS selector for an element
 * Inspired by Chrome DevTools and Vue DevTools implementations
 */
function getUniqueSelector(el: Element): string {
  // Check cache first for performance
  const cachedSelector = selectorCache.get(el)
  if (cachedSelector) return cachedSelector

  if (!el) return ""

  // ID selector - fastest and most reliable
  if (el.id) {
    const selector = `#${CSS.escape(el.id)}`
    // Verify uniqueness
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }
  }

  // Try with tag name and classes for better specificity
  const tagName = el.tagName.toLowerCase()

  // Use all classes for better uniqueness
  if (el.classList.length > 0) {
    const classSelector = Array.from(el.classList)
      .map((cls) => `.${CSS.escape(cls)}`)
      .join("")

    const selector = `${tagName}${classSelector}`

    // Verify uniqueness
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }
  }

  // Try with parent context for better uniqueness
  if (el.parentElement) {
    // Get a simple selector for this element
    let simpleSelector = tagName

    if (el.classList.length > 0) {
      // Use first class only for simplicity
      simpleSelector = `${tagName}.${CSS.escape(el.classList[0])}`
    }

    // Find position among siblings
    const siblings = Array.from(el.parentElement.children)
    const sameTagSiblings = siblings.filter(
      (sibling) => sibling.tagName.toLowerCase() === tagName
    )

    // If there are multiple siblings with same tag, use nth-child
    if (sameTagSiblings.length > 1) {
      const index = siblings.indexOf(el) + 1
      simpleSelector = `${tagName}:nth-child(${index})`
    }

    // Try to get parent's selector for context
    const parentSelector = getUniqueSelector(el.parentElement)
    const selector = `${parentSelector} > ${simpleSelector}`

    // Verify uniqueness
    try {
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    } catch (e) {
      // If selector is invalid, fall back to simpler approach
      console.warn("Invalid selector generated:", selector)
    }
  }

  // Fallback to a path-based selector as last resort
  let current = el
  const path = []

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    if (current.id) {
      selector = `#${CSS.escape(current.id)}`
      path.unshift(selector)
      break // ID is unique enough to stop here
    } else {
      const parent = current.parentElement

      if (parent) {
        const siblings = Array.from(parent.children)
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1
          selector += `:nth-child(${index})`
        }
      }

      path.unshift(selector)
      current = parent as HTMLElement
    }

    // Limit path length for performance
    if (path.length > 4) break
  }

  const selector = path.join(" > ")
  selectorCache.set(el, selector)
  return selector
}

// Get detailed element information for display
const getElementDetails = (element: HTMLElement): string => {
  const tagName = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ""

  // Include all classes for better identification
  const classes =
    element.classList.length > 0
      ? `.${Array.from(element.classList).join(".")}`
      : ""

  // Add dimensions for better context
  const rect = element.getBoundingClientRect()
  const dimensions = `${Math.round(rect.width)}×${Math.round(rect.height)}`

  return `<${tagName}${id}${classes}> ${dimensions}px`
}

// Clear all current highlights
const clearHighlights = () => {
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: Date.now(),
    data: {
      selector: "*",
      message: "",
      isValid: true,
      clear: true,
      layer: "inspector"
    }
  })
}

// Create a highlight for an element
const highlightElement = (element: HTMLElement) => {
  if (!element) return

  try {
    // Generate a unique selector for the element
    const selector = getUniqueSelector(element)

    // Get element details for the tooltip
    const message = getElementDetails(element)

    // First clear previous highlights
    clearHighlights()

    // Then add the new highlight immediately
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector,
        message,
        isValid: true,
        layer: "inspector"
      }
    })
  } catch (error) {
    console.error("[ElementInspector] Error highlighting element:", error)
  }
}

// Use requestAnimationFrame for smoother performance
let rafId: number | null = null

// Handle mouse movement with optimized performance
const handleMouseMove = (e: MouseEvent) => {
  if (!isInspecting) return

  const now = Date.now()
  // Throttle updates for better performance
  if (now - lastHighlightTimestamp < THROTTLE_MS) return
  lastHighlightTimestamp = now

  // Cancel any pending animation frame
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
  }

  // Schedule the highlight on the next animation frame
  rafId = requestAnimationFrame(() => {
    try {
      // Get the element under the cursor
      const element = document.elementFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement

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

      // Highlight the element
      highlightElement(element)
    } catch (error) {
      console.error("[ElementInspector] Error in mouse move handler:", error)
    }
  })
}

// Start inspection
const startInspection = () => {
  isInspecting = true
  document.body.style.cursor = "crosshair"

  // Clear selector cache when starting new inspection
  // Create a new WeakMap since WeakMap doesn't have a clear method
  selectorCache = new WeakMap<Element, string>()

  // Use passive listener for better performance
  document.addEventListener("mousemove", handleMouseMove, { passive: true })

  // Clear any existing highlights when starting
  clearHighlights()

  // Force a highlight update for the current element under cursor
  const currentElement = document.elementFromPoint(
    window.innerWidth / 2,
    window.innerHeight / 2
  ) as HTMLElement

  if (currentElement) {
    hoveredElement = currentElement
    highlightElement(currentElement)
  }

  console.log("[ElementInspector] Inspection started")
}

// Stop inspection
const stopInspection = () => {
  isInspecting = false
  document.body.style.cursor = ""
  document.removeEventListener("mousemove", handleMouseMove)
  hoveredElement = null

  // Cancel any pending animation frame
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }

  // Clear highlights
  clearHighlights()

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
console.log("[ElementInspector] Content script loaded")

// Cleanup on unload
window.addEventListener("unload", () => {
  stopInspection()
})
