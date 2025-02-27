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
import { ArrowUpDown, Keyboard } from "lucide-react"
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

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isVisualizing ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative",
                    isVisualizing && "bg-blue-600 hover:bg-blue-700"
                  )}
                  onClick={toggleVisualization}
                  aria-label={
                    isVisualizing ? "Hide Focus Order" : "Show Focus Order"
                  }>
                  <Keyboard className="h-4 w-4" />
                  {stats && isVisualizing && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {stats.positiveTabIndex > 0 ? "!" : ""}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{isVisualizing ? "Hide Focus Order" : "Show Focus Order"}</p>
                <p className="text-xs mt-1">
                  Visualize the tab order of interactive elements
                </p>
                {stats && (
                  <div className="text-xs mt-2 space-y-1">
                    <p>Total focusable elements: {stats.total}</p>
                    {stats.positiveTabIndex > 0 && (
                      <p className="text-red-500">
                        Warning: {stats.positiveTabIndex} elements with positive
                        tabindex
                      </p>
                    )}
                  </div>
                )}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={toggleVisualization}>
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <span>
              {isVisualizing ? "Hide Focus Order" : "Show Focus Order"}
            </span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() =>
              window.open(
                "https://www.w3.org/WAI/WCAG21/Understanding/focus-order.html",
                "_blank"
              )
            }>
            <Keyboard className="mr-2 h-4 w-4 text-blue-500" />
            <span>About Focus Order</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
