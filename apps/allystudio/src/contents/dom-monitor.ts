import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

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
    batchInterval: 50 // Time in ms to batch changes before reporting
  }
): () => void {
  // Track elements that change frequently (likely animations)
  const animatedElements = new Map<
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

    callback(changesToReport)

    // Schedule processing of any remaining changes
    if (pendingChanges.length > 0) {
      scheduleBatch()
    }
  }

  // Schedule batch processing
  const scheduleBatch = () => {
    if (batchTimer !== null) return
    batchTimer = window.setTimeout(processBatch, options.batchInterval)
  }

  // Create the observer
  const observer = new MutationObserver((mutations) => {
    let hasChanges = false

    for (const mutation of mutations) {
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
        mutation.target instanceof HTMLElement &&
        !shouldIgnoreElement(mutation.target)
      ) {
        const attributeName = mutation.attributeName || ""

        // Skip class/style changes if configured
        if (
          (attributeName === "class" && options.ignoreClassChanges) ||
          (attributeName === "style" && options.ignoreStyleChanges)
        ) {
          continue
        }

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

  // Periodically clean up the animation tracking map to prevent memory leaks
  const cleanupInterval = setInterval(() => {
    const now = performance.now()
    animatedElements.forEach((info, element) => {
      if (now - info.lastSeen > options.animationFilterWindow * 2) {
        animatedElements.delete(element)
      }
    })
  }, options.animationFilterWindow * 2)

  // Return cleanup function
  return () => {
    if (batchTimer !== null) {
      clearTimeout(batchTimer)
      batchTimer = null
    }

    clearInterval(cleanupInterval)
    observer.disconnect()
    pendingChanges = []
    animatedElements.clear()
  }
}

// Initialize the observer with a callback that logs changes
const cleanup = createDOMObserver((changes) => {
  console.log("[DOM Monitor] DOM changes detected:", changes)
})

// Clean up when the page unloads
window.addEventListener("unload", cleanup)
