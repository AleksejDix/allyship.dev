import { eventBus } from "@/lib/events/event-bus"

import { ACTTestRunner } from "./act-test-runner"
import type { ACTSuite } from "./act-test-suite"
import { TestLogger } from "./test-logger"

type TestType = "headings" | "links" | "alt" | "interactive"

interface TestConfig {
  type: TestType
  suite: ACTSuite
  events: {
    complete:
      | "HEADING_ANALYSIS_COMPLETE"
      | "LINK_ANALYSIS_COMPLETE"
      | "ALT_ANALYSIS_COMPLETE"
      | "INTERACTIVE_ANALYSIS_COMPLETE"
    request:
      | "HEADING_ANALYSIS_REQUEST"
      | "LINK_ANALYSIS_REQUEST"
      | "ALT_ANALYSIS_REQUEST"
      | "INTERACTIVE_ANALYSIS_REQUEST"
  }
  displayName: string
}

export function createTestRunner(config: TestConfig) {
  const testRunner = new ACTTestRunner()
  const logger = new TestLogger()

  const analyze = async () => {
    // Add suite fresh each time to ensure we're using the latest test definitions
    testRunner.addSuite(config.suite)

    // Run tests and handle results as they come in
    for await (const update of testRunner.runTests(config.type)) {
      if ("type" in update) {
        switch (update.type) {
          case "progress":
            // Could emit progress events if needed
            break
          case "complete":
            // Final completion event
            eventBus.publish({
              type: config.events.complete,
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
    if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === config.type) {
      if (event.data.enabled) {
        analyze()
      } else {
        // Clear highlights by sending empty analysis
        eventBus.publish({
          type: config.events.complete,
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
    } else if (event.type === config.events.request) {
      analyze()
    }
  })

  return {
    analyze,
    stop: () => testRunner.stopTests()
  }
}
