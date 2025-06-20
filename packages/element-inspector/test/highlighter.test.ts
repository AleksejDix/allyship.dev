import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ElementHighlighter } from '../src/highlighter.js'

describe('ElementHighlighter', () => {
  let highlighter: ElementHighlighter
  let testElement: HTMLElement

  beforeEach(() => {
    highlighter = new ElementHighlighter()

    testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.style.cssText = 'position: absolute; left: 100px; top: 50px; width: 200px; height: 100px;'

    // Mock getBoundingClientRect
    testElement.getBoundingClientRect = () => ({
      left: 100,
      top: 50,
      width: 200,
      height: 100,
      x: 100,
      y: 50,
      right: 300,
      bottom: 150
    } as DOMRect)

    document.body.appendChild(testElement)
  })

  afterEach(() => {
    highlighter.destroy()
    testElement.remove()

    // Clean up any remaining overlay containers
    const overlays = document.querySelectorAll('[data-inspector-overlay]')
    overlays.forEach(overlay => overlay.remove())
  })

  it('should create highlighter instance', () => {
    expect(highlighter).toBeDefined()
    expect(typeof highlighter.highlight).toBe('function')
    expect(typeof highlighter.clearAll).toBe('function')
  })

  it('should create highlight container on instantiation', () => {
    const containers = document.querySelectorAll('[data-inspector-overlay]')
    expect(containers.length).toBeGreaterThan(0)

    const container = containers[0] as HTMLElement
    expect(container.style.position).toBe('fixed')
    expect(container.style.pointerEvents).toBe('none')
  })

  it('should highlight an element with default styles', () => {
    highlighter.highlight(testElement)

    const highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(1)

    const highlight = highlights[0] as HTMLElement
    expect(highlight.style.position).toBe('absolute')
    expect(highlight.style.left).toBe('100px')
    expect(highlight.style.top).toBe('50px')
    expect(highlight.style.width).toBe('200px')
    expect(highlight.style.height).toBe('100px')
    expect(highlight.style.borderColor).toBe('rgb(0, 122, 204)')
  })

  it('should highlight element with custom styles', () => {
    const customOptions = {
      style: {
        borderColor: '#ff0000',
        borderWidth: 3,
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderRadius: 5,
        boxShadow: '0 0 10px rgba(0,0,0,0.5)'
      }
    }

    highlighter.highlight(testElement, customOptions)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    expect(highlight.style.borderColor).toBe('rgb(255, 0, 0)')
    expect(highlight.style.borderWidth).toBe('3px')
    expect(highlight.style.backgroundColor).toBe('rgba(255, 0, 0, 0.2)')
    expect(highlight.style.borderRadius).toBe('5px')
    expect(highlight.style.boxShadow).toContain('rgba(0, 0, 0, 0.5)')
  })

  it('should show tooltip when requested', () => {
    const options = {
      showTooltip: true,
      tooltipContent: 'div#test-element'
    }

    highlighter.highlight(testElement, options)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    const tooltip = highlight.querySelector('div')

    expect(tooltip).toBeDefined()
    expect(tooltip?.textContent).toBe('div#test-element')
    expect(tooltip?.style.backgroundColor).toContain('rgba(0, 0, 0, 0.8)')
    expect(tooltip?.style.color).toBe('white')
  })

  it('should clear highlight for specific element', () => {
    highlighter.highlight(testElement)

    let highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(1)

    highlighter.clearHighlight(testElement)

    highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(0)
  })

  it('should clear existing highlight when highlighting same element again', () => {
    highlighter.highlight(testElement)
    highlighter.highlight(testElement) // Should replace previous highlight

    const highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(1)
  })

  it('should clear all highlights', () => {
    const element2 = document.createElement('div')
    element2.getBoundingClientRect = () => ({ left: 0, top: 0, width: 50, height: 50 } as DOMRect)
    document.body.appendChild(element2)

    highlighter.highlight(testElement)
    highlighter.highlight(element2)

    let highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(2)

    highlighter.clearAll()

    highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(0)

    element2.remove()
  })

  it('should return highlight elements for exclusion', () => {
    highlighter.highlight(testElement)

    const highlightElements = highlighter.getHighlightElements()
    expect(highlightElements.length).toBe(1)
    expect(highlightElements[0].hasAttribute('data-highlight-box')).toBe(true)
  })

  it('should update highlight positions', () => {
    highlighter.highlight(testElement)

    // Change element position
    testElement.getBoundingClientRect = () => ({
      left: 150,
      top: 100,
      width: 250,
      height: 120,
      x: 150,
      y: 100,
      right: 400,
      bottom: 220
    } as DOMRect)

    highlighter.updatePositions()

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    expect(highlight.style.left).toBe('150px')
    expect(highlight.style.top).toBe('100px')
    expect(highlight.style.width).toBe('250px')
    expect(highlight.style.height).toBe('120px')
  })

  it('should handle scroll offset in positioning', () => {
    // Mock window scroll
    Object.defineProperty(window, 'scrollX', { value: 20, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 30, writable: true })

    highlighter.highlight(testElement)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    expect(highlight.style.left).toBe('120px') // 100 + 20
    expect(highlight.style.top).toBe('80px')   // 50 + 30

    // Reset scroll
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true })
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true })
  })

  it('should destroy highlighter and cleanup', () => {
    highlighter.highlight(testElement)

    let highlights = document.querySelectorAll('[data-highlight-box]')
    let containers = document.querySelectorAll('[data-inspector-overlay]')

    expect(highlights.length).toBe(1)
    expect(containers.length).toBe(1)

    highlighter.destroy()

    highlights = document.querySelectorAll('[data-highlight-box]')
    containers = document.querySelectorAll('[data-inspector-overlay]')

    expect(highlights.length).toBe(0)
    expect(containers.length).toBe(0)
  })

  it('should not create multiple containers', () => {
    const highlighter2 = new ElementHighlighter()

    const containers = document.querySelectorAll('[data-inspector-overlay]')
    expect(containers.length).toBe(2) // One for each highlighter instance

    highlighter2.destroy()
  })

  it('should handle highlighting when container is not available', () => {
    // Destroy container manually
    const container = document.querySelector('[data-inspector-overlay]')
    container?.remove()

    // Try to highlight - should not throw error
    expect(() => {
      highlighter.highlight(testElement)
    }).not.toThrow()

    const highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBe(0)
  })

  it('should handle clearing non-existent highlights', () => {
    const nonExistentElement = document.createElement('div')

    // Should not throw error
    expect(() => {
      highlighter.clearHighlight(nonExistentElement)
    }).not.toThrow()
  })

  it('should apply correct z-index to container', () => {
    const container = document.querySelector('[data-inspector-overlay]') as HTMLElement
    expect(container.style.zIndex).toBe('2147483647')
  })

  it('should position tooltip correctly below element', () => {
    const options = {
      showTooltip: true,
      tooltipContent: 'Test tooltip'
    }

    highlighter.highlight(testElement, options)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    const tooltip = highlight.querySelector('div') as HTMLElement

    expect(tooltip.style.top).toBe('105px') // element height (100) + 5px gap
    expect(tooltip.style.left).toBe('0px')
  })

  it('should apply transition styles to highlights', () => {
    highlighter.highlight(testElement)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    expect(highlight.style.transition).toContain('0.1s')
  })

  it('should use box-sizing border-box', () => {
    highlighter.highlight(testElement)

    const highlight = document.querySelector('[data-highlight-box]') as HTMLElement
    expect(highlight.style.boxSizing).toBe('border-box')
  })
})
