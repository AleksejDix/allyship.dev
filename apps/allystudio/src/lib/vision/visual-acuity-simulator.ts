import { eventBus } from "@/lib/events/event-bus"

// Types of visual acuity impairments
export enum VisualAcuityType {
  NORMAL = "normal", // Normal vision (no simulation)
  NEARSIGHTED = "nearsighted", // Myopia - blurry distance vision
  FARSIGHTED = "farsighted" // Hyperopia - blurry near vision
}

// Prescription strength for refractive errors
export type PrescriptionStrength = "mild" | "moderate" | "severe"

// State for the simulator
interface SimulatorState {
  isActive: boolean
  acuityType: VisualAcuityType
  prescriptionStrength: PrescriptionStrength
}

// Default state
const state: SimulatorState = {
  isActive: false,
  acuityType: VisualAcuityType.NEARSIGHTED,
  prescriptionStrength: "moderate"
}

// Standard viewing distance in cm (typical for computer use)
const VIEWING_DISTANCE = 50 // cm

// Diopter values for different vision conditions
const DIOPTER_VALUES = {
  [VisualAcuityType.NORMAL]: 0,
  [VisualAcuityType.NEARSIGHTED]: {
    mild: -1,
    moderate: -2,
    severe: -3
  },
  [VisualAcuityType.FARSIGHTED]: {
    mild: 1,
    moderate: 2,
    severe: 3
  }
}

// User preference options - could be exposed in settings later
const USER_PREFERENCES = {
  blurScaleFactor: 0.3, // Adjusted for realism
  maxBlur: 15, // Maximum blur in pixels
  updateDelay: 50 // Debounce delay for updates in ms
}

/**
 * Calculate dioptric blur based on scientific formula: D = 100/d - P
 * Where:
 * - D = Dioptric blur (in diopters)
 * - d = Viewing distance (in cm)
 * - P = Person's refractive error (in diopters)
 *
 * Includes validation to prevent division by zero and clamping to realistic values
 */
function calculateDioptricBlur(
  viewingDistance: number,
  refractiveError: number
): number {
  // Validate viewing distance to avoid division by zero
  if (viewingDistance <= 0) {
    console.warn(
      "[visual-acuity-simulator] Viewing distance must be greater than 0, using default."
    )
    viewingDistance = 50 // Use default if invalid
  }

  // Calculate the dioptric blur
  const blur = 100 / viewingDistance - refractiveError

  // Clamp to a realistic range of -10 to 10 diopters of blur
  return Math.max(-10, Math.min(10, blur))
}

/**
 * Convert dioptric blur to CSS blur value using logarithmic scaling
 * This provides a more natural transition between different blur levels
 */
function dioptricBlurToCssBlur(dioptricBlur: number): string {
  // Calculate absolute value of blur since both over-accommodation and defocus cause blur
  const absoluteBlur = Math.abs(dioptricBlur)

  // Use logarithmic function for more natural blur transition
  // log1p(x) = ln(1 + x) which gives a more natural curve that starts at 0
  const blurPx =
    USER_PREFERENCES.blurScaleFactor * Math.log1p(absoluteBlur) * 10

  // Clamp to maximum blur value
  return `${Math.min(blurPx, USER_PREFERENCES.maxBlur)}px`
}

// Create a debounce function for performance optimization
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | undefined

  return function (...args: Parameters<T>): void {
    const later = () => {
      timeout = undefined
      func(...args)
    }

    clearTimeout(timeout)
    timeout = window.setTimeout(later, wait)
  }
}

// IDs for elements we add to the page
const OVERLAY_ID = "ally-acuity-simulator-overlay"
const STYLES_ID = "ally-acuity-simulator-styles"
const CSS_VAR_BLUR = "--ally-acuity-blur"
const CSS_VAR_TEXT_SHADOW = "--ally-acuity-text-shadow"
const CSS_VAR_CONTRAST = "--ally-acuity-contrast"

// Last calculated CSS values to avoid redundant updates
let lastBlurAmount = ""
let lastAdditionalEffects = ""

/**
 * Create or update the simulation CSS variables
 */
