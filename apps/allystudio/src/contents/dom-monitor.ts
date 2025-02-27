import { eventBus } from "@/lib/events/event-bus"
import type { DOMChangeEvent } from "@/lib/events/types"
import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// No need to initialize event bus as we're importing the singleton instance

/**
 * Types of DOM changes that might be relevant for accessibility testing
 */
export enum DOMChangeType {
  ELEMENT_ADDED = "element_added",
  ELEMENT_REMOVED = "element_removed",
  ATTRIBUTE_CHANGED = "attribute_changed",
  CONTENT_CHANGED = "content_changed"
}

/**
 * Information about a DOM change
 */
export interface DOMChange {
  type: DOMChangeType
  element: HTMLElement
  details?: {
    attributeName?: string
    oldValue?: string
    newValue?: string
  }
}

/**
 * Helper function to get a CSS selector for an element
 */
function getSelector(element: HTMLElement): string {
  try {
    // Try to get a unique selector for the element
    const tagName = element.tagName.toLowerCase()
    const id = element.id ? `#${element.id}` : ""

    // If we have an ID, use it
    if (id) return `${tagName}${id}`

    // Try to use classes if available
    const classes = Array.from(element.classList).join(".")
    if (classes) return `${tagName}.${classes}`

    // Fallback to a basic selector with position
    const parent = element.parentElement
    if (parent) {
      const siblings = Array.from(parent.children)
      const index = siblings.indexOf(element)
      return `${tagName}:nth-child(${index + 1})`
    }

    return tagName
  } catch (error) {
    return element.tagName.toLowerCase()
  }
}

/**
 * Helper function to get XPath for an element
 */
function getXPath(element: HTMLElement): string {
  try {
    const parts = []
    let node: Node | null = element

    while (node && node.nodeType === Node.ELEMENT_NODE) {
      let sibling: Node | null = node
      let siblingCount = 0

      while ((sibling = sibling.previousSibling)) {
        if (
          sibling.nodeType === Node.ELEMENT_NODE &&
          sibling.nodeName === node.nodeName
        ) {
          siblingCount++
        }
      }

      const tagName = (node as Element).nodeName.toLowerCase()
      const position = siblingCount > 0 ? `[${siblingCount + 1}]` : ""
      parts.unshift(`${tagName}${position}`)

      node = node.parentNode
    }

    return `//${parts.join("/")}`
  } catch (error) {
    return ""
  }
}

/**
 * Creates a DOM observer that detects changes while ignoring Plasmo UI elements
 * @param callback Function to call when DOM changes are detected
 * @param options Configuration options
 * @returns Cleanup function to disconnect the observer
 */
