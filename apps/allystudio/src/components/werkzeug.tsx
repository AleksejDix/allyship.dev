import { eventBus } from "@/lib/events/event-bus"
import type { HeadingAnalysisCompleteEvent } from "@/lib/events/types"
import { useEffect, useState } from "react"

export function Werkzeug() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [stats, setStats] = useState({ total: 0, invalid: 0 })

  useEffect(() => {
    // Check initial state
    chrome.storage.local.get("test_enabled_headings", (result) => {
      setIsEnabled(!!result.test_enabled_headings)
    })

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
    await chrome.storage.local.set({ test_enabled_headings: newState })

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
      <button
        onClick={toggleTest}
        className={`px-4 py-2 rounded ${
          isEnabled ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}>
        {isEnabled ? "Disable Heading Analysis" : "Enable Heading Analysis"}
      </button>
      {isEnabled && (
        <div className="text-sm">
          Found {stats.invalid} issues in {stats.total} headings
        </div>
      )}
    </div>
  )
}
