import { eventBus } from "@/lib/events/event-bus"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Track inspection state
let isInspecting = false
let hoveredElement: HTMLElement | null = null
let lastHighlightTimestamp = 0
const THROTTLE_MS = 0 // No throttling for maximum responsiveness
let selectorCache = new WeakMap<Element, string>()
let elementDetailsCache = new WeakMap<Element, string>()
let deepInspectionMode = false // Toggle for deep inspection mode
let debugMode = false // Toggle for debug mode
let clickThroughMode = true // Enable click-through mode by default

// Pre-compile frequently used regexes
const idRegex = /^[a-zA-Z][\w-]*$/

// Direct DOM manipulation for warp-speed highlighting
let highlightBox: HTMLElement | null = null
let tooltipElement: HTMLElement | null = null

// Pre-allocated strings for performance
const FIXED = "fixed"
const NONE = "none"
const BLOCK = "block"
const PX = "px"

// Use GPU acceleration for maximum performance
const GPU_ACCELERATED_STYLES = {
  transform: "translateZ(0)",
  backfaceVisibility: "hidden",
  perspective: "1000px",
  willChange: "transform, opacity"
}

// Pre-compute common values
const MAX_Z_INDEX = "2147483647"
const HIGHLIGHT_COLOR = "#4f46e5"
const HIGHLIGHT_BG = "rgba(79, 70, 229, 0.1)"

// Initialize highlight elements with GPU acceleration
function createHighlightElements() {
  // Create highlight box if it doesn't exist
  if (!highlightBox) {
    highlightBox = document.createElement("div")
    highlightBox.setAttribute("data-highlight-box", "true")

    // Apply styles directly for maximum performance
    const style = highlightBox.style
    style.position = FIXED
    style.pointerEvents = NONE // Ensure pointer events pass through
    style.zIndex = MAX_Z_INDEX
    style.border = `2px solid ${HIGHLIGHT_COLOR}`
    style.backgroundColor = HIGHLIGHT_BG
    style.boxSizing = "border-box"
    style.display = NONE

    // Apply GPU acceleration
    style.transform = GPU_ACCELERATED_STYLES.transform
    style.backfaceVisibility = GPU_ACCELERATED_STYLES.backfaceVisibility
    style.perspective = GPU_ACCELERATED_STYLES.perspective
    style.willChange = GPU_ACCELERATED_STYLES.willChange

    document.body.appendChild(highlightBox)
  }

  // Create tooltip if it doesn't exist
  if (!tooltipElement) {
    tooltipElement = document.createElement("div")
    tooltipElement.setAttribute("role", "tooltip")

    // Apply styles directly for maximum performance
    const style = tooltipElement.style
    style.position = FIXED
    style.pointerEvents = "auto" // Allow clicks on tooltip
    style.cursor = "pointer" // Show pointer cursor
    style.zIndex = MAX_Z_INDEX
    style.backgroundColor = "#1e1e1e"
    style.color = "white"
    style.padding = "4px 8px"
    style.borderRadius = "4px"
    style.fontSize = "12px"
    style.fontFamily = "monospace"
    style.maxWidth = "300px"
    style.wordBreak = "break-all"
    style.display = NONE

    // Apply GPU acceleration
    style.transform = GPU_ACCELERATED_STYLES.transform
    style.backfaceVisibility = GPU_ACCELERATED_STYLES.backfaceVisibility
    style.perspective = GPU_ACCELERATED_STYLES.perspective
    style.willChange = GPU_ACCELERATED_STYLES.willChange

    // Add click handler to copy selector
    tooltipElement.addEventListener("click", (e) => {
      e.stopPropagation()

      // Get the selector from the tooltip
      const selectorElement = tooltipElement?.querySelector(
        ".selector-text"
      ) as HTMLElement | null
      if (selectorElement) {
        const selector = selectorElement.textContent || ""

        // Copy to clipboard
        navigator.clipboard
          .writeText(selector)
          .then(() => {
            // Show copied indicator
            const originalText = selectorElement.textContent
            selectorElement.textContent = "✓ Copied to clipboard!"
            selectorElement.style.color = "#10b981" // Green color

            // Reset after 1.5 seconds
            setTimeout(() => {
              if (selectorElement) {
                selectorElement.textContent = originalText
                selectorElement.style.color = "#4f46e5" // Original color
              }
            }, 1500)

            console.log(
              `%c[ElementInspector] Copied selector to clipboard: ${selector}`,
              "color: #10b981;"
            )
          })
          .catch((err) => {
            console.error("[ElementInspector] Failed to copy selector:", err)
          })
      }
    })

    // Add tooltip text
    const tooltipText = document.createElement("div")
    tooltipText.textContent = "Click to copy selector"
    tooltipText.style.fontSize = "9px"
    tooltipText.style.opacity = "0.7"
    tooltipText.style.marginTop = "2px"
    tooltipElement.appendChild(tooltipText)

    document.body.appendChild(tooltipElement)
  }
}

