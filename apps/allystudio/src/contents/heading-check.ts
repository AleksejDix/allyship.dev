import { eventBus } from "@/lib/events/event-bus"
import { ACTTestRunner } from "@/lib/testing/act-test-runner"
import { headingTests } from "@/lib/testing/heading-tests"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const testRunner = new ACTTestRunner()

const analyzeHeadings = () => {
  // Add suite fresh each time to ensure we're using the latest test definitions
  testRunner.addSuite(headingTests)
  testRunner.runTests("headings")
}

// Event listeners
eventBus.subscribe((event) => {
  if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === "headings") {
    if (event.data.enabled) {
      analyzeHeadings()
    } else {
      // Clear highlights by sending empty analysis
      eventBus.publish({
        type: "HEADING_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          issues: [],
          stats: { total: 0, invalid: 0 }
        }
      })
    }
  } else if (event.type === "HEADING_ANALYSIS_REQUEST") {
    analyzeHeadings()
  }
})