export function createDOMObserver(
  callback: (changes: DOMChange[]) => void,
  options = {
    ignorePlasmo: true,
    maxChanges: 50, // Maximum changes to report at once
    observeText: true, // Whether to observe text content changes
    animationFilterThreshold: 3, // Number of times an element can change in rapid succession before being filtered
    animationFilterWindow: 1000, // Time window in ms for animation detection
    ignoreClassChanges: true, // Whether to ignore class attribute changes (often used for animations)
    ignoreStyleChanges: true, // Whether to ignore style attribute changes (often used for animations)
    ignoreHiddenElements: true, // Whether to ignore changes to hidden elements
    batchInterval: 50, // Time in ms to batch changes before reporting
    emitEvents: true, // Whether to emit events to the event bus
    enableLogging: false, // Whether to log changes to the console
    logInterval: 500 // Time in ms to batch logs
  }
): () => void {
  // Track elements that change frequently (likely animations) using WeakMap to prevent memory leaks
  const animatedElements = new WeakMap<
    HTMLElement,
    {
      count: number
      lastSeen: number
      ignored: boolean
    }
  >()

  // Track the current batch of changes
  let pendingChanges: DOMChange[] = []
  let batchTimer: number | null = null

  // For batched logging
  let logTimeout: number | null = null
  const batchedLogs: DOMChange[][] = []

  // Debounced logging function
  const logChanges = (changes: DOMChange[]) => {
    if (!options.enableLogging) return

    batchedLogs.push(changes)
    if (!logTimeout) {
      logTimeout = window.setTimeout(() => {
        console.group("[DOM Monitor] Changes Detected")
        console.log(`Total batches: ${batchedLogs.length}`)
        console.log(`Total changes: ${batchedLogs.flat().length}`)
        console.log(
          "%cTip: Click on any element in the logs to inspect it in the Elements panel",
          "color: #4CAF50; font-weight: bold"
        )

        // Log summary by type
        const summary = batchedLogs.flat().reduce(
          (acc, change) => {
            acc[change.type] = (acc[change.type] || 0) + 1
            return acc
          },
          {} as Record<string, number>
        )

        console.log("Changes by type:", summary)

        // Log detailed changes if there aren't too many
        if (batchedLogs.flat().length <= 10) {
          console.groupCollapsed("Detailed changes (click to expand)")

          // Group changes by type for better readability
          const changesByType: Record<string, DOMChange[]> = {}

          batchedLogs.flat().forEach((change) => {
            const type = change.type
            if (!changesByType[type]) {
              changesByType[type] = []
            }
            changesByType[type].push(change)
          })

          // Log each type of change in its own group
          Object.entries(changesByType).forEach(([type, changes]) => {
            console.groupCollapsed(`${type} (${changes.length})`)

            changes.forEach((change) => {
              // Log the element directly so it's clickable in dev tools
              console.log({
                type: change.type,
                element: change.element, // This will be clickable
                selector: getSelector(change.element),
                tagName: change.element.tagName.toLowerCase(),
                textContent: change.element.textContent?.slice(0, 100) || "",
                details: change.details || {}
              })
            })

            console.groupEnd()
          })

          console.groupEnd()
        } else {
          console.log(
            "%cToo many changes to display details. Enable filtering or reduce the batch interval.",
            "color: #F44336"
          )
        }

        console.groupEnd()
        batchedLogs.length = 0
        logTimeout = null
      }, options.logInterval)
    }
  }

  // Check if an element is likely part of an animation
  const isAnimatedElement = (
    element: HTMLElement,
    attributeName?: string
  ): boolean => {
    const now = performance.now()

    // Skip animation detection for non-style/class changes if configured
    if (
      attributeName &&
      ((attributeName === "class" && !options.ignoreClassChanges) ||
        (attributeName === "style" && !options.ignoreStyleChanges))
    ) {
      return false
    }

    // Get or create tracking info
    let info = animatedElements.get(element)
    if (!info) {
      info = { count: 0, lastSeen: now, ignored: false }
      animatedElements.set(element, info)
    }

    // Reset counter if it's been a while since last change
    if (now - info.lastSeen > options.animationFilterWindow) {
      info.count = 0
      info.ignored = false
    }

    // Update tracking info
    info.count++
    info.lastSeen = now

    // Mark as animated if it changes too frequently
    if (info.count >= options.animationFilterThreshold) {
      info.ignored = true
    }

    return info.ignored
  }

  // Check if we should ignore this element
  const shouldIgnoreElement = (element: HTMLElement): boolean => {
    // Ignore Plasmo UI elements
    if (
      options.ignorePlasmo &&
      (element.tagName.toLowerCase() === "plasmo-csui" ||
        element.closest("plasmo-csui"))
    ) {
      return true
    }

    // Ignore script and style elements
    const tagName = element.tagName.toLowerCase()
    if (
      tagName === "script" ||
      tagName === "style" ||
      tagName === "link" ||
      tagName === "meta" ||
      tagName === "noscript"
    ) {
      return true
    }

    // Ignore hidden elements if configured
    if (options.ignoreHiddenElements) {
      // Check if element is hidden via CSS
      const style = window.getComputedStyle(element)
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0" ||
        element.hasAttribute("hidden")
      ) {
        return true
      }
    }

    return false
  }

  // Process and report changes
  const processBatch = () => {
    batchTimer = null

    if (pendingChanges.length === 0) return

    // Limit the number of changes to avoid overwhelming the callback
    const changesToReport = pendingChanges.slice(0, options.maxChanges)
    pendingChanges =
      pendingChanges.length > options.maxChanges
        ? pendingChanges.slice(options.maxChanges)
        : []

    // Call the callback with the changes
    callback(changesToReport)

    // Log changes if enabled
    if (options.enableLogging) {
      logChanges(changesToReport)
    }

    // Emit events if enabled
    if (options.emitEvents) {
      // Group changes by type for more efficient event emission
      const addedElements: HTMLElement[] = []
      const removedElements: HTMLElement[] = []
      const attributeChangedElements: HTMLElement[] = []
      const contentChangedElements: HTMLElement[] = []

      changesToReport.forEach((change) => {
        switch (change.type) {
          case DOMChangeType.ELEMENT_ADDED:
            addedElements.push(change.element)
            break
          case DOMChangeType.ELEMENT_REMOVED:
            removedElements.push(change.element)
            break
          case DOMChangeType.ATTRIBUTE_CHANGED:
            attributeChangedElements.push(change.element)
            break
          case DOMChangeType.CONTENT_CHANGED:
            contentChangedElements.push(change.element)
            break
        }
      })

      // Emit events for each type of change
      if (addedElements.length > 0) {
        emitDOMChangeEvent(addedElements, "added")
      }

      if (removedElements.length > 0) {
        emitDOMChangeEvent(removedElements, "removed")
      }

      if (attributeChangedElements.length > 0) {
        emitDOMChangeEvent(attributeChangedElements, "attribute")
      }

      if (contentChangedElements.length > 0) {
        emitDOMChangeEvent(contentChangedElements, "text")
      }
    }

    // Schedule processing of any remaining changes
    if (pendingChanges.length > 0) {
      scheduleBatch()
    }
  }

  // Helper function to emit DOM change events
  const emitDOMChangeEvent = (
    elements: HTMLElement[],
    changeType: "added" | "removed" | "attribute" | "text"
  ) => {
    const elementData = elements.map((element) => ({
      selector: getSelector(element),
      tagName: element.tagName.toLowerCase(),
      textContent: element.textContent?.slice(0, 100) || undefined,
      xpath: getXPath(element)
    }))

    eventBus.publish({
      type: "DOM_CHANGE",
      timestamp: performance.now(),
      data: {
        elements: elementData,
        changeType,
        timestamp: Date.now()
      }
    } as DOMChangeEvent)
  }

  // Schedule batch processing
  const scheduleBatch = () => {
    if (batchTimer !== null) return
    batchTimer = window.setTimeout(processBatch, options.batchInterval)
  }

  // Create the observer
  const observer = new MutationObserver((mutations) => {
    // Pre-filter mutations to avoid unnecessary processing
    const relevantMutations = mutations.filter((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.target instanceof HTMLElement
      ) {
        const attributeName = mutation.attributeName || ""
        // Skip class/style changes if configured
        if (
          (attributeName === "class" && options.ignoreClassChanges) ||
          (attributeName === "style" && options.ignoreStyleChanges)
        ) {
          return false
        }
        return !shouldIgnoreElement(mutation.target)
      }
      return true
    })

    if (relevantMutations.length === 0) return

    let hasChanges = false

    for (const mutation of relevantMutations) {
      // For added/removed nodes
      if (mutation.type === "childList") {
        // Process added nodes
        mutation.addedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            !shouldIgnoreElement(node) &&
            !isAnimatedElement(node)
          ) {
            pendingChanges.push({
              type: DOMChangeType.ELEMENT_ADDED,
              element: node
            })
            hasChanges = true
          }
        })

        // Process removed nodes
        mutation.removedNodes.forEach((node) => {
          if (
            node instanceof HTMLElement &&
            !shouldIgnoreElement(node) &&
            !isAnimatedElement(node)
          ) {
            pendingChanges.push({
              type: DOMChangeType.ELEMENT_REMOVED,
              element: node
            })
            hasChanges = true
          }
        })
      }

      // For attribute changes
      if (
        mutation.type === "attributes" &&
        mutation.target instanceof HTMLElement
      ) {
        const attributeName = mutation.attributeName || ""

        // Skip if this element is being animated
        if (isAnimatedElement(mutation.target, attributeName)) {
          continue
        }

        pendingChanges.push({
          type: DOMChangeType.ATTRIBUTE_CHANGED,
          element: mutation.target,
          details: {
            attributeName,
            oldValue: mutation.oldValue || "",
            newValue: mutation.target.getAttribute(attributeName) || ""
          }
        })
        hasChanges = true
      }

      // For text content changes
      if (
        options.observeText &&
        mutation.type === "characterData" &&
        mutation.target.parentElement &&
        !shouldIgnoreElement(mutation.target.parentElement) &&
        !isAnimatedElement(mutation.target.parentElement)
      ) {
        pendingChanges.push({
          type: DOMChangeType.CONTENT_CHANGED,
          element: mutation.target.parentElement,
          details: {
            oldValue: mutation.oldValue || "",
            newValue: mutation.target.textContent || ""
          }
        })
        hasChanges = true
      }
    }

    // Schedule processing if we have changes
    if (hasChanges) {
      scheduleBatch()
    }
  })

  // Start observing
  observer.observe(document.body, {
    childList: true, // Watch for added/removed nodes
    subtree: true, // Watch the entire DOM tree
    attributes: true, // Watch all attributes
    attributeOldValue: true, // Track old attribute values
    characterData: options.observeText, // Watch text changes
    characterDataOldValue: options.observeText // Track old text values
  })

  // Return cleanup function
  return () => {
    if (batchTimer !== null) {
      clearTimeout(batchTimer)
      batchTimer = null
    }

    if (logTimeout !== null) {
      clearTimeout(logTimeout)
      logTimeout = null
    }

    observer.disconnect()
    pendingChanges = []
    batchedLogs.length = 0
  }
}

