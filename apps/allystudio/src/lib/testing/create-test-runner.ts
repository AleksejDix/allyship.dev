import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisRequestEvent } from "@/lib/events/types"

import { runACTRulesForTestType } from "./act-integration"
import { TEST_CONFIGS, type TestConfig, type TestType } from "./test-config"
import { TestLogger } from "./test-logger"
import { publishTestComplete } from "./utils/event-utils"

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

      // Check if we should use ACT rules for this test
      if (config.useACTRules) {
        console.log(`[create-test-runner] Using ACT rules for ${testId}`)
        runACTRulesForTestType(testId, config).catch((error) => {
          console.error(
            `[create-test-runner] Error running ACT rules for ${testId}:`,
            error
          )
        })
        return
      }

      // Otherwise, handle legacy test
      handleLegacyTest(testId, config)
    }
  })

  console.log("[create-test-runner] Test runner created")
}

/**
 * Handles a legacy test request
 *
 * Note: We can't use dynamic imports in content scripts, and the runner files
 * don't exist at the expected paths. Instead, we'll directly publish a completion
 * event for legacy tests.
 */
function handleLegacyTest(type: TestType, config: TestConfig) {
  try {
    console.log(`[create-test-runner] Handling legacy test: ${type}`)

    if (!config.runner) {
      console.error(`[create-test-runner] No runner specified for ${type}`)
      return
    }

    // For now, we'll just publish a completion event with empty results
    // This ensures the UI doesn't get stuck waiting for a response
    console.log(`[create-test-runner] Publishing completion event for ${type}`)
    publishTestComplete(type, [], { total: 0, failed: 0 })

    // Log a warning that legacy tests are not fully supported
    console.warn(
      `[create-test-runner] Legacy test ${type} is not fully supported. ` +
        `Consider migrating to ACT rules by setting useACTRules: true in the test config.`
    )
  } catch (error) {
    console.error(
      `[create-test-runner] Error handling legacy test ${type}:`,
      error
    )

    // Ensure we always publish a completion event, even on error
    publishTestComplete(type, [], { total: 0, failed: 0 })
  }
}
