import { Button } from "@/components/ui/button"
import type { HighlightData } from "@/lib/highlight-types"
import { Eye, EyeOff } from "lucide-react"
import { memo } from "react"

interface LayerToggleProps {
  highlights: Map<string, Map<string, HighlightData>>
  hiddenLayers: Set<string>
  onToggleLayer: (layerName: string) => void
}

const layerCounterStyles = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "rgba(0, 0, 0, 0.8)",
  color: "white",
  padding: "12px",
  borderRadius: "8px",
  fontSize: "14px",
  zIndex: 999999,
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
  minWidth: "240px"
} as const

const layerItemStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  width: "100%"
} as const

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
      style={layerCounterStyles}
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
          <div key={layerName} style={layerItemStyles}>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>
              {layerName}
            </span>
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
