import { eventBus } from "@/lib/events/event-bus"
import type { TestAnalysisCompleteEvent } from "@/lib/events/types"
import { cn } from "@/lib/utils"
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

  // Handle both legacy and ACT rule formats
  const hasLegacyFormat = lastEvent.data.issues !== undefined
  const hasACTFormat = lastEvent.data.results !== undefined

  return (
    <div className="p-3 text-xs border-t mt-4 bg-muted/20 rounded">
      <h4 className="font-medium mb-2">Test Summary</h4>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-muted-foreground">Test:</span>{" "}
            <span className="font-mono font-medium">
              {lastEvent.data.testType || lastEvent.data.testId}
            </span>
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(lastEvent.timestamp).toLocaleTimeString()}
          </div>
        </div>

        {hasLegacyFormat && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 bg-card rounded border text-center">
              <div className="text-lg font-medium">
                {lastEvent.data.issues?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Issues</div>
            </div>
            <div className="p-2 bg-card rounded border text-center">
              <div className="text-lg font-medium">
                {lastEvent.data.stats?.total || 0}
              </div>
              <div className="text-xs text-muted-foreground">Total Items</div>
            </div>
            <div className="p-2 bg-card rounded border text-center">
              <div className="text-lg font-medium">
                {lastEvent.data.stats?.invalid || 0}
              </div>
              <div className="text-xs text-muted-foreground">Invalid</div>
            </div>
          </div>
        )}

        {hasACTFormat && (
          <>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="p-2 bg-card rounded border text-center">
                <div className="text-lg font-medium">
                  {lastEvent.data.results?.summary?.rules?.total || 0}
                </div>
                <div className="text-xs text-muted-foreground">Rules</div>
              </div>
              <div className="p-2 bg-card rounded border text-center">
                <div className="text-lg font-medium text-destructive">
                  {lastEvent.data.results?.summary?.rules?.failed || 0}
                </div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="p-2 bg-card rounded border text-center">
                <div className="text-lg font-medium text-success">
                  {lastEvent.data.results?.summary?.rules?.passed || 0}
                </div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
            </div>

            {lastEvent.data.results?.summary?.wcagCompliance && (
              <div className="mt-2 p-2 bg-card rounded border">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium">WCAG Compliance:</div>
                  <div className="flex gap-2">
                    <div
                      className={cn(
                        "text-center text-xs px-2 py-1 rounded-full font-medium",
                        lastEvent.data.results.summary.wcagCompliance.A
                          ? "bg-success text-white"
                          : "bg-destructive text-white"
                      )}>
                      A
                    </div>
                    <div
                      className={cn(
                        "text-center text-xs px-2 py-1 rounded-full font-medium",
                        lastEvent.data.results.summary.wcagCompliance.AA
                          ? "bg-success text-white"
                          : "bg-destructive text-white"
                      )}>
                      AA
                    </div>
                    <div
                      className={cn(
                        "text-center text-xs px-2 py-1 rounded-full font-medium",
                        lastEvent.data.results.summary.wcagCompliance.AAA
                          ? "bg-success text-white"
                          : "bg-destructive text-white"
                      )}>
                      AAA
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
