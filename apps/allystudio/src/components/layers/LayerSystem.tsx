import type { HighlightData } from "@/lib/highlight-types"
import { useEffect, useRef } from "react"

import { Layer } from "./Layer"

interface LayerSystemProps {
  highlights: Map<string, Map<string, HighlightData>>
  hiddenLayers?: Set<string>
}

export function LayerSystem({
  highlights,
  hiddenLayers = new Set()
}: LayerSystemProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const ticking = useRef(false)

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
      {Array.from(highlights.entries()).map(([layerId, layerHighlights]) => (
        <Layer
          key={layerId}
          layerId={layerId}
          highlights={layerHighlights}
          isVisible={!hiddenLayers.has(layerId)}
        />
      ))}
    </div>
  )
}
