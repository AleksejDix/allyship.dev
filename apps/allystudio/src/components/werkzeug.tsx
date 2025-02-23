import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import type { HeadingAnalysisCompleteEvent } from "@/lib/events/types"
import { useEffect, useState } from "react"

export function Werkzeug() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [stats, setStats] = useState({ total: 0, invalid: 0 })

  useEffect(() => {
    // Subscribe to analysis complete events
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_ANALYSIS_COMPLETE") {
        const analysisEvent = event as HeadingAnalysisCompleteEvent
        setStats(analysisEvent.data.stats)
      }
    })

    return unsubscribe
  }, [])

  const toggleTest = async () => {
    const newState = !isEnabled
    setIsEnabled(newState)

    // Store state

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // Publish tool state change event
    eventBus.publish({
      type: "TOOL_STATE_CHANGE",
      timestamp: Date.now(),
      tabId: tab.id,
      data: {
        tool: "headings",
        enabled: newState
      }
    })

    if (newState) {
      // Request initial analysis
      eventBus.publish({
        type: "HEADING_ANALYSIS_REQUEST",
        timestamp: Date.now(),
        tabId: tab.id
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <Button
        onClick={toggleTest}
        aria-pressed={isEnabled}
        variant={isEnabled ? "secondary" : "outline"}>
        {isEnabled ? "Disable Heading Analysis" : "Enable Heading Analysis"}
      </Button>
      {isEnabled && (
        <div className="text-sm">
          Found {stats.invalid} issues in {stats.total} headings
        </div>
      )}
    </div>
  )
}
