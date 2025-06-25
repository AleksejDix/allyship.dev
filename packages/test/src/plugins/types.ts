import type { createRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

/**
 * Plugin type - functional approach
 */
export type Plugin = {
  name: string
  install(runner: ReturnType<typeof createRunner>): void
  uninstall?(runner: ReturnType<typeof createRunner>): void
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
    initial?: number
  }
  elementsProcessed: number
  testsRun: number
}