// Remove highlight elements
function removeHighlightElements() {
  if (highlightBox) {
    document.body.removeChild(highlightBox)
    highlightBox = null
  }

  if (tooltipElement) {
    document.body.removeChild(tooltipElement)
    tooltipElement = null
  }
}

// Ultra-optimized selector generation with extreme precision
function getUniqueSelector(el: Element): string {
  // Check cache first for maximum performance
  const cachedSelector = selectorCache.get(el)
  if (cachedSelector) return cachedSelector

  if (!el) return ""

  // ID selector - fastest path for most elements
  if (el.id) {
    // Fast path for simple IDs (avoid CSS.escape overhead)
    if (idRegex.test(el.id)) {
      const selector = `#${el.id}`
      // Verify uniqueness
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    } else {
      // Handle complex IDs that need escaping
      const selector = `#${CSS.escape(el.id)}`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try tag + attributes for precise identification
  const tagName = el.tagName.toLowerCase()

  // Fast path for elements with data attributes (common in modern frameworks)
  const dataAttrs = [
    "data-testid",
    "data-id",
    "data-cy",
    "data-test",
    "data-automation-id"
  ]
  for (const attr of dataAttrs) {
    const value = el.getAttribute(attr)
    if (value) {
      const selector = `${tagName}[${attr}="${CSS.escape(value)}"]`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try with class combinations for better precision
  if (el.classList.length > 0) {
    // Try with all classes for maximum precision
    const classes = Array.from(el.classList)
      .map((c) => `.${CSS.escape(c)}`)
      .join("")

    const selector = `${tagName}${classes}`
    if (document.querySelectorAll(selector).length === 1) {
      selectorCache.set(el, selector)
      return selector
    }

    // Try with first two classes if more than one
    if (el.classList.length > 1) {
      const twoClasses = `.${CSS.escape(el.classList[0])}.${CSS.escape(el.classList[1])}`
      const selectorWithTwoClasses = `${tagName}${twoClasses}`
      if (document.querySelectorAll(selectorWithTwoClasses).length === 1) {
        selectorCache.set(el, selectorWithTwoClasses)
        return selectorWithTwoClasses
      }
    }

    // Try with just first class
    const firstClass = `.${CSS.escape(el.classList[0])}`
    const selectorWithClass = `${tagName}${firstClass}`
    if (document.querySelectorAll(selectorWithClass).length === 1) {
      selectorCache.set(el, selectorWithClass)
      return selectorWithClass
    }
  }

  // Try with other attributes that often identify elements
  const uniqueAttrs = ["name", "role", "type", "title", "aria-label"]
  for (const attr of uniqueAttrs) {
    const value = el.getAttribute(attr)
    if (value) {
      const selector = `${tagName}[${attr}="${CSS.escape(value)}"]`
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // Try with nth-of-type for siblings
  if (el.parentElement) {
    // Get siblings with same tag
    const siblings = Array.from(el.parentElement.children).filter(
      (child: Element) => child.tagName === el.tagName
    )

    if (siblings.length > 1) {
      const index = siblings.indexOf(el) + 1
      const selector = `${tagName}:nth-of-type(${index})`

      // Try with parent tag for more precision
      if (el.parentElement.tagName) {
        const parentTag = el.parentElement.tagName.toLowerCase()
        const selectorWithParent = `${parentTag} > ${selector}`

        if (document.querySelectorAll(selectorWithParent).length === 1) {
          selectorCache.set(el, selectorWithParent)
          return selectorWithParent
        }
      }

      // Try with just nth-of-type
      if (document.querySelectorAll(selector).length === 1) {
        selectorCache.set(el, selector)
        return selector
      }
    }
  }

  // For deeply nested elements, try building a path with direct child selectors
  let currentElement: Element | null = el
  let ancestorPath = ""
  let depth = 0
  const MAX_DEPTH = 5 // Limit depth to avoid performance issues

  while (currentElement && currentElement.parentElement && depth < MAX_DEPTH) {
    const parent: Element = currentElement.parentElement
    const parentTag = parent.tagName.toLowerCase()

    // Skip body and html in the path
    if (parentTag === "body" || parentTag === "html") {
      currentElement = parent
      continue
    }

    // Get position among siblings
    const siblings = Array.from(parent.children).filter(
      (child) => child.tagName === currentElement!.tagName
    )

    let elementSelector = currentElement.tagName.toLowerCase()

    // Add nth-of-type if there are multiple siblings with same tag
    if (siblings.length > 1) {
      const index = siblings.indexOf(currentElement) + 1
      elementSelector += `:nth-of-type(${index})`
    }

    // Add ID if available
    if (currentElement.id) {
      elementSelector = `#${CSS.escape(currentElement.id)}`
    }
    // Add first class if available and no ID
    else if (currentElement.classList.length > 0) {
      elementSelector += `.${CSS.escape(currentElement.classList[0])}`
    }

    // Build path from right to left
    ancestorPath = ancestorPath
      ? `${elementSelector} > ${ancestorPath}`
      : elementSelector

    // Check if current path is unique
    if (document.querySelectorAll(ancestorPath).length === 1) {
      selectorCache.set(el, ancestorPath)
      return ancestorPath
    }

    currentElement = parent
    depth++
  }

  // Try a more specific approach for deeply nested elements with complex class combinations
  try {
    // Build a selector with parent > child structure
    let complexSelector = ""
    let current: Element | null = el
    let pathDepth = 0

    while (current && pathDepth < 4) {
      let currentSelector = current.tagName.toLowerCase()

      // Add ID if present
      if (current.id) {
        currentSelector = `#${CSS.escape(current.id)}`
      }
      // Otherwise add classes (up to 2 for performance)
      else if (current.classList.length > 0) {
        const classesToUse = Array.from(current.classList).slice(0, 2)
        currentSelector += classesToUse.map((c) => `.${CSS.escape(c)}`).join("")
      }

      // Add to path
      complexSelector = complexSelector
        ? `${currentSelector} > ${complexSelector}`
        : currentSelector

      // Check if we have a unique selector
      if (document.querySelectorAll(complexSelector).length === 1) {
        selectorCache.set(el, complexSelector)
        return complexSelector
      }

      // Move up to parent
      current = current.parentElement
      pathDepth++
    }
  } catch (e) {
    console.warn("[ElementInspector] Error generating complex selector:", e)
  }

  // Generate XPath as a fallback for very complex structures
  try {
    const xpath = getXPath(el)
    if (xpath) {
      // Convert XPath to CSS if possible
      const cssFromXPath = convertXPathToCSS(xpath)
      if (
        cssFromXPath &&
        document.querySelectorAll(cssFromXPath).length === 1
      ) {
        selectorCache.set(el, cssFromXPath)
        return cssFromXPath
      }

      // Store the XPath in the cache with a special prefix
      const xpathSelector = `xpath:${xpath}`
      selectorCache.set(el, xpathSelector)
      return xpathSelector
    }
  } catch (e) {
    console.warn("[ElementInspector] Error generating XPath:", e)
  }

  // Fallback to a very specific selector with multiple attributes
  let fallbackSelector = tagName

  // Add all available attributes for maximum precision
  if (el.parentElement) {
    const siblings = Array.from(el.parentElement.children)
    const index = siblings.indexOf(el) + 1
    fallbackSelector += `:nth-child(${index})`
  }

  // Add text content hint if available (truncated for performance)
  const textContent = el.textContent?.trim().substring(0, 20)
  if (textContent && textContent.length > 0) {
    fallbackSelector += `:contains("${textContent.replace(/"/g, '\\"')}")`
  }

  selectorCache.set(el, fallbackSelector)
  return fallbackSelector
}

// Generate XPath for an element
function getXPath(element: Element): string {
  if (!element) return ""

  // Check if element has an ID
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }

  // Get the path to the element
  const paths: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 0
    let hasFollowingSibling = false

    // Count preceding siblings with same tag name
    for (
      let sibling = current.previousSibling;
      sibling;
      sibling = sibling.previousSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === current.nodeName
      ) {
        index++
      }
    }

    // Check if there are any following siblings with same tag name
    for (
      let sibling = current.nextSibling;
      sibling && !hasFollowingSibling;
      sibling = sibling.nextSibling
    ) {
      if (
        sibling.nodeType === Node.ELEMENT_NODE &&
        sibling.nodeName === current.nodeName
      ) {
        hasFollowingSibling = true
      }
    }

    // Build the path part
    const tagName = current.nodeName.toLowerCase()
    const pathIndex = index || hasFollowingSibling ? `[${index + 1}]` : ""
    paths.unshift(`${tagName}${pathIndex}`)

    current = current.parentNode as Element

    // Stop at the body
    if (current && current.nodeName.toLowerCase() === "body") {
      paths.unshift("body")
      break
    }
  }

  return `/${paths.join("/")}`
}

// Try to convert XPath to CSS selector when possible
function convertXPathToCSS(xpath: string): string | null {
  try {
    // Handle simple ID-based XPath
    const idMatch = xpath.match(/\/\/\*\[@id="([^"]+)"\]/)
    if (idMatch) {
      return `#${CSS.escape(idMatch[1])}`
    }

    // Handle simple paths like /html/body/div[1]/p[2]
    if (xpath.startsWith("/")) {
      const parts = xpath.split("/").filter(Boolean)

      // Skip html and body
      const startIndex = parts.findIndex(
        (p) => !["html", "body"].includes(p.replace(/\[\d+\]$/, ""))
      )
      if (startIndex === -1) return null

      const cssPath = parts
        .slice(startIndex)
        .map((part) => {
          // Extract tag and index
          const match = part.match(/([a-z0-9]+)(?:\[(\d+)\])?/)
          if (!match) return null

          const [, tag, indexStr] = match
          const index = indexStr ? parseInt(indexStr, 10) : null

          return index ? `${tag}:nth-of-type(${index})` : tag
        })
        .filter(Boolean)
        .join(" > ")

      return cssPath
    }

    return null
  } catch (e) {
    console.warn("[ElementInspector] Error converting XPath to CSS:", e)
    return null
  }
}

// Ultra-fast element details generation
const getElementDetails = (element: HTMLElement): string => {
  // Check cache first
  const cachedDetails = elementDetailsCache.get(element)
  if (cachedDetails) return cachedDetails

  const tagName = element.tagName.toLowerCase()
  const id = element.id ? `#${element.id}` : ""

  // Only include first class for performance
  const className = element.classList.length > 0 ? element.classList[0] : ""
  const classes = className ? `.${className}` : ""

  // Fast dimension calculation
  const rect = element.getBoundingClientRect()
  const dimensions = `${Math.round(rect.width)}×${Math.round(rect.height)}`

  const details = `<${tagName}${id}${classes}> ${dimensions}px`
  elementDetailsCache.set(element, details)
  return details
}

// Get a simplified DOM path for an element
function getSimpleDOMPath(element: HTMLElement): string {
  if (!element) return ""

  const path: string[] = []
  let current: HTMLElement | null = element
  let depth = 0
  const MAX_DEPTH = 4 // Limit depth to keep it readable

  while (current && depth < MAX_DEPTH) {
    let tag = current.tagName.toLowerCase()

    // Add ID if available
    if (current.id) {
      tag += `#${current.id}`
      // If we have an ID, we can stop here as it should be unique
      path.unshift(tag)
      break
    }

    // Add first class if available
    if (current.classList.length > 0) {
      tag += `.${current.classList[0]}`
    }

    path.unshift(tag)

    // Move up to parent
    current = current.parentElement
    depth++
  }

  // Add ellipsis if we hit the depth limit
  if (current && depth >= MAX_DEPTH) {
    path.unshift("...")
  }

  return path.join(" > ")
}

// Pre-allocate values for transform calculations
let transformX = 0
let transformY = 0
let tooltipX = 0
let tooltipY = 0
let elementWidth = 0
let elementHeight = 0

// Enhanced console logging with clickable element references
function logElementReference(
  element: HTMLElement,
  action: string,
  selector: string
) {
  const elementInfo = {
    tagName: element.tagName.toLowerCase(),
    id: element.id || "(no id)",
    classes: Array.from(element.classList).join(".") || "(no classes)",
    dimensions: `${Math.round(element.getBoundingClientRect().width)}×${Math.round(element.getBoundingClientRect().height)}`,
    selector: selector
  }

  console.groupCollapsed(
    `%c[ElementInspector] ${action}: ${elementInfo.tagName}${elementInfo.id ? "#" + elementInfo.id : ""}`,
    "color: #4f46e5; font-weight: bold;"
  )
  console.log("Element:", element)
  console.log("Selector:", selector)
  console.log("Dimensions:", elementInfo.dimensions)
  console.log("Classes:", elementInfo.classes)
  console.log(
    "Text:",
    element.textContent?.trim().substring(0, 50) || "(no text)"
  )
  console.log("Visibility check:", {
    isConnected: element.isConnected,
    offsetParent: element.offsetParent !== null,
    display: getComputedStyle(element).display,
    visibility: getComputedStyle(element).visibility,
    opacity: getComputedStyle(element).opacity
  })
  console.groupEnd()

  // Create a clickable reference in the console
  console.log(
    "%c Click to inspect element in DevTools 👇",
    "background: #4f46e5; color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold;",
    element
  )
}

// Pre-bind event handler for maximum performance
let boundPointerMoveHandler: (e: PointerEvent) => void
let boundClickHandler: (e: MouseEvent) => void
let lastReportedPosition = { x: 0, y: 0 }

// Verify highlight is correctly positioned and visible
function verifyHighlightPosition(element: HTMLElement, event: PointerEvent) {
  if (!debugMode || !element || !highlightBox) return

  // Store the current mouse position
  lastReportedPosition = { x: event.clientX, y: event.clientY }

  // Check if the element at the current mouse position is what we expect
  const elementAtPoint = document.elementFromPoint(
    event.clientX,
    event.clientY
  ) as HTMLElement

  // If the element at the point is not the same as our target or a child of it
  if (
    elementAtPoint &&
    elementAtPoint !== element &&
    !element.contains(elementAtPoint) &&
    !elementAtPoint.contains(element)
  ) {
    console.warn(
      "%c[ElementInspector] Possible targeting issue detected!",
      "color: #f43f5e; font-weight: bold;"
    )
    console.log("Expected element:", element)
    console.log("Actual element at cursor position:", elementAtPoint)
    console.log("Cursor position:", { x: event.clientX, y: event.clientY })
    console.log(
      "%c Click to inspect actual element at cursor position 👇",
      "background: #f43f5e; color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold;",
      elementAtPoint
    )

    // Highlight the issue visually by briefly flashing the highlight box
    const originalBorderColor = highlightBox.style.border
    highlightBox.style.border = "2px solid #f43f5e"
    setTimeout(() => {
      if (highlightBox) {
        highlightBox.style.border = originalBorderColor
      }
    }, 500)
  }

  // Check if the highlight box is visible on screen
  const highlightRect = highlightBox.getBoundingClientRect()
  const isVisible =
    highlightRect.width > 0 &&
    highlightRect.height > 0 &&
    highlightRect.top < window.innerHeight &&
    highlightRect.left < window.innerWidth &&
    highlightRect.bottom > 0 &&
    highlightRect.right > 0

  if (!isVisible) {
    console.warn(
      "%c[ElementInspector] Highlight may not be visible on screen!",
      "color: #f43f5e; font-weight: bold;"
    )
    console.log("Highlight box position:", highlightRect)
    console.log("Viewport size:", {
      width: window.innerWidth,
      height: window.innerHeight
    })
  }
}

// Initialize the bound handler
function initHandlers() {
  // Use pointer events for better performance
  boundPointerMoveHandler = (e: PointerEvent) => {
    if (!isInspecting) return

    // Skip throttling completely for warp speed
    lastHighlightTimestamp = performance.now()

    // Get the element under the cursor directly
    let element = e.target as HTMLElement

    if (!element) return

    // Skip the highlight elements with direct reference check for speed
    if (element === highlightBox || element === tooltipElement) return

    // In deep inspection mode, try to find the most specific element at this position
    if (deepInspectionMode) {
      element = findDeepestElementAtPoint(e.clientX, e.clientY) || element
    }

    // If we're hovering over the same element, no need to update
    if (element === hoveredElement) return

    // Update the hovered element
    hoveredElement = element

    // Directly highlight the element at warp speed
    warpSpeedHighlight(element)

    // Verify highlight position in debug mode
    verifyHighlightPosition(element, e)
  }

  // Add click handler to select elements
  boundClickHandler = (e: MouseEvent) => {
    if (!isInspecting) return

    // In click-through mode, we want to allow clicks to pass through
    // to the underlying elements, so we don't prevent default
    if (!clickThroughMode) {
      // Only prevent default when click-through is disabled
      e.preventDefault()
      e.stopPropagation()
    }

    // Get the element under the cursor
    let element = e.target as HTMLElement

    // Skip the highlight elements
    if (element === highlightBox || element === tooltipElement) return

    // In deep inspection mode, try to find the most specific element at this position
    if (deepInspectionMode) {
      element = findDeepestElementAtPoint(e.clientX, e.clientY) || element
    }

    // Highlight the clicked element
    warpSpeedHighlight(element)

    // Log that we've selected this element
    console.log(
      "%c[ElementInspector] Element selected by click:",
      "color: #10b981; font-weight: bold;",
      element
    )

    // In click-through mode, allow the click to continue to the element
    // This enables interacting with the element (clicking links, buttons, etc.)
    if (clickThroughMode) {
      console.log(
        "%c[ElementInspector] Click-through mode: Click action passed through to element",
        "color: #06b6d4;"
      )
    }
  }
}

// Warp-speed highlighting with GPU acceleration and transform
function warpSpeedHighlight(element: HTMLElement | null) {
  if (!element || !highlightBox || !tooltipElement) return

  // Get element position and size using optimized calls
  const rect = element.getBoundingClientRect()

  // Calculate positions once
  transformX = rect.left + window.scrollX
  transformY = rect.top + window.scrollY
  elementWidth = rect.width
  elementHeight = rect.height
  tooltipX = transformX
  tooltipY = transformY - 24

  // Check if element has zero dimensions
  if (elementWidth === 0 || elementHeight === 0) {
    console.warn(
      "%c[ElementInspector] Element has zero dimensions!",
      "color: #f43f5e; font-weight: bold;",
      element
    )

    // Try to make the highlight visible anyway with minimum dimensions
    elementWidth = Math.max(elementWidth, 10)
    elementHeight = Math.max(elementHeight, 10)
  }

  // Position highlight box using transform for GPU acceleration
  const highlightStyle = highlightBox.style
  highlightStyle.width = elementWidth + PX
  highlightStyle.height = elementHeight + PX
  highlightStyle.transform = `translate3d(${transformX}px, ${transformY}px, 0)`
  highlightStyle.display = BLOCK

  // Get element details and selector for tooltip
  const details = getElementDetails(element)
  let selector = getUniqueSelector(element)
  const domPath = getSimpleDOMPath(element)

  // Handle XPath selectors
  let isXPath = false
  if (selector.startsWith("xpath:")) {
    isXPath = true
    selector = selector.substring(6) // Remove the 'xpath:' prefix for display
  }

  // Position tooltip using transform for GPU acceleration
  tooltipElement.innerHTML = `
    ${details}<br>
    <span class="selector-text" style="color:${isXPath ? "#f59e0b" : "#4f46e5"};font-size:10px">${selector}</span><br>
    <span style="color:#6b7280;font-size:9px">${domPath}</span>
    <div style="font-size:9px;opacity:0.7;margin-top:2px">Click to copy selector</div>
  `
  tooltipElement.style.transform = `translate3d(${tooltipX}px, ${tooltipY}px, 0)`
  tooltipElement.style.display = BLOCK

  // Log element with clickable reference
  logElementReference(element, "Highlighting", selector)

  // Asynchronously send to event bus for compatibility
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: performance.now(),
          data: {
            selector: isXPath ? selector : selector, // Keep the original selector
            message: details,
            isValid: true,
            layer: "inspector"
          }
        })
      },
      { timeout: 200 }
    )
  }
}

