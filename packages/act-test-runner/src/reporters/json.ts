import type { Reporter, ReporterConfig } from './types.js'
import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * JSON reporter for structured output
 */
export class JsonReporter implements Reporter {
  private config: ReporterConfig
  private events: TestEvent[] = []
  private startTime = 0

  constructor(config: ReporterConfig = {}) {
    this.config = config
  }

  onEvent(event: TestEvent): void {
    if (event.type === 'test-start') {
      this.startTime = event.timestamp
    }
    this.events.push(event)
  }

  async onComplete(results: SuiteResult[]): Promise<void> {
    const duration = performance.now() - this.startTime

    const report = {
      timestamp: new Date().toISOString(),
      duration,
      summary: this.generateSummary(results),
      suites: results,
      events: this.events
    }

    const json = JSON.stringify(report, null, 2)

    if (this.config.output) {
      // In browser environment, we can't write files directly
      // Instead, trigger download or log to console
      this.downloadJson(json, this.config.output)
    } else {
      console.log('📄 JSON Report:')
      console.log(json)
    }
  }

  private generateSummary(results: SuiteResult[]) {
    const summary = {
      suites: results.length,
      passed: 0,
      failed: 0,
      skipped: 0,
      todo: 0,
      total: 0
    }

    for (const suite of results) {
      summary.passed += suite.passed
      summary.failed += suite.failed
      summary.skipped += suite.skipped
      summary.todo += suite.todo
    }

    summary.total = summary.passed + summary.failed + summary.skipped + summary.todo

    return summary
  }

  private downloadJson(json: string, filename: string): void {
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = filename.endsWith('.json') ? filename : `${filename}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
    console.log(`📄 JSON report downloaded as ${link.download}`)
  }
}
