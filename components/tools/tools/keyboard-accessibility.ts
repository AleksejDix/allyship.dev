import { BaseTool } from "./base-tool"

export class KeyboardAccessibilityTool extends BaseTool {
  private elements: HTMLElement[] = []
  private currentIndex: number = 0

  getSelector(): string {
    const notInert = ":not([inert]):not([inert] *)"
    const notNegTabIndex = ':not([tabindex^="-"])'
    const notDisabled = ":not(:disabled)"

    return [
      `a[href]${notInert}${notNegTabIndex}`,
      `area[href]${notInert}${notNegTabIndex}`,
      `input:not([type="hidden"]):not([type="radio"])${notInert}${notNegTabIndex}${notDisabled}`,
      `input[type="radio"]${notInert}${notNegTabIndex}${notDisabled}`,
      `select${notInert}${notNegTabIndex}${notDisabled}`,
      `textarea${notInert}${notNegTabIndex}${notDisabled}`,
      `button${notInert}${notNegTabIndex}${notDisabled}`,
      `details${notInert} > summary:first-of-type${notNegTabIndex}`,
      `iframe${notInert}${notNegTabIndex}`,
      `audio[controls]${notInert}${notNegTabIndex}`,
      `video[controls]${notInert}${notNegTabIndex}`,
      `[contenteditable]${notInert}${notNegTabIndex}`,
      `[tabindex]${notInert}${notNegTabIndex}`,
    ].join(", ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    if (this.elements.length === 0) {
      this.elements = Array.from(this.getElements())
      this.currentIndex = 0

      this.logInfo(
        "Keyboard Accessibility Check",
        "Checking keyboard accessibility of interactive elements...",
        "WCAG 2.1.1 Level A: All functionality must be operable through a keyboard interface"
      )
    }

    const isFocusable = this.isFocusable(el)
    const hasKeyboardHandler = this.hasKeyboardHandler(el)
    const hasMouseOnlyEvents = this.hasMouseOnlyEvents(el)
    const hasValidRole = this.hasValidRole(el)
    const hasValidTabindex = this.hasValidTabindex(el)
    const hasValidLabel = this.hasValidLabel(el)

    // Custom controls need more validation
    const isCustomControl = this.isCustomControl(el)
    const isValid = isCustomControl
      ? isFocusable && hasKeyboardHandler && hasValidRole && hasValidLabel
      : (isFocusable && hasKeyboardHandler) || !hasMouseOnlyEvents

    const status = [
      isFocusable ? "✓ Focusable" : "✕ Not focusable",
      hasKeyboardHandler ? "✓ Has keyboard handlers" : "✕ No keyboard handlers",
      hasMouseOnlyEvents ? "⚠ Mouse-only events" : "✓ No mouse-only events",
      isCustomControl ? (hasValidRole ? "✓ Valid role" : "✕ Missing role") : "",
      isCustomControl
        ? hasValidLabel
          ? "✓ Has label"
          : "✕ Missing label"
        : "",
      hasValidTabindex ? "✓ Valid tabindex" : "⚠ Check tabindex",
    ]
      .filter(Boolean)
      .join(" | ")

    this.highlightElement(
      el,
      isValid,
      `${status} ${isValid ? "(Pass)" : "(Fail)"}`
    )

    if (!isValid) {
      const selector = this.getElementSelector(el)
      const reason = !isFocusable
        ? "Element should be keyboard focusable"
        : !hasKeyboardHandler
          ? "Element needs keyboard event handlers"
          : "Element has mouse-only interactions"

      this.logWarning(
        `Issue: ${reason}`,
        `Element: ${selector}`,
        `Current state: ${status}`
      )
    } else {
      this.logSuccess(
        `✓ Element is keyboard accessible`,
        `Element: ${this.getElementSelector(el)}`,
        `State: ${status}`
      )
    }

    this.currentIndex++
    if (this.currentIndex === this.elements.length) {
      const validCount = this.elements.filter(
        (el) => this.isFocusable(el) && this.hasKeyboardHandler(el)
      ).length

      this.logInfo(
        "Keyboard Accessibility Summary",
        `Total interactive elements: ${this.elements.length}`,
        `Keyboard accessible: ${validCount}`,
        `Issues found: ${this.elements.length - validCount}`
      )

      this.elements = []
      this.currentIndex = 0
    }

    return {
      isValid,
      message: isValid ? undefined : "Element is not keyboard accessible",
    }
  }

  private isFocusable(el: HTMLElement): boolean {
    if (el.closest("[inert]")) return false

    const tabIndex = el.getAttribute("tabindex")
    if (tabIndex && parseInt(tabIndex) < 0) return false

    if (el.matches(":disabled")) return false

    const style = window.getComputedStyle(el)
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      style.opacity === "0"
    )
      return false

    return true
  }

  private hasKeyboardHandler(el: HTMLElement): boolean {
    const events = getEventListeners(el)
    return events.some(
      (event) =>
        event.startsWith("key") ||
        event === "click" ||
        event === "focus" ||
        event === "blur"
    )
  }

  private hasMouseOnlyEvents(el: HTMLElement): boolean {
    const events = getEventListeners(el)
    const mouseOnlyEvents = [
      "mousedown",
      "mouseup",
      "mousemove",
      "mouseover",
      "mouseout",
      "mouseenter",
      "mouseleave",
      "dragstart",
      "dragend",
      "dragover",
      "dragenter",
      "dragleave",
    ]

    return events.some((event) => mouseOnlyEvents.includes(event))
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
  }

  private isCustomControl(el: HTMLElement): boolean {
    return el.matches(
      "div[onclick], span[onclick], div[tabindex], span[tabindex]"
    )
  }

  private hasValidRole(el: HTMLElement): boolean {
    if (!this.isCustomControl(el)) return true

    const validRoles = [
      "button",
      "link",
      "menuitem",
      "tab",
      "checkbox",
      "radio",
      "switch",
      "combobox",
      "option",
    ]

    return (
      el.hasAttribute("role") &&
      validRoles.includes(el.getAttribute("role") || "")
    )
  }

  private hasValidTabindex(el: HTMLElement): boolean {
    const tabindex = el.getAttribute("tabindex")
    if (!tabindex) return true
    const value = parseInt(tabindex)
    return value === 0 || value === -1
  }

  private hasValidLabel(el: HTMLElement): boolean {
    return !!(
      el.getAttribute("aria-label") ||
      el.getAttribute("aria-labelledby") ||
      el.textContent?.trim()
    )
  }
}

// Helper to get event listeners (mock implementation)
function getEventListeners(el: HTMLElement): string[] {
  // In a real implementation, you'd need to:
  // 1. Check inline event handlers (onclick, onkeydown, etc.)
  // 2. Check addEventListener handlers (requires browser devtools API)
  // 3. Check framework event bindings

  const events: string[] = []

  // Check inline handlers
  for (const key in el) {
    if (key.startsWith("on")) {
      events.push(key.slice(2))
    }
  }

  return events
}

// Export singleton instance
const keyboardAccessibilityTool = new KeyboardAccessibilityTool()
export const checkKeyboardAccessibility = (
  mode: "apply" | "cleanup" = "apply"
) => keyboardAccessibilityTool.run(mode)
