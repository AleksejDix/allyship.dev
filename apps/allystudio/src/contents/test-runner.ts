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
  // Handle the generic event type
  if (event.type === "TEST_ANALYSIS_REQUEST") {
    const testId = event.data?.testId
    if (testId && Object.keys(TEST_CONFIGS).includes(testId)) {
      console.log("Running test:", testId)
      testRunner.runTest(testId as TestType).catch((error) => {
        console.error("Error running test:", error)
      })
    }
  }
})
