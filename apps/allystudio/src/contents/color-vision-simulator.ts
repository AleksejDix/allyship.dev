import { initialize } from "@/lib/vision/color-vision-simulator"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Initialize the color vision simulator
initialize()
