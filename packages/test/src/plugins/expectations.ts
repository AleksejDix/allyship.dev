import type { Plugin } from './types.js'
import type { createRunner } from '../core/runner.js'
import { expect, ExpectationError } from '../core/expectation.js'

/**
 * Extended expectations for accessibility testing
 */
class AccessibilityExpectations {
  constructor(private element: HTMLElement) {}

  /**
   * Check if element has accessible name
   */
  toHaveAccessibleName(expected?: string): void {
    const name = this.getAccessibleName()

    if (expected !== undefined) {
      if (name !== expected) {
        throw ExpectationError(
          `Expected element to have accessible name "${expected}", but got "${name}"`
        )
      }
    } else {
      if (!name) {
        throw ExpectationError(
          'Expected element to have an accessible name, but it has none'
        )
      }
    }
  }

  /**
   * Check if element has valid alt text
   */
  toHaveValidAltText(): void {
    if (this.element.tagName.toLowerCase() !== 'img') {
      throw ExpectationError('toHaveValidAltText() can only be used on img elements')
    }

    const alt = this.element.getAttribute('alt')

    if (alt === null) {
      throw ExpectationError('Image is missing alt attribute')
    }

    if (alt.trim() === '') {
      // Empty alt is valid for decorative images
      return
    }

    // Check for bad alt text patterns
    const badPatterns = [
      /^image of/i,
      /^picture of/i,
      /^photo of/i,
      /^graphic of/i,
      /\.(jpg|jpeg|png|gif|svg|webp)$/i
    ]

    for (const pattern of badPatterns) {
      if (pattern.test(alt)) {
        throw ExpectationError(
          `Alt text "${alt}" appears to be redundant or contains file extension`
        )
      }
    }
  }

  /**
   * Check if element has proper heading hierarchy
   */
  toHaveProperHeadingLevel(): void {
    const tagName = this.element.tagName.toLowerCase()

    if (!/^h[1-6]$/.test(tagName)) {
      throw ExpectationError('toHaveProperHeadingLevel() can only be used on heading elements')
    }

    const currentLevel = parseInt(tagName.charAt(1))
    const previousHeading = this.findPreviousHeading()

    if (previousHeading) {
      const previousLevel = parseInt(previousHeading.tagName.charAt(1))

      if (currentLevel > previousLevel + 1) {
        throw ExpectationError(
          `Heading level ${currentLevel} skips levels (previous was ${previousLevel})`
        )
      }
    } else if (currentLevel !== 1) {
      throw ExpectationError(
        `First heading should be h1, but found h${currentLevel}`
      )
    }
  }

  /**
   * Check if form element has proper label
   */
  toHaveProperLabel(): void {
    const tagName = this.element.tagName.toLowerCase()
    const type = this.element.getAttribute('type')

    if (!['input', 'textarea', 'select'].includes(tagName)) {
      throw ExpectationError('toHaveProperLabel() can only be used on form elements')
    }

    // Skip hidden inputs
    if (type === 'hidden') {
      return
    }

    const id = this.element.id
    const label = id ? document.querySelector(`label[for="${id}"]`) : null
    const ariaLabel = this.element.getAttribute('aria-label')
    const ariaLabelledby = this.element.getAttribute('aria-labelledby')

    if (!label && !ariaLabel && !ariaLabelledby) {
      throw ExpectationError(
        'Form element must have a label, aria-label, or aria-labelledby attribute'
      )
    }
  }

  /**
   * Check if link has meaningful text
   */
  toHaveMeaningfulLinkText(): void {
    if (this.element.tagName.toLowerCase() !== 'a') {
      throw ExpectationError('toHaveMeaningfulLinkText() can only be used on link elements')
    }

    const text = this.element.textContent?.trim() || ''
    const ariaLabel = this.element.getAttribute('aria-label')
    const title = this.element.getAttribute('title')

    const linkText = ariaLabel || text || title || ''

    if (!linkText) {
      throw ExpectationError('Link has no accessible text')
    }

    // Check for generic link text
    const genericPatterns = [
      /^click here$/i,
      /^here$/i,
      /^read more$/i,
      /^more$/i,
      /^link$/i,
      /^continue$/i
    ]

    for (const pattern of genericPatterns) {
      if (pattern.test(linkText)) {
        throw ExpectationError(
          `Link text "${linkText}" is not descriptive enough`
        )
      }
    }
  }

  private getAccessibleName(): string {
    // Check aria-label first
    const ariaLabel = this.element.getAttribute('aria-label')
    if (ariaLabel) return ariaLabel.trim()

    // Check aria-labelledby
    const ariaLabelledby = this.element.getAttribute('aria-labelledby')
    if (ariaLabelledby) {
      const labelElement = document.getElementById(ariaLabelledby)
      if (labelElement) return labelElement.textContent?.trim() || ''
    }

    // Check associated label for form elements
    if (this.element.id) {
      const label = document.querySelector(`label[for="${this.element.id}"]`)
      if (label) return label.textContent?.trim() || ''
    }

    // Fall back to text content
    return this.element.textContent?.trim() || ''
  }

  private findPreviousHeading(): HTMLElement | null {
    let current = this.element.previousElementSibling

    while (current) {
      if (/^h[1-6]$/i.test(current.tagName)) {
        return current as HTMLElement
      }
      current = current.previousElementSibling
    }

    return null
  }
}

/**
 * Extended expect function with accessibility assertions
 */
function expectA11y(element: HTMLElement) {
  return new AccessibilityExpectations(element)
}

/**
 * Plugin that adds accessibility-specific expectations
 */
export class ExpectationsPlugin implements Plugin {
  name = 'expectations'

  install(runner: ReturnType<typeof createRunner>): void {
    // Add expectA11y to global scope for tests to use
    ;(globalThis as any).expectA11y = expectA11y
    ;(globalThis as any).expect = expect
  }

  uninstall(): void {
    delete (globalThis as any).expectA11y
    delete (globalThis as any).expect
  }
}

export { expectA11y }
