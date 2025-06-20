// Import utilities from published npm packages
import {
  findElementByXPath,
  generateSelector,
  generateXPath,
  getAccessibilityInfo,
  isElementVisible
} from "@allystudio/accessibility-utils"

// Re-export with legacy function names for backward compatibility
export function getUniqueSelector(el: Element): string {
  return generateSelector(el as HTMLElement)
}

export function getXPath(element: Element): string {
  return generateXPath(element as HTMLElement)
}

export function getElementDetails(element: HTMLElement): string {
  const tagName = element.tagName.toLowerCase()
  const id = element.id ? "#" + element.id : ""
  const className = element.className
    ? "." + element.className.split(" ").filter(Boolean).join(".")
    : ""

  return `${tagName}${id}${className}`
}

// Export additional utilities from npm packages
export { isElementVisible, getAccessibilityInfo, findElementByXPath }
