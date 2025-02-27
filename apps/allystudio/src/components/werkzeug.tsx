import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { runTest as runTestHelper } from "@/lib/testing/utils/event-utils"
import { cn } from "@/lib/utils"
import { Beaker, Play } from "lucide-react"
import { useEffect, useState } from "react"

import { TestEventMonitor } from "./test-event-monitor"

interface TestResults {
  type: TestType
  stats: {
    total: number
    invalid: number
  }
  issues: Array<{
    id: string
    message: string
    severity: "Critical" | "High" | "Medium" | "Low"
  }>
}

interface TestSelectorProps {
  onRunTest: (testType: TestType) => void
  onStopTest: () => void
  isRunning: boolean
  activeTest: TestType | null
}

// Generic Test Selector using the unified event system
function TestSelector({
  onRunTest,
  onStopTest,
  isRunning,
  activeTest
}: TestSelectorProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Accessibility Tests</h2>
      <div className="space-y-2">
        {Object.entries(TEST_CONFIGS).map(([type, config]) => (
          <div
            key={type}
            className="flex items-center justify-between p-3 rounded-lg border bg-card text-card-foreground">
            <div>
              <h3 className="font-medium">{config.displayName}</h3>
              <p className="text-xs text-muted-foreground">
                Tests {config.statsText.itemName} for accessibility issues
              </p>
            </div>
            <Button
              key={type}
              size="sm"
              variant={activeTest === type ? "destructive" : "outline"}
              onClick={() =>
                activeTest === type ? onStopTest() : onRunTest(type as TestType)
              }
              disabled={isRunning && activeTest !== type}
              className={activeTest === type ? "animate-pulse" : ""}>
              {activeTest === type ? (
                <svg
                  className="h-4 w-4 mr-1 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Play className="h-3 w-3 mr-1" aria-hidden="true" />
              )}
              {config.displayName}
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

// Tooltip wrapper component for consistency
function IconButtonWithTooltip({
  children,
  tooltip,
  side = "top"
}: {
  children: React.ReactNode
  tooltip: string
  side?: "top" | "right" | "bottom" | "left"
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side}>{tooltip}</TooltipContent>
    </Tooltip>
  )
}

export function Werkzeug() {
  // Simplified state management - using only the necessary states
  const [activeTest, setActiveTest] = useState<TestType | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())
  const [showExperimental, setShowExperimental] = useState(false)
  const [processingEvent, setProcessingEvent] = useState(false)

  // Added function to clear results explicitly
  const clearResults = () => {
    console.log("[werkzeug] Clearing test results")
    setTestResults([])
  }

  useEffect(() => {
    // Listen for test completion events using the generic event system
    const handleTestComplete = (event: any) => {
      console.log("[werkzeug] Received event:", event.type, event)

      // Only handle generic test completion events
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        console.log("[werkzeug] Handling test completion:", event)
        const testId = event.data?.testId

        // Reset loading state if this is the active test
        if (activeTest === testId) {
          console.log(`[werkzeug] Resetting activeTest for ${testId}`)
          setActiveTest(null)
        }

        // Prevent processing multiple events too quickly
        if (processingEvent) {
          console.log("[werkzeug] Already processing an event, skipping")
          return
        }

        setProcessingEvent(true)

        // Use a timeout to prevent UI flashing and ensure state updates properly
        setTimeout(() => {
          // Check for legacy format (issues array)
          if (event.data?.issues && event.data.issues.length > 0) {
            console.log(
              `[werkzeug] Setting legacy test results:`,
              event.data.issues
            )
            // Append new results instead of replacing
            setTestResults((prevResults) => {
              // Create a map of existing results by ID to avoid duplicates
              const existingMap = new Map(
                prevResults.map((r) => [r.id || JSON.stringify(r), r])
              )

              // Add new results, avoiding duplicates
              event.data.issues.forEach((issue: any) => {
                const id = issue.id || JSON.stringify(issue)
                if (!existingMap.has(id)) {
                  existingMap.set(id, issue)
                }
              })

              return Array.from(existingMap.values())
            })
          }
          // Check for ACT format (results object with details)
          else if (
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
          else if (testResults.length === 0) {
            console.log(`[werkzeug] No issues found in test results`)
            // Show empty results with a message
            setTestResults([
              {
                id: "no-issues",
                message: `No issues found in ${testId} test`,
                severity: "Low"
              }
            ])
          }

          setProcessingEvent(false)
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
  }, [activeTest, testResults, processingEvent])

  const toggleLayer = (testType: string) => {
    console.log("[Werkzeug] Toggle requested for layer:", testType)

    // Get the corresponding layer name from the test config if it's a valid test type
    const layerName =
      testType in TEST_CONFIGS
        ? TEST_CONFIGS[testType as TestType].layerName || testType
        : testType

    console.log("[Werkzeug] Layer name:", layerName)

    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      if (newHidden.has(layerName)) {
        console.log(
          "[Werkzeug] Showing layer (removing from hidden):",
          layerName
        )
        newHidden.delete(layerName)
      } else {
        console.log("[Werkzeug] Hiding layer (adding to hidden):", layerName)
        newHidden.add(layerName)
      }

      const isVisible = !newHidden.has(layerName)
      console.log("[Werkzeug] Publishing LAYER_TOGGLE_REQUEST:", {
        layer: layerName,
        visible: isVisible
      })

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
  }

  // Unified test runner using the generic event system
  const runTest = async (type: TestType) => {
    console.log(`[werkzeug] Running test: ${type}`)
    setActiveTest(type)

    try {
      // Use our helper function
      await runTestHelper(type)

      // Set a safety timeout to reset the loading state
      setTimeout(() => {
        if (activeTest === type) {
          console.log(`[werkzeug] Safety timeout for test: ${type}`)
          setActiveTest(null)
        }
      }, 10000)
    } catch (error) {
      console.error(`[werkzeug] Error running test ${type}:`, error)
      setActiveTest(null)
    }
  }

  const stopTest = () => {
    if (activeTest) {
      console.log(`[Werkzeug] Stopping test: ${activeTest}`)

      eventBus.publish({
        type: "TOOL_STATE_CHANGE",
        timestamp: Date.now(),
        data: {
          tool: activeTest,
          enabled: false
        }
      })
    }
    setActiveTest(null)
  }

  return (
    <TooltipProvider>
      <div className="p-2 space-y-4">
        {/* Test Selector */}
        <TestSelector
          onRunTest={runTest}
          onStopTest={stopTest}
          isRunning={!!activeTest}
          activeTest={activeTest}
        />

        {/* Event Monitor */}
        <TestEventMonitor />

        {/* Experimental Features Toggle */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm font-medium">Experimental Features</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowExperimental(!showExperimental)}
            className="flex items-center gap-1">
            <Beaker className="h-4 w-4" aria-hidden="true" />
            {showExperimental ? "Hide" : "Show"}
          </Button>
        </div>

        {/* Experimental Features */}
        {showExperimental && (
          <div className="p-4 border rounded-md bg-muted/10">
            <h3 className="text-sm font-medium mb-2">Experimental Features</h3>
            {/* Add future experimental features here */}
          </div>
        )}

        {/* Analysis Progress */}
        {activeTest && (
          <div className="text-sm text-muted-foreground">
            Running {TEST_CONFIGS[activeTest].displayName}...
          </div>
        )}

        {/* Results Summary - Persistent until cleared */}
        {testResults.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearResults}
                className="text-xs">
                Clear results
              </Button>
            </div>

            {/* Display results in a more user-friendly format */}
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded border p-3",
                    result.outcome === "passed"
                      ? "border-success/30 bg-success/10"
                      : result.severity === "critical" ||
                          result.severity === "Critical"
                        ? "border-destructive/30 bg-destructive/10"
                        : result.severity === "serious" ||
                            result.severity === "High"
                          ? "border-warning/30 bg-warning/10"
                          : "border-muted bg-muted/10"
                  )}>
                  <div className="flex items-start justify-between">
                    <div className="font-medium">
                      {result.message || "Issue detected"}
                    </div>
                    <div className="text-xs px-2 py-1 rounded-full bg-card border">
                      {result.severity || "Unknown"}
                    </div>
                  </div>

                  {result.selector && (
                    <div className="mt-2 text-xs font-mono bg-card p-2 rounded border">
                      {result.selector}
                    </div>
                  )}

                  {result.html && (
                    <div className="mt-2">
                      <div className="text-xs text-muted-foreground mb-1">
                        HTML:
                      </div>
                      <div className="text-xs font-mono bg-card p-2 rounded border overflow-x-auto">
                        {result.html}
                      </div>
                    </div>
                  )}

                  {result.help && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      <span className="font-medium">Help: </span>
                      {result.help}
                    </div>
                  )}

                  {result.impact && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      <span className="font-medium">Impact: </span>
                      {result.impact}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
