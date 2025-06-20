import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  isElementVisible,
  isInViewport,
  isPartiallyInViewport,
  getVisibilityRatio
} from '../src/visibility.js'

describe('Visibility (Real Browser)', () => {
  let testContainer: HTMLElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    testContainer.id = 'test-container'
    testContainer.style.cssText = 'position: relative; width: 100%; height: 100vh;'
    document.body.appendChild(testContainer)
  })

  afterEach(() => {
    testContainer.remove()
  })

  describe('isElementVisible', () => {
    it('should return true for visible elements with real dimensions', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; background: red; display: block;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(true)
    })

    it('should return false for display none elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; display: none;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for visibility hidden elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; visibility: hidden;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for zero opacity elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; opacity: 0;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for zero width elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 0; height: 100px; background: red;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })

    it('should return false for zero height elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 0; background: red;'
      testContainer.appendChild(element)

      expect(isElementVisible(element)).toBe(false)
    })
  })

  describe('isInViewport', () => {
    it('should detect elements in viewport', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; background: blue;'
      testContainer.appendChild(element)

      expect(isInViewport(element)).toBe(true)
    })

    it('should detect elements outside viewport', () => {
      const element = document.createElement('div')
      element.style.cssText = 'position: absolute; top: -200px; left: -200px; width: 100px; height: 100px; background: blue;'
      testContainer.appendChild(element)

      expect(isInViewport(element)).toBe(false)
    })

    it('should detect elements below viewport', () => {
      const element = document.createElement('div')
      element.style.cssText = `position: absolute; top: ${window.innerHeight + 100}px; width: 100px; height: 100px; background: blue;`
      testContainer.appendChild(element)

      expect(isInViewport(element)).toBe(false)
    })
  })

  describe('isPartiallyInViewport', () => {
    it('should detect fully visible elements as partially visible', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; background: green;'
      testContainer.appendChild(element)

      expect(isPartiallyInViewport(element)).toBe(true)
    })

    it('should detect partially visible elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'position: absolute; top: -50px; left: 0; width: 100px; height: 100px; background: green;'
      testContainer.appendChild(element)

      expect(isPartiallyInViewport(element)).toBe(true)
    })

    it('should detect completely hidden elements as not partially visible', () => {
      const element = document.createElement('div')
      element.style.cssText = 'position: absolute; top: -200px; left: 0; width: 100px; height: 100px; background: green;'
      testContainer.appendChild(element)

      expect(isPartiallyInViewport(element)).toBe(false)
    })
  })

  describe('getVisibilityRatio', () => {
    it('should return 0 for invisible elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; display: none;'
      testContainer.appendChild(element)

      expect(getVisibilityRatio(element)).toBe(0)
    })

    it('should return 1 for fully visible elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'width: 100px; height: 100px; background: purple;'
      testContainer.appendChild(element)

      expect(getVisibilityRatio(element)).toBe(1)
    })

    it('should return partial ratio for partially visible elements', () => {
      const element = document.createElement('div')
      element.style.cssText = 'position: absolute; top: -50px; left: 0; width: 100px; height: 100px; background: purple;'
      testContainer.appendChild(element)

      const ratio = getVisibilityRatio(element)
      expect(ratio).toBeGreaterThan(0)
      expect(ratio).toBeLessThan(1)
    })
  })
})