// Clear highlights using direct style manipulation
function warpSpeedClearHighlights() {
  if (highlightBox) {
    highlightBox.style.display = NONE
  }

  if (tooltipElement) {
    tooltipElement.style.display = NONE
  }

  // Log clearing highlights
  console.log("%c[ElementInspector] Cleared highlights", "color: #4f46e5;")

  // Asynchronously clear via event bus for compatibility
  if (window.requestIdleCallback) {
    window.requestIdleCallback(
      () => {
        eventBus.publish({
          type: "HIGHLIGHT",
          timestamp: performance.now(),
          data: {
            selector: "*",
            message: "",
            isValid: true,
            clear: true,
            layer: "inspector"
          }
        })
      },
      { timeout: 200 }
    )
  }
}

// Find the deepest element at a specific point, useful for nested elements
function findDeepestElementAtPoint(x: number, y: number): HTMLElement | null {
  // Use elementsFromPoint to get all elements at this position
  const elements = document.elementsFromPoint(x, y) as HTMLElement[]

  // Filter out our UI elements
  const filteredElements = elements.filter(
    (el) =>
      el !== highlightBox &&
      el !== tooltipElement &&
      !el.hasAttribute("data-highlight-box")
  )

  // Get the smallest element by area
  if (filteredElements.length > 0) {
    // Sort by area (smallest first)
    filteredElements.sort((a, b) => {
      const aRect = a.getBoundingClientRect()
      const bRect = b.getBoundingClientRect()
      const aArea = aRect.width * aRect.height
      const bArea = bRect.width * bRect.height
      return aArea - bArea
    })

    // Return the smallest element that's not too small
    for (const el of filteredElements) {
      const rect = el.getBoundingClientRect()
      // Skip elements that are too small (likely just borders or spacers)
      if (rect.width >= 5 && rect.height >= 5) {
        return el
      }
    }

    // If all elements are too small, return the first one
    return filteredElements[0]
  }

  return null
}

