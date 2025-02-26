import { eventBus } from "@/lib/events/event-bus"
import * as DebugUtils from "@/lib/utils/debug-utils"
import * as SelectorUtils from "@/lib/utils/selector-utils"

// Track inspection state
let isInspecting = false
let hoveredElement: HTMLElement | null = null
let lastHighlightTimestamp = 0
const THROTTLE_MS = 0 // No throttling for maximum responsiveness
let deepInspectionMode = false // Toggle for deep inspection mode
let debugMode = false // Toggle for debug mode
let clickThroughMode = true // Enable click-through mode by default

// Pre-bind event handler for maximum performance
let boundPointerMoveHandler: (e: PointerEvent) => void
let boundClickHandler: (e: MouseEvent) => void
let lastReportedPosition = { x: 0, y: 0 }

/**
 * Initialize handlers for pointer events
 */
function initHandlers() {
  // Use pointer events for better performance
  boundPointerMoveHandler = (e: PointerEvent) => {
    if (!isInspecting) return

    // Skip throttling completely for warp speed
    lastHighlightTimestamp = performance.now()

    // Get the element under the cursor directly
    let element = e.target as HTMLElement

    if (!element) return

    // Skip the highlight elements from the layer system
    if (element.hasAttribute("data-highlight-box")) return

    // Skip Plasmo components
    if (element.tagName.toLowerCase().startsWith("plasmo-")) {
      // Try to find the closest non-Plasmo parent element
      let parent = element.parentElement
      while (parent && parent.tagName.toLowerCase().startsWith("plasmo-")) {
        parent = parent.parentElement
      }

      if (parent) {
        element = parent
      } else {
        return // If all parents are Plasmo components, skip highlighting
      }
    }

    // In deep inspection mode, try to find the most specific element at this position
    if (deepInspectionMode) {
      const elementsToExclude = Array.from(
        document.querySelectorAll("[data-highlight-box], plasmo-*")
      )

      // Enhanced deep inspection - get all elements at this point and find the smallest one
      const elementsAtPoint = document.elementsFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement[]

      // Filter out highlight boxes and Plasmo components
      const validElements = elementsAtPoint.filter(
        (el) =>
          !el.hasAttribute("data-highlight-box") &&
          !el.tagName.toLowerCase().startsWith("plasmo-")
      )

      if (validElements.length > 0) {
        // Sort by area (smallest first)
        validElements.sort((a, b) => {
          const aRect = a.getBoundingClientRect()
          const bRect = b.getBoundingClientRect()
          const aArea = aRect.width * aRect.height
          const bArea = bRect.width * bRect.height
          return aArea - bArea
        })

        // Find the smallest element that's not too small (at least 5x5 pixels)
        for (const el of validElements) {
          const rect = el.getBoundingClientRect()
          if (rect.width >= 5 && rect.height >= 5) {
            element = el
            break
          }
        }
      } else {
        // Fallback to the original method if no valid elements found
        element =
          SelectorUtils.findDeepestElementAtPoint(
            e.clientX,
            e.clientY,
            elementsToExclude
          ) || element
      }
    }

    // If we're hovering over the same element, no need to update
    if (element === hoveredElement) return

    // Update the hovered element
    hoveredElement = element

    // Directly highlight the element at warp speed
    highlightElement(element)

    // Verify highlight position in debug mode
    if (debugMode) {
      verifyHighlightPosition(element, e)
    }
  }

  // Add click handler to select elements
  boundClickHandler = (e: MouseEvent) => {
    if (!isInspecting) return

    // In click-through mode, we want to allow clicks to pass through
    // to the underlying elements, so we don't prevent default
    if (!clickThroughMode) {
      // Only prevent default when click-through is disabled
      e.preventDefault()
      e.stopPropagation()
    }

    // Get the element under the cursor
    let element = e.target as HTMLElement

    // Skip the highlight elements from the layer system
    if (element.hasAttribute("data-highlight-box")) return

    // Skip Plasmo components
    if (element.tagName.toLowerCase().startsWith("plasmo-")) {
      // Try to find the closest non-Plasmo parent element
      let parent = element.parentElement
      while (parent && parent.tagName.toLowerCase().startsWith("plasmo-")) {
        parent = parent.parentElement
      }

      if (parent) {
        element = parent
      } else {
        return // If all parents are Plasmo components, skip highlighting
      }
    }

    // In deep inspection mode, try to find the most specific element at this position
    if (deepInspectionMode) {
      const elementsToExclude = Array.from(
        document.querySelectorAll("[data-highlight-box], plasmo-*")
      )

      // Enhanced deep inspection - get all elements at this point and find the smallest one
      const elementsAtPoint = document.elementsFromPoint(
        e.clientX,
        e.clientY
      ) as HTMLElement[]

      // Filter out highlight boxes and Plasmo components
      const validElements = elementsAtPoint.filter(
        (el) =>
          !el.hasAttribute("data-highlight-box") &&
          !el.tagName.toLowerCase().startsWith("plasmo-")
      )

      if (validElements.length > 0) {
        // Sort by area (smallest first)
        validElements.sort((a, b) => {
          const aRect = a.getBoundingClientRect()
          const bRect = b.getBoundingClientRect()
          const aArea = aRect.width * aRect.height
          const bArea = bRect.width * bRect.height
          return aArea - bArea
        })

        // Find the smallest element that's not too small (at least 5x5 pixels)
        for (const el of validElements) {
          const rect = el.getBoundingClientRect()
          if (rect.width >= 5 && rect.height >= 5) {
            element = el
            break
          }
        }
      } else {
        // Fallback to the original method if no valid elements found
        element =
          SelectorUtils.findDeepestElementAtPoint(
            e.clientX,
            e.clientY,
            elementsToExclude
          ) || element
      }
    }

    // Highlight the clicked element
    highlightElement(element)

    // Log that we've selected this element
    DebugUtils.logElementSelection(element, clickThroughMode)
  }
}

