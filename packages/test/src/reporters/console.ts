import type { Reporter, ReporterConfig } from './types.js'
import type { SuiteResult, TestEvent } from '../core/types.js'

/**
 * Console reporter for browser environments
 */
export class ConsoleReporter implements Reporter {
  private config: ReporterConfig
  private startTime = 0

  constructor(config: ReporterConfig = {}) {
    this.config = {
      verbose: false,
      colors: true,
      ...config
    }
  }

  onEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.startTime = event.timestamp
        console.log(`🚀 Starting ${event.data.suites} test suite(s)`)
        break

      case 'test-progress':
        if (this.config.verbose) {
          console.log(
            `📋 Suite: ${event.data.suite} (${event.data.elements} elements, ${event.data.tests} tests)`
          )
        }
        break

      case 'test-result':
        if (this.config.verbose) {
          const icon = this.getOutcomeIcon(event.data.result)
          console.log(`  ${icon} ${event.data.test} on ${event.data.element}`)
        }
        break

      case 'test-error':
        console.error('❌ Test error:', event.data)
        break
    }
  }

  async onComplete(results: SuiteResult[]): Promise<void> {
    const duration = performance.now() - this.startTime

    console.log('\n📊 Test Results:')
    console.log('================')

    let totalPassed = 0
    let totalFailed = 0
    let totalSkipped = 0
    let totalTodo = 0

    for (const suite of results) {
      console.log(`\n📋 ${suite.name}`)
      console.log(`   Duration: ${suite.duration.toFixed(2)}ms`)
      console.log(`   ✅ Passed: ${suite.passed}`)
      console.log(`   ❌ Failed: ${suite.failed}`)
      console.log(`   ⏭️  Skipped: ${suite.skipped}`)
      console.log(`   📝 Todo: ${suite.todo}`)

      totalPassed += suite.passed
      totalFailed += suite.failed
      totalSkipped += suite.skipped
      totalTodo += suite.todo

      // Show failures
      if (suite.failed > 0) {
        console.log('\n   Failures:')
        suite.tests
          .filter(test => test.outcome === 'fail')
          .forEach(test => {
            console.log(`     ❌ ${test.name} (${test.element?.selector})`)
            console.log(`        ${test.message}`)
            if (this.config.verbose && test.error) {
              console.log(`        ${test.error.stack}`)
            }
          })
      }
    }

    console.log('\n🏁 Summary:')
    console.log(`   Total Duration: ${duration.toFixed(2)}ms`)
    console.log(`   ✅ Passed: ${totalPassed}`)
    console.log(`   ❌ Failed: ${totalFailed}`)
    console.log(`   ⏭️  Skipped: ${totalSkipped}`)
    console.log(`   📝 Todo: ${totalTodo}`)

    const success = totalFailed === 0
    console.log(`\n${success ? '🎉 All tests passed!' : '💥 Some tests failed!'}`)
  }

  private getOutcomeIcon(outcome: string): string {
    switch (outcome) {
      case 'pass': return '✅'
      case 'fail': return '❌'
      case 'skip': return '⏭️'
      case 'todo': return '📝'
      default: return '❓'
    }
  }
}
