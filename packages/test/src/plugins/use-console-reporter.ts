import type { Runner, SuiteResult } from '../core/types.js'

/**
 * Vue Composition-style plugin for console reporting
 * Usage: runner.use(useConsoleReporter)
 */
export function useConsoleReporter(runner: Runner): void {
  const originalRun = runner.run

  runner.run = async function(): Promise<SuiteResult[]> {
    console.log('🧪 Starting tests...')

    const results = await originalRun.call(this)

    // Report results
    results.forEach(suite => {
      const total = suite.tests.length
      const status = suite.failed > 0 ? '❌' : suite.passed === total ? '✅' : '⚠️'

      console.log(`${status} ${suite.name}:`)
      console.log(`  • Passed: ${suite.passed}/${total}`)

      if (suite.failed > 0) console.log(`  • Failed: ${suite.failed}`)
      if (suite.skipped > 0) console.log(`  • Skipped: ${suite.skipped}`)
      if (suite.todo > 0) console.log(`  • Todo: ${suite.todo}`)
      if (suite.timeout > 0) console.log(`  • Timeout: ${suite.timeout}`)
    })

    const totals = results.reduce((acc, suite) => ({
      passed: acc.passed + suite.passed,
      failed: acc.failed + suite.failed,
      skipped: acc.skipped + suite.skipped,
      todo: acc.todo + suite.todo,
      timeout: acc.timeout + suite.timeout
    }), { passed: 0, failed: 0, skipped: 0, todo: 0, timeout: 0 })

    const allPassed = totals.failed === 0 && totals.timeout === 0
    console.log(`\n${allPassed ? '🎉' : '💥'} Tests completed:`)
    console.log(`  • Total passed: ${totals.passed}`)
    if (totals.failed > 0) console.log(`  • Total failed: ${totals.failed}`)
    if (totals.skipped > 0) console.log(`  • Total skipped: ${totals.skipped}`)
    if (totals.todo > 0) console.log(`  • Total todo: ${totals.todo}`)
    if (totals.timeout > 0) console.log(`  • Total timeout: ${totals.timeout}`)

    return results
  }
}
