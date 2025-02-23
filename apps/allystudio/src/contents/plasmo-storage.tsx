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

const DEFAULT_HIGHLIGHT_STYLES = {
  valid: {
    border: "#22c55e",
    background: "rgba(34, 197, 94, 0.1)",
    messageBackground: "#22c55e"
  },
  invalid: {
    border: "#ef4444",
    background: "rgba(239, 68, 68, 0.1)",
    messageBackground: "#ef4444"
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
    borderRadius: "4px",
    whiteSpace: "nowrap",
    willChange: "transform",
    zIndex: 9999
  }
} as const satisfies Record<string, CSSProperties>

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([])
  const ticking = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

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
      if (event.type === "HEADING_HIGHLIGHT_REQUEST") {
        setHighlights((current) => {
          const highlightEvent = event as HeadingHighlightRequestEvent
          const { selector, message, isValid } = highlightEvent.data
          const element = document.querySelector(selector) as HTMLElement
          if (!element) return current

          const styles = isValid
            ? DEFAULT_HIGHLIGHT_STYLES.valid
            : DEFAULT_HIGHLIGHT_STYLES.invalid

          return current.some((h) => h.selector === selector)
            ? current.map((h) =>
                h.selector === selector
                  ? { selector, message, element, isValid, styles }
                  : h
              )
            : [...current, { selector, message, element, isValid, styles }]
        })
      } else if (
        event.type === "TOOL_STATE_CHANGE" &&
        event.data.tool === "headings" &&
        !event.data.enabled
      ) {
        setHighlights([])
      }
    })

    return unsubscribe
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
