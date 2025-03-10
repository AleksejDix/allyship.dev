import { Badge } from "@/components/ui/badge"
import { TooltipProvider } from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { runTest as runTestHelper } from "@/lib/testing/utils/event-utils"
import { Info } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { Storage } from "@plasmohq/storage"

import {
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
  const [lastActiveTest, setLastActiveTest] = useState<TestType | null>(null)
  const [isDOMMonitorEnabled, setIsDOMMonitorEnabled] = useState(false)
  const [recentDOMChange, setRecentDOMChange] = useState(false)
  const [autoRerunCount, setAutoRerunCount] = useState(0)

  // Use refs to track debounce timeouts
  const debounceTimeoutRef = useRef<number | null>(null)
  const recentChangeTimeoutRef = useRef<number | null>(null)

  // Check DOM monitor state on mount
  useEffect(() => {
    const checkDOMMonitorState = async () => {
      try {
        const storage = new Storage()
        const enabled = await storage.get("dom_monitor_enabled")
        setIsDOMMonitorEnabled(!!enabled)

        // Set up a listener for DOM monitor state changes
        storage.watch({
          dom_monitor_enabled: (c) => {
            setIsDOMMonitorEnabled(!!c.newValue)

            // When DOM monitor is disabled, clear any pending auto-reruns
            if (!c.newValue && debounceTimeoutRef.current) {
              window.clearTimeout(debounceTimeoutRef.current)
              debounceTimeoutRef.current = null
            }
          }
        })

        return () => {
          storage.unwatch({
            dom_monitor_enabled: () => {}
          })
        }
      } catch (error) {
        console.error("[werkzeug] Error checking DOM monitor state:", error)
      }
    }

    checkDOMMonitorState()
  }, [])

  // Track the last active test for auto-rerunning
  useEffect(() => {
    if (activeTest) {
      setLastActiveTest(activeTest)
    }
  }, [activeTest])

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

  // Listen for DOM changes and auto-rerun the last active test if DOM monitoring is enabled
  useEffect(() => {
    const handleDOMChange = (event: any) => {
      if (
        event.type === "DOM_CHANGE" &&
        isDOMMonitorEnabled &&
        lastActiveTest &&
        !activeTest
      ) {
        // Set recent DOM change indicator - useful for UI feedback
        setRecentDOMChange(true)

        // Clear any existing recent change timeout
        if (recentChangeTimeoutRef.current) {
          window.clearTimeout(recentChangeTimeoutRef.current)
        }

        // Set a timeout to clear the recent change indicator
        recentChangeTimeoutRef.current = window.setTimeout(() => {
          setRecentDOMChange(false)
          recentChangeTimeoutRef.current = null
        }, 2000)

        // Log the change
        console.log("[werkzeug] Detected DOM change:", {
          type: event.data?.changeType,
          elements: (event.data?.elements || []).length
        })

        // Debounce to avoid running tests too frequently
        if (debounceTimeoutRef.current) {
          window.clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = window.setTimeout(() => {
          console.log(
            "[werkzeug] Rerunning test after DOM change:",
            lastActiveTest
          )
          setAutoRerunCount((prev) => prev + 1)
          runTest(lastActiveTest)
          debounceTimeoutRef.current = null
        }, 500) // Simple 500ms debounce for all changes
      }
    }

    const cleanup = eventBus.subscribe(handleDOMChange)

    return () => {
      cleanup()
      if (debounceTimeoutRef.current) {
        window.clearTimeout(debounceTimeoutRef.current)
      }
      if (recentChangeTimeoutRef.current) {
        window.clearTimeout(recentChangeTimeoutRef.current)
      }
    }
  }, [lastActiveTest, activeTest, isDOMMonitorEnabled])

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
    setLastActiveTest(null)
    setAutoRerunCount(0)

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

  // Simple display for monitor status
  const renderMonitoringStatus = () => {
    if (!isDOMMonitorEnabled || !lastActiveTest) return null

    return (
      <div className="text-xs px-2 py-1 flex items-center gap-2 rounded-md">
        <Info
          className="w-3.5 h-3.5 text-muted-foreground/70"
          aria-hidden="true"
        />
        <span className="flex-1">
          Real-time monitoring for {TEST_CONFIGS[lastActiveTest]?.displayName}
        </span>
        {autoRerunCount > 0 && (
          <Badge variant="outline" className="text-[10px] h-4 px-1 rounded-sm">
            {autoRerunCount} {autoRerunCount === 1 ? "rerun" : "reruns"}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <TestContext.Provider value={contextValue}>
      <TooltipProvider>
        <div className="p-2 space-y-4">
          {/* Test Selector */}
          <TestSelector />

          {/* Monitoring Status */}
          {renderMonitoringStatus()}

          {/* Event Monitor */}
          <TestEventMonitor />

          {/* Results Summary */}
          <TestResults />
        </div>
      </TooltipProvider>
    </TestContext.Provider>
  )
}