// Initialize storage
const storage = new Storage()

// Track the current observer cleanup function
let currentObserverCleanup: (() => void) | null = null

// Track logging state
let loggingEnabled = false

// Function to start the DOM monitor
async function startDOMMonitor() {
  if (currentObserverCleanup) return

  // Get logging state from storage
  try {
    loggingEnabled = (await storage.get("dom_monitor_logging_enabled")) || false
  } catch (error) {
    console.warn(
      "[DOM Monitor] Failed to read logging state, defaulting to disabled"
    )
    loggingEnabled = false
  }

  console.log(
    `[DOM Monitor] Starting DOM monitor (logging: ${loggingEnabled ? "enabled" : "disabled"})`
  )
  currentObserverCleanup = createDOMObserver(
    (changes) => {
      // Process DOM changes if needed
    },
    {
      // Default options
      ignorePlasmo: true,
      maxChanges: 50,
      observeText: true,
      animationFilterThreshold: 3,
      animationFilterWindow: 1000,
      ignoreClassChanges: true,
      ignoreStyleChanges: true,
      ignoreHiddenElements: true,
      batchInterval: 50,
      emitEvents: true,
      enableLogging: loggingEnabled,
      logInterval: 500
    }
  )
}

// Function to stop the DOM monitor
function stopDOMMonitor() {
  if (currentObserverCleanup) {
    console.log("[DOM Monitor] Stopping DOM monitor")
    currentObserverCleanup()
    currentObserverCleanup = null
  }
}

