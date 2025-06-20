import { createColorVisionSimulator, getSingletonSimulator, destroySingletonSimulator } from './simulator.js'
import type { ColorVisionType } from './types.js'

// Re-export the main functions for convenience
export { createColorVisionSimulator, getSingletonSimulator, destroySingletonSimulator }

/**
 * Format color vision type for display
 */
export function formatColorVisionType(type: ColorVisionType): string {
  switch (type) {
    case 'protanopia':
      return 'Protanopia (Red-blind)'
    case 'deuteranopia':
      return 'Deuteranopia (Green-blind)'
    case 'tritanopia':
      return 'Tritanopia (Blue-blind)'
    case 'achromatopsia':
      return 'Achromatopsia (Total color blindness)'
    case 'normal':
      return 'Normal Vision'
    default:
      return 'Unknown'
  }
}

/**
 * Get a description of the color vision deficiency
 */
export function getColorVisionDescription(type: ColorVisionType): string {
  switch (type) {
    case 'protanopia':
      return 'Difficulty distinguishing between red and green colors, with red appearing darker'
    case 'deuteranopia':
      return 'Difficulty distinguishing between red and green colors, most common form of color blindness'
    case 'tritanopia':
      return 'Difficulty distinguishing between blue and yellow colors, very rare condition'
    case 'achromatopsia':
      return 'Complete absence of color vision, seeing only in shades of gray'
    case 'normal':
      return 'Normal color vision with no deficiencies'
    default:
      return 'Unknown color vision type'
  }
}
