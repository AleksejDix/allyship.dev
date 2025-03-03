/**
 * Enhanced console logging with clickable element references
 */
export function logElementReference(
  element: HTMLElement,
  action: string,
  selector: string
): void {
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

/**
 * Log a warning about a targeting issue
 */
export function logTargetingIssue(
  expectedElement: HTMLElement,
  actualElement: HTMLElement,
  position: { x: number; y: number }
): void {
  console.warn(
    "%c[ElementInspector] Possible targeting issue detected!",
    "color: #f43f5e; font-weight: bold;"
  )
  console.log("Expected element:", expectedElement)
  console.log("Actual element at cursor position:", actualElement)
  console.log("Cursor position:", position)
  console.log(
    "%c Click to inspect actual element at cursor position 👇",
    "background: #f43f5e; color: white; padding: 2px 5px; border-radius: 4px; font-weight: bold;",
    actualElement
  )
}

/**
 * Log a warning about zero dimensions
 */
export function logZeroDimensionsWarning(element: HTMLElement): void {
  console.warn(
    "%c[ElementInspector] Element has zero dimensions!",
    "color: #f43f5e; font-weight: bold;",
    element
  )
}

/**
 * Log inspection start message
 */
export function logInspectionStart(deepInspectionMode: boolean): void {
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

/**
 * Log element selection message
 */
export function logElementSelection(
  element: HTMLElement,
  clickThrough: boolean
): void {
  console.log(
    "%c[ElementInspector] Element selected by click:",
    "color: #10b981; font-weight: bold;",
    element
  )

  if (clickThrough) {
    console.log(
      "%c[ElementInspector] Click-through mode: Click action passed through to element",
      "color: #06b6d4;"
    )
  }
}