/**
 * Highlight an element with all necessary logging and verification
 */
function highlightElement(element: HTMLElement | null) {
  if (!element) return

  // Skip Plasmo components
  if (element.tagName.toLowerCase().startsWith("plasmo-")) {
    return
  }

  // Get element selector for logging
  const selector = SelectorUtils.getUniqueSelector(element)

  // Enhanced debug logging
  if (debugMode) {
    // Log element with clickable reference
    DebugUtils.logElementReference(element, "Highlighting", selector)

    // Log additional debug information
    console.group(
      "%c[ElementInspector] Debug Information",
      "color: #f59e0b; font-weight: bold;"
    )

    // Log element hierarchy
    console.log("Element Hierarchy:")
    let current: HTMLElement | null = element
    let depth = 0
    const MAX_DEPTH = 3

    while (current && depth < MAX_DEPTH) {
      console.log(
        `${" ".repeat(depth * 2)}%c${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ""}`,
        "color: #4f46e5;"
      )
      current = current.parentElement
      depth++
    }

    // Log computed style information
    const computedStyle = window.getComputedStyle(element)
    console.log("Computed Style:", {
      position: computedStyle.position,
      display: computedStyle.display,
      visibility: computedStyle.visibility,
      opacity: computedStyle.opacity,
      zIndex: computedStyle.zIndex,
      width: computedStyle.width,
      height: computedStyle.height
    })

    // Log accessibility information
    console.log("Accessibility:", {
      role: element.getAttribute("role") || "(none)",
      ariaLabel: element.getAttribute("aria-label") || "(none)",
      ariaLabelledby: element.getAttribute("aria-labelledby") || "(none)",
      ariaHidden: element.getAttribute("aria-hidden") || "(none)",
      tabIndex: element.getAttribute("tabindex") || "(none)"
    })

    console.groupEnd()
  }

  // Check for zero dimensions
  if (
    (debugMode && element.getBoundingClientRect().width === 0) ||
    element.getBoundingClientRect().height === 0
  ) {
    DebugUtils.logZeroDimensionsWarning(element)
  }

  // Asynchronously send to event bus for compatibility
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        // Handle XPath selectors
        let finalSelector = selector
        const isXPath = selector.startsWith("xpath:")
        if (isXPath) {
          finalSelector = selector.substring(6) // Remove the 'xpath:' prefix
        }

        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: performance.now(),
          data: {
            selector: finalSelector,
            message: debugMode
              ? `${SelectorUtils.getElementDetails(element)} [DEBUG MODE]`
              : SelectorUtils.getElementDetails(element),
            isValid: true,
            layer: debugMode ? "inspector-debug" : "inspector" // Use a different layer for debug mode
          }
        })
      },
      { timeout: 200 }
    )
  }
}

/**
 * Verify highlight position and log issues in debug mode
 */
