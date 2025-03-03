import { eventBus } from "@/lib/events/event-bus"
import type {
  FocusOrderCommandEvent,
  FocusOrderStatsEvent
} from "@/lib/events/types"
import { focusableSelectors } from "@/lib/focusable-selectors"

// Track visualizer state
let isVisualizingFocusOrder = false
let focusOrderStyleElement: HTMLStyleElement | null = null
let focusOrderOverlays: HTMLElement[] = []

// Configuration
const OVERLAY_Z_INDEX = 2147483646 // Just below maximum z-index
const OVERLAY_CLASS = "focus-order-indicator"
const OVERLAY_CONTAINER_ID = "focus-order-container"

/**
 * Get all focusable elements on the page
 */
function getFocusableElements(): HTMLElement[] {
  // Combine all selectors with commas
  const selector = focusableSelectors.join(", ")

  // Query all focusable elements
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector))

  // Sort by tabindex (elements with tabindex > 0 come first, in order)
  return elements.sort((a, b) => {
    const aTabIndex = a.getAttribute("tabindex")
    const bTabIndex = b.getAttribute("tabindex")

    // If neither has a tabindex, maintain DOM order
    if (!aTabIndex && !bTabIndex) return 0

    // Elements with tabindex > 0 come first, in ascending order
    if (aTabIndex && bTabIndex) {
      const aIndex = parseInt(aTabIndex, 10)
      const bIndex = parseInt(bTabIndex, 10)

      // Both positive
      if (aIndex > 0 && bIndex > 0) return aIndex - bIndex

      // a positive, b zero or negative
      if (aIndex > 0) return -1

      // b positive, a zero or negative
      if (bIndex > 0) return 1

      // Both zero or negative, maintain DOM order
      return 0
    }

    // Only a has tabindex
    if (aTabIndex) {
      const aIndex = parseInt(aTabIndex, 10)
      return aIndex > 0 ? -1 : 0
    }

    // Only b has tabindex
    if (bTabIndex) {
      const bIndex = parseInt(bTabIndex, 10)
      return bIndex > 0 ? 1 : 0
    }

    return 0
  })
}

/**
 * Create an overlay element for a focusable element
 */
function createOverlay(element: HTMLElement, index: number): HTMLElement {
  const rect = element.getBoundingClientRect()
  const overlay = document.createElement("div")

  // Set overlay properties
  overlay.className = OVERLAY_CLASS
  overlay.textContent = (index + 1).toString()
  overlay.style.cssText = `
    position: absolute;
    top: ${window.scrollY + rect.top}px;
    left: ${window.scrollX + rect.left}px;
    width: 24px;
    height: 24px;
    background-color: #2563eb;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    z-index: ${OVERLAY_Z_INDEX};
    pointer-events: none;
    box-shadow: 0 0 0 2px white, 0 0 0 4px #2563eb;
  `

  return overlay
}

/**
 * Create a container for all overlays
 */
