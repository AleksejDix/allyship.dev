import { initialize } from "@/lib/inspector/element-inspector"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Initialize the element inspector
initialize()