// Start inspection
const startInspection = () => {
  isInspecting = true
  document.body.style.cursor = "crosshair"

  // Create highlight elements
  createHighlightElements()

  // Initialize handlers if needed
  if (!boundPointerMoveHandler || !boundClickHandler) {
    initHandlers()
  }

  // Clear caches when starting new inspection
  selectorCache = new WeakMap<Element, string>()
  elementDetailsCache = new WeakMap<Element, string>()

  // Use pointer events for better performance across devices
  document.addEventListener("pointermove", boundPointerMoveHandler, {
    passive: true,
    capture: true // Use capture to get events before they're processed
  })

  // Add click handler to select elements
  document.addEventListener("click", boundClickHandler, {
    capture: true // Use capture to get events before they're processed
  })

  // Clear any existing highlights when starting
  warpSpeedClearHighlights()

  // Force a highlight update for the current element under cursor
  const currentElement = document.elementFromPoint(
    window.innerWidth / 2,
    window.innerHeight / 2
  ) as HTMLElement

  if (currentElement) {
    hoveredElement = currentElement
    warpSpeedHighlight(currentElement)
  }

  const modeText = deepInspectionMode ? "DEEP INSPECTION" : "WARP PRECISION"
  console.log(
    `%c[ElementInspector] Inspection started with ${modeText} mode`,
    "color: #4f46e5; font-weight: bold; background: #e0e7ff; padding: 2px 5px; border-radius: 4px;"
  )
  console.log(
    "%cOpen your browser console to see clickable element references as you inspect",
    "color: #4f46e5;"
  )
  if (deepInspectionMode) {
    console.log(
      "%cDEEP INSPECTION MODE: Click on elements to select them precisely. This mode targets the smallest element at each position.",
      "color: #f59e0b; font-weight: bold;"
    )
  } else {
    console.log(
      "%cTIP: If you're having trouble selecting deeply nested elements, try enabling Deep Inspection Mode.",
      "color: #4f46e5;"
    )
  }
}

