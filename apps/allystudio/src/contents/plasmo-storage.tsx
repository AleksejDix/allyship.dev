import { LayerSystem } from "@/components/layers/LayerSystem"
import { eventBus } from "@/lib/events/event-bus"
import { useEffect, useMemo, useRef, useState } from "react"

import type { HighlightData, HighlightEvent } from "./types"
import { DEFAULT_HIGHLIGHT_STYLES } from "./types"

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<
    Map<string, Map<string, HighlightData>>
  >(new Map())

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

  // Subscribe to events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HIGHLIGHT") {
        setHighlights((current) => {
          const newHighlights = new Map(current)
          const highlightEvent = event.data as HighlightEvent
          const { layer } = highlightEvent

          // Clear highlights based on layer if clear flag is set
          if (highlightEvent.clear) {
            if (layer) {
              newHighlights.delete(layer)
            } else {
              newHighlights.clear()
            }
            return newHighlights
          }

          const { selector, message, isValid } = highlightEvent
          const element = validateHighlight(selector)
          if (!element) return current

          const styles = isValid
            ? DEFAULT_HIGHLIGHT_STYLES.valid
            : DEFAULT_HIGHLIGHT_STYLES.invalid

          // Get or create layer map
          let layerHighlights = newHighlights.get(layer)
          if (!layerHighlights) {
            layerHighlights = new Map()
            newHighlights.set(layer, layerHighlights)
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

          return newHighlights
        })
      } else if (event.type === "TOOL_STATE_CHANGE") {
        const { tool, enabled } = event.data
        if (!enabled) {
          // Only clear highlights for the specific tool being disabled
          setHighlights((current) => {
            const newHighlights = new Map(current)
            newHighlights.delete(tool)
            return newHighlights
          })
        }
      }
    })

    return unsubscribe
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

  return <LayerSystem highlights={highlights} />
}

export default PlasmoOverlay
