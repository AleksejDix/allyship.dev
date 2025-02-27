import { initialize } from "@/lib/focus-order/focus-order"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Initialize the focus order visualizer
initialize()
