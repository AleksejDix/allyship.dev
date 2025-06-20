import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createColorVisionSimulator, COLOR_VISION_PRESETS } from '../src/index.js'
import type { ColorVisionType } from '../src/types.js'

describe('ColorVisionSimulator', () => {
  let simulator: ReturnType<typeof createColorVisionSimulator>

  beforeEach(() => {
    simulator = createColorVisionSimulator()
  })

  afterEach(() => {
    simulator.destroy()
  })

  describe('initialization', () => {
    it('should initialize with default state', () => {
      const state = simulator.getState()
      expect(state.isActive).toBe(false)
      expect(state.visionType).toBe(COLOR_VISION_PRESETS.PROTANOPIA)
    })

    it('should initialize with custom options', () => {
      const customSimulator = createColorVisionSimulator({
        overlayId: 'custom-overlay',
        stylesId: 'custom-styles',
        zIndex: 999999,
        useDirectFilter: false
      })

      expect(customSimulator.isActive()).toBe(false)
      expect(customSimulator.getVisionType()).toBe(COLOR_VISION_PRESETS.PROTANOPIA)

      customSimulator.destroy()
    })
  })

  describe('state management', () => {
    it('should start simulation', () => {
      simulator.start()
      expect(simulator.isActive()).toBe(true)
    })

    it('should stop simulation', () => {
      simulator.start()
      simulator.stop()
      expect(simulator.isActive()).toBe(false)
    })

    it('should toggle simulation', () => {
      expect(simulator.isActive()).toBe(false)

      simulator.toggle()
      expect(simulator.isActive()).toBe(true)

      simulator.toggle()
      expect(simulator.isActive()).toBe(false)
    })

    it('should set vision type', () => {
      simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA)
      expect(simulator.getVisionType()).toBe(COLOR_VISION_PRESETS.DEUTERANOPIA)
    })

    it('should configure both vision type and active state', () => {
      simulator.configure(COLOR_VISION_PRESETS.TRITANOPIA, true)

      expect(simulator.getVisionType()).toBe(COLOR_VISION_PRESETS.TRITANOPIA)
      expect(simulator.isActive()).toBe(true)
    })
  })

  describe('DOM manipulation', () => {
    it('should create overlay and style elements when started', () => {
      simulator.start()

      const overlay = document.getElementById('color-vision-simulator-overlay')
      const styles = document.getElementById('color-vision-simulator-styles')

      expect(overlay).toBeTruthy()
      expect(styles).toBeTruthy()
    })

    it('should remove overlay and style elements when stopped', () => {
      simulator.start()
      simulator.stop()

      const overlay = document.getElementById('color-vision-simulator-overlay')
      const styles = document.getElementById('color-vision-simulator-styles')

      expect(overlay).toBeNull()
      expect(styles).toBeNull()
    })

    it('should apply direct filter class to html element', () => {
      simulator.start()

      expect(document.documentElement.classList.contains('ally-direct-filter')).toBe(true)

      simulator.stop()

      expect(document.documentElement.classList.contains('ally-direct-filter')).toBe(false)
    })

    it('should not apply direct filter when disabled', () => {
      const customSimulator = createColorVisionSimulator({
        useDirectFilter: false
      })

      customSimulator.start()

      expect(document.documentElement.classList.contains('ally-direct-filter')).toBe(false)

      customSimulator.destroy()
    })
  })

  describe('event handling', () => {
    it('should notify state changes when starting', () => {
      let callbackCalled = false
      let receivedState: any = null

      simulator.onStateChange((state) => {
        callbackCalled = true
        receivedState = state
      })

      simulator.start()

      expect(callbackCalled).toBe(true)
      expect(receivedState.isActive).toBe(true)
      expect(receivedState.visionType).toBe(COLOR_VISION_PRESETS.PROTANOPIA)
    })

    it('should notify state changes when stopping', () => {
      simulator.start()

      let callbackCalled = false
      let receivedState: any = null

      simulator.onStateChange((state) => {
        callbackCalled = true
        receivedState = state
      })

      simulator.stop()

      expect(callbackCalled).toBe(true)
      expect(receivedState.isActive).toBe(false)
    })

    it('should notify state changes when changing vision type', () => {
      let callbackCalled = false
      let receivedState: any = null

      simulator.onStateChange((state) => {
        callbackCalled = true
        receivedState = state
      })

      simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA)

      expect(callbackCalled).toBe(true)
      expect(receivedState.visionType).toBe(COLOR_VISION_PRESETS.DEUTERANOPIA)
    })

    it('should allow unsubscribing from state changes', () => {
      let callbackCalled = false

      const unsubscribe = simulator.onStateChange(() => {
        callbackCalled = true
      })

      unsubscribe()
      simulator.start()

      expect(callbackCalled).toBe(false)
    })

    it('should handle multiple subscribers', () => {
      let callback1Called = false
      let callback2Called = false

      simulator.onStateChange(() => { callback1Called = true })
      simulator.onStateChange(() => { callback2Called = true })

      simulator.start()

      expect(callback1Called).toBe(true)
      expect(callback2Called).toBe(true)
    })
  })

  describe('vision types', () => {
    it('should handle all vision types', () => {
      const visionTypes = [
        COLOR_VISION_PRESETS.PROTANOPIA,
        COLOR_VISION_PRESETS.DEUTERANOPIA,
        COLOR_VISION_PRESETS.TRITANOPIA,
        COLOR_VISION_PRESETS.ACHROMATOPSIA,
        COLOR_VISION_PRESETS.NORMAL
      ]

      visionTypes.forEach(type => {
        simulator.setVisionType(type)
        expect(simulator.getVisionType()).toBe(type)
      })
    })

    it('should apply correct filters for each vision type', () => {
      simulator.start()

      // Test protanopia filter
      simulator.setVisionType(COLOR_VISION_PRESETS.PROTANOPIA)
      const protanopiaStyles = document.getElementById('color-vision-simulator-styles')
      expect(protanopiaStyles?.textContent).toContain('protanopia')

      // Test deuteranopia filter
      simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA)
      const deuteranopiaStyles = document.getElementById('color-vision-simulator-styles')
      expect(deuteranopiaStyles?.textContent).toContain('deuteranopia')

      // Test tritanopia filter
      simulator.setVisionType(COLOR_VISION_PRESETS.TRITANOPIA)
      const tritanopiaStyles = document.getElementById('color-vision-simulator-styles')
      expect(tritanopiaStyles?.textContent).toContain('tritanopia')

      // Test achromatopsia filter
      simulator.setVisionType(COLOR_VISION_PRESETS.ACHROMATOPSIA)
      const achromatopsiaStyles = document.getElementById('color-vision-simulator-styles')
      expect(achromatopsiaStyles?.textContent).toContain('grayscale')

      // Test normal vision (no filter)
      simulator.setVisionType(COLOR_VISION_PRESETS.NORMAL)
      const normalStyles = document.getElementById('color-vision-simulator-styles')
      expect(normalStyles?.textContent).toContain('filter: none')
    })
  })

  describe('error handling', () => {
    it('should handle callback errors gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      simulator.onStateChange(() => {
        throw new Error('Test error')
      })

      simulator.start()

      expect(consoleSpy).toHaveBeenCalledWith(
        '[ColorVisionSimulator] Error in state change callback:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
    })
  })

  describe('performance optimizations', () => {
    it('should not update simulation if state has not changed', () => {
      const spy = vi.spyOn(document, 'getElementById')

      simulator.start()
      spy.mockClear()

      // Starting again should not trigger DOM updates
      simulator.start()
      expect(spy).not.toHaveBeenCalled()

      spy.mockRestore()
    })

    it('should not notify callbacks if state has not changed', () => {
      let callbackCount = 0

      simulator.onStateChange(() => {
        callbackCount++
      })

      simulator.setVisionType(COLOR_VISION_PRESETS.PROTANOPIA) // Same as default
      expect(callbackCount).toBe(0)

      simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA) // Different
      expect(callbackCount).toBe(1)
    })
  })
})
