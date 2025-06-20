// Core simulator functions
export {
  createColorVisionSimulator,
  getSingletonSimulator,
  destroySingletonSimulator
} from './simulator.js'

// Types and constants
export type {
  ColorVisionType,
  SimulatorState,
  SimulatorOptions,
  StateChangeCallback,
  StateChangeEvent
} from './types.js'

export { COLOR_VISION_PRESETS } from './types.js'

// Utility functions
export {
  formatColorVisionType,
  getColorVisionDescription
} from './utils.js'
