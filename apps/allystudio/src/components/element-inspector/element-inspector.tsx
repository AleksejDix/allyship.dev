import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import { AlertCircle, Crosshair, Zap } from "lucide-react"
import { useEffect, useState } from "react"

export function ElementInspector() {
  const [isInspecting, setIsInspecting] = useState(false)

  // Toggle inspection mode
  const toggleInspection = () => {
    const newState = !isInspecting
    setIsInspecting(newState)

    // Send command to content script
    eventBus.publish({
      type: "INSPECTOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    })
  }

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isInspecting) {
        // Stop inspection in content script
        eventBus.publish({
          type: "INSPECTOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        })
      }
    }
  }, [isInspecting])

  return (
    <div className="p-2 space-y-2">
      <Button
        onClick={toggleInspection}
        variant={isInspecting ? "destructive" : "default"}
        className="w-full flex items-center gap-2">
        {isInspecting ? (
          <>
            <Crosshair aria-hidden="true" className="h-4 w-4" />
            Stop Inspecting
          </>
        ) : (
          <>
            <Zap aria-hidden="true" className="h-4 w-4" />
            Inspect Elements (Extreme Performance)
          </>
        )}
      </Button>

      {isInspecting && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Move your cursor over elements to highlight them with zero latency.
            The inspector now uses direct DOM manipulation for instant feedback
            with no delay.
          </p>
          <div className="flex items-start gap-2 p-2 text-xs bg-muted/50 rounded-md">
            <AlertCircle
              aria-hidden="true"
              className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"
            />
            <p className="text-muted-foreground">
              Using direct DOM manipulation and pointer events for maximum
              speed. Bypasses React rendering for instant highlights at native
              browser speed, similar to Chrome DevTools.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
