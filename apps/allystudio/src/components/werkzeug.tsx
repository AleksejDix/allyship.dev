import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import type {
  AltAnalysisCompleteEvent,
  HeadingAnalysisCompleteEvent,
  LinkAnalysisCompleteEvent
} from "@/lib/events/types"
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
    alt: { enabled: false, stats: { total: 0, invalid: 0 } }
  })

  useEffect(() => {
    // Subscribe to analysis complete events
    const unsubscribe = eventBus.subscribe((event) => {
      if (
        event.type === "HEADING_ANALYSIS_COMPLETE" ||
        event.type === "LINK_ANALYSIS_COMPLETE" ||
        event.type === "ALT_ANALYSIS_COMPLETE"
      ) {
        const type = event.type.split("_")[0].toLowerCase() as TestType
        setTestStates((current) => ({
          ...current,
          [type]: {
            ...current[type],
            stats: event.data.stats
          }
        }))
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
    setTestStates((current) => ({
      ...current,
      [type]: {
        ...current[type],
        enabled: newState
      }
    }))

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // First send tool state change event
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
    } else {
      // Clear highlights when disabling
      clearHighlights(type)
      setTestStates((current) => ({
        ...current,
        [type]: {
          ...current[type],
          stats: { total: 0, invalid: 0 }
        }
      }))
    }
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(TEST_CONFIGS).map(([type, config]) => (
        <div key={type}>
          <Button
            onClick={() => toggleTest(type as TestType)}
            aria-pressed={testStates[type as TestType].enabled}
            variant={
              testStates[type as TestType].enabled ? "secondary" : "outline"
            }
            disabled={isAnalyzing && !testStates[type as TestType].enabled}>
            {testStates[type as TestType].enabled
              ? config.buttonText.disable
              : config.buttonText.enable}
          </Button>
          {testStates[type as TestType].enabled && (
            <div className="text-sm mt-2">
              {config.statsText.label}{" "}
              {testStates[type as TestType].stats.invalid} issues in{" "}
              {testStates[type as TestType].stats.total}{" "}
              {config.statsText.itemName}
            </div>
          )}
        </div>
      ))}

      {isAnalyzing && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Analyzing...</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              // Find the active test type
              const activeType = Object.entries(testStates).find(
                ([, state]) => state.enabled
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
