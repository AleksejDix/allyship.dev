import { LayerSystem } from "@/components/layers/LayerSystem"
import { LayerToggle } from "@/components/layers/LayerToggle"
import { eventBus } from "@/lib/events/event-bus"
import type { AllyStudioEvent } from "@/lib/events/types"
import type {
  HighlightData,
  HighlightEvent,
  HighlightStyles
} from "@/lib/highlight-types"
import { DEFAULT_HIGHLIGHT_STYLES } from "@/lib/highlight-types"
import { useEffect, useRef, useState } from "react"

// Fast path for inspector highlights - no debouncing
const INSPECTOR_LAYER = "inspector"
const INSPECTOR_DEBUG_LAYER = "inspector-debug"
// Reduced debounce for other layers
const DEBOUNCE_MS = 50 // Reduced from 100ms to 50ms for better responsiveness

// Custom styles for debug mode
const DEBUG_HIGHLIGHT_STYLES: HighlightStyles = {
  border: "#f59e0b", // Amber color for debug mode
  background: "rgba(245, 158, 11, 0.1)",
  messageBackground: "#f59e0b"
}

// Define core test types outside component
const CORE_TEST_TYPES = [
  "headings",
  "links",
  "alt",
  "interactive",
  "focus",
  "forms",
  "aria"
] as const

