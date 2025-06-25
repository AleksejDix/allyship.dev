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
import type {
  FocusOrderCommandEvent,
  FocusOrderStatsEvent
} from "@/lib/events/types"
import { cn } from "@/lib/utils"
import { Keyboard, AlertTriangle, CheckCircle } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function FocusOrderVisualizer() {
  const [isVisualizing, setIsVisualizing] = useState(false)
  const [stats, setStats] = useState<{
    total: number
    positiveTabIndex: number
  } | null>(null)

  // Toggle visualization mode
  const toggleVisualization = useCallback(() => {
    const newState = !isVisualizing
    setIsVisualizing(newState)

    // Create a properly typed event
    const event: FocusOrderCommandEvent = {
      type: "FOCUS_ORDER_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    }

    eventBus.publish(event)
  }, [isVisualizing])

  // Listen for stats updates
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "FOCUS_ORDER_STATS") {
        const statsEvent = event as FocusOrderStatsEvent
        setStats(statsEvent.data)
      }
    })

    return unsubscribe
  }, [])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isVisualizing) {
        // Stop visualization in content script
        const event: FocusOrderCommandEvent = {
          type: "FOCUS_ORDER_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        }

        eventBus.publish(event)
      }
    }
  }, [isVisualizing])

  // Determine status for better UX feedback
  const hasIssues = stats && stats.positiveTabIndex > 0
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
                    "h-8 w-8 relative border-2 transition-all duration-200",
                    isVisualizing && "border-blue-500 hover:border-blue-600 bg-blue-50 dark:bg-blue-950",
                    !isVisualizing && "border-transparent hover:border-gray-300"
                  )}
                  onClick={toggleVisualization}
                  aria-label={
                    isVisualizing
                      ? `Hide Focus Order (${stats?.total || 0} elements)`
                      : "Show Focus Order"
                  }>
                                    {/* Main icon */}
                  <Keyboard className="h-4 w-4" />

                  {/* Status indicator */}
                  {stats && isVisualizing && (
                    <div className={cn(
                      "absolute -top-[4px] -right-[4px] w-3 h-3 rounded-full ring-2 ring-background flex items-center justify-center",
                      hasIssues ? "bg-amber-500" : "bg-green-500"
                    )}>
                      {hasIssues && (
                        <span className="text-white text-xs font-bold leading-none">!</span>
                      )}
                    </div>
                  )}

                  {/* Options indicator triangle - always visible */}
                  <svg
                    className="absolute bottom-0.5 right-0.5 !w-1.5 !h-1.5 opacity-60"
                    viewBox="0 0 4 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true">
                    <path
                      d="M0.5 3.5 L3.5 3.5 C3.75 3.5 3.75 3.25 3.5 3 L3.5 0.5 C3.5 0.25 3.25 0.25 3 0.5 Z"
                      fill="currentColor"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs">
                <div className="space-y-1">
                  <p className="font-medium">Focus Order Visualizer</p>
                  {stats && isVisualizing && (
                    <div className="text-xs text-muted-foreground space-y-0.5">
                      <p>{stats.total} focusable elements</p>
                      {hasIssues ? (
                        <p className="text-amber-600 dark:text-amber-400">
                          ⚠️ {stats.positiveTabIndex} elements with positive tabindex
                        </p>
                      ) : (
                        <p className="text-green-600 dark:text-green-400">
                          ✓ No tabindex issues found
                        </p>
                      )}
                    </div>
                  )}
                  {!isVisualizing && (
                    <p className="text-xs text-muted-foreground">
                      Click to show numbered focus sequence
                    </p>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuItem onClick={toggleVisualization}>
            <Keyboard className="mr-2 h-4 w-4" aria-hidden="true" />
            <span>{isVisualizing ? "Hide" : "Show"} Focus Order</span>
          </ContextMenuItem>
          {stats && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem disabled>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">Total Elements</span>
                  <span className="text-sm font-medium">{stats.total}</span>
                </div>
              </ContextMenuItem>
              <ContextMenuItem disabled>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm">Positive Tabindex</span>
                  <span className={cn(
                    "text-sm font-medium",
                    stats.positiveTabIndex > 0 ? "text-amber-600 dark:text-amber-400" : "text-green-600 dark:text-green-400"
                  )}>
                    {stats.positiveTabIndex}
                  </span>
                </div>
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
