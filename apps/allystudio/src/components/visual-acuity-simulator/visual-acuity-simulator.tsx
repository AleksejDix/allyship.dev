import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuLabel,
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
import { Eye, Glasses } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
  VisualAcuityType,
  type PrescriptionStrength
} from "../../lib/vision/visual-acuity-simulator"

export function VisualAcuitySimulator() {
  // Core state
  const [isActive, setIsActive] = useState(false)
  const [acuityType, setAcuityType] = useState<VisualAcuityType>(
    VisualAcuityType.NEARSIGHTED
  )
  const [prescriptionStrength, setPrescriptionStrength] =
    useState<PrescriptionStrength>("moderate")
  const [diopters, setDiopters] = useState(0)

  // Toggle simulation
  const toggleSimulation = useCallback(() => {
    const newState = !isActive
    setIsActive(newState)
    eventBus.publish({
      type: "VISUAL_ACUITY_COMMAND",
      timestamp: Date.now(),
      data: {
        command: newState ? "start" : "stop"
      }
    })
  }, [isActive])

  // Map diopter value to vision settings
  const updateVisionFromDiopters = useCallback(
    (value: number) => {
      // Set vision type based on positive/negative value
      const type =
        value === 0
          ? VisualAcuityType.NORMAL
          : value < 0
            ? VisualAcuityType.NEARSIGHTED
            : VisualAcuityType.FARSIGHTED

      // Set strength based on absolute value
      let strength: PrescriptionStrength

      if (Math.abs(value) === 1) {
        strength = "mild"
      } else if (Math.abs(value) === 2) {
        strength = "moderate"
      } else {
        strength = "severe"
      }

      // Only update if changed
      if (type !== acuityType || strength !== prescriptionStrength) {
        setAcuityType(type)
        setPrescriptionStrength(strength)

        // Publish changes
        eventBus.publish({
          type: "VISUAL_ACUITY_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "setType",
            options: {
              acuityType: type,
              prescriptionStrength: strength
            }
          }
        })
      }
    },
    [acuityType, prescriptionStrength]
  )

  // Handle option selection
  const handleDiopterChange = useCallback(
    (value: number) => {
      setDiopters(value)
      updateVisionFromDiopters(value)
    },
    [updateVisionFromDiopters]
  )

  // Listen for state changes from the content script
  useEffect(() => {
    const cleanup = eventBus.subscribe((event) => {
      if (event.type === "VISUAL_ACUITY_STATE_CHANGE") {
        setIsActive(event.data.isActive)
        setAcuityType(event.data.acuityType as VisualAcuityType)
        if (event.data.prescriptionStrength) {
          setPrescriptionStrength(
            event.data.prescriptionStrength as PrescriptionStrength
          )
        }
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
          type: "VISUAL_ACUITY_COMMAND",
          timestamp: Date.now(),
          data: {
            command: "stop"
          }
        })
      }
    }
  }, [isActive])

  // Get tooltip label
  const getTooltipLabel = (): string => {
    if (acuityType === VisualAcuityType.NORMAL) return "Normal Vision"
    const type =
      acuityType === VisualAcuityType.NEARSIGHTED
        ? "Nearsightedness"
        : "Farsightedness"
    return `${type} (${diopters > 0 ? "+" : ""}${diopters})`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <ContextMenu>
          <ContextMenuTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={cn(
                  "h-8 w-8 relative border-2",
                  isActive && "border-green-500 hover:border-green-600",
                  !isActive &&
                    acuityType === VisualAcuityType.NEARSIGHTED &&
                    "border-slate-300",
                  !isActive &&
                    acuityType === VisualAcuityType.FARSIGHTED &&
                    "border-blue-300",
                  !isActive &&
                    acuityType === VisualAcuityType.NORMAL &&
                    "border-green-300"
                )}
                onClick={toggleSimulation}
                aria-label={getTooltipLabel()}>
                {acuityType === VisualAcuityType.NORMAL ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <Glasses className="h-4 w-4" />
                )}
                {isActive && (
                  <div className="absolute -top-[4px] -right-[4px] w-2 h-2 bg-green-500 rounded-full ring-2 ring-background" />
                )}
              </Button>
            </TooltipTrigger>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <ContextMenuRadioGroup
              value={diopters.toString()}
              onValueChange={(value) => handleDiopterChange(parseInt(value))}>
              <ContextMenuLabel>Diopter</ContextMenuLabel>
              <ContextMenuRadioItem value="3">
                <span className="text-right grow">+3</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="2">
                <span className="text-right grow">+2</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="1">
                <span className="text-right grow">+1</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="0">
                <span className="text-right grow">0</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="-1">
                <span className="text-right grow">-1</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="-2">
                <span className="text-right grow">-2</span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="-3">
                <span className="text-right grow">-3</span>
              </ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
        <TooltipContent>
          <p>{getTooltipLabel()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
