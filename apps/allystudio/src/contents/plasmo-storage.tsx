import { LayerSystem } from "@/components/layers/LayerSystem"
import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

import type { HighlightData, HighlightEvent } from "./types"
import { DEFAULT_HIGHLIGHT_STYLES } from "./types"

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<
    Map<string, Map<string, HighlightData>>
  >(new Map())

  // Track layer visibility
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())

  // Layer counter box styles
  const layerCounterStyles = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    fontSize: "14px",
    zIndex: 999999,
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    minWidth: "240px"
  } as const

  const layerItemStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%"
  } as const

  // Get active layer count and names
  const activeLayerCount = useMemo(() => highlights.size, [highlights])
  const layerNames = useMemo(() => Array.from(highlights.keys()), [highlights])

  // Toggle layer visibility
  const toggleLayer = (layerName: string) => {
    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      if (newHidden.has(layerName)) {
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

  return (
    <>
      <LayerSystem highlights={highlights} hiddenLayers={hiddenLayers} />
      {activeLayerCount > 0 && (
        <div style={layerCounterStyles} role="status">
          <div
            style={{
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              paddingBottom: "8px",
              marginBottom: "4px"
            }}>
            <span>Active Layers: {activeLayerCount}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {layerNames.map((layerName) => (
              <div key={layerName} style={layerItemStyles}>
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                  {layerName}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLayer(layerName)}
                  aria-pressed={!hiddenLayers.has(layerName)}
                  aria-label={`Toggle ${layerName} layer visibility`}>
                  {hiddenLayers.has(layerName) ? (
                    <EyeOff size="16" />
                  ) : (
                    <Eye size="16" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export default PlasmoOverlay