function verifyHighlightPosition(element: HTMLElement, event: PointerEvent) {
  if (!debugMode || !element) return

  // Store the current mouse position
  lastReportedPosition = { x: event.clientX, y: event.clientY }

  // Check if there's a targeting issue
  const elementAtPoint = document.elementFromPoint(
    event.clientX,
    event.clientY
  ) as HTMLElement

  if (
    elementAtPoint &&
    elementAtPoint !== element &&
    !element.contains(elementAtPoint) &&
    !elementAtPoint.contains(element) &&
    !elementAtPoint.hasAttribute("data-highlight-box")
  ) {
    DebugUtils.logTargetingIssue(element, elementAtPoint, {
      x: event.clientX,
      y: event.clientY
    })
  }
}

/**
 * Start inspection
 */
export function startInspection() {
  isInspecting = true
  document.body.style.cursor = "crosshair"

  // Initialize handlers if needed
  if (!boundPointerMoveHandler || !boundClickHandler) {
    initHandlers()
  }

  // Use pointer events for better performance across devices
  document.addEventListener("pointermove", boundPointerMoveHandler, {
    passive: true,
    capture: true // Use capture to get events before they're processed
  })

  // Add click handler to select elements
  document.addEventListener("click", boundClickHandler, {
    capture: true // Use capture to get events before they're processed
  })

  // Clear any existing highlights
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: performance.now(),
    data: {
      clear: true,
      layer: "inspector",
      selector: "",
      message: "",
      isValid: true
    }
  })

  // Force a highlight update for the current element under cursor
  const currentElement = document.elementFromPoint(
    window.innerWidth / 2,
    window.innerHeight / 2
  ) as HTMLElement

  if (currentElement) {
    hoveredElement = currentElement
    highlightElement(currentElement)
  }

  // Log inspection start
  DebugUtils.logInspectionStart(deepInspectionMode)
}

/**
 * Stop inspection
 */
export function stopInspection() {
  isInspecting = false
  document.body.style.cursor = ""

  // Remove event listeners
  document.removeEventListener("pointermove", boundPointerMoveHandler, {
    capture: true
  })
  document.removeEventListener("click", boundClickHandler, {
    capture: true
  })

  // Clear any existing highlights
  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: performance.now(),
    data: {
      clear: true,
      layer: "inspector",
      selector: "",
      message: "",
      isValid: true
    }
  })

  // Log inspection stop
  console.log("Element inspection stopped")
}

/**
 * Toggle deep inspection mode
 */
export function toggleDeepInspection() {
  deepInspectionMode = !deepInspectionMode
  console.log(
    `Deep inspection mode ${deepInspectionMode ? "enabled" : "disabled"}. ${
      deepInspectionMode
        ? "Now targeting the smallest element at each position."
        : "Now using standard element targeting."
    }`
  )

  // Restart inspection if it's currently active
  if (isInspecting) {
    stopInspection()
    startInspection()
  }
}

/**
 * Toggle debug mode
 */
export function toggleDebugMode() {
  debugMode = !debugMode
  console.log(
    `Debug mode ${debugMode ? "enabled" : "disabled"}. ${
      debugMode
        ? "Detailed element information will be logged to the console."
        : "Element logging disabled."
    }`
  )

  // Restart inspection if it's currently active
  if (isInspecting) {
    stopInspection()
    startInspection()
  }
}

/**
 * Toggle click-through mode
 */
export function toggleClickThroughMode() {
  clickThroughMode = !clickThroughMode
  console.log(
    `Click-through mode ${clickThroughMode ? "enabled" : "disabled"}. ${
      clickThroughMode
        ? "Clicks will pass through to underlying elements."
        : "Clicks will be captured by the inspector."
    }`
  )

  // Restart inspection if it's currently active
  if (isInspecting) {
    stopInspection()
    startInspection()
  }
}

/**
 * Initialize the element inspector
 */
export function initialize() {
  // Subscribe to commands from the event bus
  eventBus.subscribe((event) => {
    if (event.type === "INSPECTOR_COMMAND") {
      const { command } = event.data
      switch (command) {
        case "start":
          startInspection()
          break
        case "stop":
          stopInspection()
          break
        case "toggleDeepInspection":
          toggleDeepInspection()
          break
        case "toggleDebug":
          toggleDebugMode()
          break
        case "toggleClickThrough":
          toggleClickThroughMode()
          break
      }
    }
  })

  console.log("Element inspector initialized")
}
