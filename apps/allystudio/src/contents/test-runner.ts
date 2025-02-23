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
  // Find test type by matching the request event type
  const testConfig = Object.entries(TEST_CONFIGS).find(
    ([, config]) => config.events.request === event.type
  )

  if (testConfig) {
    const [type] = testConfig
    console.log("Running test:", type) // Debug log
    testRunner.runTest(type as TestType).catch((error) => {
      console.error("Error running test:", error)
    })
  }
})
