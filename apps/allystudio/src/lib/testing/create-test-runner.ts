import { eventBus } from "@/lib/events/event-bus"

import { ACTTestRunner } from "./act-test-runner"
import type { TestType } from "./test-config"
import { TestLogger } from "./test-logger"
import { publishTestComplete } from "./utils/event-utils"

export function createTestRunner() {
  const testRunner = new ACTTestRunner()
  const logger = new TestLogger()

  // Event listeners
  eventBus.subscribe((event) => {
    if (event.type === "TOOL_STATE_CHANGE") {
      if (!event.data.enabled) {
        testRunner.stopTests()
        // Clear highlights
        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: Date.now(),
          data: {
            selector: "*",
            message: "",
            isValid: true,
            clear: true
          }
        })
      }
    }
  })

  return {
    runTest: async (type: TestType) => {
      console.log(`[create-test-runner] Running test: ${type}`)

      // Run tests and handle results as they come in
      for await (const update of testRunner.runTests(type)) {
        if ("type" in update) {
          switch (update.type) {
            case "complete":
              console.log(`[create-test-runner] Test complete: ${type}`, {
                results: update.results.length,
                stats: update.stats
              })

              // Publish the generic event
              publishTestComplete(type, update.results, update.stats)
              console.log(
                `[create-test-runner] Published TEST_ANALYSIS_COMPLETE event for ${type}`
              )
              break
          }
        } else {
          // Log individual test result
          logger.logTestResult(update)
        }
      }
    },
    stop: () => testRunner.stopTests()
  }
}
