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

// CSS for the different vision impairment types and strengths
const getVisionImpairmentCss = () => {
  const baseStyles = {
    [VisualAcuityType.NORMAL]: ""
  }

  // Get prescription-strength-based blur for refractive errors
  const blurValues = {
    mild: { nearsighted: "1px", farsighted: "0.5px" },
    moderate: { nearsighted: "2px", farsighted: "1px" },
    severe: { nearsighted: "3px", farsighted: "2px" }
  }

  const nearsightedBlur = blurValues[state.prescriptionStrength].nearsighted
  const farsightedBlur = blurValues[state.prescriptionStrength].farsighted

  return {
    ...baseStyles,
    [VisualAcuityType.NEARSIGHTED]: `
      filter: blur(${nearsightedBlur});
    `,
    [VisualAcuityType.FARSIGHTED]: `
      filter: blur(${farsightedBlur});
    `
  }
}

// IDs for elements we add to the page
const OVERLAY_ID = "ally-acuity-simulator-overlay"
const STYLES_ID = "ally-acuity-simulator-styles"

/**
 * Create or update the overlay that applies the visual acuity impairment simulation
 */
function updateSimulation() {
  let overlay = document.getElementById(OVERLAY_ID)
  let styleEl = document.getElementById(STYLES_ID)

  if (!state.isActive) {
    // Remove elements if simulation is not active
    if (overlay) overlay.remove()
    if (styleEl) styleEl.remove()
    return
  }

  // Create elements if they don't exist
  if (!overlay) {
    overlay = document.createElement("div")
    overlay.id = OVERLAY_ID
    document.body.appendChild(overlay)
  }

  if (!styleEl) {
    styleEl = document.createElement("style")
    styleEl.id = STYLES_ID
    document.head.appendChild(styleEl)
  }

  // Get the CSS for the current acuity type
  const impairmentStyles = getVisionImpairmentCss()
  const css = impairmentStyles[state.acuityType]

  // Update the overlay style based on current state
  styleEl.textContent = `
    #${OVERLAY_ID} {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
      z-index: 2147483647;
      ${css}
    }

    /* Apply acuity filters directly to the page if supported */
    ${
      state.acuityType !== VisualAcuityType.NORMAL
        ? `
    html.ally-direct-filter {
      ${css.replace("filter:", "filter:").trim()}
      #${OVERLAY_ID} {
        display: none;
      }
    }
    `
        : ""
    }
  `

  // Try to apply filter directly to html element for better performance
  if (state.acuityType !== VisualAcuityType.NORMAL) {
    document.documentElement.classList.add("ally-direct-filter")
  } else {
    document.documentElement.classList.remove("ally-direct-filter")
  }
}

/**
 * Start the visual acuity impairment simulation with the current settings
 */
function startSimulation() {
  state.isActive = true
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
 * Stop the visual acuity impairment simulation
 */
function stopSimulation() {
  state.isActive = false
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
  state.acuityType = type
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
 * Set the prescription strength for refractive errors
 * @param strength The prescription strength
 */
function setPrescriptionStrength(strength: PrescriptionStrength) {
  state.prescriptionStrength = strength
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
 * Handle commands from the UI
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
      if (options && options.acuityType) {
        setAcuityType(options.acuityType)
      }
      break
    case "setStrength":
      if (options && options.prescriptionStrength) {
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
