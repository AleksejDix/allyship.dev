import { eventBus } from "@/lib/events/event-bus"
import type { HeadingHighlightRequestEvent } from "@/lib/events/types"
import { useEffect, useMemo, useRef, useState } from "react"
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
}

interface HighlightEvent {
  selector: string
  message: string
  isValid: boolean
  clear?: boolean
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
  tooltip: {
    position: "fixed",
    top: 0,
    left: 0,
    padding: "4px 8px",
    fontSize: "12px",
    lineHeight: "1.4",
    whiteSpace: "nowrap",
    willChange: "transform",
    zIndex: 9999
  }
} as const satisfies Record<string, CSSProperties>

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([])
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

        const container = containerRef.current
        const boxes = container.querySelectorAll("[data-highlight-box]")
        const tooltips = container.querySelectorAll("[data-highlight-tooltip]")

        boxes.forEach((box, index) => {
          const element = highlights[index]?.element
          if (!element) return

          const rect = element.getBoundingClientRect()
          const style = box as HTMLElement
          style.style.setProperty("--x", `${rect.left}px`)
          style.style.setProperty("--y", `${rect.top}px`)
          style.style.width = `${rect.width}px`
          style.style.height = `${rect.height}px`
        })

        tooltips.forEach((tooltip, index) => {
          const element = highlights[index]?.element
          if (!element) return

          const rect = element.getBoundingClientRect()
          const style = tooltip as HTMLElement
          style.style.setProperty("--x", `${rect.left}px`)
          style.style.setProperty("--y", `${rect.top - 24}px`)
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
          const highlightEvent = event.data as HighlightEvent

          // Clear highlights based on message prefix if clear flag is set
          if (highlightEvent.clear) {
            if (highlightEvent.message.startsWith("Heading Structure")) {
              return current.filter(
                (h) => !h.message.startsWith("Heading Structure")
              )
            } else if (
              highlightEvent.message.startsWith("Link Accessibility")
            ) {
              return current.filter(
                (h) => !h.message.startsWith("Link Accessibility")
              )
            }
            return []
          }

          const { selector, message, isValid } = highlightEvent
          const element = validateHighlight(selector)
          if (!element) return current

          const styles = isValid
            ? DEFAULT_HIGHLIGHT_STYLES.valid
            : DEFAULT_HIGHLIGHT_STYLES.invalid

          // Create new highlight data
          const newHighlight = { selector, message, element, isValid, styles }

          // If the selector already exists, replace it
          const existingIndex = current.findIndex(
            (h) => h.selector === selector
          )
          if (existingIndex !== -1) {
            const newHighlights = [...current]
            newHighlights[existingIndex] = newHighlight
            return newHighlights
          }

          // Otherwise add new highlight
          return [...current, newHighlight]
        })
      } else if (event.type === "TOOL_STATE_CHANGE") {
        const { tool, enabled } = event.data
        if (!enabled) {
          // Only clear highlights for the specific tool being disabled
          if (tool === "headings") {
            setHighlights((current) =>
              current.filter((h) => !h.message.startsWith("Heading Structure"))
            )
          } else if (tool === "links") {
            setHighlights((current) =>
              current.filter((h) => !h.message.startsWith("Link Accessibility"))
            )
          }
        }
      }
    })

    return unsubscribe
  }, [])

  // Clean up stale highlights periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      setHighlights((current) =>
        current.filter((h) => {
          const element = validateHighlight(h.selector)
          return element !== null
        })
      )
    }, 1000)

    return () => clearInterval(cleanupInterval)
  }, [])

  const highlightElements = useMemo(() => {
    return highlights.map(({ element, message, selector, isValid, styles }) => {
      const rect = element.getBoundingClientRect()
      if (!rect || rect.width === 0) return null

      const validityLabel = isValid ? "Valid" : "Invalid"
      const highlightStyles =
        styles ||
        (isValid
          ? DEFAULT_HIGHLIGHT_STYLES.valid
          : DEFAULT_HIGHLIGHT_STYLES.invalid)

      return (
        <div
          key={selector}
          role="group"
          aria-label={`${validityLabel} highlight for ${message}`}>
          {/* Highlight box */}
          <div
            data-highlight-box
            role="presentation"
            style={{
              ...elementStyles.highlightBox,
              transform: "translate3d(var(--x), var(--y), 0)",
              border: `2px solid ${highlightStyles.border}`,
              backgroundColor: highlightStyles.background
            }}
          />
          {/* Message tooltip */}
          <div
            data-highlight-tooltip
            role="tooltip"
            id={`highlight-tooltip-${selector}`}
            style={{
              ...elementStyles.tooltip,
              transform: "translate3d(var(--x), var(--y), 0)",
              background: highlightStyles.messageBackground,
              color: "white"
            }}>
            {message}
          </div>
        </div>
      )
    })
  }, [highlights])

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Element highlights overlay"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9998 }}>
      <style>{`
        [data-highlight-box], [data-highlight-tooltip] {
          --x: 0px;
          --y: 0px;
        }
      `}</style>
      {highlightElements}
    </div>
  )
}

export default PlasmoOverlay
