/**
 * Types for the headless element inspector
 */

export interface ElementInfo {
  /** The DOM element */
  element: HTMLElement
  /** CSS selector for the element */
  selector: string
  /** XPath for the element */
  xpath?: string
  /** Element tag name */
  tagName: string
  /** Element text content */
  textContent: string
  /** Element attributes */
  attributes: Record<string, string>
  /** Element bounding rect */
  rect: DOMRect
  /** Computed styles */
  computedStyles?: CSSStyleDeclaration
}

export interface InspectorOptions {
  /** Enable deep inspection mode (find smallest element at point) */
  deepInspection?: boolean
  /** Minimum element size to consider (pixels) */
  minElementSize?: number
  /** Elements to exclude from inspection */
  excludeSelectors?: string[]
  /** Enable debug logging */
  debug?: boolean
  /** Enable throttling for performance */
  throttle?: number
}

export interface InspectorState {
  /** Whether inspection is currently active */
  isInspecting: boolean
  /** Currently hovered element */
  hoveredElement: HTMLElement | null
  /** Inspection options */
  options: InspectorOptions
}

export interface InspectorEvent {
  /** Event type */
  type: 'hover' | 'unhover' | 'select' | 'start' | 'stop'
  /** Element information */
  element?: ElementInfo
  /** Event timestamp */
  timestamp: number
  /** Mouse coordinates (for hover/select events) */
  coordinates?: { x: number; y: number }
}

export interface HighlightStyle {
  /** Border color */
  borderColor?: string
  /** Border width */
  borderWidth?: number
  /** Background color */
  backgroundColor?: string
  /** Border style */
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  /** Z-index for highlight overlay */
  zIndex?: number
  /** Border radius */
  borderRadius?: number
  /** Box shadow */
  boxShadow?: string
}

export interface HighlightOptions {
  /** Highlight style */
  style?: HighlightStyle
  /** Show element info tooltip */
  showTooltip?: boolean
  /** Tooltip content */
  tooltipContent?: string
  /** Animation duration in ms */
  animationDuration?: number
}

export type InspectorEventHandler = (event: InspectorEvent) => void

export interface InspectorAPI {
  /** Start element inspection */
  start(): void

  /** Stop element inspection */
  stop(): void

  /** Toggle inspection state */
  toggle(): void

  /** Check if currently inspecting */
  isInspecting(): boolean

  /** Get current inspector state */
  getState(): InspectorState

  /** Update inspector options */
  setOptions(options: Partial<InspectorOptions>): void

  /** Add event listener */
  on(handler: InspectorEventHandler): () => void

  /** Remove event listener */
  off(handler: InspectorEventHandler): void

  /** Inspect element at coordinates */
  inspectAt(x: number, y: number): ElementInfo | null

  /** Get element info for a given element */
  getElementInfo(element: HTMLElement): ElementInfo

  /** Highlight an element */
  highlight(element: HTMLElement, options?: HighlightOptions): void

  /** Clear all highlights */
  clearHighlights(): void

  /** Destroy inspector and cleanup */
  destroy(): void
}