function updateSimulation() {
  // If not active, clean up and exit
  if (!state.isActive) {
    removeSimulationEffects()
    return
  }

  // Calculate the values only if simulation is active
  // Get current diopter value based on selected acuity type and strength
  let diopterValue = 0

  if (state.acuityType !== VisualAcuityType.NORMAL) {
    try {
      diopterValue =
        DIOPTER_VALUES[state.acuityType][state.prescriptionStrength]
      console.log(
        `[visual-acuity-simulator] Using diopter value: ${diopterValue} for ${state.acuityType} with strength ${state.prescriptionStrength}`
      )
    } catch (error) {
      console.error(
        `[visual-acuity-simulator] Error getting diopter value:`,
        error
      )
      console.error(`[visual-acuity-simulator] State:`, {
        acuityType: state.acuityType,
        prescriptionStrength: state.prescriptionStrength
      })
    }
  }

  // Calculate dioptric blur using the formula
  const dioptricBlur = calculateDioptricBlur(VIEWING_DISTANCE, diopterValue)
  console.log(
    `[visual-acuity-simulator] Calculated dioptric blur: ${dioptricBlur} from diopter value: ${diopterValue}`
  )

  // Convert to CSS blur value
  const blurAmount = dioptricBlurToCssBlur(dioptricBlur)
  console.log(`[visual-acuity-simulator] CSS blur amount: ${blurAmount}`)

  // Additional vision-type specific effects
  let contrast = "1"
  let textShadowBlur = "0px"

  if (state.acuityType === VisualAcuityType.FARSIGHTED) {
    // For farsightedness:
    // 1. Slightly reduce contrast to simulate eye strain
    // 2. Add text shadow blur to simulate difficulty focusing on near text
    contrast = "0.95"
    // Use half the blur amount for text shadow
    textShadowBlur = `${parseFloat(blurAmount) / 2}px`
  }

  // Check if the values have changed before updating
  const newAdditionalEffects = `contrast:${contrast};text-shadow:0 0 ${textShadowBlur} rgba(0,0,0,0.2);`

  if (
    blurAmount !== lastBlurAmount ||
    newAdditionalEffects !== lastAdditionalEffects
  ) {
    lastBlurAmount = blurAmount
    lastAdditionalEffects = newAdditionalEffects

    // Apply CSS variables to both the overlay and direct HTML application
    applySimulationEffects(blurAmount, contrast, textShadowBlur)
  }
}

/**
 * Apply simulation effects using CSS variables
 */
function applySimulationEffects(
  blurAmount: string,
  contrast: string,
  textShadowBlur: string
) {
  // Ensure we have our style element
  let styleEl = document.getElementById(STYLES_ID)
  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.id = STYLES_ID
    document.head.appendChild(styleEl)
  }

  // Set CSS variables
  document.documentElement.style.setProperty(CSS_VAR_BLUR, blurAmount)
  document.documentElement.style.setProperty(CSS_VAR_CONTRAST, contrast)
  document.documentElement.style.setProperty(
    CSS_VAR_TEXT_SHADOW,
    textShadowBlur
  )

  // Add a class to indicate active simulation
  document.documentElement.classList.add("ally-vision-simulation")

  // Define the styles with CSS variables for both overlay and direct application
  styleEl.textContent = `
    .ally-vision-simulation {
      --ally-acuity-filter: blur(var(${CSS_VAR_BLUR})) contrast(var(${CSS_VAR_CONTRAST}));
    }

    html.ally-direct-filter {
      filter: var(--ally-acuity-filter);
    }

    html.ally-direct-filter #${OVERLAY_ID} {
      display: none;
    }

    /* Enhanced farsightedness text effects */
    html.ally-direct-filter.ally-farsighted p,
    html.ally-direct-filter.ally-farsighted span,
    html.ally-direct-filter.ally-farsighted div,
    html.ally-direct-filter.ally-farsighted li,
    html.ally-direct-filter.ally-farsighted a,
    html.ally-direct-filter.ally-farsighted h1,
    html.ally-direct-filter.ally-farsighted h2,
    html.ally-direct-filter.ally-farsighted h3,
    html.ally-direct-filter.ally-farsighted h4,
    html.ally-direct-filter.ally-farsighted label,
    html.ally-direct-filter.ally-farsighted input {
      text-shadow: 0 0 var(${CSS_VAR_TEXT_SHADOW}) rgba(0, 0, 0, 0.2);
    }

    #${OVERLAY_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      filter: var(--ally-acuity-filter);
    }
  `

  // Add vision type class for specific adjustments
  document.documentElement.classList.remove(
    "ally-nearsighted",
    "ally-farsighted"
  )

  // Only apply filter classes if not normal vision
  if (state.acuityType === VisualAcuityType.NORMAL) {
    // For normal vision, remove the direct filter class to prevent any blur
    document.documentElement.classList.remove("ally-direct-filter")

    // Set empty CSS variables to ensure no visual effects
    document.documentElement.style.setProperty(CSS_VAR_BLUR, "0px")
    document.documentElement.style.setProperty(CSS_VAR_CONTRAST, "1")
    document.documentElement.style.setProperty(CSS_VAR_TEXT_SHADOW, "0px")
  } else {
    // For vision impairments, add proper classes and create overlay
    if (state.acuityType === VisualAcuityType.NEARSIGHTED) {
      document.documentElement.classList.add("ally-nearsighted")
    } else if (state.acuityType === VisualAcuityType.FARSIGHTED) {
      document.documentElement.classList.add("ally-farsighted")
    }

    // Create overlay if it doesn't exist
    let overlay = document.getElementById(OVERLAY_ID)
    if (!overlay) {
      overlay = document.createElement("div")
      overlay.id = OVERLAY_ID
      document.body.appendChild(overlay)
    }

    // Try to apply filter directly to html element for better performance
    document.documentElement.classList.add("ally-direct-filter")
  }
}

