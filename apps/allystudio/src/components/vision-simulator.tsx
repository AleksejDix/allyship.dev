import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Eye, Palette } from "lucide-react"
import { useCallback, useEffect, useState } from "react"

// Simple types
type ColorVision = 'normal' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia'

const COLOR_LABELS: Record<ColorVision, string> = {
  normal: 'Normal',
  protanopia: 'Red-blind',
  deuteranopia: 'Green-blind',
  tritanopia: 'Blue-blind',
  achromatopsia: 'No color'
}

export function VisionSimulator() {
  // State
  const [colorVision, setColorVision] = useState<ColorVision>('normal')
  const [diopters, setDiopters] = useState(0)
  const [distance, setDistance] = useState(0.6) // 60cm default
  const [isActive, setIsActive] = useState(false)

  // Send message to content script
  const sendToContentScript = useCallback(async (action: string, data: any) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      if (tab.id) {
        await chrome.tabs.sendMessage(tab.id, {
          type: "VISION_SIMULATOR",
          action,
          data
        })
      }
    } catch (error) {
      console.error("[vision-simulator] Failed to send message:", error)
    }
  }, [])

  // Apply current settings
  const applySettings = useCallback(async () => {
    if (!isActive) {
      await sendToContentScript("STOP_ALL", {})
      return
    }

    // Color vision
    await sendToContentScript("SET_COLOR_VISION", { visionType: colorVision })

    // Diopter blur
    await sendToContentScript("SET_DIOPTER", { diopters, distance })
  }, [isActive, colorVision, diopters, distance, sendToContentScript])

  // Apply settings when they change
  useEffect(() => {
    applySettings()
  }, [applySettings])

  // Reset to normal
  const reset = async () => {
    setColorVision('normal')
    setDiopters(0)
    // Will trigger applySettings via useEffect
  }

  // Quick presets
  const presets = [
    { name: 'Myopia -2D', color: 'normal' as ColorVision, diopter: -2 },
    { name: 'Red-blind', color: 'protanopia' as ColorVision, diopter: 0 },
    { name: 'Green-blind', color: 'deuteranopia' as ColorVision, diopter: 0 },
    { name: 'Grayscale', color: 'achromatopsia' as ColorVision, diopter: 0 },
  ]

  const hasAnySimulation = colorVision !== 'normal' || diopters !== 0

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`h-8 w-8 relative ${
            isActive && hasAnySimulation
              ? 'border-blue-500 bg-blue-50'
              : hasAnySimulation
                ? 'border-orange-400'
                : 'border-gray-300'
          }`}
        >
          {colorVision !== 'normal' ? (
            <Palette className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
          {isActive && hasAnySimulation && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Vision Simulator</h3>
            <div className="flex gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={!hasAnySimulation}
              />
              <Button variant="ghost" size="sm" onClick={reset}>
                Reset
              </Button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Quick presets</label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setColorVision(preset.color)
                    setDiopters(preset.diopter)
                  }}
                  className="h-8 text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Color vision */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color vision</label>
            <div className="grid grid-cols-2 gap-1">
              {(Object.keys(COLOR_LABELS) as ColorVision[]).map((key) => (
                <Button
                  key={key}
                  variant={colorVision === key ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setColorVision(key)}
                  className="h-8 text-xs justify-start"
                >
                  {COLOR_LABELS[key]}
                </Button>
              ))}
            </div>
          </div>

          {/* Diopter blur */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Blur strength</label>
              <span className="text-xs text-gray-500">
                {diopters > 0 ? '+' : ''}{diopters}D
              </span>
            </div>
            <Slider
              value={[diopters]}
              onValueChange={([value]) => setDiopters(value)}
              min={-5}
              max={5}
              step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Myopia</span>
              <span>Normal</span>
              <span>Hyperopia</span>
            </div>
          </div>

          {/* Viewing distance */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Distance</label>
              <span className="text-xs text-gray-500">
                {Math.round(distance * 100)}cm
              </span>
            </div>
            <Slider
              value={[distance]}
              onValueChange={([value]) => setDistance(value)}
              min={0.2}
              max={3.0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Phone</span>
              <span>Laptop</span>
              <span>TV</span>
            </div>
          </div>

          {/* Status */}
          {hasAnySimulation && (
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
              {colorVision !== 'normal' && (
                <div>Color: {COLOR_LABELS[colorVision]}</div>
              )}
              {diopters !== 0 && (
                <div>
                  Blur: {diopters > 0 ? '+' : ''}{diopters}D at {Math.round(distance * 100)}cm
                </div>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
