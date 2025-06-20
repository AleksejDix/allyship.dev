/**
 * Element Highlighter
 * Manages highlighting of DOM elements without UI framework dependencies
 */

import type { HighlightOptions, HighlightStyle } from './types.js'

/**
 * Default highlight style
 */
const DEFAULT_HIGHLIGHT_STYLE: Required<HighlightStyle> = {
  borderColor: '#007acc',
  borderWidth: 2,
  backgroundColor: 'rgba(0, 122, 204, 0.1)',
  borderStyle: 'solid',
  zIndex: 2147483647,
  borderRadius: 0,
  boxShadow: 'none'
}

/**
 * Element Highlighter class
 * Manages creation and cleanup of highlight overlays
 */
export class ElementHighlighter {
  private highlights: Map<HTMLElement, HTMLElement> = new Map()
  private highlightContainer: HTMLElement | null = null

  constructor() {
    this.createHighlightContainer()
  }

  /**
   * Create the highlight container
   */
  private createHighlightContainer(): void {
    if (this.highlightContainer) return

    this.highlightContainer = document.createElement('div')
    this.highlightContainer.setAttribute('data-inspector-overlay', 'true')
    this.highlightContainer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: ${DEFAULT_HIGHLIGHT_STYLE.zIndex};
    `

    document.body.appendChild(this.highlightContainer)
  }

  /**
   * Highlight an element
   */
  highlight(element: HTMLElement, options: HighlightOptions = {}): void {
    // Clear existing highlight for this element
    this.clearHighlight(element)

    const style = { ...DEFAULT_HIGHLIGHT_STYLE, ...options.style }
    const rect = element.getBoundingClientRect()
    const scrollX = window.scrollX
    const scrollY = window.scrollY

    // Create highlight element
    const highlight = document.createElement('div')
    highlight.setAttribute('data-highlight-box', 'true')
    highlight.style.cssText = `
      position: absolute;
      left: ${rect.left + scrollX}px;
      top: ${rect.top + scrollY}px;
      width: ${rect.width}px;
      height: ${rect.height}px;
      border: ${style.borderWidth}px ${style.borderStyle} ${style.borderColor};
      background-color: ${style.backgroundColor};
      border-radius: ${style.borderRadius}px;
      box-shadow: ${style.boxShadow};
      pointer-events: none;
      box-sizing: border-box;
      transition: all 0.1s ease;
    `

    // Add tooltip if requested
    if (options.showTooltip && options.tooltipContent) {
      const tooltip = document.createElement('div')
      tooltip.style.cssText = `
        position: absolute;
        top: ${rect.height + 5}px;
        left: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-family: monospace;
        white-space: nowrap;
        z-index: 1;
      `
      tooltip.textContent = options.tooltipContent
      highlight.appendChild(tooltip)
    }

    if (this.highlightContainer) {
      this.highlightContainer.appendChild(highlight)
      this.highlights.set(element, highlight)
    }
  }

  /**
   * Clear highlight for a specific element
   */
  clearHighlight(element: HTMLElement): void {
    const highlight = this.highlights.get(element)
    if (highlight && highlight.parentNode) {
      highlight.parentNode.removeChild(highlight)
      this.highlights.delete(element)
    }
  }

  /**
   * Clear all highlights
   */
  clearAll(): void {
    this.highlights.forEach((highlight) => {
      if (highlight.parentNode) {
        highlight.parentNode.removeChild(highlight)
      }
    })
    this.highlights.clear()
  }

  /**
   * Get all highlight elements (for exclusion from inspection)
   */
  getHighlightElements(): HTMLElement[] {
    return Array.from(this.highlights.values())
  }

  /**
   * Update highlight positions (useful for scroll/resize events)
   */
  updatePositions(): void {
    this.highlights.forEach((highlight, element) => {
      const rect = element.getBoundingClientRect()
      const scrollX = window.scrollX
      const scrollY = window.scrollY

      highlight.style.left = `${rect.left + scrollX}px`
      highlight.style.top = `${rect.top + scrollY}px`
      highlight.style.width = `${rect.width}px`
      highlight.style.height = `${rect.height}px`
    })
  }

  /**
   * Destroy highlighter and cleanup
   */
  destroy(): void {
    this.clearAll()

    if (this.highlightContainer && this.highlightContainer.parentNode) {
      this.highlightContainer.parentNode.removeChild(this.highlightContainer)
      this.highlightContainer = null
    }
  }
}
