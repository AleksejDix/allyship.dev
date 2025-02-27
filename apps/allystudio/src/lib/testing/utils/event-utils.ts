import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisRequestEvent } from "@/lib/events/types"

import type { TestType } from "../test-config"

/**
 * Helper to publish both old and new style events for test completion
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