// Function to toggle logging
async function toggleLogging(enabled: boolean) {
  loggingEnabled = enabled

  // Store the logging state
  await storage.set("dom_monitor_logging_enabled", enabled)

  // Restart the monitor to apply the new logging state
  if (currentObserverCleanup) {
    stopDOMMonitor()
    startDOMMonitor()
  }

  console.log(`[DOM Monitor] Logging ${enabled ? "enabled" : "disabled"}`)
}

// Check if the monitor should be enabled on startup
async function initializeDOMMonitor() {
  let enabled = false
  try {
    enabled = (await storage.get("dom_monitor_enabled")) || false
    loggingEnabled = (await storage.get("dom_monitor_logging_enabled")) || false
  } catch (error) {
    console.warn(
      "[DOM Monitor] Failed to read storage, defaulting to disabled."
    )
  }

  if (enabled) {
    startDOMMonitor()
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "DOM_MONITOR_STATE_CHANGE") {
    if (message.enabled) {
      startDOMMonitor()
    } else {
      stopDOMMonitor()
    }
  } else if (message.type === "DOM_MONITOR_LOGGING_CHANGE") {
    toggleLogging(message.enabled)
  }
  return true
})

// Initialize on content script load
initializeDOMMonitor()

// Clean up when the page unloads
window.addEventListener("unload", () => {
  if (currentObserverCleanup) {
    currentObserverCleanup()
  }
})

// Export functions for external use
export { toggleLogging }
