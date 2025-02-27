import { eventBus } from "@/lib/events/event-bus"

import { ACTTestRunner } from "./act-test-runner"
import type { TestType } from "./test-config"
import { TestLogger } from "./test-logger"
import { testRegistry } from "./test-registry"

/**
 * Run a test from the registry using the generic event system
 * This is a simplified version of the test runner that uses the registry
 */
export function runRegistryTest(testId: string): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // Get the test from the registry
      const test = testRegistry.getTest(testId)
      if (!test) {
        console.error(`Test with ID "${testId}" not found in registry`)
        return reject(new Error(`Test not found: ${testId}`))
      }

      // Create a test runner and logger
      const testRunner = new ACTTestRunner()
      const logger = new TestLogger()

      // Clear and add the test suite
      testRunner.clearSuites()
      testRunner.addSuite(test.suite)

      // Run the tests
      for await (const update of testRunner.runTests(testId as TestType)) {
        if ("type" in update && update.type === "complete") {
          // Publish the result as a generic event
          eventBus.publish({
            type: "TEST_ANALYSIS_COMPLETE",
            timestamp: Date.now(),
            data: {
              testId,
              issues: update.results,
              stats: {
                total: update.stats.total,
                invalid: update.stats.failed
              }
            }
          })

          resolve()
        } else if (!("type" in update)) {
          // Log individual test result
          logger.logTestResult(update)
        }
      }
    } catch (error) {
      console.error("Error running registry test:", error)
      reject(error)
    }
  })
}
