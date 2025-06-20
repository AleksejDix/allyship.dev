/**
 * Headless Element Inspector
 * Provides DOM element inspection capabilities without UI dependencies
 */

import type {
  InspectorAPI,
  InspectorOptions,
  InspectorState,
  InspectorEvent,
  InspectorEventHandler,
  ElementInfo,
  HighlightOptions
} from './types.js'

import {
  getElementInfo,
  findDeepestElementAtPoint,
  isExcludedElement,
  throttle,
  isElementVisible
} from './utils.js'

import { ElementHighlighter } from './highlighter.js'

/**
 * Default inspector options
 */
const DEFAULT_OPTIONS: Required<InspectorOptions> = {
  deepInspection: false,
  minElementSize: 5,
  excludeSelectors: [],
  debug: false,
  throttle: 16 // 60fps
}

/**
 * Create a headless element inspector with functional API
 *
 * Provides element inspection capabilities without any UI dependencies.
 * Can be used in any environment that has DOM access.
 *
 * @example
 * ```typescript
 * const inspector = createElementInspector({
 *   deepInspection: true,
 *   debug: true
 * })
 *
 * inspector.onStateChange((state) => {
 *   console.log('Inspector state changed:', state.isInspecting)
 * })
 *
 * inspector.start()
 * ```
 */
export function createElementInspector(options: Partial<InspectorOptions> = {}): InspectorAPI {
  // Private state using closures
  let state: InspectorState = {
    isInspecting: false,
    hoveredElement: null,
    options: { ...DEFAULT_OPTIONS, ...options }
  }

  const eventHandlers = new Set<InspectorEventHandler>()
  const highlighter = new ElementHighlighter()
  let boundHandlers: {
    pointerMove?: (e: PointerEvent) => void
    click?: (e: MouseEvent) => void
    keyDown?: (e: KeyboardEvent) => void
  } = {}

  // Initialize handlers
  initializeHandlers()

  /**
   * Initialize event handlers with throttling
   */
  function initializeHandlers(): void {
    // Throttled pointer move handler for performance
    const throttleMs = state.options.throttle ?? 0
    const throttledPointerMove = throttleMs > 0
      ? throttle(handlePointerMove, throttleMs)
      : handlePointerMove

    boundHandlers = {
      pointerMove: throttledPointerMove,
      click: handleClick,
      keyDown: handleKeyDown
    }
  }

  /**
   * Handle pointer move events
   */
  function handlePointerMove(event: PointerEvent): void {
    if (!state.isInspecting) return

    const element = findElementAtPoint(event.clientX, event.clientY)

    // If element hasn't changed, do nothing
    if (element === state.hoveredElement) return

    // Clear previous highlight if there was one
    if (state.hoveredElement) {
      highlighter.clearHighlight(state.hoveredElement)
    }

    // Update state
    state.hoveredElement = element

    // If we have a new element, highlight it and emit event
    if (element) {
      const elementInfo = getElementInfo(element)

      // Highlight the element
      highlighter.highlight(element)

      // Emit hover event
      emitEvent({
        type: 'hover',
        element: elementInfo,
        timestamp: performance.now(),
        coordinates: { x: event.clientX, y: event.clientY }
      })

      if (state.options.debug) {
        console.log('[ElementInspector] Hovering:', elementInfo.selector)
      }
    } else {
      // No element found - emit unhover event
      emitEvent({
        type: 'unhover',
        timestamp: performance.now(),
        coordinates: { x: event.clientX, y: event.clientY }
      })

      if (state.options.debug) {
        console.log('[ElementInspector] No element at cursor')
      }
    }
  }

  /**
   * Handle click events
   */
  function handleClick(event: MouseEvent): void {
    if (!state.isInspecting) return

    event.preventDefault()
    event.stopPropagation()

    const element = findElementAtPoint(event.clientX, event.clientY)
    if (!element) return

    const elementInfo = getElementInfo(element)

    // Emit select event
    emitEvent({
      type: 'select',
      element: elementInfo,
      timestamp: performance.now(),
      coordinates: { x: event.clientX, y: event.clientY }
    })

    if (state.options.debug) {
      console.log('[ElementInspector] Selected:', elementInfo.selector)
    }
  }

  /**
   * Handle keyboard events
   */
  function handleKeyDown(event: KeyboardEvent): void {
    if (!state.isInspecting) return

    if (event.key === 'Escape') {
      stop()
      event.preventDefault()
    }
  }

  /**
   * Find element at the given coordinates
   */
  function findElementAtPoint(x: number, y: number): HTMLElement | null {
    // Get excluded elements
    const excludeSelectors = state.options.excludeSelectors ?? []
    const excludedElements = excludeSelectors.length > 0
      ? Array.from(document.querySelectorAll(excludeSelectors.join(', ')))
      : []

    // Add highlighter elements to exclusion list
    excludedElements.push(...highlighter.getHighlightElements())

    if (state.options.deepInspection) {
      return findDeepestElementAtPoint(x, y, excludedElements)
    }

    // Standard element finding
    const elements = document.elementsFromPoint(x, y) as HTMLElement[]

    for (const element of elements) {
      if (
        !excludedElements.includes(element) &&
        !isExcludedElement(element) &&
        isElementVisible(element)
      ) {
        const rect = element.getBoundingClientRect()
        const minSize = state.options.minElementSize ?? 5
        if (rect.width >= minSize && rect.height >= minSize) {
          return element
        }
      }
    }

    return null
  }

  /**
   * Emit an event to all registered handlers
   */
  function emitEvent(event: InspectorEvent): void {
    eventHandlers.forEach(handler => {
      try {
        handler(event)
      } catch (error) {
        console.error('[ElementInspector] Error in event handler:', error)
      }
    })
  }

  /**
   * Start element inspection
   */
  function start(): void {
    if (state.isInspecting) return

    state.isInspecting = true

    // Add event listeners
    document.addEventListener('pointermove', boundHandlers.pointerMove!, { passive: true })
    document.addEventListener('click', boundHandlers.click!, { capture: true })
    document.addEventListener('keydown', boundHandlers.keyDown!, { capture: true })

    // Update cursor and selection
    document.body.style.cursor = 'crosshair'
    document.body.style.userSelect = 'none'

    // Emit start event
    emitEvent({
      type: 'start',
      timestamp: performance.now()
    })

    if (state.options.debug) {
      console.log('[ElementInspector] Started inspection')
    }
  }

  /**
   * Stop element inspection
   */
  function stop(): void {
    if (!state.isInspecting) return

    state.isInspecting = false
    state.hoveredElement = null

    // Remove event listeners
    if (boundHandlers.pointerMove) {
      document.removeEventListener('pointermove', boundHandlers.pointerMove)
    }
    if (boundHandlers.click) {
      document.removeEventListener('click', boundHandlers.click, { capture: true })
    }
    if (boundHandlers.keyDown) {
      document.removeEventListener('keydown', boundHandlers.keyDown, { capture: true })
    }

    // Reset cursor and selection
    document.body.style.cursor = ''
    document.body.style.userSelect = ''

    // Clear highlights
    highlighter.clearAll()

    // Emit stop event
    emitEvent({
      type: 'stop',
      timestamp: performance.now()
    })

    if (state.options.debug) {
      console.log('[ElementInspector] Stopped inspection')
    }
  }

  /**
   * Toggle inspection state
   */
  function toggle(): void {
    if (state.isInspecting) {
      stop()
    } else {
      start()
    }
  }

  /**
   * Check if currently inspecting
   */
  function isInspecting(): boolean {
    return state.isInspecting
  }

  /**
   * Get current inspector state
   */
  function getState(): InspectorState {
    return { ...state }
  }

  /**
   * Update inspector options
   */
  function setOptions(newOptions: Partial<InspectorOptions>): void {
    state.options = { ...state.options, ...newOptions }

    // Reinitialize handlers if throttle changed
    if ('throttle' in newOptions) {
      initializeHandlers()
    }

    if (state.options.debug) {
      console.log('[ElementInspector] Options updated:', state.options)
    }
  }

  /**
   * Add event listener
   */
  function on(handler: InspectorEventHandler): () => void {
    eventHandlers.add(handler)
    return () => eventHandlers.delete(handler)
  }

  /**
   * Remove event listener
   */
  function off(handler: InspectorEventHandler): void {
    eventHandlers.delete(handler)
  }

  /**
   * Inspect element at coordinates
   */
  function inspectAt(x: number, y: number): ElementInfo | null {
    const element = findElementAtPoint(x, y)
    return element ? getElementInfo(element) : null
  }

  /**
   * Get element info for a given element
   */
  function getElementInfoForElement(element: HTMLElement): ElementInfo {
    return getElementInfo(element)
  }

  /**
   * Highlight an element
   */
  function highlight(element: HTMLElement, options?: HighlightOptions): void {
    highlighter.highlight(element, options)
  }

  /**
   * Clear all highlights
   */
  function clearHighlights(): void {
    highlighter.clearAll()
  }

  /**
   * Destroy inspector and cleanup
   */
  function destroy(): void {
    stop()
    highlighter.destroy()
  }

  // Return the public API
  return {
    start,
    stop,
    toggle,
    isInspecting,
    getState,
    setOptions,
    on,
    off,
    inspectAt,
    getElementInfo: getElementInfoForElement,
    highlight,
    clearHighlights,
    destroy
  }
}

