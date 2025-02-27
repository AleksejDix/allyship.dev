import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
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
import { Check, ChevronsUpDown, ExternalLink, Play } from "lucide-react"
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

// Updated Test Selector using a single select dropdown
function TestSelector({
  onRunTest,
  onStopTest,
  isRunning,
  activeTest
}: TestSelectorProps) {
  const [selectedTest, setSelectedTest] = useState<TestType | "">("")
  const [open, setOpen] = useState(false)

  // Update selected test when active test changes
  useEffect(() => {
    if (activeTest) {
      setSelectedTest(activeTest)
    }
  }, [activeTest])

  const handleTestSelection = (value: string) => {
    setSelectedTest(value as TestType)
    setOpen(false)
  }

  const handleRunClick = () => {
    if (isRunning) {
      onStopTest()
    } else if (selectedTest) {
      onRunTest(selectedTest as TestType)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between">
                <span className="truncate">
                  {selectedTest
                    ? TEST_CONFIGS[selectedTest as TestType]?.displayName
                    : "Search tests..."}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
              <Command>
                <CommandInput placeholder="Search tests..." />
                <CommandList>
                  <CommandEmpty>No tests found.</CommandEmpty>
                  <CommandGroup>
                    {Object.entries(TEST_CONFIGS)
                      .sort(([, a], [, b]) =>
                        a.displayName.localeCompare(b.displayName)
                      )
                      .map(([type, config]) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={handleTestSelection}
                          className="flex items-center justify-between">
                          <span>{config.displayName}</span>
                          {type === selectedTest && (
                            <Check className="h-4 w-4" aria-hidden="true" />
                          )}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onClick={handleRunClick}
          disabled={!selectedTest && !isRunning}
          variant={isRunning ? "destructive" : "ghost"}
          size="icon"
          className={cn(isRunning ? "animate-pulse" : "")}>
          {isRunning ? (
            <svg
              className="h-4 w-4 animate-spin"
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
            <Play className="h-4 w-4 text-green-600" aria-hidden="true" />
          )}
        </Button>
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
  }, []) // Empty dependency array since we use closure values

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
      // This is a backup in case no completion event is received
      setTimeout(() => {
        if (activeTest === type) {
          console.log(`[werkzeug] Safety timeout for test: ${type}`)
          setActiveTest(null)
        }
      }, 6000) // 6 seconds - slightly longer than the fallback event timeout
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

  // Helper function to get severity color class
  const getSeverityColorClass = (severity: string, outcome: string) => {
    if (outcome === "passed") return "bg-success"

    const normalizedSeverity = severity?.toLowerCase() || ""
    if (normalizedSeverity.includes("critical")) return "bg-destructive"
    if (normalizedSeverity.includes("high")) return "bg-destructive"
    if (
      normalizedSeverity.includes("medium") ||
      normalizedSeverity.includes("serious")
    )
      return "bg-warning"
    if (
      normalizedSeverity.includes("low") ||
      normalizedSeverity.includes("minor")
    )
      return "bg-muted"

    return "bg-muted"
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

        {/* Analysis Progress - Fixed height to prevent layout jumps */}
        <div className="h-6 text-sm text-muted-foreground">
          {activeTest && `Running ${TEST_CONFIGS[activeTest].displayName}...`}
        </div>

        {/* Results Summary - Persistent until cleared or loading placeholder when active */}
        {(testResults.length > 0 || activeTest) && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Analysis Results</h2>
              {testResults.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearResults}
                  className="text-xs">
                  Clear results
                </Button>
              )}
            </div>

            {/* Display results in a dense list format or loading placeholder */}
            <div className="border rounded overflow-hidden">
              {testResults.length > 0
                ? testResults.map((result, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 border-b last:border-b-0",
                        "bg-background hover:bg-muted/20 transition-colors"
                      )}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full",
                              getSeverityColorClass(
                                result.severity,
                                result.outcome
                              )
                            )}
                          />
                          <div className="font-medium">
                            {result.message || "Issue detected"}
                          </div>
                        </div>
                        <div className="text-xs px-2 py-1 rounded-full bg-card border">
                          {result.severity || "Unknown"}
                        </div>
                      </div>

                      {/* Additional ACT rule information */}
                      {result.ruleId && (
                        <div className="mt-1 text-xs text-muted-foreground pl-4">
                          <div>Rule: {result.ruleId}</div>
                          {result.wcagCriteria && (
                            <div className="flex items-center gap-1">
                              <span>
                                WCAG: {result.wcagCriteria.join(", ")}
                              </span>
                              {result.helpUrl && (
                                <a
                                  href={result.helpUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center hover:text-foreground">
                                  <ExternalLink
                                    size={12}
                                    className="ml-1"
                                    aria-hidden="true"
                                  />
                                  <span className="sr-only">
                                    Learn more about this rule (opens in new
                                    window)
                                  </span>
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                : activeTest
                  ? // Loading placeholder rows
                    Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`loading-${index}`}
                        className="flex items-center justify-between p-3 border-b last:border-b-0 animate-pulse">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-muted" />
                          <div className="h-4 bg-muted rounded w-64" />
                        </div>
                        <div className="h-6 w-16 bg-muted rounded-full" />
                      </div>
                    ))
                  : null}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
