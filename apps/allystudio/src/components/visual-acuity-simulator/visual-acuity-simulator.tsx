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
import { Eye, Glasses, Info } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

import {
  VisualAcuityType,
  type PrescriptionStrength
} from "../../lib/vision/visual-acuity-simulator"

// Specific string values to represent our diopter options
// This ensures + signs are correctly preserved
type DiopterValue = "3" | "2" | "1" | "0" | "-1" | "-2" | "-3"

// Standard viewing distance for computer use
const VIEWING_DISTANCE = 50 // cm

export function VisualAcuitySimulator() {
  // Core state
  const [isActive, setIsActive] = useState(false)
  const [acuityType, setAcuityType] = useState<VisualAcuityType>(
    VisualAcuityType.NEARSIGHTED
  )
  const [prescriptionStrength, setPrescriptionStrength] =
    useState<PrescriptionStrength>("moderate")
  const [diopters, setDiopters] = useState(0)
  const [showInfo, setShowInfo] = useState(false)

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
  const updateVisionSettings = useCallback(
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

  // Set the diopter value and update vision settings
  const setDiopterValue = useCallback(
    (value: DiopterValue) => {
      // Parse the string value to number
      const numValue = parseInt(value, 10)

      setDiopters(numValue)
      updateVisionSettings(numValue)
    },
    [updateVisionSettings]
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
    return `${type} (${diopters > 0 ? "+" : ""}${diopters}D)`
  }

  // Calculate the actual dioptric blur for a given prescription
  const getDioptricBlur = (refractiveError: number): number => {
    // Formula: D = 100/d - P
    // Where D = dioptric blur, d = viewing distance in cm, P = refractive error
    return Math.round((100 / VIEWING_DISTANCE - refractiveError) * 10) / 10
  }

  // Get visual explanation of the blur based on diopter value
  const getBlurExplanation = (refractiveError: number): string => {
    // Special case for normal vision
    if (refractiveError === 0) {
      return "No blur"
    }

    // Calculate the dioptric blur
    const dioptricBlur = getDioptricBlur(refractiveError)
    const absBlur = Math.abs(dioptricBlur)

    // Return appropriate description based on blur amount
    if (absBlur < 0.5) {
      return "Minimal blur"
    } else if (absBlur < 1.5) {
      return "Slight blur"
    } else if (absBlur < 2.5) {
      return "Moderate blur"
    } else if (absBlur < 3.5) {
      return "Significant blur"
    } else {
      return "Severe blur"
    }
  }

  // Format diopter value for display (with sign)
  const formatDiopters = (value: number): string => {
    return `${value > 0 ? "+" : ""}${value}D`
  }

  // Handler for radio group value change
  const handleRadioValueChange = (value: string) => {
    setDiopterValue(value as DiopterValue)
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

          <ContextMenuContent className="w-52 min-w-[240px]">
            <div className="px-4 py-1.5 flex justify-between items-center">
              <div className="text-sm font-medium">Vision Simulator</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowInfo(!showInfo)}>
                <Info className="h-3.5 w-3.5" />
              </Button>
            </div>

            {showInfo && (
              <div className="px-4 py-2 border-t text-xs text-muted-foreground">
                <p className="mb-1">
                  Using <strong>scientifically accurate</strong> diopter blur
                  calculated at {VIEWING_DISTANCE}cm viewing distance.
                </p>
                <p>
                  Formula: D = 100/d - P<br />
                  Where D = dioptric blur, d = viewing distance (cm), P =
                  refractive error
                </p>
              </div>
            )}

            <ContextMenuSeparator />

            <ContextMenuRadioGroup
              value={diopters.toString()}
              onValueChange={handleRadioValueChange}>
              <div className="pt-2 px-4 pb-0.5">
                <div className="text-sm font-medium">Farsightedness</div>
              </div>
              <ContextMenuRadioItem value="3" className="px-10 relative">
                {formatDiopters(3)}
                {diopters === 3 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(3)}
                </span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="2" className="px-10 relative">
                {formatDiopters(2)}
                {diopters === 2 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(2)}
                </span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="1" className="px-10 relative">
                {formatDiopters(1)}
                {diopters === 1 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(1)}
                </span>
              </ContextMenuRadioItem>

              <ContextMenuSeparator />

              {/* Normal Vision */}
              <ContextMenuRadioItem value="0" className="px-10 relative">
                0 - Normal
                {diopters === 0 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  No blur
                </span>
              </ContextMenuRadioItem>

              <ContextMenuSeparator />

              <div className="pt-2 px-4 pb-0.5">
                <div className="text-sm font-medium">Nearsightedness</div>
              </div>
              <ContextMenuRadioItem value="-1" className="px-10 relative">
                {formatDiopters(-1)}
                {diopters === -1 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(-1)}
                </span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="-2" className="px-10 relative">
                {formatDiopters(-2)}
                {diopters === -2 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(-2)}
                </span>
              </ContextMenuRadioItem>
              <ContextMenuRadioItem value="-3" className="px-10 relative">
                {formatDiopters(-3)}
                {diopters === -3 && (
                  <div className="absolute left-4 w-2.5 h-2.5 bg-white rounded-full" />
                )}
                <span className="absolute right-4 text-xs text-muted-foreground">
                  {getBlurExplanation(-3)}
                </span>
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
