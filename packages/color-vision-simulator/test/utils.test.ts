import { describe, it, expect, afterEach } from 'vitest'
import {
  createColorVisionSimulator,
  getSingletonSimulator,
  destroySingletonSimulator,
  formatColorVisionType,
  getColorVisionDescription,
  COLOR_VISION_PRESETS
} from '../src/index.js'

describe('Utils', () => {
  afterEach(() => {
    destroySingletonSimulator()
  })

  describe('createColorVisionSimulator', () => {
    it('should create a new simulator instance', () => {
      const simulator = createColorVisionSimulator()

      expect(simulator).toBeDefined()
      expect(simulator.isActive()).toBe(false)
      expect(simulator.getVisionType()).toBe(COLOR_VISION_PRESETS.PROTANOPIA)

      simulator.destroy()
    })

    it('should create simulator with custom options', () => {
      const simulator = createColorVisionSimulator({
        overlayId: 'test-overlay',
        useDirectFilter: false
      })

      expect(simulator).toBeDefined()
      expect(simulator.isActive()).toBe(false)

      simulator.destroy()
    })
  })

  describe('getSingletonSimulator', () => {
    it('should return the same instance when called multiple times', () => {
      const simulator1 = getSingletonSimulator()
      const simulator2 = getSingletonSimulator()

      expect(simulator1).toBe(simulator2)
    })

    it('should create singleton with custom options on first call', () => {
      const simulator = getSingletonSimulator({
        overlayId: 'singleton-overlay'
      })

      expect(simulator).toBeDefined()
      expect(simulator.isActive()).toBe(false)
    })

    it('should ignore options on subsequent calls', () => {
      const simulator1 = getSingletonSimulator({ overlayId: 'first-overlay' })
      const simulator2 = getSingletonSimulator({ overlayId: 'second-overlay' })

      expect(simulator1).toBe(simulator2)
    })
  })

  describe('destroySingletonSimulator', () => {
    it('should destroy the singleton instance', () => {
      const simulator1 = getSingletonSimulator()
      simulator1.start()

      destroySingletonSimulator()

      const simulator2 = getSingletonSimulator()

      expect(simulator1).not.toBe(simulator2)
      expect(simulator2.isActive()).toBe(false)
    })

    it('should handle multiple destroy calls gracefully', () => {
      getSingletonSimulator()

      destroySingletonSimulator()
      destroySingletonSimulator() // Should not throw

      const newSimulator = getSingletonSimulator()
      expect(newSimulator).toBeDefined()
    })

    it('should clean up DOM elements when destroying singleton', () => {
      const simulator = getSingletonSimulator()
      simulator.start()

      // Verify elements exist
      expect(document.getElementById('color-vision-simulator-overlay')).toBeTruthy()
      expect(document.getElementById('color-vision-simulator-styles')).toBeTruthy()

      destroySingletonSimulator()

      // Verify elements are cleaned up
      expect(document.getElementById('color-vision-simulator-overlay')).toBeNull()
      expect(document.getElementById('color-vision-simulator-styles')).toBeNull()
    })
  })

  describe('formatColorVisionType', () => {
    it('should format protanopia correctly', () => {
      expect(formatColorVisionType(COLOR_VISION_PRESETS.PROTANOPIA))
        .toBe('Protanopia (Red-blind)')
    })

    it('should format deuteranopia correctly', () => {
      expect(formatColorVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA))
        .toBe('Deuteranopia (Green-blind)')
    })

    it('should format tritanopia correctly', () => {
      expect(formatColorVisionType(COLOR_VISION_PRESETS.TRITANOPIA))
        .toBe('Tritanopia (Blue-blind)')
    })

    it('should format achromatopsia correctly', () => {
      expect(formatColorVisionType(COLOR_VISION_PRESETS.ACHROMATOPSIA))
        .toBe('Achromatopsia (Total color blindness)')
    })

    it('should format normal vision correctly', () => {
      expect(formatColorVisionType(COLOR_VISION_PRESETS.NORMAL))
        .toBe('Normal Vision')
    })

    it('should handle unknown types', () => {
      expect(formatColorVisionType('unknown' as any))
        .toBe('Unknown')
    })
  })

  describe('getColorVisionDescription', () => {
    it('should provide correct description for protanopia', () => {
      expect(getColorVisionDescription(COLOR_VISION_PRESETS.PROTANOPIA))
        .toBe('Difficulty distinguishing between red and green colors, with red appearing darker')
    })

    it('should provide correct description for deuteranopia', () => {
      expect(getColorVisionDescription(COLOR_VISION_PRESETS.DEUTERANOPIA))
        .toBe('Difficulty distinguishing between red and green colors, most common form of color blindness')
    })

    it('should provide correct description for tritanopia', () => {
      expect(getColorVisionDescription(COLOR_VISION_PRESETS.TRITANOPIA))
        .toBe('Difficulty distinguishing between blue and yellow colors, very rare condition')
    })

    it('should provide correct description for achromatopsia', () => {
      expect(getColorVisionDescription(COLOR_VISION_PRESETS.ACHROMATOPSIA))
        .toBe('Complete absence of color vision, seeing only in shades of gray')
    })

    it('should provide correct description for normal vision', () => {
      expect(getColorVisionDescription(COLOR_VISION_PRESETS.NORMAL))
        .toBe('Normal color vision with no deficiencies')
    })

    it('should handle unknown types', () => {
      expect(getColorVisionDescription('unknown' as any))
        .toBe('Unknown color vision type')
    })
  })
})
