import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
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
import { ColorVisionType } from "@/lib/vision/color-vision-simulator"
import { Eye } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

export function ColorVisionSimulator() {
  // Core state
  const [isActive, setIsActive] = useState(false)
  const [visionType, setVisionType] = useState<ColorVisionType>(
    ColorVisionType.PROTANOPIA
  )

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    const newState = !isActive
    setIsActive(newState)
    eventBus.publish({
      type: "VISION_SIMULATOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    })
  }, [isActive])

  // Set vision type
  const handleVisionTypeChange = useCallback((type: ColorVisionType) => {
    setVisionType(type)
    eventBus.publish({
      type: "VISION_SIMULATOR_COMMAND",
      timestamp: Date.now(),
      data: {
        command: "setType",
        options: {
          visionType: type
        }
      }
    })
  }, [])

  // Listen for state changes from the content script
  useEffect(() => {
    const cleanup = eventBus.subscribe((event) => {
      if (event.type === "VISION_SIMULATOR_STATE_CHANGE") {
        setIsActive(event.data.isActive)
        setVisionType(event.data.visionType as ColorVisionType)
      }
    })

    return cleanup
  }, [])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (isActive) {
        // Stop simulation in content script
        eventBus.publish({
          type: "VISION_SIMULATOR_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        })
      }
    }
  }, [isActive])

  // Get the tool label based on current state
  const getButtonDetails = () => {
    if (isActive) {
      const label = `Stop ${visionType} Simulation`
      return { label }
    }

    const label =
      visionType === ColorVisionType.NORMAL
        ? "Vision Simulator"
        : `Simulate ${visionType}`

    return { label }
  }

  const { label } = getButtonDetails()

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
                    isActive && "border-green-500 hover:border-green-600",
                    !isActive &&
                      visionType === ColorVisionType.PROTANOPIA &&
                      "border-red-300",
                    !isActive &&
                      visionType === ColorVisionType.DEUTERANOPIA &&
                      "border-green-300",
                    !isActive &&
                      visionType === ColorVisionType.TRITANOPIA &&
                      "border-blue-300",
                    !isActive &&
                      visionType === ColorVisionType.ACHROMATOPSIA &&
                      "border-gray-300",
                    !isActive &&
                      visionType === ColorVisionType.NORMAL &&
                      "border-transparent"
                  )}
                  onClick={toggleSimulation}
                  aria-label={label}>
                  <Eye className="h-4 w-4" />
                  {isActive && (
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
                <p>Color Vision Simulator</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          <ContextMenuRadioGroup
            value={visionType}
            onValueChange={(value) =>
              handleVisionTypeChange(value as ColorVisionType)
            }>
            <ContextMenuRadioItem value={ColorVisionType.NORMAL}>
              Normal Vision
            </ContextMenuRadioItem>
            <ContextMenuSeparator />
            <ContextMenuRadioItem value={ColorVisionType.PROTANOPIA}>
              <div className="flex flex-col">
                <span>Protanopia</span>
              </div>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value={ColorVisionType.DEUTERANOPIA}>
              <div className="flex flex-col">
                <span>Deuteranopia</span>
              </div>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value={ColorVisionType.TRITANOPIA}>
              <div className="flex flex-col">
                <span>Tritanopia</span>
              </div>
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value={ColorVisionType.ACHROMATOPSIA}>
              <div className="flex flex-col">
                <span>Achromatopsia</span>
              </div>
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  )
}
