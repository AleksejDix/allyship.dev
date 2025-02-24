import type { HighlightData } from "@/contents/types"
import { memo } from "react"

import { HighlightBox } from "./HighlightBox"

interface LayerProps {
  layerId: string
  highlights: Map<string, HighlightData>
}

function LayerComponent({ layerId, highlights }: LayerProps) {
  return (
    <>
      {Array.from(highlights.values()).map((highlight) => (
        <HighlightBox
          key={`${layerId}-${highlight.selector}`}
          highlight={highlight}
          layer={layerId}
        />
      ))}
    </>
  )
}

// Memoize the Layer component to prevent unnecessary re-renders
export const Layer = memo(LayerComponent)
