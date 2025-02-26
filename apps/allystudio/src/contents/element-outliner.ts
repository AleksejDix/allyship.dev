import { initialize } from "@/lib/outliner/element-outliner"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Initialize the element outliner
initialize()
