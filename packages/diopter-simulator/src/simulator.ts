import type {
  SimulatorState,
  SimulatorOptions,
  StateChangeCallback,
  DiopterValue,
  ViewingDistance,
  StateChangeEvent
} from './types'
import { DIOPTER_PRESETS, VIEWING_DISTANCE_PRESETS } from './types'
import { calculateBlur, createStyleSheet, removeElement } from './utils'

/**
 * Creates a diopter simulator for testing visual acuity impairments
 * Uses mathematical diopter values and viewing distance for accurate simulation
 */
export function createDiopterSimulator(options: SimulatorOptions = {}) {
  // Configuration with defaults
  const config = {
    overlayId: 'diopter-simulator-overlay',
    stylesId: 'diopter-simulator-styles',
    zIndex: 2147483647,
    useDirectFilter: true,
    ...options
  }

  // Private state
  let state: SimulatorState = {
    isActive: false,
    diopters: DIOPTER_PRESETS.NORMAL,
    viewingDistance: VIEWING_DISTANCE_PRESETS.LAPTOP // Default to laptop distance
  }

  // Event listeners
  const listeners: StateChangeCallback[] = []

  // Notify listeners of state changes
  function notifyListeners() {
    const event: StateChangeEvent = {
      isActive: state.isActive,
      diopters: state.diopters,
      viewingDistance: state.viewingDistance
    }
    listeners.forEach(callback => callback(event))
  }

  // Apply blur effect based on diopter value and viewing distance
  function applyEffect() {
    if (!state.isActive || state.diopters === 0) {
      removeEffect()
      return
    }

    const blurAmount = calculateBlur(state.diopters, state.viewingDistance)

    if (config.useDirectFilter) {
      // Apply filter directly to HTML element
      document.documentElement.style.filter = `blur(${blurAmount}px)`
    } else {
      // Use overlay approach
      removeElement(config.overlayId)

      const overlay = document.createElement('div')
      overlay.id = config.overlayId
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${config.zIndex};
        backdrop-filter: blur(${blurAmount}px);
      `

      document.body.appendChild(overlay)
    }

    // Add styles for better visual feedback
    const styles = createStyleSheet(config.stylesId, `
      body.diopter-simulation-active {
        transition: filter 0.3s ease;
      }
    `)

    document.body.classList.add('diopter-simulation-active')
  }

  // Remove blur effect
  function removeEffect() {
    if (config.useDirectFilter) {
      document.documentElement.style.filter = ''
    } else {
      removeElement(config.overlayId)
    }

    removeElement(config.stylesId)
    document.body.classList.remove('diopter-simulation-active')
  }

  // Public API
  return {
    /**
     * Start the simulation with current settings
     */
    start() {
      state.isActive = true
      applyEffect()
      notifyListeners()
    },

    /**
     * Stop the simulation
     */
    stop() {
      state.isActive = false
      removeEffect()
      notifyListeners()
    },

    /**
     * Toggle simulation on/off
     */
    toggle() {
      if (state.isActive) {
        this.stop()
      } else {
        this.start()
      }
    },

    /**
     * Set diopter value
     * Positive = farsighted, Negative = nearsighted, Zero = normal
     */
    setDiopters(diopters: DiopterValue) {
      state.diopters = diopters
      if (state.isActive) {
        applyEffect()
      }
      notifyListeners()
    },

    /**
     * Set viewing distance in meters
     */
    setViewingDistance(distance: ViewingDistance) {
      state.viewingDistance = distance
      if (state.isActive) {
        applyEffect()
      }
      notifyListeners()
    },

    /**
     * Set both diopters and viewing distance at once
     */
    configure(diopters: DiopterValue, viewingDistance: ViewingDistance) {
      state.diopters = diopters
      state.viewingDistance = viewingDistance
      if (state.isActive) {
        applyEffect()
      }
      notifyListeners()
    },

    /**
     * Get current diopter value
     */
    getDiopters(): DiopterValue {
      return state.diopters
    },

    /**
     * Get current viewing distance
     */
    getViewingDistance(): ViewingDistance {
      return state.viewingDistance
    },

    /**
     * Check if simulation is active
     */
    isActive(): boolean {
      return state.isActive
    },

    /**
     * Get current state
     */
    getState(): SimulatorState {
      return { ...state }
    },

    /**
     * Listen for state changes
     */
    onStateChange(callback: StateChangeCallback) {
      listeners.push(callback)
      return () => {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    },

    /**
     * Clean up resources
     */
    destroy() {
      this.stop()
      listeners.length = 0
    }
  }
}

// Singleton instance for global usage
let singletonInstance: ReturnType<typeof createDiopterSimulator> | null = null

/**
 * Get or create singleton simulator instance
 */
export function getSingletonSimulator(options?: SimulatorOptions) {
  if (!singletonInstance) {
    singletonInstance = createDiopterSimulator(options)
  }
  return singletonInstance
}

/**
 * Destroy singleton instance
 */
export function destroySingletonSimulator() {
  if (singletonInstance) {
    singletonInstance.destroy()
    singletonInstance = null
  }
}
