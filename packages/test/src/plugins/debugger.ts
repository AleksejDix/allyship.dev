import type { Plugin } from './types.js'
import type { createRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

export interface DebuggerConfig {
  enabled?: boolean
  logLevel?: 'info' | 'debug' | 'verbose'
  showElementCounts?: boolean
  showSampleElements?: boolean
  showTestExecution?: boolean
  showPerformanceMetrics?: boolean
  highlightElements?: boolean
  maxSampleElements?: number
  maxExecutionLogSize?: number
  prefix?: string
}

interface ElementStats {
  selector: string
  count: number
  samples: HTMLElement[]
}

interface TestExecutionLog {
  testName: string
  elementSelector: string
  selector: string
  outcome: string
  duration: number
  timestamp: number
}

/**
 * Debugger plugin for test runner analysis and troubleshooting
 */
export class DebuggerPlugin implements Plugin {
  name = 'debugger'
  private config: Required<DebuggerConfig>
  private elementStats: Map<string, ElementStats> = new Map()
  private executionLog: TestExecutionLog[] = []
  private suiteStartTime = 0
  private testCounts = {
    total: 0,
    passed: 0,
    failed: 0,
    skipped: 0
  }

  constructor(config: DebuggerConfig = {}) {
    this.config = {
      enabled: true,
      logLevel: 'info',
      showElementCounts: true,
      showSampleElements: false,
      showTestExecution: false,
      showPerformanceMetrics: false,
      highlightElements: false,
      maxSampleElements: 3,
      maxExecutionLogSize: 1000,
      prefix: '🐛',
      ...config
    }
  }

  install(runner: ReturnType<typeof createRunner>): void {
    if (!this.config.enabled) return
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.onTestStart(event.data)
        break
      case 'test-progress':
        this.onTestProgress(event.data)
        break
      case 'test-result':
        this.onTestResult(event.data)
        break
      case 'test-complete':
        this.onTestComplete(event.data)
        break
    }
  }

  private onTestStart(data: any): void {
    this.suiteStartTime = performance.now()
    this.elementStats.clear()
    this.clearExecutionLog()
    this.testCounts = { total: 0, passed: 0, failed: 0, skipped: 0 }

    this.log('info', `${this.config.prefix} Starting test analysis...`)

    if (this.config.showElementCounts) {
      this.analyzeElements()
    }
  }

  private onTestProgress(data: any): void {
    if (this.config.logLevel === 'verbose') {
      this.log('debug', `Processing suite: ${data.suite} (${data.tests} tests)`)
    }
  }

  private onTestResult(data: any): void {
    this.testCounts.total++

    if (data.result === 'pass') this.testCounts.passed++
    else if (data.result === 'fail') this.testCounts.failed++
    else if (data.result === 'skip') this.testCounts.skipped++

    if (this.config.showTestExecution) {
      this.log('debug', `Test "${data.test}" on ${data.element}: ${data.result}`)
    }

    if (this.config.showPerformanceMetrics) {
      this.addExecutionLog({
        testName: data.test,
        elementSelector: data.element,
        selector: data.element,
        outcome: data.result,
        duration: 0,
        timestamp: performance.now()
      })
    }

    if (this.config.highlightElements) {
      this.highlightElement(data.element, data.result)
    }
  }

  private addExecutionLog(log: TestExecutionLog): void {
    this.executionLog.push(log)

    if (this.executionLog.length > this.config.maxExecutionLogSize) {
      const removeCount = this.executionLog.length - this.config.maxExecutionLogSize
      this.executionLog.splice(0, removeCount)
    }
  }

  private clearExecutionLog(): void {
    this.executionLog.length = 0
  }

  private onTestComplete(data: any): void {
    const duration = performance.now() - this.suiteStartTime

    this.log('info', `${this.config.prefix} Test analysis complete!`)
    this.log('info', `   Duration: ${duration.toFixed(2)}ms`)
    this.log('info', `   Tests: ${this.testCounts.total} total`)
    this.log('info', `   ✅ Passed: ${this.testCounts.passed}`)
    this.log('info', `   ❌ Failed: ${this.testCounts.failed}`)
    this.log('info', `   ⏭️ Skipped: ${this.testCounts.skipped}`)

    if (this.config.showPerformanceMetrics) {
      this.showPerformanceAnalysis()
    }

    if (this.config.logLevel === 'verbose') {
      this.showDetailedAnalysis()
    }
  }

  private analyzeElements(): void {
    const selectors = [
      { name: 'Images', selector: 'img' },
      { name: 'Buttons', selector: 'button' },
      { name: 'Links', selector: 'a[href]' },
      { name: 'Form Controls', selector: 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea, select' },
      { name: 'Lang Elements', selector: '[lang]' },
      { name: 'Headings', selector: 'h1, h2, h3, h4, h5, h6' },
      { name: 'ARIA Elements', selector: '[role], [aria-label], [aria-labelledby]' },
      { name: 'Focus Elements', selector: '[tabindex]' }
    ]

    this.log('info', `${this.config.prefix} Element Analysis:`)

    let totalElements = 0

    for (const { name, selector } of selectors) {
      const elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[]
      const count = elements.length
      totalElements += count

      const limitedSamples = elements.slice(0, this.config.maxSampleElements)

      this.elementStats.set(selector, {
        selector,
        count,
        samples: limitedSamples
      })

      this.log('info', `   ${name}: ${count} elements`)

      if (this.config.showSampleElements && count > 0) {
        limitedSamples.forEach((el, i) => {
          const preview = this.getElementPreview(el)
          this.log('debug', `     [${i + 1}] ${preview}`)
        })
        if (count > this.config.maxSampleElements) {
          this.log('debug', `     ... and ${count - this.config.maxSampleElements} more`)
        }
      }
    }

    this.log('info', `   Total testable elements: ${totalElements}`)
  }

  private showPerformanceAnalysis(): void {
    if (this.executionLog.length === 0) return

    this.log('info', `${this.config.prefix} Performance Analysis:`)

    const testGroups = new Map<string, TestExecutionLog[]>()
    for (const log of this.executionLog) {
      if (!testGroups.has(log.testName)) {
        testGroups.set(log.testName, [])
      }
      testGroups.get(log.testName)!.push(log)
    }

    for (const [testName, logs] of testGroups) {
      const passed = logs.filter(l => l.outcome === 'pass').length
      const failed = logs.filter(l => l.outcome === 'fail').length
      this.log('info', `   ${testName}: ${logs.length} runs (${passed} passed, ${failed} failed)`)
    }
  }

  private showDetailedAnalysis(): void {
    this.log('debug', `${this.config.prefix} Detailed Analysis:`)

    for (const [selector, stats] of this.elementStats) {
      if (stats.count > 0) {
        this.log('debug', `   Selector "${selector}": ${stats.count} matches`)
        if (this.config.showSampleElements) {
          stats.samples.forEach((el, i) => {
            this.log('debug', `     ${i + 1}. ${this.getElementPreview(el)}`)
          })
        }
      }
    }

    if (this.config.showTestExecution && this.executionLog.length > 0) {
      this.log('debug', `   Execution Timeline:`)
      const recentLogs = this.executionLog.slice(-10)
      recentLogs.forEach(log => {
        const time = (log.timestamp - this.suiteStartTime).toFixed(2)
        this.log('debug', `     ${time}ms: ${log.testName} on ${log.elementSelector} → ${log.outcome}`)
      })

      if (this.executionLog.length > 10) {
        this.log('debug', `     ... and ${this.executionLog.length - 10} earlier entries`)
      }
    }
  }

  private highlightElement(selector: string, outcome: string): void {
    const element = document.querySelector(selector) as HTMLElement
    if (!element) return

    const color = outcome === 'pass' ? '#22c55e' :
                 outcome === 'fail' ? '#ef4444' : '#6b7280'

    const originalOutline = element.style.outline
    element.style.outline = `2px solid ${color}`
    element.style.outlineOffset = '2px'

    setTimeout(() => {
      element.style.outline = originalOutline
    }, 1000)
  }

  private getElementPreview(element: HTMLElement): string {
    const tag = element.tagName.toLowerCase()
    const id = element.id ? `#${element.id}` : ''
    const className = element.className ? `.${element.className.split(' ').join('.')}` : ''
    const text = element.textContent?.trim().substring(0, 30) || ''
    const textPreview = text ? ` "${text}${text.length > 30 ? '...' : ''}"` : ''

    return `<${tag}${id}${className}>${textPreview}`
  }

  private log(level: 'info' | 'debug', message: string): void {
    if (level === 'debug' && this.config.logLevel === 'info') return

    console.log(message)
  }

  getElementStats(): Map<string, ElementStats> {
    return new Map(this.elementStats)
  }

  getExecutionLog(): TestExecutionLog[] {
    return [...this.executionLog]
  }

  getTestCounts(): typeof this.testCounts {
    return { ...this.testCounts }
  }

  analyzeElementsNow(): void {
    if (!this.config.enabled) return
    this.analyzeElements()
  }

  showDOMState(): void {
    if (!this.config.enabled) return
    this.log('info', `${this.config.prefix} Current DOM State:`)
    this.log('info', `   Total elements: ${document.querySelectorAll('*').length}`)
    this.log('info', `   Body innerHTML length: ${document.body.innerHTML.length} chars`)
    this.analyzeElements()
  }

  reset(): void {
    this.elementStats.clear()
    this.clearExecutionLog()
    this.testCounts = { total: 0, passed: 0, failed: 0, skipped: 0 }
    this.suiteStartTime = 0
  }

  getMemoryUsage(): { logEntries: number; maxLogSize: number; elementStats: number } {
    return {
      logEntries: this.executionLog.length,
      maxLogSize: this.config.maxExecutionLogSize,
      elementStats: this.elementStats.size
    }
  }
}

export const debuggerPluginPresets = {
  development: new DebuggerPlugin({
    enabled: true,
    logLevel: 'verbose',
    showElementCounts: true,
    showSampleElements: true,
    showTestExecution: true,
    maxSampleElements: 3,
    maxExecutionLogSize: 500
  }),

  production: new DebuggerPlugin({
    enabled: true,
    logLevel: 'info',
    showElementCounts: true,
    showSampleElements: false,
    showTestExecution: false,
    maxExecutionLogSize: 100
  }),

  performance: new DebuggerPlugin({
    enabled: true,
    logLevel: 'info',
    showElementCounts: false,
    showPerformanceMetrics: true,
    showTestExecution: true,
    maxExecutionLogSize: 1000
  }),

  visual: new DebuggerPlugin({
    enabled: true,
    logLevel: 'debug',
    showElementCounts: true,
    highlightElements: true,
    showTestExecution: true,
    maxExecutionLogSize: 200
  }),

  disabled: new DebuggerPlugin({
    enabled: false
  })
}
