/**
 * Focus Order Visualizer
 * A lightweight library for visualizing focus order on web pages
 */

export {
  createFocusOrderVisualizer,
  type FocusOrderVisualizerOptions,
  type FocusOrderStats,
  type FocusableElementInfo,
} from './focus-order-visualizer'

export {
  focusableSelectors,
  getFocusableElements,
  isElementVisible,
  sortByTabOrder,
} from './focusable-selectors'

// Default export for convenience
export { createFocusOrderVisualizer as default } from './focus-order-visualizer'
