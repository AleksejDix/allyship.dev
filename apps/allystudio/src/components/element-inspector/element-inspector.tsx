import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
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

  // Get the appropriate label based on current state
  const getButtonDetails = () => {
    if (isInspecting) {
      return {
        label: "Stop Inspecting",
        variant: "destructive" as const
      }
    }

    if (deepInspectionMode) {
      return {
        label: "Start Deep Inspection",
        variant: "outline" as const
      }
    }

    if (debugMode) {
      return {
        label: "Start Debug Inspection",
        variant: "outline" as const
      }
    }

    if (!clickThroughMode) {
      return {
        label: "Start Inspection (Click-Through Off)",
        variant: "outline" as const
      }
    }

    return {
      label: "Inspect Elements",
      variant: "outline" as const
    }
  }

  const { label, variant } = getButtonDetails()

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative border-2",
                    isInspecting && "border-green-500 hover:border-green-600",
                    !isInspecting && debugMode && "border-amber-500",
                    !isInspecting && deepInspectionMode && "border-orange-500",
                    !isInspecting && !clickThroughMode && "border-cyan-500",
                    !isInspecting &&
                      !debugMode &&
                      !deepInspectionMode &&
                      clickThroughMode &&
                      "border-transparent"
                  )}
                  onClick={toggleInspection}
                  aria-label={label}>
                  <Locate className="h-4 w-4" />
                  {isInspecting && (
                    <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-green-500 rounded-full ring-2 ring-background " />
                  )}
                  {/* Options indicator triangle - always visible */}

                  <svg
                    className="absolute bottom-0.5 right-0.5 !w-1.5 !h-1.5"
                    viewBox="0 0 4 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M0.5 3.5 L3.5 3.5 C3.75 3.5 3.75 3.25 3.5 3 L3.5 0.5 C3.5 0.25 3.25 0.25 3 0.5 Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Element Inspector</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-56">
          <ContextMenuRadioGroup
            value={
              debugMode ? "debug" : deepInspectionMode ? "deep" : "standard"
            }>
            <ContextMenuRadioItem
              value="standard"
              onClick={() => startWithMode("default")}>
              <Zap className="mr-2 h-4 w-4" />
              <span>Standard Inspection</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              value="deep"
              onClick={() => startWithMode("deep")}>
              <Layers className="mr-2 h-4 w-4 text-orange-500" />
              <span>Deep Inspection</span>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              value="debug"
              onClick={() => startWithMode("debug")}>
              <Bug className="mr-2 h-4 w-4 text-amber-500" />
              <span>Debug Inspection</span>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={clickThroughMode}
            onClick={toggleClickThroughMode}>
            <MousePointer className="mr-2 h-4 w-4 text-cyan-500" />
            <span>Click-Through</span>
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
