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

  // Use refs to track debounce timeouts and auto-rerun status
  const debounceTimeoutRef = useRef<number | null>(null)
  const recentChangeTimeoutRef = useRef<number | null>(null)
  const currentAutoRerunTestRef = useRef<TestType | null>(null)

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

        // Check if this is an auto-rerun completion
        const isAutoRerun = currentAutoRerunTestRef.current === testId

        // Reset the auto-rerun ref after we've used it
        if (isAutoRerun) {
          currentAutoRerunTestRef.current = null
        }

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
              `[werkzeug] Adding ACT test results${isAutoRerun ? " (auto-rerun)" : ""}:`,
              event.data.results.details
            )

            // Add new results only if they don't already exist
            setTestResults((prevResults) => {
              // Create a map of existing results by content hash to avoid duplicates
              const existingMap = new Map()

              // First add all existing results to our map
              prevResults.forEach((result) => {
                // Create a deterministic hash/key for each result based on its content
                // This helps identify genuinely unique issues
                const contentHash = createContentHash(result)
                existingMap.set(contentHash, result)
              })

              // Then add new results that don't already exist
              event.data.results.details.forEach((detail: any) => {
                // Add testType to help with identification
                const enrichedDetail = {
                  ...detail,
                  testType: testId,
                  discoveredAt: new Date().toISOString(),
                  autoRerun: isAutoRerun
                }

                const contentHash = createContentHash(enrichedDetail)

                // Only add if this exact issue doesn't already exist
                if (!existingMap.has(contentHash)) {
                  existingMap.set(contentHash, enrichedDetail)
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
                testType: testId,
                message: `No issues found in ${testId} test`,
                severity: "Low",
                outcome: "passed",
                discoveredAt: new Date().toISOString()
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

          // Mark this as an auto-rerun for results handling
          runTestWithFlag(lastActiveTest, true)

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

  // Test running functionality with optional isAutoRerun flag
  const runTestWithFlag = useCallback(
    async (type: TestType, isAutoRerun = false) => {
      console.log(
        `[werkzeug] Running test: ${type}${isAutoRerun ? " (auto-rerun)" : ""}`
      )
      setActiveTest(type)

      // Set the auto-rerun ref if this is an auto-rerun
      if (isAutoRerun) {
        currentAutoRerunTestRef.current = type
      }

      try {
        // Use our helper function - only pass the test type
        await runTestHelper(type)
      } catch (error) {
        console.error(`[werkzeug] Error running test:`, error)
        setActiveTest(null)
        // Clear the auto-rerun ref if there was an error
        if (isAutoRerun) {
          currentAutoRerunTestRef.current = null
        }
      }
    },
    []
  )

  // Maintain the original runTest function for compatibility
  const runTest = useCallback(
    (type: TestType) => runTestWithFlag(type, false),
    [runTestWithFlag]
  )

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

  // Helper to create a content hash for deduplication
  const createContentHash = (result: any) => {
    // Extract the properties that define uniqueness
    // Adjust these based on what makes an issue truly unique in your system
    const uniqueData = {
      selector: result.selector || "",
      html: result.html || "",
      message: result.message || "",
      impact: result.impact || "",
      severity: result.severity || "",
      // For element-based tests, include the element details
      target: result.target || result.targetElement || "",
      // DOM position might be important for uniqueness
      xpath: result.xpath || ""
    }

    // Create a deterministic string representation
    return JSON.stringify(uniqueData)
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
