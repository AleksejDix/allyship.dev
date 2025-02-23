import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import type { HeadingHighlightRequestEvent } from "@/lib/events/types"
import { useEffect, useMemo, useRef, useState, type JSX } from "react"
import type { CSSProperties } from "react"

interface HighlightStyles {
  border: string
  background: string
  messageBackground: string
}

interface HighlightData {
  selector: string
  message: string
  element: HTMLElement
  isValid: boolean
  styles?: HighlightStyles
  layer: string
}

interface HighlightEvent {
  selector: string
  message: string
  isValid: boolean
  clear?: boolean
  layer: string
}

const DEFAULT_HIGHLIGHT_STYLES = {
  valid: {
    border: "#16A34A",
    background: "rgba(22, 163, 74, 0.1)",
    messageBackground: "#16A34A"
  },
  invalid: {
    border: "#DC2626",
    background: "rgba(220, 38, 38, 0.1)",
    messageBackground: "#DC2626"
  }
} as const

// CSS classes for highlight elements
const elementStyles = {
  highlightBox: {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform",
    zIndex: 9999
  },
  tooltipTrigger: {
    position: "absolute",
    top: "-24px",
    left: "0",
    width: "100%",
    height: "24px",
    pointerEvents: "auto",
    cursor: "pointer"
  }
} as const satisfies Record<string, CSSProperties>

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<
    Map<string, Map<string, HighlightData>>
  >(new Map())
  const ticking = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // Handle scroll and resize updates
  useEffect(() => {
    const updatePositions = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return

        const boxes = containerRef.current.querySelectorAll(
          "[data-highlight-box]"
        )

        boxes.forEach((box) => {
          const selector = box.getAttribute("data-selector")
          if (!selector) return

          // Find the element in our highlights map
          let element: HTMLElement | undefined
          for (const [, layerHighlights] of highlights) {
            const highlight = layerHighlights.get(selector)
            if (highlight?.element) {
              element = highlight.element
              break
            }
          }

          if (!element) return

          const rect = element.getBoundingClientRect()
          const style = box as HTMLElement
          style.style.setProperty("--x", `${rect.left}px`)
          style.style.setProperty("--y", `${rect.top}px`)
          style.style.width = `${rect.width}px`
          style.style.height = `${rect.height}px`
        })

        ticking.current = false
      })
    }

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true
        updatePositions()
      }
    }

    // Listen to all scroll events in the document
    document.addEventListener("scroll", onScroll, {
      capture: true,
      passive: true
    })

    const resizeObserver = new ResizeObserver(updatePositions)
    resizeObserver.observe(document.body)

    // Initial position update
    updatePositions()

    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true })
      resizeObserver.disconnect()
    }
  }, [highlights])

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

  const highlightElements = useMemo(() => {
    const elements: JSX.Element[] = []

    // Render highlights from each layer
    highlights.forEach((layerHighlights, layer) => {
      layerHighlights.forEach(
        ({ element, message, selector, isValid, styles }) => {
          const rect = element.getBoundingClientRect()
          if (!rect || rect.width === 0) return

          const validityLabel = isValid ? "Valid" : "Invalid"
          const highlightStyles =
            styles ||
            (isValid
              ? DEFAULT_HIGHLIGHT_STYLES.valid
              : DEFAULT_HIGHLIGHT_STYLES.invalid)

          elements.push(
            <div
              key={`${layer}-${selector}`}
              role="group"
              aria-label={`${validityLabel} highlight for ${message}`}>
              <div
                data-highlight-box
                data-selector={selector}
                role="presentation"
                style={{
                  ...elementStyles.highlightBox,
                  transform: "translate3d(var(--x), var(--y), 0)",
                  border: `2px solid ${highlightStyles.border}`,
                  backgroundColor: highlightStyles.background
                }}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div style={elementStyles.tooltipTrigger} />
                    </TooltipTrigger>
                    <TooltipContent
                      side="top"
                      className="z-[9999]"
                      style={{
                        backgroundColor: highlightStyles.messageBackground,
                        color: "white",
                        maxWidth: "300px",
                        whiteSpace: "pre-wrap"
                      }}>
                      {message}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )
        }
      )
    })

    return elements
  }, [highlights])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Element highlights overlay"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}>
      <style>{`
        [data-highlight-box] {
          --x: 0px;
          --y: 0px;
        }
      `}</style>
      {highlightElements}
    </div>
  )
}

export default PlasmoOverlay
