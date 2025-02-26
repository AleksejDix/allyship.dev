import { Button } from "@/components/ui/button"
import { eventBus } from "@/lib/events/event-bus"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  Bug,
  Crosshair,
  Layers,
  MousePointer,
  Zap
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function ElementInspector() {
  const [isInspecting, setIsInspecting] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [deepInspectionMode, setDeepInspectionMode] = useState(false)
  const [clickThroughMode, setClickThroughMode] = useState(true)

  // Toggle inspection mode
  const toggleInspection = useCallback(() => {
    const newState = !isInspecting
    setIsInspecting(newState)
    eventBus.publish({
      type: "INSPECTOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    })
  }, [isInspecting])

  // Toggle debug mode
  const toggleDebugMode = useCallback(() => {
    setDebugMode(!debugMode)
    eventBus.publish({
      type: "INSPECTOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: "toggleDebug"
      }
    })
  }, [debugMode])

  // Toggle deep inspection mode
  const toggleDeepInspectionMode = useCallback(() => {
    setDeepInspectionMode(!deepInspectionMode)
    eventBus.publish({
      type: "INSPECTOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: "toggleDeepInspection"
      }
    })
  }, [deepInspectionMode])

  // Toggle click-through mode
  const toggleClickThroughMode = useCallback(() => {
    setClickThroughMode(!clickThroughMode)
    eventBus.publish({
      type: "INSPECTOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: "toggleClickThrough"
      }
    })
  }, [clickThroughMode])

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
            Inspect Elements{" "}
            {deepInspectionMode ? "(DEEP MODE)" : "(WARP PRECISION)"}
          </>
        )}
      </Button>

      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={toggleDebugMode}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${debugMode ? "bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50" : ""}`}>
          <Bug
            aria-hidden="true"
            className={`h-4 w-4 ${debugMode ? "text-amber-600 dark:text-amber-400" : ""}`}
          />
          {debugMode ? "Debug Mode: ON" : "Debug Mode: OFF"}
        </Button>

        <Button
          onClick={toggleDeepInspectionMode}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${deepInspectionMode ? "bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50" : ""}`}>
          <Layers
            aria-hidden="true"
            className={`h-4 w-4 ${deepInspectionMode ? "text-orange-600 dark:text-orange-400" : ""}`}
          />
          {deepInspectionMode ? "Deep Mode: ON" : "Deep Mode: OFF"}
        </Button>

        <Button
          onClick={toggleClickThroughMode}
          variant="outline"
          size="sm"
          className={`flex items-center gap-2 ${clickThroughMode ? "bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/30 dark:hover:bg-cyan-900/50" : ""}`}>
          <MousePointer
            aria-hidden="true"
            className={`h-4 w-4 ${clickThroughMode ? "text-cyan-600 dark:text-cyan-400" : ""}`}
          />
          {clickThroughMode ? "Click-Through: ON" : "Click-Through: OFF"}
        </Button>

        {debugMode && (
          <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
            <p>
              <strong>Debug mode is ON</strong>. Check browser console for
              element details.
            </p>
            <p className="mt-1">
              Debug features include clickable element references, visibility
              checks, selector copying, and DOM path visualization.
            </p>
          </div>
        )}
      </div>

      {isInspecting && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Move your cursor over elements to highlight them with zero latency.
            {deepInspectionMode
              ? " Click on elements to select them precisely. Deep mode targets the smallest element at each position."
              : " The inspector uses GPU-accelerated transforms and generates extremely precise selectors."}
          </p>
          <div className="flex items-start gap-2 p-2 text-xs bg-muted/50 rounded-md">
            <AlertCircle
              aria-hidden="true"
              className="h-4 w-4 text-amber-500 shrink-0 mt-0.5"
            />
            <p className="text-muted-foreground">
              {deepInspectionMode
                ? "Deep Inspection Mode is enabled. This mode helps you select deeply nested elements by targeting the smallest element at each position. Click on elements to select them precisely."
                : "Using GPU acceleration and multi-tiered selector generation for maximum speed and precision. Generates unique, robust selectors using a 12-step algorithm."}
            </p>
          </div>
          {clickThroughMode && (
            <div className="text-xs text-muted-foreground mt-2 p-2 bg-cyan-100/50 dark:bg-cyan-900/20 rounded-md">
              <p>
                <strong>Click-through mode is ON</strong>. You can now interact
                with elements underneath the highlight.
              </p>
              <p className="mt-1">
                This allows you to click links, buttons, and other interactive
                elements while inspecting them.
              </p>
            </div>
          )}
          {debugMode && (
            <div className="flex items-start gap-2 p-2 text-xs bg-amber-100/50 dark:bg-amber-900/20 rounded-md">
              <Bug
                aria-hidden="true"
                className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5"
              />
              <p className="text-muted-foreground">
                Debug mode is enabled. Open your browser console (F12) to see
                detailed information about highlighted elements, including
                clickable references, visibility checks, and warnings about
                potential targeting issues. You can also click on the tooltip to
                copy the selector to your clipboard.
              </p>
            </div>
          )}
          {deepInspectionMode && (
            <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded-md">
              <p>
                <strong>Deep inspection mode is ON</strong>. Click to select the
                exact element you want to inspect, even when deeply nested.
              </p>
              <p className="mt-1">
                The DOM path will be shown in the tooltip to help you understand
                the element's position in the hierarchy.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
