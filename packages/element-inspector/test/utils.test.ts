import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
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
} from '../src/utils.js'

describe('Inspector Utils', () => {
  let testContainer: HTMLElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    testContainer.id = 'test-container'
    document.body.appendChild(testContainer)
  })

  afterEach(() => {
    testContainer.remove()
  })

  describe('findDeepestElementAtPoint', () => {
    it('should find deepest element at point', () => {
      const outer = document.createElement('div')
      outer.style.cssText = 'position: absolute; left: 0; top: 0; width: 100px; height: 100px;'

      const inner = document.createElement('span')
      inner.style.cssText = 'position: absolute; left: 10px; top: 10px; width: 50px; height: 50px;'

      outer.appendChild(inner)
      testContainer.appendChild(outer)

      // Mock elementsFromPoint
      const originalElementsFromPoint = document.elementsFromPoint
      document.elementsFromPoint = () => [inner, outer, testContainer, document.body, document.documentElement] as HTMLElement[]

      const result = findDeepestElementAtPoint(25, 25)
      expect(result).toBe(inner)

      document.elementsFromPoint = originalElementsFromPoint
    })

    it('should exclude specified elements', () => {
      const element1 = document.createElement('div')
      const element2 = document.createElement('span')

      testContainer.appendChild(element1)
      testContainer.appendChild(element2)

      const originalElementsFromPoint = document.elementsFromPoint
      document.elementsFromPoint = () => [element1, element2] as HTMLElement[]

      const result = findDeepestElementAtPoint(0, 0, [element1])
      expect(result).toBe(element2)

      document.elementsFromPoint = originalElementsFromPoint
    })

    it('should return null when no valid elements found', () => {
      const script = document.createElement('script')
      testContainer.appendChild(script)

      const originalElementsFromPoint = document.elementsFromPoint
      document.elementsFromPoint = () => [script] as HTMLElement[]

      const result = findDeepestElementAtPoint(0, 0)
      expect(result).toBeNull()

      document.elementsFromPoint = originalElementsFromPoint
    })

    it('should filter elements by minimum size', () => {
      const large = document.createElement('div')
      const small = document.createElement('span')

      testContainer.appendChild(large)
      testContainer.appendChild(small)

      // Mock getBoundingClientRect
      vi.spyOn(large, 'getBoundingClientRect').mockReturnValue({
        width: 100, height: 100, top: 0, left: 0, right: 100, bottom: 100,
        x: 0, y: 0, toJSON: () => ({})
      } as DOMRect)

      vi.spyOn(small, 'getBoundingClientRect').mockReturnValue({
        width: 2, height: 2, top: 0, left: 0, right: 2, bottom: 2,
        x: 0, y: 0, toJSON: () => ({})
      } as DOMRect)

      const originalElementsFromPoint = document.elementsFromPoint
      document.elementsFromPoint = () => [small, large] as HTMLElement[]

      const result = findDeepestElementAtPoint(0, 0)
      expect(result).toBe(large)

      document.elementsFromPoint = originalElementsFromPoint
    })
  })

  describe('isExcludedElement', () => {
    it('should exclude script elements', () => {
      const script = document.createElement('script')
      expect(isExcludedElement(script)).toBe(true)
    })

    it('should exclude style elements', () => {
      const style = document.createElement('style')
      expect(isExcludedElement(style)).toBe(true)
    })

    it('should exclude meta elements', () => {
      const meta = document.createElement('meta')
      expect(isExcludedElement(meta)).toBe(true)
    })

    it('should exclude elements with highlight attributes', () => {
      const div = document.createElement('div')
      div.setAttribute('data-highlight-box', 'true')
      expect(isExcludedElement(div)).toBe(true)
    })

    it('should exclude elements with inspector overlay attributes', () => {
      const div = document.createElement('div')
      div.setAttribute('data-inspector-overlay', 'true')
      expect(isExcludedElement(div)).toBe(true)
    })

    it('should exclude elements with overlay classes', () => {
      const div = document.createElement('div')
      div.className = 'highlight-overlay'
      expect(isExcludedElement(div)).toBe(true)

      const div2 = document.createElement('div')
      div2.className = 'inspector-overlay'
      expect(isExcludedElement(div2)).toBe(true)
    })

    it('should not exclude regular elements', () => {
      const div = document.createElement('div')
      expect(isExcludedElement(div)).toBe(false)
    })
  })

  describe('getElementInfo', () => {
    it('should return comprehensive element information', () => {
      const element = document.createElement('div')
      element.id = 'test-element'
      element.className = 'test-class'
      element.textContent = 'Test content'
      element.setAttribute('data-test', 'value')

      testContainer.appendChild(element)

      const info = getElementInfo(element)

      expect(info.element).toBe(element)
      expect(info.tagName).toBe('div')
      expect(info.textContent).toBe('Test content')
      expect(info.attributes['id']).toBe('test-element')
      expect(info.attributes['class']).toBe('test-class')
      expect(info.attributes['data-test']).toBe('value')
      expect(typeof info.rect).toBe('object')
      expect(info.rect).toHaveProperty('width')
      expect(info.rect).toHaveProperty('height')
      expect(info.computedStyles).toBeDefined()
      expect(typeof info.selector).toBe('string')
      expect(typeof info.xpath).toBe('string')
    })

    it('should handle elements with no text content', () => {
      const element = document.createElement('div')
      testContainer.appendChild(element)

      const info = getElementInfo(element)
      expect(info.textContent).toBe('')
    })

    it('should trim and limit text content', () => {
      const element = document.createElement('div')
      element.textContent = '   Trimmed content   '
      testContainer.appendChild(element)

      const info = getElementInfo(element)
      expect(info.textContent).toBe('Trimmed content')
    })
  })

  describe('throttle', () => {
    it('should throttle function calls', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      await new Promise(resolve => setTimeout(resolve, 150))

      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    it('should pass arguments to throttled function', () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)

      throttledFn('arg1', 'arg2')
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should reset timer on subsequent calls', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)

      debouncedFn()

      await new Promise(resolve => setTimeout(resolve, 50))
      debouncedFn() // This should reset the timer

      await new Promise(resolve => setTimeout(resolve, 75))
      expect(mockFn).not.toHaveBeenCalled() // Should not be called yet

      await new Promise(resolve => setTimeout(resolve, 50))
      expect(mockFn).toHaveBeenCalledTimes(1) // Now it should be called
    })
  })
})
