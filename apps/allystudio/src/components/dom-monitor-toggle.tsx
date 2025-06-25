import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger
} from "@/components/ui/context-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Activity, FileText } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

/**
 * Component for toggling the DOM monitor
 */
export function DOMMonitorToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoggingEnabled, setIsLoggingEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize state from storage
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const storage = new Storage()
        const enabled = await storage.get("dom_monitor_enabled")
        const loggingEnabled = await storage.get("dom_monitor_logging_enabled")
        setIsEnabled(!!enabled)
        setIsLoggingEnabled(!!loggingEnabled)
      } catch (error) {
        console.error("Error loading DOM monitor state:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialState()
  }, [])

  // Toggle the DOM monitor
  const toggleDOMMonitor = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newState = !isEnabled
      await sendToBackground({
        name: "toggle-dom-monitor",
        body: { enabled: newState }
      })
      setIsEnabled(newState)
    } catch (error) {
      console.error("Error toggling DOM monitor:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isEnabled, isLoading])

  // Toggle logging
  const toggleLogging = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newState = !isLoggingEnabled
      await sendToBackground({
        name: "toggle-dom-monitor",
        body: { toggleLogging: newState }
      })
      setIsLoggingEnabled(newState)
    } catch (error) {
      console.error("Error toggling DOM monitor logging:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoggingEnabled, isLoading])

  return (
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
                  isEnabled && "border-green-500 hover:border-green-600",
                  !isEnabled && "border-transparent",
                  isLoading && "opacity-50 cursor-wait"
                )}
                onClick={toggleDOMMonitor}
                disabled={isLoading}
                aria-label={
                  isEnabled ? "Stop DOM Monitor" : "Start DOM Monitor"
                }>
                <Activity className="h-4 w-4" />
                {isLoggingEnabled && isEnabled && (
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
              <p>DOM Monitor</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuCheckboxItem
          checked={isLoggingEnabled}
          onClick={toggleLogging}
          disabled={isLoading}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Console Logs</span>
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
