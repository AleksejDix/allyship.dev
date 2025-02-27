import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisRequestEvent } from "@/lib/events/types"

import { runACTRulesForTestType } from "./act-integration"
import { TEST_CONFIGS, type TestConfig, type TestType } from "./test-config"
import { TestLogger } from "./test-logger"

/**
 * Creates a test runner that listens for test requests and runs the appropriate test
 */
export function createTestRunner() {
  const logger = new TestLogger()

  // Subscribe to test requests
  eventBus.subscribe((event) => {
    if (event.type === "TEST_ANALYSIS_REQUEST") {
      const testEvent = event as TestAnalysisRequestEvent
      const testId = testEvent.data.testId as TestType

      // Get the test config
      const config = TEST_CONFIGS[testId]

      if (!config) {
        console.error(`[create-test-runner] No test config found for ${testId}`)
        return
      }

      console.log(`[create-test-runner] Running test: ${testId}`)

      // Run the test using ACT rules
      runACTRulesForTestType(testId, config).catch((error) => {
        console.error(
          `[create-test-runner] Error running ACT rules for ${testId}:`,
          error
        )
      })
    }
  })

  console.log("[create-test-runner] Test runner created")
}
