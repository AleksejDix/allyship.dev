import { eventBus } from "@/lib/events/event-bus"
import * as DebugUtils from "@/lib/utils/debug-utils"
import * as SelectorUtils from "@/lib/utils/selector-utils"
import { createElementInspector } from "@allystudio/element-inspector"
import type { InspectorAPI, ElementInfo } from "@allystudio/element-inspector"

// Inspector instance
let inspector: InspectorAPI | null = null

// Track state
let isInspecting = false
let debugMode = false
let clickThroughMode = true

/**
 * Filter out Plasmo components and find valid parent
 */
function getValidElement(element: HTMLElement): HTMLElement | null {
  if (element.tagName.toLowerCase().startsWith("plasmo-")) {
    let parent = element.parentElement
    while (parent && parent.tagName.toLowerCase().startsWith("plasmo-")) {
      parent = parent.parentElement
    }
    return parent
  }
  return element
}

/**
 * Highlight element via event bus
 */
function highlightElement(elementInfo: ElementInfo) {
  const element = elementInfo.element

  if (!element || element.tagName.toLowerCase().startsWith("plasmo-")) return

  const selector = SelectorUtils.getUniqueSelector(element)

  if (debugMode) {
    DebugUtils.logElementReference(element, "Highlighting", selector)

    const rect = element.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) {
      DebugUtils.logZeroDimensionsWarning(element)
    }
  }

  // Send to event bus
  const finalSelector = selector.startsWith("xpath:")
    ? selector.substring(6)
    : selector

  eventBus.publish({
    type: "HIGHLIGHT",
    timestamp: performance.now(),
    data: {
      selector: finalSelector,
      message: debugMode
        ? `${SelectorUtils.getElementDetails(element)} [DEBUG MODE]`
        : SelectorUtils.getElementDetails(element),
      isValid: true,
      layer: debugMode ? "inspector-debug" : "inspector"
    }
  })
}

/**
 * Clear highlights via event bus
 */
function clearHighlights() {
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
}

/**
 * Initialize the inspector instance
 */
function initializeInspector() {
  if (inspector) {
    inspector.destroy()
  }

  inspector = createElementInspector({
    deepInspection: false,
    debug: debugMode,
    throttle: 16, // 60fps
    excludeSelectors: [
      '[data-highlight-box]',
      '[data-inspector-overlay]',
      'plasmo-csui',
      'plasmo-overlay'
    ]
  })

  // Handle hover events
  inspector.on((event) => {
    switch (event.type) {
      case 'hover':
        if (event.element) {
          // Filter out Plasmo components
          const validElement = getValidElement(event.element.element)
          if (validElement && validElement !== event.element.element) {
            // Create new ElementInfo for the valid element
            const validElementInfo = inspector!.getElementInfo(validElement)
            highlightElement(validElementInfo)
          } else if (validElement) {
            highlightElement(event.element)
          }
        }
        break

      case 'unhover':
        // Clear highlights when not hovering over any element
        clearHighlights()
        break

      case 'select':
        if (event.element) {
          const validElement = getValidElement(event.element.element)
          if (validElement) {
            const validElementInfo = validElement === event.element.element
              ? event.element
              : inspector!.getElementInfo(validElement)

            highlightElement(validElementInfo)
            DebugUtils.logElementSelection(validElement, clickThroughMode)
          }
        }
        break

      case 'start':
        isInspecting = true
        document.body.style.cursor = "crosshair"
        clearHighlights()
        DebugUtils.logInspectionStart(inspector!.getState().options.deepInspection || false)
        break

      case 'stop':
        isInspecting = false
        document.body.style.cursor = ""
        clearHighlights()
        console.log("Element inspection stopped")
        break
    }
  })
}

/**
 * Start inspection
 */
export function startInspection() {
  if (!inspector) {
    initializeInspector()
  }

  inspector!.start()
}

/**
 * Stop inspection
 */
export function stopInspection() {
  if (inspector) {
    inspector.stop()
  }
}

/**
 * Toggle deep inspection mode
 */
export function toggleDeepInspection() {
  if (!inspector) {
    initializeInspector()
  }

  const currentState = inspector!.getState()
  const newDeepMode = !currentState.options.deepInspection

  inspector!.setOptions({ deepInspection: newDeepMode })

  console.log(
    `%c[Deep Inspection] Mode ${newDeepMode ? "ENABLED" : "DISABLED"}`,
    `color: ${newDeepMode ? "#f59e0b" : "#6b7280"}; font-weight: bold;`
  )

  if (isInspecting) {
    console.log("[Deep Inspection] Restarting inspection with new mode")
    inspector!.stop()
    inspector!.start()
  }
}

/**
 * Toggle debug mode
 */
export function toggleDebugMode() {
  debugMode = !debugMode
  console.log(`Debug mode ${debugMode ? "enabled" : "disabled"}`)

  // Reinitialize inspector with new debug mode
  const wasInspecting = isInspecting
  if (inspector) {
    inspector.destroy()
  }

  initializeInspector()

  if (wasInspecting) {
    inspector!.start()
  }
}

/**
 * Toggle click-through mode
 */
export function toggleClickThroughMode() {
  clickThroughMode = !clickThroughMode
  console.log(`Click-through mode ${clickThroughMode ? "enabled" : "disabled"}`)

  // Note: The published package handles click prevention internally
  // This mode now primarily affects logging behavior
}

/**
 * Get current inspector state (for debugging)
 */
export function getInspectorState() {
  const inspectorState = inspector?.getState()
  return {
    isInspecting,
    deepInspectionMode: inspectorState?.options.deepInspection || false,
    debugMode,
    clickThroughMode,
    hoveredElement: inspectorState?.hoveredElement?.tagName
  }
}

/**
 * Test deep inspection at a specific position (for debugging in console)
 */
export function testDeepInspectionAtPosition(x: number, y: number) {
  console.log(`%c[Test] Testing deep inspection at position (${x}, ${y})`, "color: #06b6d4; font-weight: bold;")

  if (!inspector) {
    console.log("[Test] Inspector not initialized")
    return null
  }

  const elementInfo = inspector.inspectAt(x, y)

  if (elementInfo) {
    console.log(`[Test] Inspector found: ${elementInfo.tagName}${elementInfo.element.id ? '#' + elementInfo.element.id : ''}`)
    return elementInfo.element
  } else {
    console.log("[Test] No element found at position")
    return null
  }
}

/**
 * Initialize the element inspector
 */
export function initialize() {
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

  console.log("Element inspector initialized with @allystudio/element-inspector")

  // Expose debugging functions to window for console testing
  if (typeof window !== "undefined") {
    (window as any).allyStudioDebug = {
      getInspectorState,
      testDeepInspectionAtPosition,
      toggleDeepInspection,
      startInspection,
      stopInspection
    }
    console.log("Debug functions available at window.allyStudioDebug")
  }
}
