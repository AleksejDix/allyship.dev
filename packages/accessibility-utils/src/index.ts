/**
 * @allystudio/accessibility-utils
 *
 * Shared accessibility utilities for AllyStudio projects
 * Consolidates accessibility logic that was scattered across multiple packages
 */

// Accessibility analysis
export {
  getAccessibilityInfo,
  getImplicitRole,
  getInputRole,
  isFocusable,
  getAccessibleName,
  getAccessibleDescription
} from './accessibility.js'

// CSS selectors and element finding
export {
  generateSelector,
  generateXPath,
  findElementByXPath,
  getFocusableElements,
  getVisibleFocusableElements,
  isFocusableBySelector,
  focusableSelectors,
  cssEscape
} from './selectors.js'

// Element visibility
export {
  isElementVisible,
  isInViewport,
  isPartiallyInViewport,
  getVisibilityRatio
} from './visibility.js'
