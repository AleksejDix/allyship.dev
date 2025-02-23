import { eventBus } from "@/lib/events/event-bus"
import type { HeadingHighlightRequestEvent } from "@/lib/events/types"
import { useEffect, useState } from "react"

interface HighlightData {
  selector: string
  message: string
  element: HTMLElement
  isValid: boolean
}

export default function PlasmoContent() {
  const [highlights, setHighlights] = useState<HighlightData[]>([])

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_HIGHLIGHT_REQUEST") {
        const highlightEvent = event as HeadingHighlightRequestEvent
        const { selector, message, isValid } = highlightEvent.data

        // Find element and create highlight
        const element = document.querySelector(selector) as HTMLElement
        if (element) {
          setHighlights((current) => [
            ...current.filter((h) => h.selector !== selector), // Remove existing highlight for this selector
            { selector, message, element, isValid }
          ])
        }
      } else if (
        event.type === "TOOL_STATE_CHANGE" &&
        event.data.tool === "headings" &&
        !event.data.enabled
      ) {
        // Clear all highlights when tool is disabled
        setHighlights([])
      }
    })

    return unsubscribe
  }, [])

  return (
    <>
      {highlights.map(({ element, message, selector, isValid }) => {
        const rect = element.getBoundingClientRect()

        return (
          <div
            key={selector}
            style={{
              position: "absolute",
              top: `${rect.top + window.scrollY}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              border: `2px solid ${isValid ? "#22c55e" : "#ef4444"}`,
              backgroundColor: `${
                isValid ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)"
              }`,
              zIndex: 9999,
              pointerEvents: "none"
            }}>
            <span
              style={{
                position: "absolute",
                top: "-20px",
                left: "0",
                background: isValid ? "#22c55e" : "#ef4444",
                color: "white",
                padding: "2px 5px",
                fontSize: "12px",
                borderRadius: "3px"
              }}>
              {message}
            </span>
          </div>
        )
      })}
    </>
  )
}
