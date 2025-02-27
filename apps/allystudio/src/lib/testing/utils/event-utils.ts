import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisRequestEvent } from "@/lib/events/types"

import { TEST_CONFIGS, type TestType } from "../test-config"

/**
 * Helper to publish both old and new style events for test completion
 *
 * MIGRATION NOTE: This currently publishes only the generic event.
 * The old specific events are now generated in create-test-runner.ts.
 * Once all components are migrated to use generic events,
 * we can remove the old event types completely.
 */
export function publishTestComplete(
  type: TestType,
  results: any[],
  stats: { total: number; failed: number }
) {
  // Publish the new generic event
  eventBus.publish({
    type: "TEST_ANALYSIS_COMPLETE",
    timestamp: Date.now(),
    data: {
      testId: type,
      issues: results,
      stats: {
        total: stats.total,
        invalid: stats.failed
      }
    }
  })

  // We're not replacing the old events yet, just adding the new ones alongside
}

/**
 * Helper to request a test analysis using the generic event type
 */
export async function requestTestAnalysis(testId: string) {
  // Get current tab
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      console.error("No active tab found for test analysis request")
      return
    }

    // Publish the new generic event
    const event: TestAnalysisRequestEvent = {
      type: "TEST_ANALYSIS_REQUEST",
      timestamp: Date.now(),
      data: { testId },
      tabId: tab.id
    }

    console.log("Publishing test analysis request:", event)
    eventBus.publish(event)
  } catch (error) {
    console.error("Error requesting test analysis:", error)
  }
}

/**
 * Helper to run a test and ensure the corresponding layer is visible
 *
 * MIGRATION: This function abstracts away the differences between old and new
 * event systems. Currently it uses the generic event system, but it could
 * be changed to use either approach for backward compatibility.
 *
 * @param testId The test ID/type to run
 * @returns A promise that resolves when the test is started
 */
export async function runTest(testId: TestType) {
  console.log(`[event-utils] Running test: ${testId}`)

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      console.error("No active tab found for test")
      return
    }

    // Get layer name from test config
    const testConfig = TEST_CONFIGS[testId]
    const layerName = testConfig.layerName || testId

    // Make layer visible
    eventBus.publish({
      type: "LAYER_TOGGLE_REQUEST",
      timestamp: Date.now(),
      data: {
        layer: layerName,
        visible: true
      },
      tabId: tab.id
    })

    // Check if the tab is ready to receive messages
    let tabReady = false
    try {
      const currentTab = await chrome.tabs.get(tab.id)
      tabReady = currentTab && currentTab.status === "complete"
    } catch (error) {
      console.error(`[event-utils] Error checking tab status:`, error)
    }

    if (!tabReady) {
      console.warn(
        `[event-utils] Tab ${tab.id} may not be ready to receive messages`
      )

      // Publish a fallback completion event after a delay
      setTimeout(() => {
        console.log(
          `[event-utils] Publishing fallback completion event for ${testId}`
        )
        publishTestComplete(testId, [], { total: 0, failed: 0 })
      }, 500)

      return
    }

    // Use the generic approach for running tests
    await requestTestAnalysis(testId)

    // Set a timeout to ensure that a completion event is published
    // This prevents the UI from getting stuck if the content script fails
    setTimeout(() => {
      // Check if we need to send a fallback event
      console.log(
        `[event-utils] Checking if test ${testId} needs a fallback completion event`
      )

      // Publish a fallback completion event just in case
      // The event bus will deduplicate if the real event was already handled
      publishTestComplete(testId, [], { total: 0, failed: 0 })
    }, 3000) // 3 second fallback timeout

    console.log(`[event-utils] Test started: ${testId}`)
  } catch (error) {
    console.error(`[event-utils] Error running test ${testId}:`, error)

    // Ensure we always publish a completion event, even on error
    publishTestComplete(testId, [], { total: 0, failed: 0 })
  }
}
