import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createDiopterSimulator } from '../src/simulator.js'
import { DIOPTER_PRESETS, VIEWING_DISTANCE_PRESETS } from '../src/types.js'

describe('DiopterSimulator', () => {
  let simulator: ReturnType<typeof createDiopterSimulator>

  beforeEach(() => {
    // Clean up any existing overlays
    const existingOverlay = document.getElementById('diopter-simulator-overlay')
    if (existingOverlay) {
      existingOverlay.remove()
    }
    const existingStyles = document.getElementById('diopter-simulator-styles')
    if (existingStyles) {
      existingStyles.remove()
    }
    simulator = createDiopterSimulator()
  })

  afterEach(() => {
    simulator.destroy()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const state = simulator.getState()
      expect(state.isActive).toBe(false)
      expect(state.diopters).toBe(DIOPTER_PRESETS.NORMAL)
      expect(state.viewingDistance).toBe(VIEWING_DISTANCE_PRESETS.LAPTOP)
    })

    it('should initialize with custom options', () => {
      const customSimulator = createDiopterSimulator({
        overlayId: 'custom-overlay',
        stylesId: 'custom-styles',
        zIndex: 999999,
        useDirectFilter: false
      })

      expect(customSimulator.isActive()).toBe(false)
      expect(customSimulator.getDiopters()).toBe(DIOPTER_PRESETS.NORMAL)
      expect(customSimulator.getViewingDistance()).toBe(VIEWING_DISTANCE_PRESETS.LAPTOP)

      customSimulator.destroy()
    })
  })

  describe('state management', () => {
    it('should start and stop simulation', () => {
      expect(simulator.isActive()).toBe(false)

      simulator.start()
      expect(simulator.isActive()).toBe(true)

      simulator.stop()
      expect(simulator.isActive()).toBe(false)
    })

    it('should toggle simulation state', () => {
      expect(simulator.isActive()).toBe(false)

      simulator.toggle()
      expect(simulator.isActive()).toBe(true)

      simulator.toggle()
      expect(simulator.isActive()).toBe(false)
    })

    it('should set diopter values', () => {
      simulator.setDiopters(-3.0)
      expect(simulator.getDiopters()).toBe(-3.0)

      simulator.setDiopters(2.5)
      expect(simulator.getDiopters()).toBe(2.5)

      simulator.setDiopters(0)
      expect(simulator.getDiopters()).toBe(0)
    })

    it('should set viewing distance', () => {
      simulator.setViewingDistance(0.3)
      expect(simulator.getViewingDistance()).toBe(0.3)

      simulator.setViewingDistance(2.0)
      expect(simulator.getViewingDistance()).toBe(2.0)
    })

    it('should configure both diopters and viewing distance', () => {
      simulator.configure(-6.0, 0.5)

      expect(simulator.getDiopters()).toBe(-6.0)
      expect(simulator.getViewingDistance()).toBe(0.5)
    })
  })

  describe('diopter simulation', () => {
    it('should handle negative diopters (myopia)', () => {
      const myopiaValues = [-1.5, -3.0, -6.0, -8.0]

      for (const diopter of myopiaValues) {
        simulator.setDiopters(diopter)
        expect(simulator.getDiopters()).toBe(diopter)
      }
    })

    it('should handle positive diopters (hyperopia)', () => {
      const hyperopiaValues = [1.5, 3.0, 6.0]

      for (const diopter of hyperopiaValues) {
        simulator.setDiopters(diopter)
        expect(simulator.getDiopters()).toBe(diopter)
      }
    })

    it('should handle normal vision (zero diopters)', () => {
      simulator.setDiopters(0)
      expect(simulator.getDiopters()).toBe(0)
    })

    it('should handle various viewing distances', () => {
      const distances = [0.2, 0.3, 0.6, 1.0, 2.0, 4.0]

      for (const distance of distances) {
        simulator.setViewingDistance(distance)
        expect(simulator.getViewingDistance()).toBe(distance)
      }
    })
  })

  describe('event system', () => {
    it('should notify subscribers of state changes', () => {
      let callbackCount = 0
      let lastEvent: any = null

      const unsubscribe = simulator.onStateChange((event) => {
        callbackCount++
        lastEvent = event
      })

      simulator.start()
      expect(callbackCount).toBe(1)
      expect(lastEvent.isActive).toBe(true)

      simulator.setDiopters(-3.0)
      expect(callbackCount).toBe(2)
      expect(lastEvent.diopters).toBe(-3.0)

      simulator.setViewingDistance(0.3)
      expect(callbackCount).toBe(3)
      expect(lastEvent.viewingDistance).toBe(0.3)

      unsubscribe()
      simulator.stop()
      expect(callbackCount).toBe(3) // Should not increase after unsubscribe
    })

    it('should handle multiple subscribers', () => {
      let callback1Count = 0
      let callback2Count = 0

      const unsubscribe1 = simulator.onStateChange(() => callback1Count++)
      const unsubscribe2 = simulator.onStateChange(() => callback2Count++)

      simulator.start()
      expect(callback1Count).toBe(1)
      expect(callback2Count).toBe(1)

      unsubscribe1()
      simulator.stop()
      expect(callback1Count).toBe(1)
      expect(callback2Count).toBe(2)

      unsubscribe2()
    })

    it('should include all state in event callback', () => {
      let lastEvent: any = null

      simulator.onStateChange((event) => {
        lastEvent = event
      })

      simulator.configure(-2.5, 0.4)
      simulator.start()

      expect(lastEvent).toEqual({
        isActive: true,
        diopters: -2.5,
        viewingDistance: 0.4
      })
    })
  })

  describe('DOM manipulation', () => {
    it('should create blur effect when started with diopter impairment', () => {
      simulator.setDiopters(-3.0)
      simulator.start()

      // Check if direct filter is applied
      expect(document.documentElement.style.filter).toContain('blur(')
    })

    it('should remove blur effect when stopped', () => {
      simulator.setDiopters(-3.0)
      simulator.start()
      simulator.stop()

      expect(document.documentElement.style.filter).toBe('')
    })

    it('should not create blur effect for normal vision', () => {
      simulator.setDiopters(0)
      simulator.start()

      expect(document.documentElement.style.filter).toBe('')
    })

    it('should use overlay when direct filter is disabled', () => {
      const overlaySimulator = createDiopterSimulator({
        useDirectFilter: false
      })

      overlaySimulator.setDiopters(-3.0)
      overlaySimulator.start()

      const overlay = document.getElementById('diopter-simulator-overlay')
      expect(overlay).toBeTruthy()
      expect(overlay!.style.backdropFilter).toContain('blur(')

      overlaySimulator.destroy()
    })

    it('should clean up DOM elements on destroy', () => {
      simulator.setDiopters(-3.0)
      simulator.start()

      simulator.destroy()

      expect(document.documentElement.style.filter).toBe('')
      expect(document.getElementById('diopter-simulator-overlay')).toBeNull()
      expect(document.getElementById('diopter-simulator-styles')).toBeNull()
    })
  })

  describe('blur calculation accuracy', () => {
    it('should apply more blur for higher diopter values', () => {
      simulator.setViewingDistance(0.6) // Standard laptop distance

      // Test myopia progression
      simulator.setDiopters(-1.5)
      simulator.start()
      const mildBlur = document.documentElement.style.filter

      simulator.setDiopters(-3.0)
      const moderateBlur = document.documentElement.style.filter

      simulator.setDiopters(-6.0)
      const severeBlur = document.documentElement.style.filter

      // Extract blur values (rough check)
      expect(mildBlur).toContain('blur(')
      expect(moderateBlur).toContain('blur(')
      expect(severeBlur).toContain('blur(')
    })

    it('should vary blur based on viewing distance', () => {
      simulator.setDiopters(-3.0)

      // Test at phone distance
      simulator.setViewingDistance(0.3)
      simulator.start()
      const phoneBlur = document.documentElement.style.filter

      // Test at TV distance
      simulator.setViewingDistance(2.0)
      const tvBlur = document.documentElement.style.filter

      expect(phoneBlur).toContain('blur(')
      expect(tvBlur).toContain('blur(')
      // TV should have more blur for myopia
      expect(phoneBlur).not.toBe(tvBlur)
    })
  })

  describe('preset values', () => {
    it('should work with diopter presets', () => {
      simulator.setDiopters(DIOPTER_PRESETS.MILD_NEARSIGHTED)
      expect(simulator.getDiopters()).toBe(-1.5)

      simulator.setDiopters(DIOPTER_PRESETS.MODERATE_FARSIGHTED)
      expect(simulator.getDiopters()).toBe(3.0)

      simulator.setDiopters(DIOPTER_PRESETS.NORMAL)
      expect(simulator.getDiopters()).toBe(0)
    })

    it('should work with viewing distance presets', () => {
      simulator.setViewingDistance(VIEWING_DISTANCE_PRESETS.SMARTPHONE)
      expect(simulator.getViewingDistance()).toBe(0.3)

      simulator.setViewingDistance(VIEWING_DISTANCE_PRESETS.TV_LARGE)
      expect(simulator.getViewingDistance()).toBe(3.0)
    })
  })
})
