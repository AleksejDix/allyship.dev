import type { Reporter } from './types.js'
import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * Minimal reporter - just essential output
 */
export class MinimalReporter implements Reporter {
  private startTime = 0

  onEvent(event: TestEvent): void {
    if (event.type === 'test-start') {
      this.startTime = event.timestamp
    }
  }

  async onComplete(results: SuiteResult[]): Promise<void> {
    const duration = performance.now() - this.startTime

    let totalPassed = 0
    let totalFailed = 0

    for (const suite of results) {
      totalPassed += suite.passed
      totalFailed += suite.failed
    }

    const total = totalPassed + totalFailed
    const success = totalFailed === 0

    console.log(
      `${success ? '✅' : '❌'} ${totalPassed}/${total} passed (${duration.toFixed(0)}ms)`
    )

    if (!success) {
      console.log(`${totalFailed} failed`)
    }
  }
}
