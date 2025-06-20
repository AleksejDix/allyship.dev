import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisRequestEvent } from "@/lib/events/types"

import { TEST_CONFIGS, type TestType } from "../test-config"

/**
 * Helper to publish test completion events
 *
 * Publishes a TEST_ANALYSIS_COMPLETE event with the test results
 */
export function publishTestComplete(
  type: TestType,
  results: any[],
  stats: { total: number; failed: number }
) {
  // Add unique IDs to results if they don't have them
  const resultsWithIds = results.map((result, index) => {
    if (!result.id) {
      return {
        ...result,
        id: `${type}-result-${index}-${Date.now()}`
      }
    }
    return result
  })

  // Publish the generic event
  eventBus.publish({
    type: "TEST_ANALYSIS_COMPLETE",
    timestamp: Date.now(),
    data: {
      testId: type,
      testType: type, // Add testType for consistency with ACT format
      issues: resultsWithIds,
      stats: {
        total: stats.total,
        invalid: stats.failed
      },
      // Add results field in ACT format for compatibility
      results: {
        summary: {
          rules: {
            total: 1, // One legacy rule
            passed: results.length === 0 ? 1 : 0,
            failed: results.length > 0 ? 1 : 0,
            inapplicable: 0,
            cantTell: 0
          },
          elements: {
            total: stats.total,
            passed: stats.total - stats.failed,
            failed: stats.failed
          },
          wcagCompliance: {
            A: results.length === 0,
            AA: results.length === 0,
            AAA: results.length === 0
          }
        },
        details: resultsWithIds.map((issue) => ({
          ...issue,
          // Ensure each issue has these fields for compatibility
          outcome: "failed",
          severity: issue.severity || "serious",
          impact: issue.impact || "serious"
        }))
      }
    }
  })
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
 * @param testId The test ID/type to run
 * @returns A promise that resolves when the test is started
 */
export async function runTest(testId: TestType) {
  console.log(`[event-utils] Running test: ${testId}`)

  // Flag to track if a real event has been published
  let eventPublished = false

  // Set up a listener to detect if a real event is published
  const unsubscribe = eventBus.subscribe((event) => {
    if (
      event.type === "TEST_ANALYSIS_COMPLETE" &&
      (event.data?.testId === testId || event.data?.testType === testId)
    ) {
      console.log(`[event-utils] Real event detected for ${testId}`)
      eventPublished = true
    }
  })

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      console.error("No active tab found for test")
      return
    }

    console.log(`[event-utils] Found active tab: ${tab.id}`)

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

    console.log(`[event-utils] Published LAYER_TOGGLE_REQUEST for ${layerName}`)

    // Check if the tab is ready to receive messages
    let tabReady = false
    try {
      const currentTab = await chrome.tabs.get(tab.id)
      tabReady = currentTab && currentTab.status === "complete"
      console.log(`[event-utils] Tab ready status: ${tabReady}`)
    } catch (error) {
      console.error(`[event-utils] Error checking tab status:`, error)
    }

    if (!tabReady) {
      console.warn(
        `[event-utils] Tab ${tab.id} may not be ready to receive messages`
      )
      return
    }

    // Use the generic approach for running tests
    console.log(`[event-utils] About to request test analysis for ${testId}`)
    await requestTestAnalysis(testId)

    // Set a timeout to ensure that a completion event is published
    // This prevents the UI from getting stuck if the content script fails
    setTimeout(() => {
      // Check if we need to send a fallback event
      if (!eventPublished) {
        console.log(
          `[event-utils] Publishing fallback completion event for ${testId} (no real event received)`
        )
        // Publish a fallback completion event just in case
        // Add a special flag to indicate this is a fallback event
        eventBus.publish({
          type: "TEST_ANALYSIS_COMPLETE",
          timestamp: Date.now(),
          data: {
            testId: testId,
            testType: testId,
            isFallbackEvent: true, // Add this flag to identify fallback events
            issues: [],
            stats: {
              total: 0,
              invalid: 0
            },
            results: {
              summary: {
                rules: {
                  total: 0,
                  passed: 0,
                  failed: 0,
                  inapplicable: 0,
                  cantTell: 0
                },
                elements: {
                  total: 0,
                  passed: 0,
                  failed: 0
                },
                wcagCompliance: {
                  A: true,
                  AA: true,
                  AAA: true
                }
              },
              details: []
            }
          }
        })
      } else {
        console.log(
          `[event-utils] Real event already published for ${testId}, skipping fallback`
        )
      }
    }, 2000) // Reduced timeout to 2 seconds for faster debugging

    console.log(`[event-utils] Test started: ${testId}`)
  } catch (error) {
    console.error(`[event-utils] Error running test ${testId}:`, error)

    // Ensure we always publish a completion event, even on error
    if (!eventPublished) {
      publishTestComplete(testId, [], { total: 0, failed: 0 })
    }
  } finally {
    // Clean up the event listener
    unsubscribe()
  }
}
