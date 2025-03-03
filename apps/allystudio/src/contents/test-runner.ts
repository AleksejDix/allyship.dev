import { eventBus } from "@/lib/events/event-bus"
import { createTestRunner } from "@/lib/testing/create-test-runner"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Create a test runner instance
// This sets up event listeners for TEST_ANALYSIS_REQUEST events
createTestRunner()

console.log("[test-runner] Test runner initialized")
