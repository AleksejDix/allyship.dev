import { TooltipProvider } from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { runTest as runTestHelper } from "@/lib/testing/utils/event-utils"
import { useCallback, useEffect, useMemo, useState } from "react"

import {
  ProgressIndicator,
  TestContext,
  TestEventMonitor,
  TestResults,
  TestSelector
} from "./werkzeug/index"

// Main Werkzeug Component with TestProvider
export function Werkzeug() {
  // Core state management
  const [activeTest, setActiveTest] = useState<TestType | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())

  // Event handling for test completion
  useEffect(() => {
    const handleTestComplete = (event: any) => {
      // Only handle generic test completion events
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        console.log("[werkzeug] Handling test completion:", event)
        const testId = event.data?.testId || event.data?.testType

        // Always reset loading state when we receive a completion event
        if (activeTest) {
          console.log(`[werkzeug] Resetting activeTest from ${activeTest}`)
          setActiveTest(null)
        }

        // Skip fallback events if we already have results
        if (event.data?.isFallbackEvent && testResults.length > 0) {
          console.log(
            "[werkzeug] Ignoring fallback event since we already have results"
          )
          return
        }

        // Use a timeout to prevent UI flashing and ensure state updates properly
        setTimeout(() => {
          // Check for ACT format (results object with details)
          if (
            event.data?.results?.details &&
            event.data.results.details.length > 0
          ) {
            console.log(
              `[werkzeug] Setting ACT test results:`,
              event.data.results.details
            )
            // Append new results instead of replacing
            setTestResults((prevResults) => {
              // Create a map of existing results by ID to avoid duplicates
              const existingMap = new Map(
                prevResults.map((r) => [r.id || JSON.stringify(r), r])
              )

              // Add new results, avoiding duplicates
              event.data.results.details.forEach((detail: any) => {
                const id = detail.id || JSON.stringify(detail)
                if (!existingMap.has(id)) {
                  existingMap.set(id, detail)
                }
              })

              return Array.from(existingMap.values())
            })
          }
          // If no results found and we don't have any existing results, show a message
          else if (testResults.length === 0 && !event.data?.isFallbackEvent) {
            console.log(`[werkzeug] No issues found in test results`)
            // Show empty results with a message
            setTestResults([
              {
                id: "no-issues",
                message: `No issues found in ${testId} test`,
                severity: "Low",
                outcome: "passed"
              }
            ])
          }
        }, 100) // Small delay to ensure state updates properly
      }
    }

    console.log(
      "[werkzeug] Setting up event listener for test completion events"
    )
    const cleanup = eventBus.subscribe(handleTestComplete)
    return () => {
      console.log("[werkzeug] Cleaning up event listener")
      cleanup()
    }
  }, [activeTest, testResults])

  // Layer toggling functionality
  const toggleLayer = useCallback((testType: string) => {
    console.log("[Werkzeug] Toggle requested for layer:", testType)

    // Get the corresponding layer name from the test config if it's a valid test type
    const layerName =
      testType in TEST_CONFIGS
        ? TEST_CONFIGS[testType as TestType].layerName || testType
        : testType

    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      if (newHidden.has(layerName)) {
        newHidden.delete(layerName)
      } else {
        newHidden.add(layerName)
      }

      const isVisible = !newHidden.has(layerName)
      eventBus.publish({
        type: "LAYER_TOGGLE_REQUEST",
        timestamp: Date.now(),
        data: {
          layer: layerName,
          visible: isVisible
        }
      })

      return newHidden
    })
  }, [])

  // Test running functionality
  const runTest = useCallback(async (type: TestType) => {
    console.log(`[werkzeug] Running test: ${type}`)
    setActiveTest(type)

    try {
      // Use our helper function
      await runTestHelper(type)

      // Set a safety timeout to reset the loading state
      // This is a backup in case no completion event is received
      setTimeout(() => {
        setActiveTest((current) => {
          if (current === type) {
            console.log(`[werkzeug] Safety timeout for test: ${type}`)
            return null
          }
          return current
        })
      }, 6000) // 6 seconds - slightly longer than the fallback event timeout
    } catch (error) {
      console.error(`[werkzeug] Error running test ${type}:`, error)
      setActiveTest(null)
    }
  }, [])

  const stopTest = useCallback(() => {
    setActiveTest((current) => {
      if (current) {
        console.log(`[Werkzeug] Stopping test: ${current}`)
        eventBus.publish({
          type: "TOOL_STATE_CHANGE",
          timestamp: Date.now(),
          data: {
            tool: current,
            enabled: false
          }
        })
      }
      return null
    })
  }, [])

  const clearResults = useCallback(() => {
    console.log("[werkzeug] Clearing test results")
    setTestResults([])

    // Hide any visible layers when clearing results
    console.log("[werkzeug] Hiding all layers")

    // Get all test types to find their layer names
    Object.keys(TEST_CONFIGS).forEach((testType) => {
      const layerName = TEST_CONFIGS[testType as TestType].layerName || testType

      // Only send event if layer is not already hidden
      if (!hiddenLayers.has(layerName)) {
        eventBus.publish({
          type: "LAYER_TOGGLE_REQUEST",
          timestamp: Date.now(),
          data: {
            layer: layerName,
            visible: false // explicitly set to not visible
          }
        })
      }
    })

    // Update hidden layers state
    setHiddenLayers(
      new Set(
        Object.keys(TEST_CONFIGS).map(
          (testType) => TEST_CONFIGS[testType as TestType].layerName || testType
        )
      )
    )
  }, [hiddenLayers])

  // Create a memoized context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      activeTest,
      testResults,
      isRunning: !!activeTest,
      runTest,
      stopTest,
      clearResults
    }),
    [activeTest, testResults, runTest, stopTest, clearResults]
  )

  return (
    <TestContext.Provider value={contextValue}>
      <TooltipProvider>
        <div className="p-2 space-y-4">
          {/* Test Selector */}
          <TestSelector />

          {/* Event Monitor */}
          <TestEventMonitor />

          {/* Analysis Progress */}
          <ProgressIndicator />

          {/* Results Summary */}
          <TestResults />
        </div>
      </TooltipProvider>
    </TestContext.Provider>
  )
}
