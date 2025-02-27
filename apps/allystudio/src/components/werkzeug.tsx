import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { requestTestAnalysis } from "@/lib/testing/utils/event-utils"
import { Beaker, Eye, EyeOff, Play, Square } from "lucide-react"
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
  isAnalyzing: boolean
  activeTest: TestType | null
}

// New TestSelector component to allow selecting and running individual tests
function TestSelector({
  onRunTest,
  onStopTest,
  isAnalyzing,
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
            <IconButtonWithTooltip
              tooltip={
                activeTest === type
                  ? `Stop ${config.displayName} test`
                  : `Run ${config.displayName} test`
              }
              side="left">
              {activeTest === type ? (
                <Button
                  size="icon"
                  className="h-8 w-8 animate-pulse"
                  variant="destructive"
                  onClick={onStopTest}
                  aria-label={`Stop ${config.displayName} test`}>
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
                </Button>
              ) : (
                <Button
                  size="icon"
                  className="h-8 w-8"
                  variant="outline"
                  onClick={() => onRunTest(type as TestType)}
                  disabled={isAnalyzing}
                  aria-label={`Run ${config.displayName} test`}>
                  <Play className="h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </IconButtonWithTooltip>
          </div>
        ))}
      </div>
    </div>
  )
}

interface TestResultItemProps {
  result: TestResults
  hiddenLayers: Set<string>
  onToggleLayer: (layer: string) => void
}

