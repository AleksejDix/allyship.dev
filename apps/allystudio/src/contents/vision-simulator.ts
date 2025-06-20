import { createColorVisionSimulator } from "@allystudio/color-vision-simulator"
import { createDiopterSimulator } from "@allystudio/diopter-simulator"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"],
  all_frames: true
}

// Create simulator instances
const colorSim = createColorVisionSimulator()
const diopterSim = createDiopterSimulator()

// Listen for messages from the extension UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "VISION_SIMULATOR") {
    const { action, data } = message

    try {
      switch (action) {
        case "SET_COLOR_VISION":
          colorSim.setVisionType(data.visionType)
          if (data.visionType !== "normal") {
            colorSim.start()
          } else {
            colorSim.stop()
          }
          break

        case "SET_DIOPTER":
          if (data.diopters !== 0) {
            diopterSim.configure(data.diopters, data.distance)
            diopterSim.start()
          } else {
            diopterSim.stop()
          }
          break

        case "STOP_ALL":
          colorSim.stop()
          diopterSim.stop()
          break

        default:
          console.warn("[vision-simulator] Unknown action:", action)
      }

      sendResponse({ success: true })
    } catch (error) {
      console.error("[vision-simulator] Error:", error)
      const errorMessage = error instanceof Error ? error.message : String(error)
      sendResponse({ success: false, error: errorMessage })
    }
  }

  return true // Keep message channel open for async response
})

// Cleanup on page unload
window.addEventListener("beforeunload", () => {
  colorSim.stop()
  diopterSim.stop()
})

console.log("[vision-simulator] Content script loaded")