/**
 * Remove all simulation effects
 */
function removeSimulationEffects() {
  // Remove overlay
  const overlay = document.getElementById(OVERLAY_ID)
  if (overlay) {
    overlay.remove()
  }

  // Remove style element
  const styleEl = document.getElementById(STYLES_ID)
  if (styleEl) {
    styleEl.remove()
  }

  // Remove all CSS variables and classes
  document.documentElement.style.removeProperty(CSS_VAR_BLUR)
  document.documentElement.style.removeProperty(CSS_VAR_CONTRAST)
  document.documentElement.style.removeProperty(CSS_VAR_TEXT_SHADOW)
  document.documentElement.classList.remove(
    "ally-vision-simulation",
    "ally-direct-filter",
    "ally-nearsighted",
    "ally-farsighted"
  )

  // Reset last values
  lastBlurAmount = ""
  lastAdditionalEffects = ""
}

// Create a debounced version of updateSimulation for better performance
const updateSimulationDebounced = debounce(
  updateSimulation,
  USER_PREFERENCES.updateDelay
)

/**
 * Start the visual acuity impairment simulation with the current settings
 */
function startSimulation() {
  state.isActive = true
  updateSimulationDebounced()

  // Publish state change
  eventBus.publish({
    type: "VISUAL_ACUITY_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      acuityType: state.acuityType,
      prescriptionStrength: state.prescriptionStrength
    }
  })
}

/**
 * Stop the visual acuity impairment simulation
 */
function stopSimulation() {
  state.isActive = false
  // Use immediate update to remove effects quickly
  updateSimulation()

  // Publish state change
  eventBus.publish({
    type: "VISUAL_ACUITY_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      acuityType: state.acuityType,
      prescriptionStrength: state.prescriptionStrength
    }
  })
}

/**
 * Set the type of visual acuity impairment to simulate
 * @param type The type of visual acuity impairment
 */
function setAcuityType(type: VisualAcuityType) {
  console.log(`[visual-acuity-simulator] Setting acuity type: ${type}`)
  state.acuityType = type
  updateSimulationDebounced()

  // Publish state change
  eventBus.publish({
    type: "VISUAL_ACUITY_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      acuityType: state.acuityType,
      prescriptionStrength: state.prescriptionStrength
    }
  })
}

/**
 * Set the strength of the visual acuity impairment
 * @param strength The strength of the impairment
 */
function setPrescriptionStrength(strength: PrescriptionStrength) {
  console.log(
    `[visual-acuity-simulator] Setting prescription strength: ${strength}`
  )
  state.prescriptionStrength = strength
  updateSimulationDebounced()

  // Publish state change
  eventBus.publish({
    type: "VISUAL_ACUITY_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      acuityType: state.acuityType,
      prescriptionStrength: state.prescriptionStrength
    }
  })
}

/**
 * Handle a command from the UI
 * @param command The command to execute
 * @param options Optional parameters for the command
 */
function handleCommand(command: string, options?: any) {
  console.log(`[visual-acuity-simulator] Received command: ${command}`, options)

  switch (command) {
    case "start":
      startSimulation()
      break
    case "stop":
      stopSimulation()
      break
    case "toggle":
      state.isActive ? stopSimulation() : startSimulation()
      break
    case "setType":
      if (options?.acuityType) {
        console.log(
          `[visual-acuity-simulator] Setting acuity type from command:`,
          options.acuityType
        )
        setAcuityType(options.acuityType)

        // If prescription strength is also provided, set it
        if (options?.prescriptionStrength) {
          console.log(
            `[visual-acuity-simulator] Setting prescription strength from command:`,
            options.prescriptionStrength
          )
          setPrescriptionStrength(options.prescriptionStrength)
        }
      }
      break
    case "setStrength":
      if (options?.prescriptionStrength) {
        console.log(
          `[visual-acuity-simulator] Setting strength from command:`,
          options.prescriptionStrength
        )
        setPrescriptionStrength(options.prescriptionStrength)
      }
      break
    default:
      console.warn(`[visual-acuity-simulator] Unknown command: ${command}`)
  }
}

/**
 * Initialize the visual acuity impairment simulator
 */
export function initialize() {
  console.log("[visual-acuity-simulator] Initializing")

  // Listen for commands from the UI
  const cleanup = eventBus.subscribe((event) => {
    if (event.type === "VISUAL_ACUITY_COMMAND") {
      handleCommand(event.data?.command, event.data?.options)
    }
  })

  // Cleanup function
  return () => {
    cleanup()
    stopSimulation()
  }
}