// Extract test result item to its own component
function TestResultItem({
  result,
  hiddenLayers,
  onToggleLayer
}: TestResultItemProps) {
  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{TEST_CONFIGS[result.type].displayName}</h3>
        <IconButtonWithTooltip
          tooltip={hiddenLayers.has(result.type) ? "Show layer" : "Hide layer"}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleLayer(result.type)}
            aria-pressed={!hiddenLayers.has(result.type)}
            aria-label={`Toggle ${TEST_CONFIGS[result.type].displayName} layer visibility`}
            className="h-8 w-8">
            {hiddenLayers.has(result.type) ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </IconButtonWithTooltip>
      </div>
      <p className="text-sm text-muted-foreground">
        Found {result.stats.invalid} issues in {result.stats.total}{" "}
        {TEST_CONFIGS[result.type].statsText.itemName}
      </p>
      {result.issues.length > 0 && (
        <ul className="mt-2 space-y-1">
          {result.issues.map((issue, index) => (
            <li
              key={`${result.type}-${issue.id}-${issue.severity}-${index}`}
              className="text-sm flex items-center gap-2">
              <span
                className={`px-1.5 py-0.5 rounded-full text-xs ${
                  issue.severity === "Critical"
                    ? "bg-destructive text-destructive-foreground"
                    : issue.severity === "High"
                      ? "bg-warning text-warning-foreground"
                      : "bg-muted text-muted-foreground"
                }`}>
                {issue.severity}
              </span>
              {issue.message}
            </li>
          ))}
        </ul>
      )}
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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTest, setActiveTest] = useState<TestType | null>(null)
  const [results, setResults] = useState<TestResults[]>([])
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())
  const [showExperimental, setShowExperimental] = useState(false)

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      // Find test type by matching the complete event type
      const testConfig = Object.entries(TEST_CONFIGS).find(
        ([, config]) => config.events.complete === event.type
      )

      if (
        testConfig &&
        (event.type === "HEADING_ANALYSIS_COMPLETE" ||
          event.type === "LINK_ANALYSIS_COMPLETE" ||
          event.type === "ALT_ANALYSIS_COMPLETE" ||
          event.type === "INTERACTIVE_ANALYSIS_COMPLETE")
      ) {
        const [type] = testConfig
        setResults((current) => [
          ...current.filter((result) => result.type !== type),
          {
            type: type as TestType,
            stats: {
              total: event.data.stats.total,
              invalid: event.data.stats.invalid
            },
            issues: event.data.issues
          }
        ])
        setIsAnalyzing(false)
        setActiveTest(null)
      }

      // Also listen for the generic TEST_ANALYSIS_COMPLETE events
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        const testId = event.data.testId
        // Check if this is a known test type
        if (Object.keys(TEST_CONFIGS).includes(testId)) {
          setResults((current) => [
            ...current.filter((result) => result.type !== testId),
            {
              type: testId as TestType,
              stats: {
                total: event.data.stats.total,
                invalid: event.data.stats.invalid
              },
              issues: event.data.issues
            }
          ])
          setIsAnalyzing(false)
          setActiveTest(null)
        }
      }
    })

    return unsubscribe
  }, [])

  const toggleLayer = (layerName: string) => {
    // Map test types to layer names first
    const layerMap = {
      headings: "headings",
      links: "links",
      alt: "images",
      interactive: "interactive"
    } as const

    console.log("[Werkzeug] Toggle requested for layer:", layerName)

    // Get the mapped layer name
    const mappedLayer =
      layerMap[layerName as keyof typeof layerMap] || layerName
    console.log("[Werkzeug] Mapped layer name:", mappedLayer)

    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      if (newHidden.has(mappedLayer)) {
        console.log(
          "[Werkzeug] Showing layer (removing from hidden):",
          mappedLayer
        )
        newHidden.delete(mappedLayer)
      } else {
        console.log("[Werkzeug] Hiding layer (adding to hidden):", mappedLayer)
        newHidden.add(mappedLayer)
      }

      const isVisible = !newHidden.has(mappedLayer)
      console.log("[Werkzeug] Publishing LAYER_TOGGLE_REQUEST:", {
        layer: mappedLayer,
        visible: isVisible
      })

      eventBus.publish({
        type: "LAYER_TOGGLE_REQUEST",
        timestamp: Date.now(),
        data: {
          layer: mappedLayer,
          visible: isVisible
        }
      })

      return newHidden
    })
  }

  // Run a single test
  const runTest = async (testType: TestType) => {
    setIsAnalyzing(true)
    setActiveTest(testType)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      setIsAnalyzing(false)
      setActiveTest(null)
      return
    }

    // Make sure the layer for this test is visible
    // Map test types to layer names
    const layerMap = {
      headings: "headings",
      links: "links",
      alt: "images",
      interactive: "interactive"
    } as const

    const mappedLayer = layerMap[testType] || testType

    console.log(
      `[Werkzeug] Running test: ${testType}, ensuring layer ${mappedLayer} is visible`
    )

    // Remove this layer from hidden layers to make it visible
    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      // Always make sure the layer is visible by removing it from hidden layers
      newHidden.delete(mappedLayer)
      return newHidden
    })

    // Always explicitly publish layer visibility event
    console.log(
      `[Werkzeug] Publishing LAYER_TOGGLE_REQUEST for layer: ${mappedLayer}, visible: true`
    )
    eventBus.publish({
      type: "LAYER_TOGGLE_REQUEST",
      timestamp: Date.now(),
      data: {
        layer: mappedLayer,
        visible: true
      }
    })

    const config = TEST_CONFIGS[testType]

    // Start this test
    eventBus.publish({
      type: config.events.request,
      timestamp: Date.now(),
      tabId: tab.id
    })

    // Note: The test completion is handled by the useEffect
  }

  // Run a test using the generic event system
  const runGenericTest = async (testId: string) => {
    setIsAnalyzing(true)
    setActiveTest(testId as TestType)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) {
      setIsAnalyzing(false)
      setActiveTest(null)
      return
    }

    // Make sure the layer for this test is visible
    // Map test types to layer names
    const layerMap = {
      headings: "headings",
      links: "links",
      alt: "images",
      interactive: "interactive"
    } as const

    const mappedLayer = layerMap[testId as keyof typeof layerMap] || testId

    // Remove this layer from hidden layers to make it visible
    setHiddenLayers((current) => {
      const newHidden = new Set(current)
      newHidden.delete(mappedLayer)
      return newHidden
    })

    // Publish layer visibility
    eventBus.publish({
      type: "LAYER_TOGGLE_REQUEST",
      timestamp: Date.now(),
      data: {
        layer: mappedLayer,
        visible: true
      },
      tabId: tab.id
    })

    // Start this test using the new generic event
    requestTestAnalysis(testId)
  }

  const stopAnalysis = () => {
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
    setIsAnalyzing(false)
    setActiveTest(null)
  }

  return (
    <TooltipProvider>
      <div className="p-2 space-y-4">
        {/* Test Selector */}
        <TestSelector
          onRunTest={runTest}
          onStopTest={stopAnalysis}
          isAnalyzing={isAnalyzing}
          activeTest={activeTest}
        />

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

        {/* Generic Event System Test UI */}
        {showExperimental && (
          <div className="p-4 border rounded-md bg-muted/10">
            <h3 className="text-sm font-medium mb-2">
              Run Tests with Generic Events
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(TEST_CONFIGS).map((testId) => (
                <Button
                  key={testId}
                  size="sm"
                  variant={activeTest === testId ? "destructive" : "outline"}
                  onClick={() => runGenericTest(testId)}
                  disabled={isAnalyzing && activeTest !== testId}
                  className={activeTest === testId ? "animate-pulse" : ""}>
                  {activeTest === testId ? (
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
                  {TEST_CONFIGS[testId as TestType].displayName}
                </Button>
              ))}
            </div>

            {/* Event Monitor */}
            <TestEventMonitor />
          </div>
        )}

        {/* Analysis Progress */}
        {isAnalyzing && activeTest && (
          <div className="text-sm text-muted-foreground">
            Running {TEST_CONFIGS[activeTest].displayName}...
          </div>
        )}

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Analysis Results</h2>
            {results.map((result) => (
              <TestResultItem
                key={result.type}
                result={result}
                hiddenLayers={hiddenLayers}
                onToggleLayer={toggleLayer}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
