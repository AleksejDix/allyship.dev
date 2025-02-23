import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import type {
  HeadingAnalysisCompleteEvent,
  LinkAnalysisCompleteEvent
} from "@/lib/events/types"
import { useEffect, useState } from "react"

export function Werkzeug() {
  const [isHeadingEnabled, setIsHeadingEnabled] = useState(false)
  const [isLinkEnabled, setIsLinkEnabled] = useState(false)
  const [headingStats, setHeadingStats] = useState({ total: 0, invalid: 0 })
  const [linkStats, setLinkStats] = useState({ total: 0, invalid: 0 })

  useEffect(() => {
    // Subscribe to analysis complete events
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_ANALYSIS_COMPLETE") {
        const analysisEvent = event as HeadingAnalysisCompleteEvent
        setHeadingStats(analysisEvent.data.stats)
      } else if (event.type === "LINK_ANALYSIS_COMPLETE") {
        const analysisEvent = event as LinkAnalysisCompleteEvent
        setLinkStats(analysisEvent.data.stats)
      }
    })

    return unsubscribe
  }, [])

  const toggleHeadingTest = async () => {
    const newState = !isHeadingEnabled
    setIsHeadingEnabled(newState)

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

  const toggleLinkTest = async () => {
    const newState = !isLinkEnabled
    setIsLinkEnabled(newState)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // Publish tool state change event
    eventBus.publish({
      type: "TOOL_STATE_CHANGE",
      timestamp: Date.now(),
      tabId: tab.id,
      data: {
        tool: "links",
        enabled: newState
      }
    })

    if (newState) {
      // Request initial analysis
      eventBus.publish({
        type: "LINK_ANALYSIS_REQUEST",
        timestamp: Date.now(),
        tabId: tab.id
      })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <Button
          onClick={toggleHeadingTest}
          aria-pressed={isHeadingEnabled}
          variant={isHeadingEnabled ? "secondary" : "outline"}>
          {isHeadingEnabled
            ? "Disable Heading Analysis"
            : "Enable Heading Analysis"}
        </Button>
        {isHeadingEnabled && (
          <div className="text-sm mt-2">
            Found {headingStats.invalid} issues in {headingStats.total} headings
          </div>
        )}
      </div>

      <div>
        <Button
          onClick={toggleLinkTest}
          aria-pressed={isLinkEnabled}
          variant={isLinkEnabled ? "secondary" : "outline"}>
          {isLinkEnabled ? "Disable Link Analysis" : "Enable Link Analysis"}
        </Button>
        {isLinkEnabled && (
          <div className="text-sm mt-2">
            Found {linkStats.invalid} empty links in {linkStats.total} links
          </div>
        )}
      </div>
    </div>
  )
}
