import { eventBus } from "@/lib/events/event-bus"
import { createTestRunner } from "@/lib/testing/create-test-runner"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

console.log("[test-runner] Content script starting to load...")

// Test if event bus is working
eventBus.subscribe((event) => {
  console.log("[test-runner] Received event in content script:", event.type)
})

// Create a test runner instance
// This sets up event listeners for TEST_ANALYSIS_REQUEST events
console.log("[test-runner] Creating test runner...")
createTestRunner()

console.log(
  "[test-runner] Test runner initialized on URL:",
  window.location.href
)

// Expose a test function to verify content script is loaded
if (typeof window !== "undefined") {
  ;(window as any).testContentScript = () => {
    console.log("[test-runner] Content script is loaded and working!")
    return "Content script is working"
  }
}
