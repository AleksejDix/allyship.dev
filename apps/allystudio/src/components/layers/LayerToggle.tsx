import { Button } from "@/components/ui/button"
import type { HighlightData } from "@/lib/highlight-types"
import { Eye, EyeOff } from "lucide-react"
import { memo } from "react"

import { elementStyles } from "./constants"

interface LayerToggleProps {
  highlights: Map<string, Map<string, HighlightData>>
  hiddenLayers: Set<string>
  onToggleLayer: (layerName: string) => void
}

function LayerToggleComponent({
  highlights,
  hiddenLayers,
  onToggleLayer
}: LayerToggleProps) {
  const activeLayerCount = highlights.size
  const layerNames = Array.from(highlights.keys())

  if (activeLayerCount === 0) return null

  return (
    <div
      style={elementStyles.layerCounter}
      role="status"
      className="animate-in fade-in slide-in-from-bottom-4 duration-300">
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
          <div key={layerName} style={elementStyles.layerItem}>
            <span style={elementStyles.layerName}>{layerName}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleLayer(layerName)}
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
  )
}

// Memoize the component to prevent unnecessary re-renders
export const LayerToggle = memo(LayerToggleComponent)
