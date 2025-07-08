// Main exports
export { createDOMMonitor, monitorDOM } from "./dom-monitor"
export {
  DOMChangeType,
  type DOMChange,
  type DOMMonitorOptions,
  type PerformanceMetrics,
  DEFAULT_OPTIONS,
  ACCESSIBILITY_ATTRIBUTES,
} from "./types"

// Utility exports
export {
  defaultSelectorGenerator,
  shouldIgnoreElement,
  isElementHidden,
  throttle,
} from "./utils"
