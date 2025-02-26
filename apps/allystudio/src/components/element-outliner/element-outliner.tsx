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
import { Grid3X3, Layers } from "lucide-react"
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
        // Stop outlining in content script
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
                  variant={isOutlining ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-8 w-8 relative",
                    isOutlining && "bg-amber-500 hover:bg-amber-600"
                  )}
                  onClick={toggleOutlining}
                  aria-label={
                    isOutlining ? "Stop Element Outlining" : "Outline Elements"
                  }>
                  <Grid3X3 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>
                  {isOutlining ? "Stop Element Outlining" : "Outline Elements"}
                </p>
                <p className="text-xs mt-1">
                  Visualize all elements with colored outlines
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-56">
          <ContextMenuItem onClick={toggleOutlining}>
            <Layers className="mr-2 h-4 w-4" />
            <span>{isOutlining ? "Stop Outlining" : "Start Outlining"}</span>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() =>
              window.open("https://github.com/mrmrs/pesticide", "_blank")
            }>
            <Grid3X3 className="mr-2 h-4 w-4 text-amber-500" />
            <span>About Element Outlining</span>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
