import { eventBus } from "@/lib/events/event-bus"

// Types of color vision deficiencies
export enum ColorVisionType {
  PROTANOPIA = "protanopia", // Red-blind
  DEUTERANOPIA = "deuteranopia", // Green-blind
  TRITANOPIA = "tritanopia", // Blue-blind
  ACHROMATOPSIA = "achromatopsia", // Total color blindness
  NORMAL = "normal" // Normal vision (no simulation)
}

// State for the simulator
interface SimulatorState {
  isActive: boolean
  visionType: ColorVisionType
}

// Default state
const state: SimulatorState = {
  isActive: false,
  visionType: ColorVisionType.PROTANOPIA
}

// CSS for the different color vision deficiency types
const colorDeficiencyCss = {
  [ColorVisionType.PROTANOPIA]: `
    filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='protanopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.567, 0.433, 0, 0, 0, 0.558, 0.442, 0, 0, 0, 0, 0.242, 0.758, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#protanopia");
  `,
  [ColorVisionType.DEUTERANOPIA]: `
    filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='deuteranopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.625, 0.375, 0, 0, 0, 0.7, 0.3, 0, 0, 0, 0, 0.3, 0.7, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#deuteranopia");
  `,
  [ColorVisionType.TRITANOPIA]: `
    filter: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='tritanopia'><feColorMatrix in='SourceGraphic' type='matrix' values='0.95, 0.05, 0, 0, 0, 0, 0.433, 0.567, 0, 0, 0, 0.475, 0.525, 0, 0, 0, 0, 0, 1, 0'/></filter></svg>#tritanopia");
  `,
  [ColorVisionType.ACHROMATOPSIA]: `
    filter: grayscale(100%);
  `,
  [ColorVisionType.NORMAL]: ""
}

// IDs for elements we add to the page
const OVERLAY_ID = "ally-color-vision-simulator-overlay"
const STYLES_ID = "ally-color-vision-simulator-styles"

/**
 * Create or update the overlay that applies the color vision deficiency simulation
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

  // Get the CSS for the current vision type
  const css = colorDeficiencyCss[state.visionType]

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

    /* Apply to the entire page if directly supported by the browser */
    ${
      state.visionType !== ColorVisionType.NORMAL
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
  if (state.visionType !== ColorVisionType.NORMAL) {
    document.documentElement.classList.add("ally-direct-filter")
  } else {
    document.documentElement.classList.remove("ally-direct-filter")
  }
}

/**
 * Start the color vision deficiency simulation with the current settings
 */
function startSimulation() {
  state.isActive = true
  updateSimulation()

  // Publish state change
  eventBus.publish({
    type: "VISION_SIMULATOR_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      visionType: state.visionType
    }
  })
}

/**
 * Stop the color vision deficiency simulation
 */
function stopSimulation() {
  state.isActive = false
  updateSimulation()

  // Publish state change
  eventBus.publish({
    type: "VISION_SIMULATOR_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      visionType: state.visionType
    }
  })
}

/**
 * Set the type of color vision deficiency to simulate
 * @param type The type of color vision deficiency
 */
function setVisionType(type: ColorVisionType) {
  state.visionType = type
  updateSimulation()

  // Publish state change
  eventBus.publish({
    type: "VISION_SIMULATOR_STATE_CHANGE",
    timestamp: Date.now(),
    data: {
      isActive: state.isActive,
      visionType: state.visionType
    }
  })
}

/**
 * Handle commands from the UI
 */
function handleCommand(command: string, options?: any) {
  console.log(`[color-vision-simulator] Received command: ${command}`, options)

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
      if (options && options.visionType) {
        setVisionType(options.visionType)
      }
      break
    default:
      console.warn(`[color-vision-simulator] Unknown command: ${command}`)
  }
}

/**
 * Initialize the color vision deficiency simulator
 */
export function initialize() {
  console.log("[color-vision-simulator] Initializing")

  // Listen for commands from the UI
  const cleanup = eventBus.subscribe((event) => {
    if (event.type === "VISION_SIMULATOR_COMMAND") {
      handleCommand(event.data?.command, event.data?.options)
    }
  })

  // Cleanup function
  return () => {
    cleanup()
    stopSimulation()
  }
}
