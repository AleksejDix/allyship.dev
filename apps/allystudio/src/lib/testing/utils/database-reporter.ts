import { supabase } from "@/core/supabase"

export interface TestResultData {
  url: string
  test_type: string
  results: {
    rule_id: string
    outcome: "passed" | "failed" | "inapplicable"
    elements?: Array<{
      selector: string
      message: string
    }>
  }[]
  summary: {
    total: number
    passed: number
    failed: number
    inapplicable: number
  }
  timestamp: string
}

/**
 * Reports test results to the database queue for processing
 */
export async function reportTestResults(
  testData: TestResultData
): Promise<void> {
  try {
    console.log("🔥 [DATABASE] Sending test results to database:", {
      url: testData.url,
      test_type: testData.test_type,
      results_count: testData.results.length,
      summary: testData.summary,
      timestamp: testData.timestamp
    })

    // Additional debug logging for link tests specifically
    if (testData.test_type === "links") {
      console.log("🔗 [DATABASE] Link test results details:", {
        results: testData.results,
        first_result: testData.results[0],
        has_elements: testData.results.some(
          (r) => r.elements && r.elements.length > 0
        )
      })
    }

    // Send to PGMQ queue using the queue_test_result function
    const { data, error } = await supabase.rpc("queue_test_result", {
      test_data: testData
    })

    if (error) {
      console.error("❌ [DATABASE] Failed to queue test results:", error)
      throw error
    }

    console.log("✅ [DATABASE] Test results queued successfully!", data)

    // Additional success logging for link tests
    if (testData.test_type === "links") {
      console.log("🔗 [DATABASE] Link test results successfully queued!")
    }
  } catch (error) {
    console.error("❌ [DATABASE] Error reporting test results:", error)
    // Don't throw - we don't want to break the UI if database fails
  }
}

/**
 * Test function to verify database connection and queue functionality
 */
export async function testDatabaseConnection(): Promise<void> {
  console.log("🧪 Testing database connection...")

  const testData: TestResultData = {
    url: window.location.href,
    test_type: "database-test",
    results: [
      {
        rule_id: "test-rule-1",
        outcome: "passed",
        elements: [
          {
            selector: "body",
            message: "Test message"
          }
        ]
      }
    ],
    summary: {
      total: 1,
      passed: 1,
      failed: 0,
      inapplicable: 0
    },
    timestamp: new Date().toISOString()
  }

  await reportTestResults(testData)
  console.log("✅ Database test completed!")
}

// Expose test function globally for debugging
if (typeof window !== "undefined") {
  ;(window as any).testDatabaseConnection = testDatabaseConnection
}
