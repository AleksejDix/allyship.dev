import type { Plugin } from '../plugins/types.js'
import type { createRunner } from '../core/runner.js'
import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * Minimal reporter plugin - shows only essential information
 */
export class MinimalReporter implements Plugin {
  name = 'minimal-reporter'
  private startTime = 0

  install(runner: ReturnType<typeof createRunner>): void {
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.startTime = event.timestamp
        break

      case 'test-complete':
        this.onComplete(event.data.results)
        break

      case 'test-error':
        console.error('❌', event.data.error.message)
        break
    }
  }

  private onComplete(results: SuiteResult[]): void {
    const duration = performance.now() - this.startTime

    let totalPassed = 0
    let totalFailed = 0
    let totalSkipped = 0
    let totalTodo = 0

    for (const suite of results) {
      totalPassed += suite.passed
      totalFailed += suite.failed
      totalSkipped += suite.skipped
      totalTodo += suite.todo
    }

    const total = totalPassed + totalFailed + totalSkipped + totalTodo
    const success = totalFailed === 0

    console.log(`${success ? '✅' : '❌'} ${totalPassed}/${total} passed (${duration.toFixed(0)}ms)`)
  }
}
