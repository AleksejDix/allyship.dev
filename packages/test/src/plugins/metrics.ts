import type { Plugin } from './types.js'
import type { createRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

export interface MetricsData {
  total: number
  passed: number
  failed: number
  skipped: number
  todo: number
  duration: number
  passRate: number
  testsPerSecond: number
  suites: number
  startTime: number
  endTime: number
}

/**
 * Metrics plugin for comprehensive test statistics
 */
export class MetricsPlugin implements Plugin {
  name = 'metrics'
  private data: MetricsData = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0,
    todo: 0,
    duration: 0,
    passRate: 0,
    testsPerSecond: 0,
    suites: 0,
    startTime: 0,
    endTime: 0
  }

  install(runner: ReturnType<typeof createRunner>): void {
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.onTestStart(event.data)
        break
      case 'test-complete':
        this.onTestComplete(event.data)
        break
    }
  }

  private onTestStart(data: { suites: number }): void {
    this.data.startTime = performance.now()
    this.data.suites = data.suites
    this.reset()
  }

  private onTestComplete(data: { results: any[] }): void {
    this.data.endTime = performance.now()
    this.data.duration = this.data.endTime - this.data.startTime

    // Count all test results from the final results
    for (const suiteResult of data.results) {
      this.data.total += suiteResult.tests.length
      this.data.passed += suiteResult.passed
      this.data.failed += suiteResult.failed
      this.data.skipped += suiteResult.skipped
      this.data.todo += suiteResult.todo
    }

    this.data.passRate = this.data.total > 0 ? (this.data.passed / this.data.total * 100) : 0
    this.data.testsPerSecond = this.data.duration > 0 ? (this.data.total / (this.data.duration / 1000)) : 0

    this.displayMetrics()
  }

  private displayMetrics(): void {
    console.log('\n📊 Test Metrics:')
    console.log('================')
    console.log(`✅ Passed: ${this.data.passed}`)
    console.log(`❌ Failed: ${this.data.failed}`)
    console.log(`⏭️ Skipped: ${this.data.skipped}`)
    console.log(`📝 Todo: ${this.data.todo}`)
    console.log(`📋 Total: ${this.data.total}`)
    console.log(`📈 Pass Rate: ${this.data.passRate.toFixed(1)}%`)
    console.log(`📦 Suites: ${this.data.suites}`)
  }

  /**
   * Get current metrics data
   */
  getData(): MetricsData {
    return { ...this.data }
  }

  /**
   * Reset all metrics
   */
  reset(): void {
    this.data = {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      todo: 0,
      duration: 0,
      passRate: 0,
      testsPerSecond: 0,
      suites: 0,
      startTime: 0,
      endTime: 0
    }
  }
}
