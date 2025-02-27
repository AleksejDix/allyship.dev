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
  // Handle the old event types (specific test request events)
  // Find test type by matching the request event type
  const testConfig = Object.entries(TEST_CONFIGS).find(
    ([, config]) => config.events.request === event.type
  )

  if (testConfig) {
    const [type] = testConfig
    console.log("Running test (old style):", type) // Debug log
    testRunner.runTest(type as TestType).catch((error) => {
      console.error("Error running test:", error)
    })
  }

  // Handle the new generic event type
  if (event.type === "TEST_ANALYSIS_REQUEST") {
    const testId = event.data?.testId
    if (testId && Object.keys(TEST_CONFIGS).includes(testId)) {
      console.log("Running test (generic):", testId) // Debug log
      testRunner.runTest(testId as TestType).catch((error) => {
        console.error("Error running generic test:", error)
      })
    }
  }
})
