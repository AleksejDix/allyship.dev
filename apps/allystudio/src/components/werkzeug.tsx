import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { Eye, EyeOff } from "lucide-react"
import { useEffect, useState } from "react"

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

export function Werkzeug() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTest, setActiveTest] = useState<TestType | null>(null)
  const [results, setResults] = useState<TestResults[]>([])
  const [hiddenLayers, setHiddenLayers] = useState<Set<string>>(new Set())

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
          ...current,
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

  const startAnalysis = async () => {
    // Clear previous results and layer states
    setResults([])
    setHiddenLayers(new Set())
    setIsAnalyzing(true)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // Run all test suites in sequence
    const testTypes = Object.entries(TEST_CONFIGS)
    for (const [type, config] of testTypes) {
      setActiveTest(type as TestType)
      console.log("Starting test:", type) // Debug log

      // Start this test
      eventBus.publish({
        type: config.events.request,
        timestamp: Date.now(),
        tabId: tab.id
      })

      // Wait for completion before starting next test
      await new Promise<void>((resolve, reject) => {
        let timeout: NodeJS.Timeout

        const cleanup = eventBus.subscribe((event) => {
          if (event.type === config.events.complete) {
            clearTimeout(timeout)
            cleanup()
            resolve()
          }
        })

        // Add timeout to prevent hanging
        timeout = setTimeout(() => {
          cleanup()
          reject(new Error(`Test ${type} timed out`))
        }, 10000) // 10 second timeout
      }).catch((error) => {
        console.error("Test error:", error)
        // Continue with next test even if current one fails
      })

      // Add small delay between tests to ensure highlights are properly handled
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsAnalyzing(false)
    setActiveTest(null)
  }

  const stopAnalysis = () => {
    if (activeTest) {
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
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={startAnalysis}
          disabled={isAnalyzing}
          className="w-full">
          {isAnalyzing ? "Analyzing..." : "Start Accessibility Analysis"}
        </Button>
        {isAnalyzing && (
          <Button
            variant="destructive"
            size="sm"
            onClick={stopAnalysis}
            className="ml-2">
            Stop
          </Button>
        )}
      </div>

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
            <div
              key={result.type}
              className="p-4 rounded-lg border bg-card text-card-foreground">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">
                  {TEST_CONFIGS[result.type].displayName}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLayer(result.type)}
                  aria-pressed={!hiddenLayers.has(result.type)}
                  aria-label={`Toggle ${TEST_CONFIGS[result.type].displayName} layer visibility`}
                  className="h-8 w-8">
                  {hiddenLayers.has(result.type) ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
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
          ))}
        </div>
      )}
    </div>
  )
}
