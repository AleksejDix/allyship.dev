import { eventBus } from "@/lib/events/event-bus"
import { ACTTestRunner } from "@/lib/testing/act-test-runner"
import { linkTests } from "@/lib/testing/link-tests"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const testRunner = new ACTTestRunner()

const analyzeLinks = () => {
  // Add suite fresh each time to ensure we're using the latest test definitions
  testRunner.addSuite(linkTests)
  testRunner.runTests("links")
}

// Event listeners
eventBus.subscribe((event) => {
  if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === "links") {
    if (event.data.enabled) {
      analyzeLinks()
    } else {
      // Clear analysis and remove all highlights
      eventBus.publish({
        type: "LINK_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          issues: [],
          stats: { total: 0, invalid: 0 }
        }
      })
      // Clear all highlights
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: Date.now(),
        data: {
          selector: "",
          message: "",
          isValid: true
        }
      })
    }
  } else if (event.type === "LINK_ANALYSIS_REQUEST") {
    analyzeLinks()
  }
})
