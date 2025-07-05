import { eventBus } from "@/lib/events/event-bus"
import { generateSelector } from "@allystudio/accessibility-utils"
import { DOMChangeType, monitorDOM } from "@allystudio/dom-monitor"
import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Storage for state management
const storage = new Storage()
let monitor: ReturnType<typeof monitorDOM> | null = null
let isEnabled = false
let loggingEnabled = false

/**
 * Start DOM monitoring using the new package
 */
async function startDOMMonitor() {
  if (monitor) return

  console.log(
    "%c[Modern DOM Monitor] Starting with @allystudio/dom-monitor",
    "color: #3B82F6; font-weight: bold"
  )

  monitor = monitorDOM(
    (changes) => {
      // Emit DOM change events for each type
      const elementData = changes.map((change) => ({
        selector: generateSelector(change.element),
        tagName: change.element.tagName.toLowerCase(),
        textContent: change.element.textContent?.slice(0, 100) || undefined,
        changeType: change.type,
        details: change.details
      }))

      // Group by change type and emit events
      const changesByType = changes.reduce(
        (acc, change) => {
          if (!acc[change.type]) acc[change.type] = []
          acc[change.type].push(change.element)
          return acc
        },
        {} as Record<string, HTMLElement[]>
      )

      Object.entries(changesByType).forEach(([type, elements]) => {
        const changeType = mapDOMChangeTypeToEventType(type as DOMChangeType)

        eventBus.publish({
          type: "DOM_CHANGE",
          timestamp: performance.now(),
          data: {
            elements: elements.map((el) => ({
              selector: generateSelector(el),
              tagName: el.tagName.toLowerCase(),
              textContent: el.textContent?.slice(0, 100) || undefined
            })),
            changeType,
            timestamp: Date.now()
          }
        })
      })
    },
    {
      // 120 FPS Performance Configuration
      maxChanges: 10, // Reduced for high frame rate
      targetFrameRate: 120,

      // Performance optimizations
      ignoreClassChanges: true,
      ignoreStyleChanges: true,
      ignoreHiddenElements: true,

      // Advanced features
      trackPerformance: true,
      trackAccessibility: true,
      debug: loggingEnabled,

      // Custom filters for AllyStudio
      elementFilter: (element) => {
        // Ignore Plasmo UI elements
        if (
          element.tagName.toLowerCase() === "plasmo-csui" ||
          element.closest("plasmo-csui")
        ) {
          return false
        }
        return true
      },

      attributeFilter: (attributeName, element) => {
        // Focus on accessibility-relevant attributes
        const relevantAttributes = [
          "aria-expanded",
          "aria-selected",
          "aria-checked",
          "aria-disabled",
          "aria-hidden",
          "aria-label",
          "aria-labelledby",
          "aria-describedby",
          "role",
          "tabindex",
          "alt",
          "title",
          "data-testid"
        ]
        return relevantAttributes.includes(attributeName)
      }
    }
  )

  isEnabled = true

  // Start performance logging if enabled
  if (loggingEnabled) {
    startPerformanceLogging()
  }
}

/**
 * Stop DOM monitoring
 */
function stopDOMMonitor() {
  if (monitor) {
    console.log(
      "%c[Modern DOM Monitor] Stopping",
      "color: #3B82F6; font-weight: bold"
    )
    monitor.stop()
    monitor = null
  }

  // Stop performance logging
  stopPerformanceLogging()

  isEnabled = false
}

/**
 * Toggle logging state
 */
async function toggleLogging(enabled: boolean) {
  loggingEnabled = enabled
  await storage.set("dom_monitor_logging_enabled", enabled)

  // Restart monitor to apply new logging state
  if (isEnabled) {
    stopDOMMonitor()
    await startDOMMonitor()
  }

  console.log(
    `%c[Modern DOM Monitor] Logging ${enabled ? "enabled" : "disabled"}`,
    `color: ${enabled ? "#3B82F6" : "#6B7280"}; font-weight: bold`
  )
}

/**
 * Get performance metrics from the DOM monitor
 */
function getPerformanceMetrics() {
  if (!monitor) return null

  const metrics = monitor.getMetrics()
  return {
    ...metrics,
    effectiveFrameRate:
      metrics.changesPerSecond > 0
        ? Math.min(120, 1000 / (metrics.averageProcessingTime || 1))
        : 120
  }
}

// Performance logging state
let performanceLogInterval: ReturnType<typeof setInterval> | null = null

/**
 * Log performance metrics periodically when logging is enabled
 */
function startPerformanceLogging() {
  if (!loggingEnabled || performanceLogInterval) return

  performanceLogInterval = setInterval(() => {
    const metrics = getPerformanceMetrics()
    if (metrics && metrics.totalChanges > 0) {
      console.log(
        "%c[Modern DOM Monitor] Performance Metrics",
        "color: #10B981; font-weight: bold",
        {
          totalChanges: metrics.totalChanges,
          changesPerSecond: metrics.changesPerSecond.toFixed(1),
          effectiveFrameRate: metrics.effectiveFrameRate.toFixed(1) + " FPS",
          averageProcessingTime:
            metrics.averageProcessingTime.toFixed(2) + "ms",
          droppedChanges: metrics.droppedChanges
        }
      )
    }
  }, 5000) // Log every 5 seconds
}

/**
 * Stop performance logging
 */
function stopPerformanceLogging() {
  if (performanceLogInterval) {
    clearInterval(performanceLogInterval)
    performanceLogInterval = null
  }
}

/**
 * Map DOM change types to event types for compatibility
 */
function mapDOMChangeTypeToEventType(
  changeType: DOMChangeType
): "added" | "removed" | "attribute" | "text" {
  switch (changeType) {
    case DOMChangeType.ELEMENT_ADDED:
      return "added"
    case DOMChangeType.ELEMENT_REMOVED:
      return "removed"
    case DOMChangeType.ATTRIBUTE_CHANGED:
      return "attribute"
    case DOMChangeType.CONTENT_CHANGED:
      return "text"
    default:
      return "added" // Default fallback
  }
}

/**
 * Initialize the modern DOM monitor
 */
async function initializeModernDOMMonitor() {
  try {
    const enabled = (await storage.get("dom_monitor_enabled")) || false
    loggingEnabled = (await storage.get("dom_monitor_logging_enabled")) || false

    if (enabled) {
      await startDOMMonitor()
    }
  } catch (error) {
    console.warn(
      "%c[Modern DOM Monitor] Failed to read storage, defaulting to disabled.",
      "color: #F59E0B; font-weight: bold"
    )
  }
}

// Listen for messages from the background script and UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "DOM_MONITOR_STATE_CHANGE") {
    if (message.enabled) {
      startDOMMonitor()
    } else {
      stopDOMMonitor()
    }
  } else if (message.type === "DOM_MONITOR_LOGGING_CHANGE") {
    toggleLogging(message.enabled)
  } else if (message.type === "GET_DOM_MONITOR_METRICS") {
    // Send performance metrics to the UI
    const metrics = getPerformanceMetrics()
    if (metrics) {
      chrome.runtime.sendMessage({
        type: "DOM_MONITOR_METRICS",
        data: metrics
      })
    }
    sendResponse(metrics)
  }
  return true
})

// Initialize on content script load
initializeModernDOMMonitor()

// Clean up when the page unloads
window.addEventListener("unload", () => {
  if (monitor) {
    monitor.stop()
  }
})

// Export for external use
export { toggleLogging }
