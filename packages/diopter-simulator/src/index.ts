// Core simulator functions
export {
  createDiopterSimulator,
  getSingletonSimulator,
  destroySingletonSimulator
} from './simulator'

// Types and constants
export type {
  DiopterValue,
  ViewingDistance,
  SimulatorState,
  SimulatorOptions,
  StateChangeCallback,
  StateChangeEvent
} from './types'

export { DIOPTER_PRESETS, VIEWING_DISTANCE_PRESETS } from './types'

// Utility functions
export {
  calculateBlur,
  formatDiopters,
  formatViewingDistance,
  getDeviceType,
  createStyleSheet,
  removeElement
} from './utils'
