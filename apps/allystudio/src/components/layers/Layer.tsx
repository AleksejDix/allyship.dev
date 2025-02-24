import type { HighlightData } from "@/lib/highlight-types"
import { memo } from "react"

import { HighlightBox } from "./HighlightBox"

interface LayerProps {
  layerId: string
  highlights: Map<string, HighlightData>
  isVisible?: boolean
}

function LayerComponent({ layerId, highlights, isVisible = true }: LayerProps) {
  return (
    <div style={{ opacity: isVisible ? 1 : 0, transition: "opacity 0.2s" }}>
      {Array.from(highlights.values()).map((highlight) => (
        <HighlightBox
          key={`${layerId}-${highlight.selector}`}
          highlight={highlight}
          layer={layerId}
        />
      ))}
    </div>
  )
}

// Memoize the Layer component to prevent unnecessary re-renders
export const Layer = memo(LayerComponent)
