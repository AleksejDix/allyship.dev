/**
 * Common accessibility utility functions for testing rules
 */

// Import utilities from published npm packages
import {
  isElementVisible,
  isFocusable as npmIsFocusable
} from "@allystudio/accessibility-utils"

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
  // Use the npm package visibility check first
  if (!isElementVisible(element as HTMLElement)) {
    return true
  }

  // Check if the element itself has aria-hidden="true"
  if (element.getAttribute("aria-hidden") === "true") {
    return true
  }

  // Check for hidden attribute
  if (element.hasAttribute("hidden")) {
    return true
  }

  // Check if any ancestor has aria-hidden="true"
  let parent = element.parentElement
  while (parent) {
    if (parent.getAttribute("aria-hidden") === "true") {
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
 * Use the npm package implementation
 */
export function isFocusable(element: Element): boolean {
  return npmIsFocusable(element as HTMLElement)
}
