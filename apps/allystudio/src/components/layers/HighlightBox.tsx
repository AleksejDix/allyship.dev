import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"

import type { HighlightData } from "../../contents/types"
import { DEFAULT_HIGHLIGHT_STYLES } from "../../contents/types"
import { elementStyles } from "./constants"

interface HighlightBoxProps {
  highlight: HighlightData
  layer: string
}

export function HighlightBox({ highlight, layer }: HighlightBoxProps) {
  const { element, message, selector, isValid, styles } = highlight
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
              className="z-[9999]"
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
