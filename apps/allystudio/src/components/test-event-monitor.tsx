import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisCompleteEvent } from "@/lib/events/types"
import { useEffect, useState } from "react"

// Simple component to monitor new-style events
export function TestEventMonitor() {
  const [lastEvent, setLastEvent] = useState<TestAnalysisCompleteEvent | null>(
    null
  )

  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "TEST_ANALYSIS_COMPLETE") {
        console.log("Received new-style generic test event:", event)
        setLastEvent(event as TestAnalysisCompleteEvent)
      }
    })

    return unsubscribe
  }, [])

  if (!lastEvent) return null

  return (
    <div className="p-2 text-xs border-t mt-4 bg-muted/20 rounded">
      <h4 className="font-medium mb-1">Last Generic Test Event</h4>
      <div className="space-y-1">
        <div>
          Test ID: <span className="font-mono">{lastEvent.data.testId}</span>
        </div>
        <div>Issues: {lastEvent.data.issues.length}</div>
        <div>Total items: {lastEvent.data.stats.total}</div>
        <div>Invalid items: {lastEvent.data.stats.invalid}</div>
        <div className="text-xs text-muted-foreground">
          Timestamp: {new Date(lastEvent.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
