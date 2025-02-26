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
  },
  layerCounter: {
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
    flexDirection: "column",
    gap: "8px",
    minWidth: "240px"
  },
  layerItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    width: "100%"
  },
  layerName: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  }
} as const satisfies Record<string, CSSProperties>
