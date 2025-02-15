/**
 * Keyboard Shortcuts Validation Tool
 *
 * This tool checks for conflicting keyboard shortcuts across the page by analyzing:
 * - HTML accesskey attributes
 * - Custom data-hotkey attributes
 * - Elements with role="menuitem"
 *
 * Features:
 * - Detects duplicate shortcuts that could cause conflicts
 * - Validates both native accesskey and custom hotkey implementations
 * - Provides visual highlighting of shortcuts in the UI
 * - Reports conflicts through the axe-core format
 * - Tracks and displays all keyboard shortcuts used on the page
 *
 * Usage:
 * ```ts
 * // Run the check
 * checkKeyboardShortcuts()
 *
 * // Clean up highlights
 * checkKeyboardShortcuts('cleanup')
 * ```
 *
 * Example conflicts it catches:
 * - Multiple elements using the same accesskey
 * - Overlapping accesskey and data-hotkey values
 * - Duplicate shortcuts in menu items
 */

import { BaseTool } from "./base-tool"

export class KeyboardShortcutsTool extends BaseTool {
  private hasIssues = false
  private shortcuts = new Map<string, HTMLElement[]>()

  getSelector(): string {
    return `
      [accesskey],
      [role="menuitem"],
      button[data-hotkey],
      a[data-hotkey]
    `
      .trim()
      .replace(/\s+/g, " ")
  }

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  validateElement(el: HTMLElement): { isValid: boolean; message?: string } {
    // Reset state and shortcuts at start of validation
    if (el === this.getElements()[0]) {
      this.hasIssues = false
      this.shortcuts.clear()
      this.logInfo(
        "Keyboard Shortcuts Check Started",
        "Checking for conflicting shortcuts..."
      )
    }

    // Get shortcut key
    const accessKey = el.getAttribute("accesskey")?.toLowerCase()
    const hotkey = el.getAttribute("data-hotkey")?.toLowerCase()
    const key = accessKey || hotkey

    if (!key) {
      return { isValid: true }
    }

    // Track shortcuts
    if (!this.shortcuts.has(key)) {
      this.shortcuts.set(key, [])
    }
    this.shortcuts.get(key)?.push(el)

    // Check for conflicts
    const conflictingElements = this.shortcuts.get(key) || []
    const hasConflict = conflictingElements.length > 1

    if (hasConflict) {
      this.hasIssues = true
      this.logAxeIssue({
        id: "accesskey",
        impact: "serious",
        description: "Keyboard shortcuts must not conflict",
        help: "Remove duplicate accesskey or hotkey values",
        helpUrl: "https://dequeuniversity.com/rules/axe/4.6/accesskey",
        nodes: [
          {
            html: el.outerHTML,
            target: conflictingElements.map(this.getElementSelector),
            failureSummary: `Multiple elements share the same shortcut: ${key}`,
          },
        ],
      })
    }

    // Show shortcut in highlight
    const label = `Shortcut: ${key.toUpperCase()}${
      hasConflict ? " (Conflict)" : ""
    }`
    this.highlightElement(el, !hasConflict, label)

    // Log success if no issues found
    if (
      el === this.getElements()[this.getElements().length - 1] &&
      !this.hasIssues
    ) {
      this.logSuccess(
        "Keyboard Shortcuts Check Passed",
        "No conflicting shortcuts found",
        "Shortcuts are properly assigned",
        `Total shortcuts: ${this.shortcuts.size}`
      )
    }

    return {
      isValid: !hasConflict,
      message: hasConflict
        ? `Conflicting shortcut '${key}' on ${this.getElementSelector(el)}`
        : undefined,
    }
  }

  private getElementSelector(el: HTMLElement): string {
    const tag = el.tagName.toLowerCase()
    const id = el.id ? `#${el.id}` : ""
    const classes = Array.from(el.classList)
      .map((c) => `.${c}`)
      .join("")
    return `${tag}${id}${classes}`
  }
}

// Export a singleton instance
const keyboardShortcutsTool = new KeyboardShortcutsTool()
export const checkKeyboardShortcuts = (mode: "apply" | "cleanup" = "apply") =>
  keyboardShortcutsTool.run(mode)
