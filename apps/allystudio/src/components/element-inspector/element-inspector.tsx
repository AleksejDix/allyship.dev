import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger
} from "@/components/ui/context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { eventBus } from "@/lib/events/event-bus"
import { cn } from "@/lib/utils"
import {
  Bug,
  Crosshair,
  Layers,
  Locate,
  LocateOff,
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

    // Restart inspection if it's currently active
    if (isInspecting) {
      // Stop inspection
      eventBus.publish({
        type: "INSPECTOR_COMMAND",
        timestamp: Date.now(),
        data: {
          command: "stop"
        }
      })

      // Start inspection again
      setTimeout(() => {
        eventBus.publish({
          type: "INSPECTOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "start"
          }
        })
      }, 50) // Small delay to ensure stop completes first
    }
  }, [debugMode, isInspecting])

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

  // Start inspection with specific mode
  const startWithMode = useCallback(
    (mode: "default" | "deep" | "debug") => {
      // First ensure inspection is stopped
      if (isInspecting) {
        eventBus.publish({
          type: "INSPECTOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        })
      }

      // Set modes based on selection
      const newDeepMode = mode === "deep"
      const newDebugMode = mode === "debug"

      if (deepInspectionMode !== newDeepMode) {
        setDeepInspectionMode(newDeepMode)
        eventBus.publish({
          type: "INSPECTOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "toggleDeepInspection"
          }
        })
      }

      if (debugMode !== newDebugMode) {
        setDebugMode(newDebugMode)
        eventBus.publish({
          type: "INSPECTOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "toggleDebug"
          }
        })
      }

      // Start inspection
      setIsInspecting(true)
      eventBus.publish({
        type: "INSPECTOR_COMMAND",
        timestamp: Date.now(),
        data: {
          command: "start"
        }
      })
    },
    [isInspecting, deepInspectionMode, debugMode]
  )

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

  // Get the appropriate icon and label based on current state
  const getButtonDetails = () => {
    if (isInspecting) {
      return {
        icon: <LocateOff className="h-4 w-4" />,
        label: "Stop Inspecting",
        variant: "destructive" as const
      }
    }

    if (deepInspectionMode) {
      return {
        icon: <Layers className="h-4 w-4 text-orange-500" />,
        label: "Start Deep Inspection",
        variant: "outline" as const
      }
    }

    if (debugMode) {
      return {
        icon: <Bug className="h-4 w-4 text-amber-500" />,
        label: "Start Debug Inspection",
        variant: "outline" as const
      }
    }

    if (!clickThroughMode) {
      return {
        icon: <MousePointer className="h-4 w-4 text-cyan-500" />,
        label: "Start Inspection (Click-Through Off)",
        variant: "outline" as const
      }
    }

    return {
      icon: <Locate className="h-4 w-4" />,
      label: "Inspect Elements",
      variant: "outline" as const
    }
  }

  const { icon, label, variant } = getButtonDetails()

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isInspecting ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative",
                    isInspecting && "bg-green-500 hover:bg-green-600"
                  )}
                  onClick={toggleInspection}
                  aria-label={label}>
                  {icon}
                  {isInspecting && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full ring-1 ring-background" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Element Inspector</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={() => startWithMode("default")}>
            <Zap className="mr-2 h-4 w-4" />
            <span>Standard Inspection</span>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => startWithMode("deep")}>
            <Layers className="mr-2 h-4 w-4 text-orange-500" />
            <span>Deep Inspection</span>
            {deepInspectionMode && (
              <span className="ml-auto text-xs text-muted-foreground">
                Active
              </span>
            )}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => startWithMode("debug")}>
            <Bug className="mr-2 h-4 w-4 text-amber-500" />
            <span>Debug Inspection</span>
            {debugMode && (
              <span className="ml-auto text-xs text-muted-foreground">
                Active
              </span>
            )}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={toggleClickThroughMode}>
            <MousePointer className="mr-2 h-4 w-4 text-cyan-500" />
            <span>Click-Through</span>
            <span className="ml-auto text-xs text-muted-foreground">
              {clickThroughMode ? "On" : "Off"}
            </span>
          </ContextMenuItem>
          {isInspecting && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem
                onClick={toggleInspection}
                className="text-destructive">
                <Crosshair className="mr-2 h-4 w-4 text-destructive" />
                <span>Stop Inspection</span>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
