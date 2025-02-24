import { LayerSystem } from "@/components/layers/LayerSystem"
import { LayerToggle } from "@/components/layers/LayerToggle"
import { eventBus } from "@/lib/events/event-bus"
import type { AllyStudioEvent } from "@/lib/events/types"
import type { HighlightData, HighlightEvent } from "@/lib/highlight-types"
import { DEFAULT_HIGHLIGHT_STYLES } from "@/lib/highlight-types"
import { useEffect, useRef, useState } from "react"

const DEBOUNCE_MS = 100 // Wait 100ms for batching updates

// Track which tests need to complete
const REQUIRED_TEST_COMPLETIONS = [
  "HEADING_ANALYSIS_COMPLETE",
  "LINK_ANALYSIS_COMPLETE",
  "ALT_ANALYSIS_COMPLETE",
  "INTERACTIVE_ANALYSIS_COMPLETE"
] as const

const PlasmoOverlay = () => {
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

  // Helper to validate selector and element
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
    setHighlights(pendingUpdatesRef.current)
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
      // Track test completions
      if (REQUIRED_TEST_COMPLETIONS.includes(event.type as any)) {
        completedTestsRef.current.add(event.type)
        console.log("Test completed:", event.type)

        // Check if all required tests are complete
        const allComplete = REQUIRED_TEST_COMPLETIONS.every((testType) =>
          completedTestsRef.current.has(testType)
        )

        if (allComplete) {
          console.log("All tests complete, showing layer toggle")
          setTestsComplete(true)
          // Reset hidden layers when tests complete
          setHiddenLayers(new Set())
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
    const unsubscribe = eventBus.subscribe((event: AllyStudioEvent) => {
      if (event.type === "HIGHLIGHT") {
        const highlightEvent = event.data as HighlightEvent
        const { layer } = highlightEvent

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
  }, [])

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
