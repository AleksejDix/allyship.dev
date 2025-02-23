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
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    // Subscribe to analysis complete events
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_ANALYSIS_COMPLETE") {
        const analysisEvent = event as HeadingAnalysisCompleteEvent
        setHeadingStats(analysisEvent.data.stats)
        setIsAnalyzing(false)
      } else if (event.type === "LINK_ANALYSIS_COMPLETE") {
        const analysisEvent = event as LinkAnalysisCompleteEvent
        setLinkStats(analysisEvent.data.stats)
        setIsAnalyzing(false)
      }
    })

    return unsubscribe
  }, [])

  const clearHighlights = (tool: "headings" | "links") => {
    // Clear highlights for specific tool
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector: "*",
        message:
          tool === "headings" ? "Heading Structure" : "Link Accessibility",
        isValid: true,
        clear: true
      }
    })
  }

  const toggleHeadingTest = async () => {
    const newState = !isHeadingEnabled
    setIsHeadingEnabled(newState)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // First send tool state change event
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
      setIsAnalyzing(true)
      eventBus.publish({
        type: "HEADING_ANALYSIS_REQUEST",
        timestamp: Date.now(),
        tabId: tab.id
      })
    } else {
      // Clear highlights when disabling
      clearHighlights("headings")
      setHeadingStats({ total: 0, invalid: 0 })
    }
  }

  const toggleLinkTest = async () => {
    const newState = !isLinkEnabled
    setIsLinkEnabled(newState)

    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (!tab?.id) return

    // First send tool state change event
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
      setIsAnalyzing(true)
      eventBus.publish({
        type: "LINK_ANALYSIS_REQUEST",
        timestamp: Date.now(),
        tabId: tab.id
      })
    } else {
      // Clear highlights when disabling
      clearHighlights("links")
      setLinkStats({ total: 0, invalid: 0 })
    }
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <Button
          onClick={toggleHeadingTest}
          aria-pressed={isHeadingEnabled}
          variant={isHeadingEnabled ? "secondary" : "outline"}
          disabled={isAnalyzing && !isHeadingEnabled}>
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
          variant={isLinkEnabled ? "secondary" : "outline"}
          disabled={isAnalyzing && !isLinkEnabled}>
          {isLinkEnabled ? "Disable Link Analysis" : "Enable Link Analysis"}
        </Button>
        {isLinkEnabled && (
          <div className="text-sm mt-2">
            Found {linkStats.invalid} empty links in {linkStats.total} links
          </div>
        )}
      </div>

      {isAnalyzing && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Analyzing...</span>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              eventBus.publish({
                type: "TOOL_STATE_CHANGE",
                timestamp: Date.now(),
                data: {
                  tool: isHeadingEnabled ? "headings" : "links",
                  enabled: false
                }
              })
              setIsAnalyzing(false)
              if (isHeadingEnabled) {
                setIsHeadingEnabled(false)
                setHeadingStats({ total: 0, invalid: 0 })
              }
              if (isLinkEnabled) {
                setIsLinkEnabled(false)
                setLinkStats({ total: 0, invalid: 0 })
              }
            }}>
            Stop Analysis
          </Button>
        </div>
      )}
    </div>
  )
}
