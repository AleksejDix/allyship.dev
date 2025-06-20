/**
 * Test setup for element-inspector package
 */

// Setup JSDOM environment for tests
import { beforeEach } from 'vitest'

// Polyfill PointerEvent for JSDOM
if (!global.PointerEvent) {
  global.PointerEvent = class PointerEvent extends MouseEvent {
    constructor(type: string, options: PointerEventInit = {}) {
      super(type, options)
    }
  } as any
}

// Polyfill CSS.escape if not available
if (!global.CSS) {
  global.CSS = {
    escape: (value: string) => {
      return value.replace(/[!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g, '\\$&')
    }
  } as any
}

// Mock performance.now if not available
if (!global.performance) {
  global.performance = {
    now: () => Date.now()
  } as any
}

beforeEach(() => {
  // Clear any existing highlights or overlays
  const existingHighlights = document.querySelectorAll('[data-highlight-box], [data-inspector-overlay]')
  existingHighlights.forEach(el => el.remove())

  // Reset body styles
  document.body.style.userSelect = ''
  document.body.style.cursor = ''

  // Clear any event listeners
  document.removeEventListener('pointermove', () => {}, true)
  document.removeEventListener('click', () => {}, true)
  document.removeEventListener('keydown', () => {}, true)
})
