import { initialize } from "@/lib/vision/visual-acuity-simulator"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Initialize the visual acuity simulator
initialize()
