import type { Runner } from '../core/types.js'
import { expect } from '../core/expectation.js'

/**
 * Vue Composition-style plugin for simple expectations
 * Usage: runner.use(useExpectations)
 */
export function useExpectations(_runner: Runner): void {
  // Add expect to global scope for tests
  if (typeof window !== 'undefined') {
    (window as any).expect = expect
  }

  // Add DOM-specific expectations
  if (typeof window !== 'undefined') {
    (window as any).expectElement = expectElement
  }

  function expectElement(element: HTMLElement) {
    return {
      toHaveText(text: string): void {
        if (element.textContent?.trim() !== text) {
          throw new Error(`Expected element to have text "${text}" but got "${element.textContent?.trim()}"`)
        }
      },

      toHaveAttribute(attr: string, value?: string): void {
        if (!element.hasAttribute(attr)) {
          throw new Error(`Expected element to have attribute "${attr}"`)
        }
        if (value !== undefined && element.getAttribute(attr) !== value) {
          throw new Error(`Expected attribute "${attr}" to be "${value}" but got "${element.getAttribute(attr)}"`)
        }
      },

      toBeVisible(): void {
        const style = window.getComputedStyle(element)
        if (style.display === 'none' || style.visibility === 'hidden') {
          throw new Error('Expected element to be visible')
        }
      },

      toHaveClass(className: string): void {
        if (!element.classList.contains(className)) {
          throw new Error(`Expected element to have class "${className}"`)
        }
      }
    }
  }
}
