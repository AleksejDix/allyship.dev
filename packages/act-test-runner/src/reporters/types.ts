import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * Reporter interface
 */
export interface Reporter {
  onEvent(event: TestEvent): void
  onComplete(results: SuiteResult[]): void | Promise<void>
}

/**
 * Reporter configuration
 */
export interface ReporterConfig {
  verbose?: boolean
  colors?: boolean
  output?: string
}
