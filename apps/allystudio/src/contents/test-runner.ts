import { eventBus } from "@/lib/events/event-bus"
import { createTestRunner } from "@/lib/testing/create-test-runner"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Create a single test runner instance
const testRunner = createTestRunner()

// Subscribe to test requests
eventBus.subscribe((event) => {
  // MIGRATION: Eventually, we'll handle only TEST_ANALYSIS_REQUEST events
  // and remove the specific event type handling

  // Handle the new generic event type (preferred method)
  if (event.type === "TEST_ANALYSIS_REQUEST") {
    const testId = event.data?.testId
    if (testId && Object.keys(TEST_CONFIGS).includes(testId)) {
      console.log("Running test (generic):", testId)
      testRunner.runTest(testId as TestType).catch((error) => {
        console.error("Error running generic test:", error)
      })
      return // Return early if we handled the generic event
    }
  }

  // Handle the old event types as fallback (legacy support)
  const testConfig = Object.entries(TEST_CONFIGS).find(
    ([, config]) => config.events.request === event.type
  )

  if (testConfig) {
    const [type] = testConfig
    console.log("Running test (legacy):", type)
    testRunner.runTest(type as TestType).catch((error) => {
      console.error("Error running test:", error)
    })
  }
})
