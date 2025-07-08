import type { Runner, SuiteResult } from '../core/types.js'

/**
 * Minimal composition-style debugger plugin
 * Usage: runner.use(useDebugger())
 */
export function useDebugger(options: {
  showElementCounts?: boolean
  showResults?: boolean
  prefix?: string
} = {}) {
  return function(runner: Runner): void {
    const config = {
      showElementCounts: true,
      showResults: true,
      prefix: '🐛',
      ...options
    }

    const originalRun = runner.run
    runner.run = async function(): Promise<SuiteResult[]> {
      const startTime = performance.now()

      if (config.showElementCounts) {
        console.log(`${config.prefix} Element Analysis:`)
        analyzeElements()
      }

      console.log(`${config.prefix} Starting tests...`)

      const results = await originalRun.call(this)

      if (config.showResults) {
        const duration = performance.now() - startTime
        const totals = results.reduce((acc, suite) => ({
          total: acc.total + suite.tests.length,
          passed: acc.passed + suite.passed,
          failed: acc.failed + suite.failed,
          skipped: acc.skipped + suite.skipped,
          todo: acc.todo + suite.todo,
          timeout: acc.timeout + suite.timeout
        }), { total: 0, passed: 0, failed: 0, skipped: 0, todo: 0, timeout: 0 })

        console.log(`${config.prefix} Test analysis complete!`)
        console.log(`   Duration: ${duration.toFixed(2)}ms`)
        console.log(`   Tests: ${totals.total} total`)
        console.log(`   ✅ Passed: ${totals.passed}`)
        if (totals.failed > 0) console.log(`   ❌ Failed: ${totals.failed}`)
        if (totals.skipped > 0) console.log(`   ⏭️ Skipped: ${totals.skipped}`)
        if (totals.todo > 0) console.log(`   📝 Todo: ${totals.todo}`)
        if (totals.timeout > 0) console.log(`   ⏱️ Timeout: ${totals.timeout}`)
      }

      return results
    }
  }
}

function analyzeElements(): void {
  const selectors = [
    { name: 'Images', selector: 'img' },
    { name: 'Buttons', selector: 'button' },
    { name: 'Links', selector: 'a[href]' },
    { name: 'Form Controls', selector: 'input, textarea, select' },
    { name: 'Headings', selector: 'h1, h2, h3, h4, h5, h6' },
    { name: 'ARIA Elements', selector: '[role], [aria-label], [aria-labelledby]' }
  ]

  for (const { name, selector } of selectors) {
    const count = document.querySelectorAll(selector).length
    if (count > 0) {
      console.log(`   ${name}: ${count} elements`)
    }
  }
}
