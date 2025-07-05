import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Activity } from "lucide-react"
import { useEffect, useState } from "react"

import { Storage } from "@plasmohq/storage"

/**
 * Component for toggling the DOM monitor
 */
export function DOMMonitorToggle() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const storage = new Storage()
        const enabled = await storage.get("dom_monitor_enabled")
        setIsEnabled(!!enabled)
      } catch (error) {
        console.error("Error checking DOM monitor status:", error)
      }
    }

    checkStatus()
  }, [])

  const toggleDOMMonitor = async () => {
    setIsLoading(true)
    try {
      const storage = new Storage()
      const newState = !isEnabled

      await storage.set("dom_monitor_enabled", newState)
      setIsEnabled(newState)

      // Send message to content script
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: newState ? "START_DOM_MONITOR" : "STOP_DOM_MONITOR"
          })
        }
      })
    } catch (error) {
      console.error("Error toggling DOM monitor:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
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
            aria-label={isEnabled ? "Stop DOM Monitor" : "Start DOM Monitor"}>
            <Activity className="h-4 w-4" />
            {isEnabled && (
              <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-green-500 rounded-full ring-2 ring-background" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>DOM Monitor</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
