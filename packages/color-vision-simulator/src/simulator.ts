import { COLOR_VISION_PRESETS, type ColorVisionType, type SimulatorState, type SimulatorOptions, type StateChangeCallback } from './types.js'

// CSS filters for different color vision deficiency types
const COLOR_DEFICIENCY_FILTERS = {
  [COLOR_VISION_PRESETS.PROTANOPIA]: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='protanopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#protanopia")`,
  [COLOR_VISION_PRESETS.DEUTERANOPIA]: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='deuteranopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#deuteranopia")`,
  [COLOR_VISION_PRESETS.TRITANOPIA]: `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='tritanopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#tritanopia")`,
  [COLOR_VISION_PRESETS.ACHROMATOPSIA]: 'grayscale(100%)',
  [COLOR_VISION_PRESETS.NORMAL]: 'none'
} as const

/**
 * Creates a color vision simulator for testing color vision deficiencies
 * Uses CSS filters to simulate different types of color blindness
 */
export function createColorVisionSimulator(options: SimulatorOptions = {}) {
  // Private state using closure
  let state: SimulatorState = {
    isActive: false,
    visionType: COLOR_VISION_PRESETS.PROTANOPIA
  }

  const config = {
    overlayId: options.overlayId ?? 'color-vision-simulator-overlay',
    stylesId: options.stylesId ?? 'color-vision-simulator-styles',
    zIndex: options.zIndex ?? 2147483647,
    useDirectFilter: options.useDirectFilter ?? true
  }

  const callbacks = new Set<StateChangeCallback>()

  /**
   * Update the visual simulation based on current state
   */
  function updateSimulation(): void {
    let overlay = document.getElementById(config.overlayId)
    let styleEl = document.getElementById(config.stylesId)

    if (!state.isActive) {
      // Remove elements if simulation is not active
      if (overlay) overlay.remove()
      if (styleEl) styleEl.remove()
      document.documentElement.classList.remove('ally-direct-filter')
      return
    }

    // Create elements if they don't exist
    if (!overlay) {
      overlay = document.createElement('div')
      overlay.id = config.overlayId
      document.body.appendChild(overlay)
    }

    if (!styleEl) {
      styleEl = document.createElement('style')
      styleEl.id = config.stylesId
      document.head.appendChild(styleEl)
    }

    // Get the filter for the current vision type
    const filter = COLOR_DEFICIENCY_FILTERS[state.visionType]

    // Update the overlay style based on current state
    styleEl.textContent = `
      #${config.overlayId} {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: ${config.zIndex};
        filter: ${filter};
      }

      /* Apply to the entire page if directly supported by the browser */
      ${
        config.useDirectFilter && state.visionType !== COLOR_VISION_PRESETS.NORMAL
          ? `
      html.ally-direct-filter {
        filter: ${filter};
      }
      html.ally-direct-filter #${config.overlayId} {
        display: none;
      }
      `
          : ''
      }
    `

    // Try to apply filter directly to html element for better performance
    if (config.useDirectFilter && state.visionType !== COLOR_VISION_PRESETS.NORMAL) {
      document.documentElement.classList.add('ally-direct-filter')
    } else {
      document.documentElement.classList.remove('ally-direct-filter')
    }
  }

  /**
   * Notify all subscribers of state changes
   */
  function notifyStateChange(): void {
    const stateEvent = {
      isActive: state.isActive,
      visionType: state.visionType
    }

    callbacks.forEach(callback => {
      try {
        callback(stateEvent)
      } catch (error) {
        console.error('[ColorVisionSimulator] Error in state change callback:', error)
      }
    })
  }

  // Public API
  return {
    /**
     * Start the color vision deficiency simulation
     */
    start(): void {
      if (state.isActive) return

      state.isActive = true
      updateSimulation()
      notifyStateChange()
    },

    /**
     * Stop the color vision deficiency simulation
     */
    stop(): void {
      if (!state.isActive) return

      state.isActive = false
      updateSimulation()
      notifyStateChange()
    },

    /**
     * Toggle the simulation on/off
     */
    toggle(): void {
      if (state.isActive) {
        this.stop()
      } else {
        this.start()
      }
    },

    /**
     * Set the type of color vision deficiency to simulate
     */
    setVisionType(type: ColorVisionType): void {
      if (state.visionType === type) return

      state.visionType = type
      updateSimulation()
      notifyStateChange()
    },

    /**
     * Set both vision type and active state at once
     */
    configure(visionType: ColorVisionType, isActive: boolean): void {
      const changed = state.visionType !== visionType || state.isActive !== isActive

      state.visionType = visionType
      state.isActive = isActive

      if (changed) {
        updateSimulation()
        notifyStateChange()
      }
    },

    /**
     * Get the current vision type being simulated
     */
    getVisionType(): ColorVisionType {
      return state.visionType
    },

    /**
     * Check if the simulator is currently active
     */
    isActive(): boolean {
      return state.isActive
    },

    /**
     * Get the current state of the simulator
     */
    getState(): SimulatorState {
      return { ...state }
    },

    /**
     * Subscribe to state changes
     */
    onStateChange(callback: StateChangeCallback): () => void {
      callbacks.add(callback)

      // Return unsubscribe function
      return () => {
        callbacks.delete(callback)
      }
    },

    /**
     * Clean up the simulator and remove all DOM elements
     */
    destroy(): void {
      this.stop()
      callbacks.clear()

      // Remove any remaining DOM elements
      const overlay = document.getElementById(config.overlayId)
      const styleEl = document.getElementById(config.stylesId)

      if (overlay) overlay.remove()
      if (styleEl) styleEl.remove()

      document.documentElement.classList.remove('ally-direct-filter')
    }
  }
}

// Singleton pattern support
let singletonInstance: ReturnType<typeof createColorVisionSimulator> | null = null

/**
 * Get or create singleton simulator instance
 */
export function getSingletonSimulator(options?: SimulatorOptions): ReturnType<typeof createColorVisionSimulator> {
  if (!singletonInstance) {
    singletonInstance = createColorVisionSimulator(options)
  }
  return singletonInstance
}

/**
 * Destroy singleton instance
 */
export function destroySingletonSimulator(): void {
  if (singletonInstance) {
    singletonInstance.destroy()
    singletonInstance = null
  }
}
