import { getFocusableElements, sortByTabOrder } from './focusable-selectors'

/**
 * Configuration options for the focus order visualizer
 */
export interface FocusOrderVisualizerOptions {
  /** Include hidden focusable elements */
  includeHidden?: boolean
  /** Show connecting lines between elements */
  showConnectingLines?: boolean
  /** Custom colors for the visualization */
  colors?: {
    overlay?: string
    overlayText?: string
    connectingLine?: string
    focusOutline?: string
  }
  /** Z-index for overlays */
  zIndex?: number
  /** Custom overlay size */
  overlaySize?: number
}

/**
 * Default configuration
 */
const DEFAULT_OPTIONS: Required<FocusOrderVisualizerOptions> = {
  includeHidden: false,
  showConnectingLines: true,
  colors: {
    overlay: '#2563eb',
    overlayText: '#ffffff',
    connectingLine: 'rgba(37, 99, 235, 0.3)',
    focusOutline: '#2563eb',
  },
  zIndex: 2147483646,
  overlaySize: 24,
}

/**
 * Statistics about the focus order
 */
export interface FocusOrderStats {
  /** Total number of focusable elements */
  total: number
  /** Number of elements with positive tabindex */
  positiveTabIndex: number
  /** Number of elements that are actually visible and focusable */
  actuallyFocusable: number
}

/**
 * Information about a focusable element
 */
export interface FocusableElementInfo {
  element: HTMLElement
  tabIndex: number
  order: number
  isVisible: boolean
}

/**
 * Creates a focus order visualizer instance
 */
