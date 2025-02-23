import { eventBus } from "@/lib/events/event-bus"
import { ACTTestRunner } from "@/lib/testing/act-test-runner"
import type { TestUpdate } from "@/lib/testing/act-test-runner"
import { linkTests } from "@/lib/testing/link-tests"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

const testRunner = new ACTTestRunner()

const analyzeLinks = async () => {
  // Add suite fresh each time to ensure we're using the latest test definitions
  testRunner.addSuite(linkTests)

  // Run tests and handle results as they come in
  for await (const update of testRunner.runTests("links")) {
    if ("type" in update) {
      switch (update.type) {
        case "progress":
          // Could emit progress events if needed
          break
        case "complete":
          // Final completion event
          eventBus.publish({
            type: "LINK_ANALYSIS_COMPLETE",
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
      // Individual test result
      // No need to do anything here as highlights are handled by the test runner
    }
  }
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
          isValid: true,
          clear: true
        }
      })
    }
  } else if (event.type === "LINK_ANALYSIS_REQUEST") {
    analyzeLinks()
  }
})
