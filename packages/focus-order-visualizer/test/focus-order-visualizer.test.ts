import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import { createFocusOrderVisualizer } from '../src/focus-order-visualizer'

// Mock focusable-selectors since it's an external dependency
vi.mock('focusable-selectors', () => ({
  default: [
    'input:not([type="hidden"]):not([disabled])',
    'button:not([disabled])',
    'a[href]',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ]
}))

describe('FocusOrderVisualizer', () => {
  let dom: JSDOM
  let document: Document
  let window: Window & typeof globalThis

  beforeEach(() => {
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <button id="btn1">Button 1</button>
          <input id="input1" type="text" value="Input 1">
          <a id="link1" href="#test">Link 1</a>
          <button id="btn2" tabindex="2">Button 2</button>
          <input id="input2" type="text" tabindex="1" value="Input 2">
        </body>
      </html>
    `, {
      url: 'http://localhost',
      pretendToBeVisual: true,
      resources: 'usable'
    })

    document = dom.window.document
    window = dom.window as unknown as Window & typeof globalThis

    // Setup global environment
    global.document = document
    global.window = window
    global.HTMLElement = window.HTMLElement
    global.HTMLInputElement = window.HTMLInputElement
    global.getComputedStyle = window.getComputedStyle

    // Mock getBoundingClientRect for all elements
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      top: 10,
      left: 10,
      width: 100,
      height: 30,
      right: 110,
      bottom: 40,
      x: 10,
      y: 10,
      toJSON: () => ({})
    }))
  })

  describe('Basic functionality', () => {
    it('should create visualizer instance', () => {
      const visualizer = createFocusOrderVisualizer()
      expect(visualizer).toBeDefined()
      expect(typeof visualizer.start).toBe('function')
      expect(typeof visualizer.stop).toBe('function')
      expect(typeof visualizer.toggle).toBe('function')
    })

    it('should start and stop visualization', () => {
      const visualizer = createFocusOrderVisualizer()

      expect(visualizer.isActive()).toBe(false)

      visualizer.start()
      expect(visualizer.isActive()).toBe(true)

      visualizer.stop()
      expect(visualizer.isActive()).toBe(false)
    })

    it('should toggle visualization state', () => {
      const visualizer = createFocusOrderVisualizer()

      expect(visualizer.isActive()).toBe(false)

      const result1 = visualizer.toggle()
      expect(result1).toBe(true)
      expect(visualizer.isActive()).toBe(true)

      const result2 = visualizer.toggle()
      expect(result2).toBe(false)
      expect(visualizer.isActive()).toBe(false)
    })
  })

  describe('DOM manipulation', () => {
    it('should add style element when started', () => {
      const visualizer = createFocusOrderVisualizer()

      expect(document.head.querySelector('style')).toBeNull()

      visualizer.start()

      const styleElement = document.head.querySelector('style')
      expect(styleElement).not.toBeNull()
      expect(styleElement?.textContent).toContain('.focus-order-overlay')
    })

    it('should remove style element when stopped', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()
      expect(document.head.querySelector('style')).not.toBeNull()

      visualizer.stop()
      expect(document.head.querySelector('style')).toBeNull()
    })

    it('should create overlay container', () => {
      const visualizer = createFocusOrderVisualizer()

      expect(document.body.querySelector('.focus-order-container')).toBeNull()

      visualizer.start()

      const container = document.body.querySelector('.focus-order-container')
      expect(container).not.toBeNull()
      expect(container?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should create overlays for focusable elements', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()

      const overlays = document.querySelectorAll('.focus-order-overlay')
      expect(overlays.length).toBeGreaterThan(0)

      // Check that overlays have numbers
      const firstOverlay = overlays[0] as HTMLElement
      expect(firstOverlay.textContent).toMatch(/^\d+$/)
    })

    it('should add data attributes to focusable elements', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()

      const button = document.getElementById('btn1')
      expect(button?.getAttribute('data-focus-order')).toBeTruthy()
    })

    it('should clean up when stopped', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()
      visualizer.stop()

      expect(document.body.querySelector('.focus-order-container')).toBeNull()
      expect(document.querySelectorAll('.focus-order-overlay')).toHaveLength(0)

      const button = document.getElementById('btn1')
      expect(button?.getAttribute('data-focus-order')).toBeNull()
    })
  })

  describe('Focus order detection', () => {
    it('should detect focusable elements', () => {
      const visualizer = createFocusOrderVisualizer()
      const stats = visualizer.getStats()

      expect(stats.total).toBeGreaterThan(0)
    })

    it('should handle positive tabindex correctly', () => {
      const visualizer = createFocusOrderVisualizer()
      const stats = visualizer.getStats()

      // We have elements with tabindex="1" and tabindex="2"
      expect(stats.positiveTabIndex).toBeGreaterThan(0)
    })

    it('should return focusable elements list', () => {
      const visualizer = createFocusOrderVisualizer()
      visualizer.start()

      const elements = visualizer.getFocusableElements()
      expect(Array.isArray(elements)).toBe(true)

      if (elements.length > 0) {
        const firstElement = elements[0]
        expect(firstElement).toHaveProperty('element')
        expect(firstElement).toHaveProperty('tabIndex')
        expect(firstElement).toHaveProperty('order')
        expect(firstElement).toHaveProperty('isVisible')
      }
    })
  })

  describe('Configuration', () => {
    it('should use custom colors', () => {
      const customColors = {
        overlay: '#ff0000',
        overlayText: '#00ff00'
      }

      const visualizer = createFocusOrderVisualizer({
        colors: customColors
      })

      visualizer.start()

      const styleElement = document.head.querySelector('style')
      expect(styleElement?.textContent).toContain(customColors.overlay)
      expect(styleElement?.textContent).toContain(customColors.overlayText)
    })

    it('should use custom z-index', () => {
      const customZIndex = 999999

      const visualizer = createFocusOrderVisualizer({
        zIndex: customZIndex
      })

      visualizer.start()

      const styleElement = document.head.querySelector('style')
      expect(styleElement?.textContent).toContain(`z-index: ${customZIndex}`)
    })

    it('should use custom overlay size', () => {
      const customSize = 40

      const visualizer = createFocusOrderVisualizer({
        overlaySize: customSize
      })

      visualizer.start()

      const styleElement = document.head.querySelector('style')
      expect(styleElement?.textContent).toContain(`width: ${customSize}px`)
      expect(styleElement?.textContent).toContain(`height: ${customSize}px`)
    })

    it('should update configuration', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.updateConfig({
        colors: { overlay: '#123456' }
      })

      visualizer.start()

      const styleElement = document.head.querySelector('style')
      expect(styleElement?.textContent).toContain('#123456')
    })
  })

  describe('Edge cases', () => {
    it('should handle empty DOM', () => {
      // Create empty DOM
      const emptyDom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')
      global.document = emptyDom.window.document
             global.window = emptyDom.window as unknown as Window & typeof globalThis

      const visualizer = createFocusOrderVisualizer()

      expect(() => visualizer.start()).not.toThrow()
      expect(visualizer.getStats().total).toBe(0)
    })

    it('should handle elements with zero dimensions', () => {
      // Mock getBoundingClientRect to return zero dimensions
      Element.prototype.getBoundingClientRect = vi.fn(() => ({
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        right: 0,
        bottom: 0,
        x: 0,
        y: 0,
        toJSON: () => ({})
      }))

      const visualizer = createFocusOrderVisualizer()

      expect(() => visualizer.start()).not.toThrow()
    })

    it('should not start twice', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()
      const firstContainer = document.body.querySelector('.focus-order-container')

      visualizer.start() // Try to start again
      const containers = document.body.querySelectorAll('.focus-order-container')

      expect(containers).toHaveLength(1)
      expect(containers[0]).toBe(firstContainer)
    })

    it('should handle stop when not active', () => {
      const visualizer = createFocusOrderVisualizer()

      expect(() => visualizer.stop()).not.toThrow()
      expect(visualizer.isActive()).toBe(false)
    })

    it('should handle destroy method', () => {
      const visualizer = createFocusOrderVisualizer()

      visualizer.start()
      expect(visualizer.isActive()).toBe(true)

      visualizer.destroy()
      expect(visualizer.isActive()).toBe(false)
    })
  })

  describe('Error handling', () => {
    it('should handle DOM query errors gracefully', () => {
      // Mock querySelectorAll to throw an error
      const originalQuerySelectorAll = document.querySelectorAll
      document.querySelectorAll = vi.fn(() => {
        throw new Error('DOM query failed')
      })

      const visualizer = createFocusOrderVisualizer()

      // Should not throw, should handle error gracefully
      expect(() => visualizer.start()).not.toThrow()
      expect(visualizer.getStats().total).toBe(0)

      // Restore original method
      document.querySelectorAll = originalQuerySelectorAll
    })

    it('should handle CSS injection errors gracefully', () => {
      // Mock document.head.appendChild to throw an error
      const originalAppendChild = document.head.appendChild
      document.head.appendChild = vi.fn(() => {
        throw new Error('CSS injection failed')
      })

      const visualizer = createFocusOrderVisualizer()

      // Should not throw, should handle error gracefully
      expect(() => visualizer.start()).not.toThrow()

      // Restore original method
      document.head.appendChild = originalAppendChild
    })
  })
})
