import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
import { Scan } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function ElementOutliner() {
  const [isOutlining, setIsOutlining] = useState(false)

  // Toggle outlining mode
  const toggleOutlining = useCallback(() => {
    const newState = !isOutlining
    setIsOutlining(newState)

    eventBus.publish({
      type: "OUTLINER_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    })
  }, [isOutlining])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isOutlining) {
        eventBus.publish({
          type: "OUTLINER_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        })
      }
    }
  }, [isOutlining])

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
                    isOutlining && "border-blue-500 hover:border-blue-600",
                    !isOutlining && "border-transparent"
                  )}
                  onClick={toggleOutlining}
                  aria-label={
                    isOutlining ? "Stop Element Outlining" : "Start Element Outlining"
                  }
                >
                  <Scan className="h-4 w-4" />
                  {isOutlining && (
                    <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-blue-500 rounded-full ring-2 ring-background" />
                  )}
                  {/* Options indicator triangle */}
                  <svg
                    className="absolute bottom-0.5 right-0.5 !w-1.5 !h-1.5"
                    viewBox="0 0 4 4"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.5 3.5 L3.5 3.5 C3.75 3.5 3.75 3.25 3.5 3 L3.5 0.5 C3.5 0.25 3.25 0.25 3 0.5 Z"
                      fill="currentColor"
                      opacity="0.8"
                    />
                  </svg>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Element Outliner</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem disabled>
            <Scan className="mr-2 h-4 w-4" />
            <span>No additional options</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
