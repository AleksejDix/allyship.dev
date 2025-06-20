// Diopter values for vision simulation
// Positive values = farsighted (hyperopia)
// Negative values = nearsighted (myopia)
// Zero = normal vision (no simulation)
export type DiopterValue = number

// Viewing distance in meters
export type ViewingDistance = number

// Predefined common diopter values
export const DIOPTER_PRESETS = {
  MILD_NEARSIGHTED: -1.5,
  MODERATE_NEARSIGHTED: -3.0,
  SEVERE_NEARSIGHTED: -6.0,
  MILD_FARSIGHTED: 1.5,
  MODERATE_FARSIGHTED: 3.0,
  SEVERE_FARSIGHTED: 6.0,
  NORMAL: 0
} as const

// Common viewing distances for different devices
export const VIEWING_DISTANCE_PRESETS = {
  SMARTPHONE: 0.3,      // 30cm - typical phone holding distance
  TABLET: 0.5,          // 50cm - tablet reading distance
  LAPTOP: 0.6,          // 60cm - laptop screen distance
  DESKTOP: 0.7,         // 70cm - desktop monitor distance
  TV_SMALL: 2.0,        // 2m - small TV viewing distance
  TV_LARGE: 3.0,        // 3m - large TV viewing distance
  PROJECTOR: 4.0        // 4m - projector screen distance
} as const

// State for the simulator
export interface SimulatorState {
  isActive: boolean
  diopters: DiopterValue
  viewingDistance: ViewingDistance
}

// Configuration options for the simulator
export interface SimulatorOptions {
  /** Custom overlay ID (default: "diopter-simulator-overlay") */
  overlayId?: string
  /** Custom styles ID (default: "diopter-simulator-styles") */
  stylesId?: string
  /** Custom z-index for overlay (default: 2147483647) */
  zIndex?: number
  /** Whether to use direct HTML filter for better performance (default: true) */
  useDirectFilter?: boolean
}

// Event types for state changes
export interface StateChangeEvent {
  isActive: boolean
  diopters: DiopterValue
  viewingDistance: ViewingDistance
}

// Event callback type
export type StateChangeCallback = (state: StateChangeEvent) => void
