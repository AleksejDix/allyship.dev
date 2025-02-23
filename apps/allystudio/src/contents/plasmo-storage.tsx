import { eventBus } from "@/lib/events/event-bus"
import type { HeadingHighlightRequestEvent } from "@/lib/events/types"
import { useEffect, useMemo, useRef, useState } from "react"

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

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([])
  const highlightRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const tooltipRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const ticking = useRef(false)

  // Handle scroll and resize updates
  useEffect(() => {
    const updatePositions = () => {
      highlights.forEach(({ element, selector }) => {
        const highlightEl = highlightRefs.current.get(selector)
        const tooltipEl = tooltipRefs.current.get(selector)
        if (!highlightEl || !tooltipEl) return

        const rect = element.getBoundingClientRect()
        if (rect.width === 0) return

        const scrollY = window.scrollY

        // Update highlight position
        highlightEl.style.transform = `translate3d(${rect.left}px, ${rect.top + scrollY}px, 0)`
        highlightEl.style.width = `${rect.width}px`
        highlightEl.style.height = `${rect.height}px`

        // Update tooltip position
        tooltipEl.style.transform = `translate3d(${rect.left}px, ${rect.top + scrollY - 24}px, 0)`
      })

      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updatePositions)
        ticking.current = true
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updatePositions)
    })

    resizeObserver.observe(document.body)
    window.addEventListener("scroll", onScroll, { passive: true })

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("scroll", onScroll)
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
            ref={(el) => {
              if (el) highlightRefs.current.set(selector, el)
              else highlightRefs.current.delete(selector)
            }}
            role="presentation"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translate3d(${rect.left}px, ${rect.top + window.scrollY}px, 0)`,
              width: rect.width,
              height: rect.height,
              border: `2px solid ${highlightStyles.border}`,
              backgroundColor: highlightStyles.background,
              pointerEvents: "none",
              willChange: "transform",
              backfaceVisibility: "hidden"
            }}
          />
          {/* Message tooltip */}
          <div
            ref={(el) => {
              if (el) tooltipRefs.current.set(selector, el)
              else tooltipRefs.current.delete(selector)
            }}
            role="tooltip"
            id={`highlight-tooltip-${selector}`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              transform: `translate3d(${rect.left}px, ${rect.top + window.scrollY - 24}px, 0)`,
              background: highlightStyles.messageBackground,
              color: "white",
              padding: "4px 8px",
              fontSize: "12px",
              lineHeight: "1.4",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              willChange: "transform",
              backfaceVisibility: "hidden"
            }}>
            {message}
          </div>
        </div>
      )
    })
  }, [highlights])

  return (
    <div
      role="region"
      aria-label="Element highlights overlay"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}>
      {highlightElements}
    </div>
  )
}

export default PlasmoOverlay