// Stop inspection
const stopInspection = () => {
  isInspecting = false
  document.body.style.cursor = ""

  if (boundPointerMoveHandler) {
    document.removeEventListener("pointermove", boundPointerMoveHandler, {
      capture: true
    })
  }

  if (boundClickHandler) {
    document.removeEventListener("click", boundClickHandler, {
      capture: true
    })
  }

  hoveredElement = null

  // Clear highlights
  warpSpeedClearHighlights()

  // Remove highlight elements
  removeHighlightElements()

  console.log("[ElementInspector] Inspection stopped")
}

// Initialize event listeners
function initializeEventBus() {
  eventBus.subscribe((event) => {
    if (event.type === "INSPECTOR_COMMAND") {
      const { command } = event.data

      if (command === "start") {
        startInspection()
      } else if (command === "stop") {
        stopInspection()
      } else if (command === "toggleDebug") {
        debugMode = !debugMode
        console.log(
          `%c[ElementInspector] Debug mode ${debugMode ? "enabled" : "disabled"}`,
          "color: #10b981; font-weight: bold;"
        )
        if (debugMode) {
          console.log(
            "%c[ElementInspector] Debug features:",
            "color: #10b981;",
            "\n- Clickable element references in console",
            "\n- Visibility and dimension checks",
            "\n- Click on tooltip to copy selector",
            "\n- DOM path visualization"
          )
        }
      } else if (command === "toggleDeepInspection") {
        deepInspectionMode = !deepInspectionMode
        console.log(
          `%c[ElementInspector] Deep inspection mode ${deepInspectionMode ? "enabled" : "disabled"}`,
          "color: #f59e0b; font-weight: bold;"
        )
        if (deepInspectionMode) {
          console.log(
            "%c[ElementInspector] Deep inspection tips:",
            "color: #f59e0b;",
            "\n- Click directly on elements to select them",
            "\n- Hover to see DOM path in tooltip",
            "\n- Works best with debug mode enabled",
            "\n- Great for complex nested layouts"
          )
        }

        // If we're currently inspecting, restart to apply the new mode
        if (isInspecting) {
          stopInspection()
          startInspection()
        }
      } else if (command === "toggleClickThrough") {
        clickThroughMode = !clickThroughMode
        console.log(
          `%c[ElementInspector] Click-through mode ${clickThroughMode ? "enabled" : "disabled"}`,
          "color: #06b6d4; font-weight: bold;"
        )
        if (clickThroughMode) {
          console.log(
            "%c[ElementInspector] Click-through enabled:",
            "color: #06b6d4;",
            "\n- You can now click on elements underneath the highlight",
            "\n- Great for interacting with the page while inspecting",
            "\n- Use with deep inspection mode for best results"
          )
        } else {
          console.log(
            "%c[ElementInspector] Click-through disabled:",
            "color: #06b6d4;",
            "\n- Clicks will now select elements without activating them",
            "\n- Prevents accidental navigation while inspecting"
          )
        }

        // If we're currently inspecting, restart to apply the new mode
        if (isInspecting) {
          stopInspection()
          startInspection()
        }
      }
    }
  })
}

