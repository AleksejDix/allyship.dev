import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  generateSelector,
  generateXPath,
  findElementByXPath,
  getFocusableElements,
  getVisibleFocusableElements,
  isFocusableBySelector,
  focusableSelectors
} from '../src/selectors.js'

describe('Selectors', () => {
  let testContainer: HTMLElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    testContainer.id = 'test-container'
    document.body.appendChild(testContainer)
  })

  afterEach(() => {
    testContainer.remove()
  })

  describe('generateSelector', () => {
    it('should generate selector for element with ID', () => {
      const element = document.createElement('div')
      element.id = 'unique-id'

      const selector = generateSelector(element)
      expect(selector).toBe('#unique-id')
    })

    it('should generate selector for element with classes', () => {
      const element = document.createElement('div')
      element.className = 'class1 class2 class3'
      testContainer.appendChild(element)

      const selector = generateSelector(element)
      expect(selector).toContain('div.class1.class2.class3')
    })

    it('should filter out CSS-in-JS classes starting with underscore', () => {
      const element = document.createElement('div')
      element.className = 'valid-class _css-in-js-class another-valid'
      testContainer.appendChild(element)

      const selector = generateSelector(element)
      expect(selector).not.toContain('_css-in-js-class')
      expect(selector).toContain('valid-class')
    })

    it('should add nth-child for siblings with same tag', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('span')
      const child3 = document.createElement('span')

      parent.appendChild(child1)
      parent.appendChild(child2)
      parent.appendChild(child3)
      testContainer.appendChild(parent)

      const selector = generateSelector(child2)
      expect(selector).toContain(':nth-child(2)')
    })

    it('should escape special characters in ID', () => {
      const element = document.createElement('div')
      element.id = 'id:with.special[chars]'

      const selector = generateSelector(element)
      expect(selector).toBe('#id\\:with\\.special\\[chars\\]')
    })
  })

  describe('generateXPath', () => {
    it('should generate XPath for element with ID', () => {
      const element = document.createElement('div')
      element.id = 'test-id'

      const xpath = generateXPath(element)
      expect(xpath).toBe('//*[@id="test-id"]')
    })

    it('should generate XPath with indices for multiple siblings', () => {
      const parent = document.createElement('div')
      const child1 = document.createElement('span')
      const child2 = document.createElement('span')

      parent.appendChild(child1)
      parent.appendChild(child2)
      testContainer.appendChild(parent)

      const xpath = generateXPath(child2)
      expect(xpath).toContain('span[2]')
    })
  })

  describe('findElementByXPath', () => {
    it('should find element by XPath', () => {
      const element = document.createElement('div')
      element.id = 'xpath-test'
      testContainer.appendChild(element)

      const found = findElementByXPath('//*[@id="xpath-test"]')
      expect(found).toBe(element)
    })

    it('should return null for invalid XPath', () => {
      const found = findElementByXPath('//*[@id="nonexistent"]')
      expect(found).toBeNull()
    })
  })

  describe('getFocusableElements', () => {
    it('should find focusable elements using focusable-selectors', () => {
      const button = document.createElement('button')
      const input = document.createElement('input')
      const link = document.createElement('a')
      link.href = '#'

      testContainer.appendChild(button)
      testContainer.appendChild(input)
      testContainer.appendChild(link)

      const focusable = getFocusableElements(testContainer)
      expect(focusable).toContain(button)
      expect(focusable).toContain(input)
      expect(focusable).toContain(link)
    })
  })

  describe('isFocusableBySelector', () => {
    it('should detect focusable elements', () => {
      const button = document.createElement('button')
      const div = document.createElement('div')

      expect(isFocusableBySelector(button)).toBe(true)
      expect(isFocusableBySelector(div)).toBe(false)
    })
  })

  describe('focusableSelectors', () => {
    it('should export focusable selectors array', () => {
      expect(Array.isArray(focusableSelectors)).toBe(true)
      expect(focusableSelectors.length).toBeGreaterThan(0)
      expect(focusableSelectors).toContain('button:not([inert]):not([inert] *):not([tabindex^="-"]):not(:disabled)')
    })
  })
})
