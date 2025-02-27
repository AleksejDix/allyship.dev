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
import { publishTestComplete } from "./utils/event-utils"

type AnalysisCompleteEvent =
  | HeadingAnalysisCompleteEvent
  | LinkAnalysisCompleteEvent
  | AltAnalysisCompleteEvent
  | InteractiveAnalysisCompleteEvent

// Map test types to their event creators
// MIGRATION: This will be removed once we fully migrate to generic events
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

              // MIGRATION: In the future, we'll only use the generic events
              // Currently maintaining both for backward compatibility

              // 1. Legacy specific event (will be removed in future)
              const completeEvent = createCompleteEvent(
                type,
                update.results,
                update.stats
              )
              eventBus.publish(completeEvent)
              console.log(
                `[create-test-runner] Published legacy event: ${completeEvent.type}`
              )

              // 2. Generic event (will be the only one in future)
              publishTestComplete(type, update.results, update.stats)
              console.log(
                `[create-test-runner] Published generic TEST_ANALYSIS_COMPLETE event`
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
