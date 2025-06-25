import type { Plugin } from '../plugins/types.js'
import type { createRunner } from '../core/runner.js'
import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * JSON reporter configuration
 */
export interface JsonReporterConfig {
  output?: string
  pretty?: boolean
}

/**
 * JSON reporter plugin - outputs test results as JSON
 */
export class JsonReporter implements Plugin {
  name = 'json-reporter'
  private config: Required<JsonReporterConfig>

  constructor(config: JsonReporterConfig = {}) {
    this.config = {
      output: 'console',
      pretty: true,
      ...config
    }
  }

  install(runner: ReturnType<typeof createRunner>): void {
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    if (event.type === 'test-complete') {
      this.onComplete(event.data.results)
    }
  }

  private onComplete(results: SuiteResult[]): void {
    const output = this.config.pretty
      ? JSON.stringify(results, null, 2)
      : JSON.stringify(results)

    if (this.config.output === 'console') {
      console.log(output)
    } else {
      // In browser environment, we can't write to files directly
      // This could be extended to use different output methods
      console.log('JSON Results:', output)
    }
  }
}