// Legacy class wrapper for backward compatibility
export class ElementInspector implements InspectorAPI {
  private inspector: InspectorAPI

  constructor(options: Partial<InspectorOptions> = {}) {
    this.inspector = createElementInspector(options)
  }

  start(): void {
    this.inspector.start()
  }

  stop(): void {
    this.inspector.stop()
  }

  toggle(): void {
    this.inspector.toggle()
  }

  isInspecting(): boolean {
    return this.inspector.isInspecting()
  }

  getState(): InspectorState {
    return this.inspector.getState()
  }

  setOptions(options: Partial<InspectorOptions>): void {
    this.inspector.setOptions(options)
  }

  on(handler: InspectorEventHandler): () => void {
    return this.inspector.on(handler)
  }

  off(handler: InspectorEventHandler): void {
    this.inspector.off(handler)
  }

  inspectAt(x: number, y: number): ElementInfo | null {
    return this.inspector.inspectAt(x, y)
  }

  getElementInfo(element: HTMLElement): ElementInfo {
    return this.inspector.getElementInfo(element)
  }

  highlight(element: HTMLElement, options?: HighlightOptions): void {
    this.inspector.highlight(element, options)
  }

  clearHighlights(): void {
    this.inspector.clearHighlights()
  }

  destroy(): void {
    this.inspector.destroy()
  }
}
