// Color vision deficiency types
export type ColorVisionType =
  | 'protanopia'      // Red-blind
  | 'deuteranopia'    // Green-blind
  | 'tritanopia'      // Blue-blind
  | 'achromatopsia'   // Total color blindness
  | 'normal'          // Normal vision (no simulation)

// Preset constants for common color vision types
export const COLOR_VISION_PRESETS = {
  PROTANOPIA: 'protanopia' as const,
  DEUTERANOPIA: 'deuteranopia' as const,
  TRITANOPIA: 'tritanopia' as const,
  ACHROMATOPSIA: 'achromatopsia' as const,
  NORMAL: 'normal' as const
} as const

// State for the simulator
export interface SimulatorState {
  isActive: boolean
  visionType: ColorVisionType
}

// Configuration options for the simulator
export interface SimulatorOptions {
  /** Custom overlay ID (default: "color-vision-simulator-overlay") */
  overlayId?: string
  /** Custom styles ID (default: "color-vision-simulator-styles") */
  stylesId?: string
  /** Custom z-index for overlay (default: 2147483647) */
  zIndex?: number
  /** Whether to use direct HTML filter for better performance (default: true) */
  useDirectFilter?: boolean
}

// Event types for state changes
export interface StateChangeEvent {
  isActive: boolean
  visionType: ColorVisionType
}

// Event callback type
export type StateChangeCallback = (state: StateChangeEvent) => void
