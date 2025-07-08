/**
 * Vue Composition-style plugins for the test runner
 */

// Export composition-style plugin functions
export { useMetrics } from "./use-metrics.js"
export { useConsoleReporter } from "./use-console-reporter.js"
export { useExpectations } from "./use-expectations.js"
export { useACTMetadata, ACT_RULES } from "./use-act-metadata.js"
export { useDebugger } from "./use-debugger.js"
export { useAccessibilityHelpers } from "./use-accessibility-helpers.js"
export { useContrastAnalyzer } from "./use-contrast-analyzer.js"
export { usePerformanceMonitor } from "./use-performance-monitor.js"

// Export types
export type { Plugin } from "../core/types.js"
export type { ACTRuleMetadata, ACTTestResult } from "./use-act-metadata.js"
