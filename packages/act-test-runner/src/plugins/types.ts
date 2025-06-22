import type { createTestRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

/**
 * Plugin type - functional approach
 */
export type Plugin = {
  name: string
  install(runner: ReturnType<typeof createTestRunner>): void
  uninstall?(runner: ReturnType<typeof createTestRunner>): void
}

/**
 * Performance tracking data
 */
export type PerformanceData = {
  startTime: number
  endTime: number
  duration: number
  memoryUsage?: {
    used: number
    total: number
  }
  elementsProcessed: number
  testsRun: number
}

/**
 * AllyStudio integration data
 */
export type AllyStudioData = {
  highlightElement?: (element: HTMLElement, type: 'pass' | 'fail' | 'skip') => void
  clearHighlights?: () => void
  showTooltip?: (element: HTMLElement, message: string) => void
}
