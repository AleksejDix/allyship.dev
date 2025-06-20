import { createFocusOrderVisualizer } from "@allystudio/focus-order-visualizer"
import { eventBus } from "@/lib/events/event-bus"
import type {
  FocusOrderCommandEvent,
  FocusOrderStatsEvent
} from "@/lib/events/types"

// Track visualizer instance and state
let focusOrderVisualizer: ReturnType<typeof createFocusOrderVisualizer> | null = null
let isVisualizingFocusOrder = false

/**
 * Get or create the focus order visualizer instance
 */
function getVisualizer() {
  if (!focusOrderVisualizer) {
    focusOrderVisualizer = createFocusOrderVisualizer({
      colors: {
        overlay: "#2563eb",
        overlayText: "#ffffff",
        connectingLine: "#2563eb"
      },
      showConnectingLines: true,
      overlaySize: 26
    })
  }
  return focusOrderVisualizer
}

/**
 * Start visualizing focus order
 */
export function startVisualizingFocusOrder(): void {
  if (isVisualizingFocusOrder) return

  const visualizer = getVisualizer()
  visualizer.start()
  isVisualizingFocusOrder = true

    // Get stats from the visualizer
  const stats = visualizer.getStats()

  // Publish stats about focus order
  const statsEvent: FocusOrderStatsEvent = {
    type: "FOCUS_ORDER_STATS",
    timestamp: Date.now(),
    data: {
      total: stats.total,
      positiveTabIndex: stats.positiveTabIndex
    }
  }

  eventBus.publish(statsEvent)

  console.log(
    `Focus order visualization started with ${stats.total} elements`
  )
}

/**
 * Stop visualizing focus order
 */
export function stopVisualizingFocusOrder(): void {
  if (!isVisualizingFocusOrder) return

  const visualizer = getVisualizer()
  visualizer.stop()
  isVisualizingFocusOrder = false

  console.log("Focus order visualization stopped")
}

/**
 * Toggle focus order visualization
 */
export function toggleFocusOrderVisualization(): boolean {
  if (isVisualizingFocusOrder) {
    stopVisualizingFocusOrder()
  } else {
    startVisualizingFocusOrder()
  }

  return isVisualizingFocusOrder
}

/**
 * Get current visualization state
 */
export function getFocusOrderVisualizationState(): boolean {
  return isVisualizingFocusOrder
}

/**
 * Handle window resize to reposition overlays
 */
function handleResize(): void {
  if (isVisualizingFocusOrder) {
    // The new package handles resize automatically
    // Just refresh the stats
    const visualizer = getVisualizer()
    const stats = visualizer.getStats()

    const statsEvent: FocusOrderStatsEvent = {
      type: "FOCUS_ORDER_STATS",
      timestamp: Date.now(),
      data: {
        total: stats.total,
        positiveTabIndex: stats.positiveTabIndex
      }
    }

    eventBus.publish(statsEvent)
  }
}

/**
 * Handle focus order command events
 */
function handleFocusOrderCommand(event: FocusOrderCommandEvent): void {
  const { command } = event.data

  switch (command) {
    case "start":
      startVisualizingFocusOrder()
      break
    case "stop":
      stopVisualizingFocusOrder()
      break
    case "toggle":
      toggleFocusOrderVisualization()
      break
    default:
      console.warn(`Unknown focus order command: ${command}`)
  }
}

/**
 * Initialize the focus order visualizer
 */
export function initialize(): void {
  // Subscribe to focus order commands
  eventBus.subscribe((event) => {
    if (event.type === "FOCUS_ORDER_COMMAND") {
      handleFocusOrderCommand(event as FocusOrderCommandEvent)
    }
  })

  // Handle window resize
  window.addEventListener("resize", handleResize)

  // Handle scroll events to reposition overlays
  window.addEventListener("scroll", handleResize)

  console.log("Focus order visualizer initialized")
}

// Auto-initialize when imported in content script
if (typeof window !== "undefined") {
  initialize()
}
