import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import type { HighlightData } from "@/lib/highlight-types"
import { DEFAULT_HIGHLIGHT_STYLES } from "@/lib/highlight-types"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"

import { elementStyles } from "./constants"

interface HighlightBoxProps {
  highlight: HighlightData
  layer: string
}

export function HighlightBox({ highlight, layer }: HighlightBoxProps) {
  const { element, message, selector, isValid, styles } = highlight
  const [isPulsing, setIsPulsing] = useState(layer === "focus")

  // When highlight changes, reset pulsing state for focus layer
  useEffect(() => {
    if (layer === "focus") {
      setIsPulsing(true)

      // Turn off pulsing after 2 seconds
      const timer = setTimeout(() => {
        setIsPulsing(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [highlight, layer])

  if (!element) return null

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
      key={`${layer}-${selector}`}
      role="group"
      aria-label={`${validityLabel} highlight for ${message}`}>
      <div
        data-highlight-box
        data-selector={selector}
        role="presentation"
        className={cn(layer === "focus" && isPulsing && "animate-focus-pulse")}
        style={{
          ...elementStyles.highlightBox,
          transform: "translate3d(var(--x), var(--y), 0)",
          border: `2px solid ${highlightStyles.border}`,
          backgroundColor: highlightStyles.background
        }}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div style={elementStyles.tooltipTrigger} />
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className={cn(
                "z-[9999]",
                layer === "focus" && isPulsing && "animate-focus-pulse-opacity"
              )}
              style={{
                backgroundColor: highlightStyles.messageBackground,
                color: "white",
                maxWidth: "300px",
                whiteSpace: "pre-wrap"
              }}>
              {message}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}
