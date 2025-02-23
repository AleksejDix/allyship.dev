import { eventBus } from "@/lib/events/event-bus"
import { ACTTestRunner } from "@/lib/testing/act-test-runner"
import type { TestUpdate } from "@/lib/testing/act-test-runner"
import { altTests } from "@/lib/testing/alt-tests"
import { TestLogger } from "@/lib/testing/test-logger"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const testRunner = new ACTTestRunner()
const logger = new TestLogger()

const analyzeAltText = async () => {
  // Add suite fresh each time to ensure we're using the latest test definitions
  testRunner.addSuite(altTests)

  // Run tests and handle results as they come in
  for await (const update of testRunner.runTests("alt")) {
    if ("type" in update) {
      switch (update.type) {
        case "progress":
          // Could emit progress events if needed
          break
        case "complete":
          // Final completion event
          eventBus.publish({
            type: "ALT_ANALYSIS_COMPLETE",
            timestamp: Date.now(),
            data: {
              issues: update.results,
              stats: {
                total: update.stats.total,
                invalid: update.stats.failed
              }
            }
          })
          break
      }
    } else {
      // Log individual test result
      logger.logTestResult(update)
    }
  }
}

// Event listeners
eventBus.subscribe((event) => {
  if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === "alt") {
    if (event.data.enabled) {
      analyzeAltText()
    } else {
      // Clear highlights by sending empty analysis
      eventBus.publish({
        type: "ALT_ANALYSIS_COMPLETE",
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
          isValid: true,
          clear: true
        }
      })
    }
  } else if (event.type === "ALT_ANALYSIS_REQUEST") {
    analyzeAltText()
  }
})
