/**
 * @allystudio/element-inspector
 *
 * Headless DOM element inspection and highlighting library
 *
 * @example
 * ```typescript
 * import { createElementInspector } from '@allystudio/element-inspector'
 *
 * const inspector = createElementInspector({
 *   deepInspection: true,
 *   debug: true
 * })
 *
 * inspector.on((event) => {
 *   console.log('Inspector event:', event.type, event.element?.tagName)
 * })
 *
 * inspector.start()
 * ```
 */

// Main factory function (recommended)
export { createElementInspector } from './inspector.js'

// Legacy class (for backward compatibility)
export { ElementInspector } from './inspector.js'

// Utility classes
export { ElementHighlighter } from './highlighter.js'

// Types
export type {
  InspectorAPI,
  InspectorOptions,
  InspectorState,
  InspectorEvent,
  InspectorEventHandler,
  ElementInfo,
  HighlightOptions,
  HighlightStyle
} from './types.js'

// Utilities
export {
  generateSelector,
  generateXPath,
  findElementByXPath,
  findDeepestElementAtPoint,
  isExcludedElement,
  getElementInfo,
  throttle,
  debounce,
  isElementVisible,
  getAccessibilityInfo
} from './utils.js'

// Version
export const version = '0.0.1'