function getOrCreateOverlayContainer(): HTMLElement {
  let container = document.getElementById(OVERLAY_CONTAINER_ID)

  if (!container) {
    container = document.createElement("div")
    container.id = OVERLAY_CONTAINER_ID
    container.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${OVERLAY_Z_INDEX};
    `
    document.body.appendChild(container)
  }

  return container
}

/**
 * Create CSS for focus order visualization
 */
function generateFocusOrderCSS(): string {
  return `
    .${OVERLAY_CLASS} {
      transition: transform 0.2s ease-in-out;
    }
    .${OVERLAY_CLASS}:hover {
      transform: scale(1.2);
    }

    /* Highlight the current focused element */
    :focus {
      outline: 3px solid #2563eb !important;
      outline-offset: 2px !important;
    }

    /* Add a connecting line between sequential focus elements */
    .focus-order-path {
      position: absolute;
      background-color: rgba(37, 99, 235, 0.3);
      pointer-events: none;
      z-index: ${OVERLAY_Z_INDEX - 1};
    }
  `
}

/**
 * Start visualizing focus order
 */
export function startVisualizingFocusOrder(): void {
  if (isVisualizingFocusOrder) return

  isVisualizingFocusOrder = true

  // Add CSS styles
  if (!focusOrderStyleElement) {
    focusOrderStyleElement = document.createElement("style")
    focusOrderStyleElement.textContent = generateFocusOrderCSS()
    document.head.appendChild(focusOrderStyleElement)
  }

  // Get all focusable elements
  const focusableElements = getFocusableElements()

  // Create overlay container
  const container = getOrCreateOverlayContainer()

  // Create overlays for each focusable element
  focusableElements.forEach((element, index) => {
    const overlay = createOverlay(element, index)
    container.appendChild(overlay)
    focusOrderOverlays.push(overlay)

    // Add data attribute to the element for easier identification
    element.setAttribute("data-focus-order", (index + 1).toString())

    // Create connecting lines between elements (except for the first one)
    if (index > 0) {
      const prevElement = focusableElements[index - 1]
      const prevRect = prevElement.getBoundingClientRect()
      const currRect = element.getBoundingClientRect()

      // Calculate line position
      const prevX = window.scrollX + prevRect.left + prevRect.width / 2
      const prevY = window.scrollY + prevRect.top + prevRect.height / 2
      const currX = window.scrollX + currRect.left + currRect.width / 2
      const currY = window.scrollY + currRect.top + currRect.height / 2

      // Calculate line dimensions
      const length = Math.sqrt(
        Math.pow(currX - prevX, 2) + Math.pow(currY - prevY, 2)
      )
      const angle = Math.atan2(currY - prevY, currX - prevX) * (180 / Math.PI)

      // Create line element
      const line = document.createElement("div")
      line.className = "focus-order-path"
      line.style.cssText = `
        position: absolute;
        top: ${prevY}px;
        left: ${prevX}px;
        width: ${length}px;
        height: 2px;
        transform: rotate(${angle}deg);
        transform-origin: 0 0;
      `

      container.appendChild(line)
      focusOrderOverlays.push(line)
    }
  })

  // Publish stats about focus order
  const statsEvent: FocusOrderStatsEvent = {
    type: "FOCUS_ORDER_STATS",
    timestamp: Date.now(),
    data: {
      total: focusableElements.length,
      positiveTabIndex: focusableElements.filter((el) => {
        const tabIndex = el.getAttribute("tabindex")
        return tabIndex && parseInt(tabIndex, 10) > 0
      }).length
    }
  }

  eventBus.publish(statsEvent)

  console.log(
    `Focus order visualization started with ${focusableElements.length} elements`
  )
}

/**
 * Stop visualizing focus order
 */
export function stopVisualizingFocusOrder(): void {
  if (!isVisualizingFocusOrder) return

  isVisualizingFocusOrder = false

  // Remove style element
  if (
    focusOrderStyleElement &&
    document.head.contains(focusOrderStyleElement)
  ) {
    document.head.removeChild(focusOrderStyleElement)
  }

  // Remove all overlays
  const container = document.getElementById(OVERLAY_CONTAINER_ID)
  if (container) {
    document.body.removeChild(container)
  }

  // Remove data attributes from elements
  document.querySelectorAll("[data-focus-order]").forEach((element) => {
    element.removeAttribute("data-focus-order")
  })

  // Clear overlay array
  focusOrderOverlays = []

  console.log("Focus order visualization stopped")
}

/**
 * Toggle focus order visualization
 */
export function toggleFocusOrderVisualization(): boolean {
  if (isVisualizingFocusOrder) {
    stopVisualizingFocusOrder()
  } else {
    startVisualizingFocusOrder()
  }

  return isVisualizingFocusOrder
}

/**
 * Get current visualization state
 */
export function getFocusOrderVisualizationState(): boolean {
  return isVisualizingFocusOrder
}

/**
 * Handle window resize to reposition overlays
 */
function handleResize(): void {
  if (isVisualizingFocusOrder) {
    // Simply restart visualization to recalculate positions
    stopVisualizingFocusOrder()
    startVisualizingFocusOrder()
  }
}

/**
 * Handle focus order command events
 */
function handleFocusOrderCommand(event: FocusOrderCommandEvent): void {
  const { command } = event.data

  switch (command) {
    case "start":
      startVisualizingFocusOrder()
      break
    case "stop":
      stopVisualizingFocusOrder()
      break
    case "toggle":
      toggleFocusOrderVisualization()
      break
    default:
      console.warn(`Unknown focus order command: ${command}`)
  }
}

/**
 * Initialize the focus order visualizer
 */
export function initialize(): void {
  // Subscribe to focus order commands
  eventBus.subscribe((event) => {
    if (event.type === "FOCUS_ORDER_COMMAND") {
      handleFocusOrderCommand(event as FocusOrderCommandEvent)
    }
  })

  // Handle window resize
  window.addEventListener("resize", handleResize)

  // Handle scroll events to reposition overlays
  window.addEventListener("scroll", handleResize)

  console.log("Focus order visualizer initialized")
}

// Auto-initialize when imported in content script
if (typeof window !== "undefined") {
  initialize()
}
