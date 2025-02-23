import { eventBus } from "@/lib/events/event-bus"
import type { HeadingHighlightRequestEvent } from "@/lib/events/types"
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  useFloating
} from "@floating-ui/react-dom"
import { useEffect, useRef, useState } from "react"

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

function useHighlightPosition(element: HTMLElement | null) {
  const arrowRef = useRef<HTMLDivElement>(null)

  // Create a virtual element from the target element's rect
  const getVirtualElement = () => {
    if (!element) return null
    const rect = element.getBoundingClientRect()
    return {
      getBoundingClientRect() {
        return {
          x: rect.x,
          y: rect.y,
          top: rect.top,
          left: rect.left,
          bottom: rect.bottom,
          right: rect.right,
          width: rect.width,
          height: rect.height
        }
      }
    }
  }

  const {
    x,
    y,
    strategy,
    refs,
    middlewareData: { arrow: { x: arrowX, y: arrowY } = {} }
  } = useFloating({
    placement: "top",
    middleware: [
      offset(8),
      flip({
        fallbackAxisSideDirection: "start",
        padding: 8
      }),
      shift({
        padding: 8,
        mainAxis: true,
        crossAxis: true
      }),
      arrow({
        element: arrowRef,
        padding: 8
      })
    ],
    whileElementsMounted: (reference, floating, update) => {
      // Handle both resize and scroll
      const cleanup = autoUpdate(reference, floating, update, {
        animationFrame: true, // Use RAF for smoother updates
        elementResize: true, // Watch for element size changes
        ancestorResize: true, // Watch for ancestor size changes
        layoutShift: true // Handle layout shifts
      })

      return cleanup
    },
    elements: {
      reference: getVirtualElement() ?? undefined
    }
  })

  return {
    x,
    y,
    strategy,
    refs,
    arrowRef,
    arrowX,
    arrowY
  }
}

const PlasmoOverlay = () => {
  const [highlights, setHighlights] = useState<HighlightData[]>([])
  const [forceUpdate, setForceUpdate] = useState(0)

  // Add resize observer to update positions
  useEffect(() => {
    const handleResize = () => {
      // Force a re-render to update positions
      setForceUpdate((prev) => prev + 1)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    // Observe document body for any layout changes
    resizeObserver.observe(document.body)
    // Also listen for window resize events
    window.addEventListener("resize", handleResize)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_HIGHLIGHT_REQUEST") {
        const highlightEvent = event as HeadingHighlightRequestEvent
        const { selector, message, isValid } = highlightEvent.data

        // Find element and create highlight
        const element = document.querySelector(selector) as HTMLElement
        if (element) {
          const styles = isValid
            ? DEFAULT_HIGHLIGHT_STYLES.valid
            : DEFAULT_HIGHLIGHT_STYLES.invalid
          setHighlights((current) => [
            ...current.filter((h) => h.selector !== selector),
            { selector, message, element, isValid, styles }
          ])
        }
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

  return (
    <div
      role="region"
      aria-label="Element highlights overlay"
      className="fixed inset-0 pointer-events-none">
      {highlights.map(({ element, message, selector, isValid, styles }) => {
        // Get fresh position on every render and resize
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
            key={`${selector}-${forceUpdate}`}
            role="group"
            aria-label={`${validityLabel} highlight for ${message}`}>
            {/* Highlight box */}
            <div
              role="presentation"
              style={{
                position: "absolute",
                top: rect.top + window.scrollY,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                border: `2px solid ${highlightStyles.border}`,
                backgroundColor: highlightStyles.background,
                pointerEvents: "none",
                transition: "all 150ms ease-in-out"
              }}
            />
            {/* Message tooltip */}
            <div
              role="tooltip"
              id={`highlight-tooltip-${selector}`}
              style={{
                position: "absolute",
                top: rect.top + window.scrollY - 24,
                left: rect.left,
                background: highlightStyles.messageBackground,
                color: "white",
                padding: "4px 8px",
                fontSize: "12px",
                lineHeight: "1.4",
                borderRadius: "4px",
                whiteSpace: "nowrap",
                transition: "all 150ms ease-in-out"
              }}>
              {message}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PlasmoOverlay