// Initialize
function initialize() {
  console.log("%c[ElementInspector] Initializing...", "color: #4f46e5;")

  // Create highlight box if it doesn't exist
  if (!highlightBox) {
    highlightBox = document.createElement("div")
    highlightBox.id = "ally-studio-highlight-box"
    highlightBox.style.cssText = `
      position: absolute;
      border: 2px solid #4f46e5;
      background-color: rgba(79, 70, 229, 0.1);
      pointer-events: none;
      z-index: 2147483647;
      display: none;
      box-sizing: border-box;
      border-radius: 2px;
    `
    document.body.appendChild(highlightBox)
  }

  // Create tooltip if it doesn't exist
  if (!tooltipElement) {
    tooltipElement = document.createElement("div")
    tooltipElement.id = "ally-studio-tooltip"
    tooltipElement.style.cssText = `
      position: absolute;
      background-color: #1e1e1e;
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      pointer-events: auto;
      cursor: pointer;
      z-index: 2147483647;
      display: none;
      max-width: 300px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
      box-sizing: border-box;
      transform-origin: top left;
    `
    document.body.appendChild(tooltipElement)

    // Add click event to copy selector
    tooltipElement.addEventListener("click", () => {
      const selectorElement = tooltipElement?.querySelector(
        ".selector-text"
      ) as HTMLElement | null
      if (selectorElement) {
        const selector = selectorElement.textContent || ""
        navigator.clipboard
          .writeText(selector)
          .then(() => {
            // Store original text and color
            const originalText = tooltipElement!.innerHTML
            const originalColor = tooltipElement!.style.backgroundColor

            // Show success message
            tooltipElement!.innerHTML = "✓ Copied to clipboard!"
            tooltipElement!.style.backgroundColor = "#10b981"

            // Restore original after 1.5 seconds
            setTimeout(() => {
              if (tooltipElement) {
                tooltipElement.innerHTML = originalText
                tooltipElement.style.backgroundColor = originalColor
              }
            }, 1500)

            console.log(
              "%c[ElementInspector] Selector copied to clipboard:",
              "color: #10b981;",
              selector
            )
          })
          .catch((err) => {
            console.error("[ElementInspector] Failed to copy selector:", err)
          })
      }
    })
  }

  // Initialize event bus
  initializeEventBus()

  console.log("%c[ElementInspector] Initialized and ready!", "color: #4f46e5;")
}

// Call initialize
initialize()

// Cleanup on unload
window.addEventListener("unload", () => {
  stopInspection()
})
