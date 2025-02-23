import { eventBus } from "@/lib/events/event-bus"
import type {
  AltAnalysisCompleteEvent,
  HeadingAnalysisCompleteEvent,
  InteractiveAnalysisCompleteEvent,
  LinkAnalysisCompleteEvent
} from "@/lib/events/types"

import { ACTTestRunner } from "./act-test-runner"
import type { TestType } from "./test-config"
import { TestLogger } from "./test-logger"

type AnalysisCompleteEvent =
  | HeadingAnalysisCompleteEvent
  | LinkAnalysisCompleteEvent
  | AltAnalysisCompleteEvent
  | InteractiveAnalysisCompleteEvent

// Map test types to their event creators
const createCompleteEvent = (
  type: TestType,
  results: any[],
  stats: { total: number; failed: number }
): AnalysisCompleteEvent => {
  const baseEvent = {
    timestamp: Date.now(),
    data: {
      issues: results,
      stats: {
        total: stats.total,
        invalid: stats.failed
      }
    }
  }

  switch (type) {
    case "headings":
      return { ...baseEvent, type: "HEADING_ANALYSIS_COMPLETE" }
    case "links":
      return { ...baseEvent, type: "LINK_ANALYSIS_COMPLETE" }
    case "alt":
      return { ...baseEvent, type: "ALT_ANALYSIS_COMPLETE" }
    case "interactive":
      return { ...baseEvent, type: "INTERACTIVE_ANALYSIS_COMPLETE" }
  }
}

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
      // Run tests and handle results as they come in
      for await (const update of testRunner.runTests(type)) {
        if ("type" in update) {
          switch (update.type) {
            case "complete":
              // Final completion event
              const completeEvent = createCompleteEvent(
                type,
                update.results,
                update.stats
              )
              eventBus.publish(completeEvent)
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