export function createFocusOrderVisualizer(options: FocusOrderVisualizerOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let isActive = false
  let styleElement: HTMLStyleElement | null = null
  let overlayContainer: HTMLElement | null = null
  let overlays: HTMLElement[] = []
  let connectingLines: SVGElement[] = []
  let svgContainer: SVGSVGElement | null = null
  let focusableElements: FocusableElementInfo[] = []

  /**
   * Get all focusable elements with comprehensive sorting
   */
  function getFocusableElementsInfo(): FocusableElementInfo[] {
    try {
      const elements = getFocusableElements(document, config.includeHidden)
      const sortedElements = sortByTabOrder(elements)

      const focusableElementsInfo = sortedElements.map((element, index) => {
        const tabIndexAttr = element.getAttribute('tabindex')
        const tabIndex = tabIndexAttr ? parseInt(tabIndexAttr, 10) : 0

        return {
          element,
          tabIndex,
          order: index + 1,
          isVisible: true, // Already filtered by getFocusableElements
        }
      })

      return focusableElementsInfo
    } catch (error) {
      console.error('[focus-order-visualizer] Error:', error)
      return []
    }
  }

  /**
   * Create CSS styles for the visualization
   */
  function createStyles(): string {
    return `
      .focus-order-overlay {
        position: absolute;
        width: ${config.overlaySize}px;
        height: ${config.overlaySize}px;
        background-color: ${config.colors.overlay};
        color: ${config.colors.overlayText};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
        font-family: system-ui, sans-serif;
        z-index: ${config.zIndex};
        pointer-events: none;
        box-shadow: 0 0 0 2px white, 0 0 0 4px ${config.colors.overlay};
        transition: transform 0.2s ease;
      }

      .focus-order-overlay:hover {
        transform: scale(1.2);
      }

      .focus-order-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${config.zIndex};
      }

      .focus-order-svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: ${config.zIndex - 1};
        overflow: visible;
      }

      .focus-order-line {
        stroke: ${config.colors.connectingLine};
        stroke-width: 2;
        fill: none;
      }

      .focus-order-arrow {
        fill: ${config.colors.connectingLine};
      }
    `
  }

  /**
   * Create overlay container
   */
  function createOverlayContainer(): HTMLElement {
    const container = document.createElement('div')
    container.className = 'focus-order-container'
    container.setAttribute('aria-hidden', 'true')
    document.body.appendChild(container)
    return container
  }

  /**
   * Create SVG container
   */
  function createSVGContainer(): SVGSVGElement {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('class', 'focus-order-svg')
    svg.setAttribute('aria-hidden', 'true')

    // Define arrow marker
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
    marker.setAttribute('id', 'focus-arrow')
    marker.setAttribute('markerWidth', '10')
    marker.setAttribute('markerHeight', '10')
    marker.setAttribute('refX', '8')
    marker.setAttribute('refY', '3')
    marker.setAttribute('orient', 'auto')
    marker.setAttribute('markerUnits', 'strokeWidth')

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('d', 'M0,0 L0,6 L9,3 z')
    path.setAttribute('class', 'focus-order-arrow')

    marker.appendChild(path)
    defs.appendChild(marker)
    svg.appendChild(defs)

    document.body.appendChild(svg)
    return svg
  }

  /**
   * Create an overlay for a focusable element
   */
  function createOverlay(elementInfo: FocusableElementInfo): HTMLElement {
    const { element, order } = elementInfo
    const rect = element.getBoundingClientRect()
    const overlay = document.createElement('div')

    overlay.className = 'focus-order-overlay'
    overlay.textContent = order.toString()
    // Use absolute positioning relative to document
    overlay.style.top = `${window.pageYOffset + rect.top}px`
    overlay.style.left = `${window.pageXOffset + rect.left}px`

    return overlay
  }

  /**
   * Create a connecting line between two focusable elements
   */
  function createConnectingLine(from: FocusableElementInfo, to: FocusableElementInfo): SVGPathElement {
    const fromRect = from.element.getBoundingClientRect()
    const toRect = to.element.getBoundingClientRect()

    const fromX = window.pageXOffset + fromRect.left + fromRect.width / 2
    const fromY = window.pageYOffset + fromRect.top + fromRect.height / 2
    const toX = window.pageXOffset + toRect.left + toRect.width / 2
    const toY = window.pageYOffset + toRect.top + toRect.height / 2

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    path.setAttribute('class', 'focus-order-line')
    path.setAttribute('marker-end', 'url(#focus-arrow)')

    // Create a straight line
    const pathData = `M ${fromX} ${fromY} L ${toX} ${toY}`
    path.setAttribute('d', pathData)

    return path
  }

  /**
   * Update visualization
   */
  function updateVisualization(): void {
    if (!isActive) return

    // Update overlay positions
    focusableElements.forEach((elementInfo, index) => {
      const overlay = overlays[index]
      if (overlay) {
        const rect = elementInfo.element.getBoundingClientRect()
        overlay.style.top = `${window.pageYOffset + rect.top}px`
        overlay.style.left = `${window.pageXOffset + rect.left}px`
      }
    })

    // Update connecting lines
    if (config.showConnectingLines && svgContainer) {
      // Clear existing lines
      connectingLines.forEach(line => line.remove())
      connectingLines = []

      // Create new lines
      for (let i = 0; i < focusableElements.length - 1; i++) {
        const line = createConnectingLine(focusableElements[i], focusableElements[i + 1])
        svgContainer.appendChild(line)
        connectingLines.push(line)
      }

      // Update SVG dimensions
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )
      const docWidth = Math.max(
        document.body.scrollWidth,
        document.body.offsetWidth,
        document.documentElement.clientWidth,
        document.documentElement.scrollWidth,
        document.documentElement.offsetWidth
      )

      svgContainer.setAttribute('width', docWidth.toString())
      svgContainer.setAttribute('height', docHeight.toString())
    }
  }

  /**
   * Start visualizing focus order
   */
  function start(): void {
    if (isActive) return

    try {
      isActive = true

      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.textContent = createStyles()
        document.head.appendChild(styleElement)
      }

      focusableElements = getFocusableElementsInfo()

      if (!overlayContainer) {
        overlayContainer = createOverlayContainer()
      }

      if (config.showConnectingLines && !svgContainer) {
        svgContainer = createSVGContainer()
      }

      focusableElements.forEach((elementInfo) => {
        const overlay = createOverlay(elementInfo)
        overlayContainer!.appendChild(overlay)
        overlays.push(overlay)
        elementInfo.element.setAttribute('data-focus-order', elementInfo.order.toString())
      })

      // Create connecting lines if enabled
      if (config.showConnectingLines && svgContainer) {
        for (let i = 0; i < focusableElements.length - 1; i++) {
          const line = createConnectingLine(focusableElements[i], focusableElements[i + 1])
          svgContainer.appendChild(line)
          connectingLines.push(line)
        }
      }

      // Add scroll and resize listeners for real-time updates
      window.addEventListener('scroll', updateVisualization, { passive: true })
      window.addEventListener('resize', updateVisualization, { passive: true })

      // Add scroll listeners to all scrollable containers
      document.addEventListener('scroll', updateVisualization, { passive: true, capture: true })

      updateVisualization()

    } catch (error) {
      console.error('[focus-order-visualizer] Error starting:', error)
      stop()
    }
  }

  /**
   * Stop visualizing focus order
   */
  function stop(): void {
    if (!isActive) return

    isActive = false

    // Remove scroll and resize listeners
    window.removeEventListener('scroll', updateVisualization)
    window.removeEventListener('resize', updateVisualization)
    document.removeEventListener('scroll', updateVisualization, { capture: true })

    overlays.forEach(overlay => overlay.remove())
    overlays = []

    connectingLines.forEach(line => line.remove())
    connectingLines = []

    if (overlayContainer) {
      overlayContainer.remove()
      overlayContainer = null
    }

    if (svgContainer) {
      svgContainer.remove()
      svgContainer = null
    }

    focusableElements.forEach(elementInfo => {
      elementInfo.element.removeAttribute('data-focus-order')
    })

    if (styleElement) {
      styleElement.remove()
      styleElement = null
    }

    focusableElements = []
  }

  /**
   * Toggle visualization state
   */
  function toggle(): boolean {
    if (isActive) {
      stop()
    } else {
      start()
    }
    return isActive
  }

  /**
   * Get statistics about focus order
   */
  function getStats(): FocusOrderStats {
    const elements = getFocusableElementsInfo()

    return {
      total: elements.length,
      positiveTabIndex: elements.filter(info => info.tabIndex > 0).length,
      actuallyFocusable: elements.filter(info => info.isVisible).length,
    }
  }

  /**
   * Get information about all focusable elements
   */
  function getCurrentFocusableElements(): FocusableElementInfo[] {
    return [...focusableElements]
  }

  /**
   * Update configuration
   */
  function updateConfig(newOptions: Partial<FocusOrderVisualizerOptions>): void {
    Object.assign(config, newOptions)
    if (isActive) {
      stop()
      start()
    }
  }

  /**
   * Destroy the visualizer and clean up all resources
   */
  function destroy(): void {
    stop()
    // Additional cleanup if needed
  }

  return {
    start,
    stop,
    toggle,
    isActive: () => isActive,
    getStats,
    getFocusableElements: getCurrentFocusableElements,
    updateConfig,
    destroy,
  }
}
