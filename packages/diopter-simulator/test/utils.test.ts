import { describe, it, expect, afterEach } from 'vitest'
import {
  createDiopterSimulator,
  getSingletonSimulator,
  destroySingletonSimulator,
  calculateBlur,
  formatDiopters,
  formatViewingDistance,
  getDeviceType
} from '../src/index.js'
import { DIOPTER_PRESETS, VIEWING_DISTANCE_PRESETS } from '../src/types.js'

describe('DiopterSimulator Utils', () => {
  afterEach(() => {
    // Clean up singleton after each test
    destroySingletonSimulator()

    // Clean up any existing DOM elements
    const existingOverlay = document.getElementById('diopter-simulator-overlay')
    if (existingOverlay) {
      existingOverlay.remove()
    }
    const existingStyles = document.getElementById('diopter-simulator-styles')
    if (existingStyles) {
      existingStyles.remove()
    }

    // Reset document filter
    document.documentElement.style.filter = ''
  })

  describe('createDiopterSimulator', () => {
    it('should create a new simulator instance', () => {
      const simulator = createDiopterSimulator()

      expect(simulator).toBeDefined()
      expect(simulator.isActive()).toBe(false)
      expect(simulator.getDiopters()).toBe(DIOPTER_PRESETS.NORMAL)
      expect(simulator.getViewingDistance()).toBe(VIEWING_DISTANCE_PRESETS.LAPTOP)

      simulator.destroy()
    })

    it('should create simulator with custom options', () => {
      const simulator = createDiopterSimulator({
        overlayId: 'custom-overlay',
        zIndex: 999999
      })

      expect(simulator).toBeDefined()
      expect(simulator.isActive()).toBe(false)

      simulator.destroy()
    })
  })

  describe('getSingletonSimulator', () => {
    it('should return the same instance on multiple calls', () => {
      const simulator1 = getSingletonSimulator()
      const simulator2 = getSingletonSimulator()

      expect(simulator1).toBe(simulator2)
      expect(simulator1.isActive()).toBe(false)
    })

    it('should create new instance with custom options on first call', () => {
      const simulator = getSingletonSimulator({
        overlayId: 'singleton-overlay'
      })

      expect(simulator).toBeDefined()
      expect(simulator.getDiopters()).toBe(DIOPTER_PRESETS.NORMAL)
      expect(simulator.getViewingDistance()).toBe(VIEWING_DISTANCE_PRESETS.LAPTOP)
    })

    it('should ignore options on subsequent calls', () => {
      const simulator1 = getSingletonSimulator({ zIndex: 1000 })
      const simulator2 = getSingletonSimulator({ zIndex: 2000 })

      expect(simulator1).toBe(simulator2)
    })
  })

  describe('destroySingletonSimulator', () => {
    it('should destroy the singleton instance', () => {
      const simulator = getSingletonSimulator()
      simulator.start()

      expect(simulator.isActive()).toBe(true)

      destroySingletonSimulator()

      // Should create a new instance now
      const newSimulator = getSingletonSimulator()
      expect(newSimulator).not.toBe(simulator)
      expect(newSimulator.isActive()).toBe(false)
    })

    it('should handle multiple destroy calls gracefully', () => {
      getSingletonSimulator()

      destroySingletonSimulator()
      destroySingletonSimulator() // Should not throw

      const newSimulator = getSingletonSimulator()
      expect(newSimulator.isActive()).toBe(false)
    })

    it('should clean up DOM elements when destroying active singleton', () => {
      const simulator = getSingletonSimulator()
      simulator.setDiopters(-3.0)
      simulator.start()

      // Should have blur effect
      expect(document.documentElement.style.filter).toContain('blur(')

      destroySingletonSimulator()

      // Should be cleaned up
      expect(document.documentElement.style.filter).toBe('')
    })
  })

  describe('calculateBlur', () => {
    it('should return 0 for normal vision', () => {
      expect(calculateBlur(0, 0.6)).toBe(0)
      expect(calculateBlur(0, 2.0)).toBe(0)
    })

    it('should calculate blur for myopia (negative diopters)', () => {
      const blur1 = calculateBlur(-1.5, 0.6)
      const blur2 = calculateBlur(-3.0, 0.6)
      const blur3 = calculateBlur(-6.0, 0.6)

      expect(blur1).toBeGreaterThan(0)
      expect(blur2).toBeGreaterThan(blur1)
      expect(blur3).toBeGreaterThan(blur2)
    })

    it('should calculate blur for hyperopia (positive diopters)', () => {
      const blur1 = calculateBlur(1.5, 0.6)
      const blur2 = calculateBlur(3.0, 0.6)

      expect(blur1).toBeGreaterThan(0)
      expect(blur2).toBeGreaterThan(blur1)
    })

    it('should vary blur based on viewing distance for myopia', () => {
      const phoneBlur = calculateBlur(-3.0, 0.3)
      const laptopBlur = calculateBlur(-3.0, 0.6)
      const tvBlur = calculateBlur(-3.0, 2.0)

      expect(phoneBlur).toBeGreaterThan(0)
      expect(laptopBlur).toBeGreaterThan(0)
      expect(tvBlur).toBeGreaterThan(0)

      // For myopia, TV should have more blur than phone
      expect(tvBlur).toBeGreaterThan(phoneBlur)
    })

    it('should cap blur at maximum value', () => {
      const extremeBlur = calculateBlur(-10.0, 4.0)
      expect(extremeBlur).toBeLessThanOrEqual(12) // Max blur cap
    })
  })

  describe('formatDiopters', () => {
    it('should format normal vision', () => {
      expect(formatDiopters(0)).toBe('Normal vision')
    })

    it('should format negative diopters (myopia)', () => {
      expect(formatDiopters(-1.5)).toBe('-1.5D (nearsighted)')
      expect(formatDiopters(-3.0)).toBe('-3.0D (nearsighted)')
    })

    it('should format positive diopters (hyperopia)', () => {
      expect(formatDiopters(1.5)).toBe('+1.5D (farsighted)')
      expect(formatDiopters(3.0)).toBe('+3.0D (farsighted)')
    })

    it('should handle decimal precision', () => {
      expect(formatDiopters(-2.75)).toBe('-2.8D (nearsighted)')
      expect(formatDiopters(1.25)).toBe('+1.3D (farsighted)')
    })
  })

  describe('formatViewingDistance', () => {
    it('should format distances in centimeters', () => {
      expect(formatViewingDistance(0.3)).toBe('30cm')
      expect(formatViewingDistance(0.5)).toBe('50cm')
      expect(formatViewingDistance(0.75)).toBe('75cm')
    })

    it('should format distances in meters', () => {
      expect(formatViewingDistance(1.0)).toBe('1.0m')
      expect(formatViewingDistance(2.0)).toBe('2.0m')
      expect(formatViewingDistance(3.5)).toBe('3.5m')
    })
  })

  describe('getDeviceType', () => {
    it('should identify smartphone distance', () => {
      expect(getDeviceType(0.3)).toBe('Smartphone')
      expect(getDeviceType(0.25)).toBe('Smartphone')
    })

    it('should identify tablet distance', () => {
      expect(getDeviceType(0.5)).toBe('Tablet')
    })

    it('should identify laptop distance', () => {
      expect(getDeviceType(0.6)).toBe('Laptop')
    })

    it('should identify desktop distance', () => {
      expect(getDeviceType(0.7)).toBe('Desktop')
    })

    it('should identify TV distances', () => {
      expect(getDeviceType(2.0)).toBe('Small TV')
      expect(getDeviceType(3.0)).toBe('Large TV')
    })

    it('should identify projector distance', () => {
      expect(getDeviceType(4.0)).toBe('Projector')
    })
  })

  describe('integration', () => {
    it('should work with both singleton and regular instances', () => {
      const singleton = getSingletonSimulator()
      const regular = createDiopterSimulator()

      singleton.setDiopters(-3.0)
      singleton.setViewingDistance(0.3)

      regular.setDiopters(2.0)
      regular.setViewingDistance(2.0)

      expect(singleton.getDiopters()).toBe(-3.0)
      expect(singleton.getViewingDistance()).toBe(0.3)

      expect(regular.getDiopters()).toBe(2.0)
      expect(regular.getViewingDistance()).toBe(2.0)

      regular.destroy()
    })

    it('should handle realistic device scenarios', () => {
      const simulator = createDiopterSimulator()

      // Test phone scenario
      simulator.configure(DIOPTER_PRESETS.MILD_NEARSIGHTED, VIEWING_DISTANCE_PRESETS.SMARTPHONE)
      expect(simulator.getDiopters()).toBe(-1.5)
      expect(simulator.getViewingDistance()).toBe(0.3)

      // Test TV scenario
      simulator.configure(DIOPTER_PRESETS.MODERATE_NEARSIGHTED, VIEWING_DISTANCE_PRESETS.TV_SMALL)
      expect(simulator.getDiopters()).toBe(-3.0)
      expect(simulator.getViewingDistance()).toBe(2.0)

      simulator.destroy()
    })
  })
})
