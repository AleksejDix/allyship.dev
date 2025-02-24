import type { CSSProperties } from "react"

export const elementStyles = {
  highlightBox: {
    position: "fixed",
    top: 0,
    left: 0,
    pointerEvents: "none",
    willChange: "transform",
    zIndex: 9999
  },
  tooltipTrigger: {
    position: "absolute",
    top: "-24px",
    left: "0",
    width: "100%",
    height: "24px",
    pointerEvents: "auto",
    cursor: "pointer"
  }
} as const satisfies Record<string, CSSProperties>
