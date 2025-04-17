/**
 * Common accessibility utility functions for testing rules
 */

/**
 * Check if an element is hidden from assistive technology
 * Elements are hidden from AT if they:
 * - Have aria-hidden="true"
 * - Are ancestors of an element with aria-hidden="true"
 * - Have display:none in CSS
 * - Have visibility:hidden in CSS
 * - Have a hidden attribute
 */
export function isHiddenFromAT(element: Element): boolean {
  // Check if the element itself has aria-hidden="true"
  if (element.getAttribute("aria-hidden") === "true") {
    return true
  }

  // Check for hidden attribute
  if (element.hasAttribute("hidden")) {
    return true
  }

  // Check inline style attribute for display:none
  const styleAttr = element.getAttribute("style")
  if (
    styleAttr &&
    (styleAttr.includes("display:none") || styleAttr.includes("display: none"))
  ) {
    return true
  }

  // Check computed styles for display:none or visibility:hidden
  const computedStyle = window.getComputedStyle(element as HTMLElement)
  if (
    computedStyle.display === "none" ||
    computedStyle.visibility === "hidden"
  ) {
    return true
  }

  // Check if any ancestor has aria-hidden="true" or display:none
  let parent = element.parentElement
  while (parent) {
    if (parent.getAttribute("aria-hidden") === "true") {
      return true
    }

    // Check parent's inline style
    const parentStyleAttr = parent.getAttribute("style")
    if (
      parentStyleAttr &&
      (parentStyleAttr.includes("display:none") ||
        parentStyleAttr.includes("display: none"))
    ) {
      return true
    }

    // Check parent's computed style
    const parentStyle = window.getComputedStyle(parent)
    if (parentStyle.display === "none" || parentStyle.visibility === "hidden") {
      return true
    }

    parent = parent.parentElement
  }

  return false
}

/**
 * Check if an element is disabled
 * Elements can be disabled through:
 * - disabled attribute
 * - aria-disabled="true"
 */
export function isDisabled(element: Element): boolean {
  if (element.hasAttribute("disabled")) {
    return true
  }

  if (element.getAttribute("aria-disabled") === "true") {
    return true
  }

  return false
}

/**
 * Check if an element is focusable
 * Simplified check for common focusable elements
 */
export function isFocusable(element: Element): boolean {
  const tagName = element.tagName.toLowerCase()

  // Elements that are naturally focusable if not disabled
  const focusableTags = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "details",
    "summary",
    "iframe",
    "object",
    "embed",
    "audio",
    "video"
  ]

  if (focusableTags.includes(tagName)) {
    if (isDisabled(element)) {
      return false
    }

    // Special case for links - they need href to be focusable
    if (tagName === "a" && !element.hasAttribute("href")) {
      return false
    }

    return true
  }

  // Elements with tabindex
  if (element.hasAttribute("tabindex")) {
    const tabindex = parseInt(element.getAttribute("tabindex") || "-1", 10)
    return tabindex >= 0
  }

  return false
}
