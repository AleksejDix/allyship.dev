/**
 * Types of DOM changes that can be monitored
 */
export enum DOMChangeType {
  ELEMENT_ADDED = "element_added",
  ELEMENT_REMOVED = "element_removed",
  ATTRIBUTE_CHANGED = "attribute_changed",
  CONTENT_CHANGED = "content_changed",
  ACCESSIBILITY_CHANGE = "accessibility_change",
  PERFORMANCE_IMPACT = "performance_impact",
}

/**
 * Information about a DOM change
 */
export interface DOMChange {
  type: DOMChangeType
  element: HTMLElement
  timestamp: number
  details?: {
    attributeName?: string
    oldValue?: string
    newValue?: string
    performanceImpact?: number // milliseconds processing time
    accessibilityImpact?: boolean // affects screen readers
  }
}

/**
 * Performance metrics for monitoring
 */
export interface PerformanceMetrics {
  totalChanges: number
  changesPerSecond: number
  averageProcessingTime: number
  maxProcessingTime: number
  droppedChanges: number
  frameRate: number
}

/**
 * Configuration options for DOM monitoring
 */
export interface DOMMonitorOptions {
  /** Maximum number of changes to process per frame (120 FPS = ~8ms per frame) */
  maxChanges?: number

  /** Whether to observe text content changes */
  observeText?: boolean

  /** Whether to ignore class attribute changes */
  ignoreClassChanges?: boolean

  /** Whether to ignore style attribute changes */
  ignoreStyleChanges?: boolean

  /** Whether to ignore hidden elements */
  ignoreHiddenElements?: boolean

  /** Track accessibility-related changes (aria-*, role, tabindex, etc.) */
  trackAccessibility?: boolean

  /** Track performance impact of changes */
  trackPerformance?: boolean

  /** Enable debug mode with detailed logging */
  debug?: boolean

  /** Custom element filter function */
  elementFilter?: (element: HTMLElement) => boolean

  /** Custom attribute filter function */
  attributeFilter?: (attributeName: string, element: HTMLElement) => boolean

  /** Callback for performance metrics */
  onPerformanceUpdate?: (metrics: PerformanceMetrics) => void

  /** Target frame rate (default: 120) */
  targetFrameRate?: number
}

/**
 * Default configuration optimized for 120 FPS performance
 */
export const DEFAULT_OPTIONS: Required<DOMMonitorOptions> = {
  maxChanges: 10, // Process max 10 changes per frame for 120 FPS
  observeText: false, // Disabled by default for performance
  ignoreClassChanges: true,
  ignoreStyleChanges: true,
  ignoreHiddenElements: true,
  trackAccessibility: false,
  trackPerformance: false,
  debug: false,
  elementFilter: () => true,
  attributeFilter: () => true,
  onPerformanceUpdate: () => {},
  targetFrameRate: 120,
}

/**
 * Accessibility-related attributes to track
 */
export const ACCESSIBILITY_ATTRIBUTES = [
  "aria-label",
  "aria-labelledby",
  "aria-describedby",
  "aria-hidden",
  "aria-expanded",
  "aria-selected",
  "aria-checked",
  "aria-disabled",
  "aria-required",
  "aria-invalid",
  "aria-live",
  "aria-atomic",
  "role",
  "tabindex",
  "alt",
  "title",
]

/**
 * Event emitter interface for DOM monitor
 */
export interface DOMMonitorEventEmitter {
  emit(event: string, ...args: any[]): void
}

/**
 * Selector generation function type
 */
export type SelectorGenerator = (element: HTMLElement) => string
