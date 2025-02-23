import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import { TEST_CONFIGS, type TestType } from "@/lib/testing/test-config"
import { useEffect, useState } from "react"

interface TestState {
  enabled: boolean
  stats: {
    total: number
    invalid: number
  }
}

export function Werkzeug() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [testStates, setTestStates] = useState<Record<TestType, TestState>>({
    headings: { enabled: false, stats: { total: 0, invalid: 0 } },
    links: { enabled: false, stats: { total: 0, invalid: 0 } },
    alt: { enabled: false, stats: { total: 0, invalid: 0 } },
    interactive: { enabled: false, stats: { total: 0, invalid: 0 } }
  })

  useEffect(() => {
    // Subscribe to analysis complete events
    const unsubscribe = eventBus.subscribe((event) => {
      if (
        event.type === "HEADING_ANALYSIS_COMPLETE" ||
        event.type === "LINK_ANALYSIS_COMPLETE" ||
        event.type === "ALT_ANALYSIS_COMPLETE"
      ) {
        // Map event type to test type
        const type =
          event.type === "HEADING_ANALYSIS_COMPLETE"
            ? "headings"
            : event.type === "LINK_ANALYSIS_COMPLETE"
              ? "links"
              : "alt"

        setTestStates((current) => {
          // Only update if the test is still enabled
          if (!current[type].enabled) return current

          return {
            ...current,
            [type]: {
              ...current[type],
              stats: {
                total: event.data.stats.total,
                invalid: event.data.stats.invalid
              }
            }
          }
        })
        setIsAnalyzing(false)
      }
    })

    return unsubscribe
  }, [])

  const clearHighlights = (type: TestType) => {
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector: "*",
        message: TEST_CONFIGS[type].displayName,
        isValid: true,
        clear: true
      }
    })
  }

  const toggleTest = async (type: TestType) => {
    const newState = !testStates[type].enabled

    if (!newState) {
      // If disabling, update state immediately
      setTestStates((current) => ({
        ...current,
        [type]: {
          enabled: false,
          stats: { total: 0, invalid: 0 }
        }
      }))
      clearHighlights(type)
    } else {
      // If enabling, just update enabled state
      setTestStates((current) => ({
        ...current,
        [type]: {
          ...current[type],
          enabled: true
        }
      }))
    }

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // Send tool state change event
    eventBus.publish({
      type: "TOOL_STATE_CHANGE",
      timestamp: Date.now(),
      tabId: tab.id,
      data: {
        tool: type,
        enabled: newState
      }
    })

    if (newState) {
      // Request initial analysis
      setIsAnalyzing(true)
      eventBus.publish({
        type: TEST_CONFIGS[type].events.request,
        timestamp: Date.now(),
        tabId: tab.id
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(TEST_CONFIGS).map(([type, config]) => {
        // Ensure type is a valid TestType
        const testType = type as TestType
        // Get state with fallback for safety
        const state = testStates[testType] || {
          enabled: false,
          stats: { total: 0, invalid: 0 }
        }

        return (
          <div key={type} className="min-h-[64px]">
            <Button
              onClick={() => toggleTest(testType)}
              aria-pressed={state.enabled}
              variant={state.enabled ? "secondary" : "outline"}
              disabled={isAnalyzing && !state.enabled}
              className="w-full">
              {state.enabled
                ? config.buttonText.disable
                : config.buttonText.enable}
            </Button>
            <div className="h-8 text-sm mt-2">
              {state.enabled && (
                <span>
                  {config.statsText.label} {state.stats.invalid} issues in{" "}
                  {state.stats.total} {config.statsText.itemName}
                </span>
              )}
            </div>
          </div>
        )
      })}

      {isAnalyzing && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Analyzing...</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              // Find the active test type
              const activeType = Object.entries(testStates).find(
                ([, state]) => state?.enabled
              )?.[0] as TestType

              if (activeType) {
                eventBus.publish({
                  type: "TOOL_STATE_CHANGE",
                  timestamp: Date.now(),
                  data: {
                    tool: activeType,
                    enabled: false
                  }
                })
                setIsAnalyzing(false)
                setTestStates((current) => ({
                  ...current,
                  [activeType]: {
                    enabled: false,
                    stats: { total: 0, invalid: 0 }
                  }
                }))
              }
            }}>
            Stop Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
