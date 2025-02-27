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
                  variant="outline"
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative border-2",
                    isVisualizing && "border-green-500 hover:border-green-600",
                    !isVisualizing && "border-transparent"
                  )}
                  onClick={toggleVisualization}
                  aria-label={
                    isVisualizing ? "Hide Focus Order" : "Show Focus Order"
                  }>
                  <Keyboard className="h-4 w-4" />
                  {stats && isVisualizing && stats.positiveTabIndex > 0 && (
                    <span className="absolute -top-[4px] -right-[4px] bg-red-500 text-white text-xs rounded-full w-2 h-2 flex items-center justify-center ring-2 ring-background">
                      !
                    </span>
                  )}
                  {isVisualizing &&
                    (!stats || stats.positiveTabIndex === 0) && (
                      <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-green-500 rounded-full ring-2 ring-background" />
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
                <p>Focus Order</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem disabled>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>No additional options</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
