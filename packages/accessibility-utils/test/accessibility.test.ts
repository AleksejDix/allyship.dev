import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  getAccessibilityInfo,
  getImplicitRole,
  getInputRole,
  isFocusable,
  getAccessibleName,
  getAccessibleDescription
} from '../src/accessibility.js'

describe('Accessibility', () => {
  let testContainer: HTMLElement

  beforeEach(() => {
    testContainer = document.createElement('div')
    testContainer.id = 'test-container'
    document.body.appendChild(testContainer)
  })

  afterEach(() => {
    testContainer.remove()
  })

  describe('getAccessibilityInfo', () => {
    it('should get accessibility info for button', () => {
      const button = document.createElement('button')
      button.textContent = 'Click me'
      button.setAttribute('aria-label', 'Custom label')
      testContainer.appendChild(button)

      const a11yInfo = getAccessibilityInfo(button)

      expect(a11yInfo.role).toBe('button')
      expect(a11yInfo.ariaLabel).toBe('Custom label')
      expect(a11yInfo.focusable).toBe(true)
      expect(a11yInfo.accessibleName).toBe('Custom label')
    })

    it('should get accessibility info for input elements', () => {
      const input = document.createElement('input')
      input.type = 'text'
      input.setAttribute('aria-describedby', 'help-text')
      testContainer.appendChild(input)

      const a11yInfo = getAccessibilityInfo(input)

      expect(a11yInfo.role).toBe('textbox')
      expect(a11yInfo.ariaDescribedBy).toBe('help-text')
      expect(a11yInfo.focusable).toBe(true)
    })
  })

  describe('getImplicitRole', () => {
    it('should return correct roles for semantic elements', () => {
      const button = document.createElement('button')
      const h1 = document.createElement('h1')
      const nav = document.createElement('nav')
      const main = document.createElement('main')

      expect(getImplicitRole(button)).toBe('button')
      expect(getImplicitRole(h1)).toBe('heading')
      expect(getImplicitRole(nav)).toBe('navigation')
      expect(getImplicitRole(main)).toBe('main')
    })

    it('should return link role for anchors with href', () => {
      const link = document.createElement('a')
      link.href = '#'
      expect(getImplicitRole(link)).toBe('link')

      const linkWithoutHref = document.createElement('a')
      expect(getImplicitRole(linkWithoutHref)).toBeNull()
    })
  })

  describe('getInputRole', () => {
    it('should return correct roles for input types', () => {
      const checkbox = document.createElement('input') as HTMLInputElement
      checkbox.type = 'checkbox'

      const radio = document.createElement('input') as HTMLInputElement
      radio.type = 'radio'

      const range = document.createElement('input') as HTMLInputElement
      range.type = 'range'

      expect(getInputRole(checkbox)).toBe('checkbox')
      expect(getInputRole(radio)).toBe('radio')
      expect(getInputRole(range)).toBe('slider')
    })
  })

  describe('isFocusable', () => {
    it('should detect focusable elements', () => {
      const button = document.createElement('button')
      const input = document.createElement('input')
      const div = document.createElement('div')

      expect(isFocusable(button)).toBe(true)
      expect(isFocusable(input)).toBe(true)
      expect(isFocusable(div)).toBe(false)
    })

    it('should handle disabled elements', () => {
      const button = document.createElement('button')
      button.disabled = true

      expect(isFocusable(button)).toBe(false)
    })

    it('should handle tabindex', () => {
      const div = document.createElement('div')
      div.setAttribute('tabindex', '0')

      expect(isFocusable(div)).toBe(true)

      div.setAttribute('tabindex', '-1')
      expect(isFocusable(div)).toBe(false)
    })
  })

  describe('getAccessibleName', () => {
    it('should get name from aria-label', () => {
      const button = document.createElement('button')
      button.setAttribute('aria-label', 'Custom button')

      expect(getAccessibleName(button)).toBe('Custom button')
    })

    it('should get name from aria-labelledby', () => {
      const label = document.createElement('div')
      label.id = 'label-id'
      label.textContent = 'Label text'

      const button = document.createElement('button')
      button.setAttribute('aria-labelledby', 'label-id')

      testContainer.appendChild(label)
      testContainer.appendChild(button)

      expect(getAccessibleName(button)).toBe('Label text')
    })

    it('should get name from text content', () => {
      const button = document.createElement('button')
      button.textContent = 'Button text'

      expect(getAccessibleName(button)).toBe('Button text')
    })

    it('should get name from alt attribute for images', () => {
      const img = document.createElement('img')
      img.setAttribute('alt', 'Image description')

      expect(getAccessibleName(img)).toBe('Image description')
    })
  })

  describe('getAccessibleDescription', () => {
    it('should get description from aria-describedby', () => {
      const desc = document.createElement('div')
      desc.id = 'desc-id'
      desc.textContent = 'Description text'

      const button = document.createElement('button')
      button.setAttribute('aria-describedby', 'desc-id')

      testContainer.appendChild(desc)
      testContainer.appendChild(button)

      expect(getAccessibleDescription(button)).toBe('Description text')
    })

    it('should get description from title attribute', () => {
      const button = document.createElement('button')
      button.setAttribute('title', 'Tooltip text')

      expect(getAccessibleDescription(button)).toBe('Tooltip text')
    })
  })
})