const PlasmoOverlay = () => {
  // Track which tests are known (move this inside the component)
  const knownTestTypesRef = useRef<Set<string>>(new Set())

  // Initialize with core test types (this must be inside the component)
  useEffect(() => {
    CORE_TEST_TYPES.forEach((type: string) =>
      knownTestTypesRef.current.add(type)
    )
  }, [])

  const [highlights, setHighlights] = useState<
    Map<string, Map<string, HighlightData>>
  >(new Map())

  // Track if tests are complete
  const [testsComplete, setTestsComplete] = useState(false)
  const completedTestsRef = useRef<Set<string>>(new Set())

  // Ref to store pending updates
  const pendingUpdatesRef = useRef<Map<string, Map<string, HighlightData>>>(
    new Map([])
  )
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  // Separate fast-path for inspector highlights
  const inspectorHighlightsRef = useRef<Map<string, HighlightData>>(new Map())

  // Track layer visibility
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())

  // Toggle layer visibility
  const toggleLayer = (layerName: string, forceVisible?: boolean) => {
    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      const isCurrentlyHidden = newHidden.has(layerName)

      // If forceVisible is provided, use that, otherwise toggle
      const shouldShow = forceVisible ?? isCurrentlyHidden

      if (shouldShow) {
        newHidden.delete(layerName)
      } else {
        newHidden.add(layerName)
      }
      return newHidden
    })
  }

  // Fast validation for inspector highlights
  const fastValidateHighlight = (selector: string): HTMLElement | null => {
    try {
      if (!selector || selector === "*") return null
      return document.querySelector(selector) as HTMLElement
    } catch (error) {
      return null
    }
  }

  // More thorough validation for other highlights
  const validateHighlight = (selector: string): HTMLElement | null => {
    try {
      if (!selector || selector === "*") return null
      const element = document.querySelector(selector) as HTMLElement
      if (!element || !element.isConnected) return null
      const rect = element.getBoundingClientRect()
      if (!rect || rect.width === 0 || rect.height === 0) return null
      return element
    } catch (error) {
      console.error("Invalid selector:", selector, error)
      return null
    }
  }

  // Function to apply batched updates
  const applyUpdates = () => {
    // Create a new map that includes both the pending updates and inspector highlights
    const newHighlights = new Map(pendingUpdatesRef.current)

    // Add inspector highlights if they exist
    if (inspectorHighlightsRef.current.size > 0) {
      newHighlights.set(
        INSPECTOR_LAYER,
        new Map(inspectorHighlightsRef.current)
      )
    }

    // Debug log to check if aria layer has highlights
    if (newHighlights.has("aria")) {
      const ariaHighlights = newHighlights.get("aria")
      console.log(
        `[HIGHLIGHT DEBUG] Aria layer has ${ariaHighlights?.size || 0} highlights:`,
        Array.from(ariaHighlights?.entries() || [])
      )
    } else {
      console.log(
        "[HIGHLIGHT DEBUG] Aria layer has no highlights in pending updates"
      )
    }

    setHighlights(newHighlights)
    pendingUpdatesRef.current = new Map(pendingUpdatesRef.current)
  }

  // Debounced update function
  const debouncedUpdate = (
    updates: Map<string, Map<string, HighlightData>>
  ) => {
    pendingUpdatesRef.current = updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }
    updateTimeoutRef.current = setTimeout(applyUpdates, DEBOUNCE_MS)
  }

  // Fast path update for inspector highlights
  const updateInspectorHighlights = (highlightData: HighlightData | null) => {
    // Clear inspector highlights if null
    if (highlightData === null) {
      inspectorHighlightsRef.current.clear()
    } else {
      // Set the new highlight
      inspectorHighlightsRef.current.clear() // Only show one highlight at a time for inspector
      inspectorHighlightsRef.current.set(highlightData.selector, highlightData)
    }

    // Apply updates immediately using requestAnimationFrame
    requestAnimationFrame(() => {
      const newHighlights = new Map(highlights)

      if (inspectorHighlightsRef.current.size === 0) {
        newHighlights.delete(INSPECTOR_LAYER)
      } else {
        newHighlights.set(
          INSPECTOR_LAYER,
          new Map(inspectorHighlightsRef.current)
        )
      }

      setHighlights(newHighlights)
    })
  }

  // Initialize message handling
  useEffect(() => {
    console.log("[PlasmoOverlay] Content script initialized")

    // Notify that we're ready to receive messages
    chrome.runtime
      .sendMessage({ type: "CONTENT_SCRIPT_READY" })
      .catch((error) =>
        console.error("[PlasmoOverlay] Failed to send ready message:", error)
      )

    return () => {
      console.log("[PlasmoOverlay] Content script cleanup")
    }
  }, [])

  // Subscribe to test completion events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event: AllyStudioEvent) => {
      // Track test completions using the generic event
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        const testId = event.data.testId
        if (testId) {
          // Auto-register any new test types
          if (!knownTestTypesRef.current.has(testId)) {
            console.log(`Registering new test type: ${testId}`)
            knownTestTypesRef.current.add(testId)
          }

          completedTestsRef.current.add(testId)
          console.log(`Test completed: ${testId}`)

          // Check if all required tests are complete
          const allComplete = Array.from(knownTestTypesRef.current).every(
            (testType) => completedTestsRef.current.has(testType)
          )

          if (allComplete) {
            console.log("All tests complete, showing layer toggle")
            setTestsComplete(true)
            // Reset hidden layers when tests complete
            setHiddenLayers(new Set())
          }
        }
      }
    })
    return () => {
      completedTestsRef.current.clear()
      unsubscribe()
    }
  }, [])

  // Subscribe to highlight events
  useEffect(() => {
    // Debug log to check if aria layer is hidden
    console.log("[LAYER DEBUG] Hidden layers:", Array.from(hiddenLayers))
    console.log("[LAYER DEBUG] Is aria layer hidden:", hiddenLayers.has("aria"))

    const unsubscribe = eventBus.subscribe((event: AllyStudioEvent) => {
      if (event.type === "HIGHLIGHT") {
        const highlightEvent = event.data as HighlightEvent
        const { layer } = highlightEvent

        // Debug log to see highlight events
        console.log(
          `[HIGHLIGHT] Layer: ${layer}, Selector: ${highlightEvent.selector}`
        )

        // Special debug for aria layer
        if (layer === "aria") {
          console.log(
            `[ARIA HIGHLIGHT] Adding highlight for selector: ${highlightEvent.selector}, message: ${highlightEvent.message}, isValid: ${highlightEvent.isValid}`
          )
        }

        // Fast path for inspector layer and inspector-debug layer
        if (layer === INSPECTOR_LAYER || layer === INSPECTOR_DEBUG_LAYER) {
          // Clear highlights if clear flag is set
          if (highlightEvent.clear) {
            updateInspectorHighlights(null)
            return
          }

          const { selector, message, isValid } = highlightEvent
          const element = fastValidateHighlight(selector)
          if (!element) {
            updateInspectorHighlights(null)
            return
          }

          // Use custom styling for debug mode
          let styles = isValid
            ? DEFAULT_HIGHLIGHT_STYLES.valid
            : DEFAULT_HIGHLIGHT_STYLES.invalid

          // Apply special styling for debug mode
          if (layer === INSPECTOR_DEBUG_LAYER) {
            // Create new highlight data with debug styles
            const newHighlight = {
              selector,
              message,
              element,
              isValid,
              styles: DEBUG_HIGHLIGHT_STYLES,
              layer
            }

            // Update inspector highlights immediately
            updateInspectorHighlights(newHighlight)
            return
          }

          // Create new highlight data
          const newHighlight = {
            selector,
            message,
            element,
            isValid,
            styles,
            layer
          }

          // Update inspector highlights immediately
          updateInspectorHighlights(newHighlight)
          return
        }

        // Standard path for other layers
        pendingUpdatesRef.current = new Map(pendingUpdatesRef.current)

        // Clear highlights based on layer if clear flag is set
        if (highlightEvent.clear) {
          if (layer) {
            pendingUpdatesRef.current.delete(layer)
          } else {
            pendingUpdatesRef.current.clear()
          }
          debouncedUpdate(pendingUpdatesRef.current)
          return
        }

        const { selector, message, isValid } = highlightEvent
        const element = validateHighlight(selector)
        if (!element) return

        const styles = isValid
          ? DEFAULT_HIGHLIGHT_STYLES.valid
          : DEFAULT_HIGHLIGHT_STYLES.invalid

        // Get or create layer map
        let layerHighlights = pendingUpdatesRef.current.get(layer)
        if (!layerHighlights) {
          layerHighlights = new Map()
          pendingUpdatesRef.current.set(layer, layerHighlights)
        }

        // Create new highlight data
        const newHighlight = {
          selector,
          message,
          element,
          isValid,
          styles,
          layer
        }

        // Update highlight in layer
        layerHighlights.set(selector, newHighlight)

        debouncedUpdate(pendingUpdatesRef.current)
      } else if (event.type === "TOOL_STATE_CHANGE") {
        const { tool, enabled } = event.data
        if (!enabled) {
          // Fast path for inspector
          if (tool === INSPECTOR_LAYER) {
            updateInspectorHighlights(null)
            return
          }

          pendingUpdatesRef.current = new Map(pendingUpdatesRef.current)
          pendingUpdatesRef.current.delete(tool)
          debouncedUpdate(pendingUpdatesRef.current)
        }
      }
    })

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
      unsubscribe()
    }
  }, [highlights])

  // Subscribe to layer toggle events
  useEffect(() => {
    console.log("[PlasmoOverlay] Setting up LAYER_TOGGLE_REQUEST listener")

    const unsubscribe = eventBus.subscribe((event: AllyStudioEvent) => {
      if (event.type === "LAYER_TOGGLE_REQUEST") {
        console.log("[PlasmoOverlay] Received LAYER_TOGGLE_REQUEST event:", {
          type: event.type,
          data: event.data,
          timestamp: event.timestamp
        })

        const { layer, visible } = event.data

        // Apply the toggle
        setHiddenLayers((current) => {
          const newHidden = new Set(current)
          console.log(
            "[PlasmoOverlay] Current hidden layers:",
            Array.from(current)
          )

          if (!visible) {
            console.log("[PlasmoOverlay] Hiding layer:", layer)
            newHidden.add(layer)
          } else {
            console.log("[PlasmoOverlay] Showing layer:", layer)
            newHidden.delete(layer)
          }

          console.log(
            "[PlasmoOverlay] Updated hidden layers:",
            Array.from(newHidden)
          )
          return newHidden
        })
      }
    })

    return () => {
      console.log("[PlasmoOverlay] Cleaning up LAYER_TOGGLE_REQUEST listener")
      unsubscribe()
    }
  }, [])

  // Clean up stale highlights periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setHighlights((current) => {
        const newHighlights = new Map()
        let hasChanges = false

        // Check each layer
        current.forEach((layerHighlights, layer) => {
          // Skip inspector layer in periodic cleanup - it's managed separately
          if (layer === INSPECTOR_LAYER) {
            newHighlights.set(layer, layerHighlights)
            return
          }

          const newLayerHighlights = new Map()

          // Check each highlight in layer
          layerHighlights.forEach((highlight, selector) => {
            const element = validateHighlight(selector)
            if (element !== null) {
              newLayerHighlights.set(selector, highlight)
            } else {
              hasChanges = true
            }
          })

          if (newLayerHighlights.size > 0) {
            newHighlights.set(layer, newLayerHighlights)
          } else {
            hasChanges = true
          }
        })

        return hasChanges ? newHighlights : current
      })
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  // Apply pending updates to highlights
  useEffect(() => {
    if (pendingUpdatesRef.current.size === 0) return

    // Create a new map that includes both the pending updates and inspector highlights
    const newHighlights = new Map(pendingUpdatesRef.current)

    // Add inspector highlights if they exist
    if (inspectorHighlightsRef.current.size > 0) {
      newHighlights.set(
        INSPECTOR_LAYER,
        new Map(inspectorHighlightsRef.current)
      )
    }

    setHighlights(newHighlights)
    pendingUpdatesRef.current = new Map()

    // Debug log to check if aria layer has highlights
    if (newHighlights.has("aria")) {
      const ariaHighlights = newHighlights.get("aria")
      console.log(
        `[HIGHLIGHT DEBUG] Aria layer has ${ariaHighlights?.size || 0} highlights:`,
        Array.from(ariaHighlights?.entries() || [])
      )
    } else {
      console.log("[HIGHLIGHT DEBUG] Aria layer has no highlights")
    }
  }, [])

  return (
    <>
      <LayerSystem highlights={highlights} hiddenLayers={hiddenLayers} />
      {testsComplete && (
        <LayerToggle
          highlights={highlights}
          hiddenLayers={hiddenLayers}
          onToggleLayer={toggleLayer}
        />
      )}
    </>
  )
}

export default PlasmoOverlay
