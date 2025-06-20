import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { JSDOM } from 'jsdom'
import { createElementOutliner, OUTLINE_COLORS } from './index'

// Setup JSDOM environment
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
})

// Set up global environment
global.document = dom.window.document
global.window = dom.window as any
global.HTMLElement = dom.window.HTMLElement
global.HTMLStyleElement = dom.window.HTMLStyleElement

describe('createElementOutliner', () => {
  let outliner: ReturnType<typeof createElementOutliner>

  beforeEach(() => {
    // Clean up any existing style elements
    const existingStyles = document.querySelectorAll('#element-outliner-styles')
    existingStyles.forEach(el => el.remove())

    // Reset document body
    document.body.innerHTML = '<div><p>Test content</p></div>'

    outliner = createElementOutliner()
  })

  afterEach(() => {
    if (outliner) {
      outliner.destroy()
    }
  })

  describe('basic functionality', () => {
    it('should create an outliner instance', () => {
      expect(outliner).toBeDefined()
      expect(typeof outliner.start).toBe('function')
      expect(typeof outliner.stop).toBe('function')
      expect(typeof outliner.toggle).toBe('function')
      expect(typeof outliner.isActive).toBe('function')
      expect(typeof outliner.configure).toBe('function')
      expect(typeof outliner.destroy).toBe('function')
    })

    it('should start inactive', () => {
      expect(outliner.isActive()).toBe(false)
    })

    it('should start outlining when start() is called', () => {
      outliner.start()
      expect(outliner.isActive()).toBe(true)

      const styleElement = document.getElementById('element-outliner-styles')
      expect(styleElement).toBeTruthy()
      expect(styleElement?.tagName).toBe('STYLE')
    })

    it('should stop outlining when stop() is called', () => {
      outliner.start()
      expect(outliner.isActive()).toBe(true)

      outliner.stop()
      expect(outliner.isActive()).toBe(false)

      const styleElement = document.getElementById('element-outliner-styles')
      expect(styleElement).toBeFalsy()
    })

    it('should toggle outlining state', () => {
      expect(outliner.isActive()).toBe(false)

      const result1 = outliner.toggle()
      expect(result1).toBe(true)
      expect(outliner.isActive()).toBe(true)

      const result2 = outliner.toggle()
      expect(result2).toBe(false)
      expect(outliner.isActive()).toBe(false)
    })

    it('should not start twice', () => {
      outliner.start()
      const styleElement1 = document.getElementById('element-outliner-styles')

      outliner.start() // Should not create another style element
      const styleElements = document.querySelectorAll('#element-outliner-styles')

      expect(styleElements.length).toBe(1)
      expect(styleElements[0]).toBe(styleElement1)
    })

    it('should handle stop when not started', () => {
      expect(() => outliner.stop()).not.toThrow()
      expect(outliner.isActive()).toBe(false)
    })
  })

  describe('CSS generation', () => {
    it('should generate CSS with outline colors', () => {
      outliner.start()
      const styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      const css = styleElement.textContent || ''

      expect(css).toContain('Element Outliner - Inspired by Pesticide CSS')
      expect(css).toContain('div { outline: 1px solid #036cdb !important; }')
      expect(css).toContain('p { outline: 1px solid #ac050b !important; }')
      expect(css).toContain('body { outline: 1px solid #2980b9 !important; }')
    })

    it('should include hover effects by default', () => {
      outliner.start()
      const styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      const css = styleElement.textContent || ''

      expect(css).toContain('body *:not([data-highlight-box]):hover')
      expect(css).toContain('outline-width: 2px !important')
      expect(css).toContain('box-shadow: 0 0 10px rgba(0, 0, 0, 0.3) !important')
    })

    it('should exclude hover effects when disabled', () => {
      const outlinerNoHover = createElementOutliner({ enableHover: false })
      outlinerNoHover.start()

      const styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      const css = styleElement.textContent || ''

      expect(css).not.toContain('hover')
      expect(css).not.toContain('outline-width: 2px')

      outlinerNoHover.destroy()
    })
  })

  describe('configuration', () => {
    it('should accept custom colors', () => {
      const customOutliner = createElementOutliner({
        customColors: {
          div: '#ff0000',
          p: '#00ff00'
        }
      })

      customOutliner.start()
      const styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      const css = styleElement.textContent || ''

      expect(css).toContain('div { outline: 1px solid #ff0000 !important; }')
      expect(css).toContain('p { outline: 1px solid #00ff00 !important; }')

      customOutliner.destroy()
    })

    it('should exclude specified selectors', () => {
      const customOutliner = createElementOutliner({
        excludeSelectors: ['.excluded', '[data-test]']
      })

      customOutliner.start()
      const styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      const css = styleElement.textContent || ''

      expect(css).toContain('div:not(.excluded):not([data-test]) { outline: 1px solid #036cdb !important; }')

      customOutliner.destroy()
    })

    it('should allow runtime configuration updates', () => {
      outliner.start()

      let styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      let css = styleElement.textContent || ''
      expect(css).toContain('div { outline: 1px solid #036cdb !important; }')

      outliner.configure({
        customColors: { div: '#ff0000' }
      })

      styleElement = document.getElementById('element-outliner-styles') as HTMLStyleElement
      css = styleElement.textContent || ''
      expect(css).toContain('div { outline: 1px solid #ff0000 !important; }')
    })

    it('should not restart if not active during configuration', () => {
      expect(outliner.isActive()).toBe(false)

      outliner.configure({
        customColors: { div: '#ff0000' }
      })

      expect(outliner.isActive()).toBe(false)
      expect(document.getElementById('element-outliner-styles')).toBeFalsy()
    })
  })

  describe('cleanup', () => {
    it('should clean up when destroyed', () => {
      outliner.start()
      expect(outliner.isActive()).toBe(true)
      expect(document.getElementById('element-outliner-styles')).toBeTruthy()

      outliner.destroy()
      expect(outliner.isActive()).toBe(false)
      expect(document.getElementById('element-outliner-styles')).toBeFalsy()
    })

    it('should handle destroy when not started', () => {
      expect(() => outliner.destroy()).not.toThrow()
    })
  })

    describe('multiple instances', () => {
    it('should handle multiple outliner instances', () => {
      const outliner2 = createElementOutliner()

      outliner.start()
      outliner2.start()

      // Both should be active, and each creates its own style element
      expect(outliner.isActive()).toBe(true)
      expect(outliner2.isActive()).toBe(true)

      // Each instance creates its own style element with the same ID
      // The second one will replace the first one's content
      const styleElements = document.querySelectorAll('#element-outliner-styles')
      expect(styleElements.length).toBe(2) // Each instance creates one

      outliner2.destroy()
    })
  })
})

describe('OUTLINE_COLORS', () => {
  it('should export the color palette', () => {
    expect(OUTLINE_COLORS).toBeDefined()
    expect(typeof OUTLINE_COLORS).toBe('object')
    expect(OUTLINE_COLORS.div).toBe('#036cdb')
    expect(OUTLINE_COLORS.p).toBe('#ac050b')
    expect(OUTLINE_COLORS.body).toBe('#2980b9')
  })

  it('should have colors for common HTML elements', () => {
    const commonElements = ['div', 'p', 'span', 'a', 'button', 'input', 'form', 'table', 'ul', 'li']

    commonElements.forEach(element => {
      expect(OUTLINE_COLORS).toHaveProperty(element)
      expect(typeof OUTLINE_COLORS[element as keyof typeof OUTLINE_COLORS]).toBe('string')
      expect(OUTLINE_COLORS[element as keyof typeof OUTLINE_COLORS]).toMatch(/^#[0-9a-f]{3,6}$/i)
    })
  })
})
