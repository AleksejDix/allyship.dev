/**
 * Watch Mode Plugin - Enhanced DOM monitoring integration
 */

import type { Plugin } from './types.js'
import type { TestEvent } from '../core/types.js'

export interface WatchPluginConfig {
  enabled?: boolean
  smartFiltering?: boolean
  performanceMode?: boolean
  logChanges?: boolean
}

/**
 * Watch mode plugin that provides enhanced DOM change filtering and performance optimizations
 */
export class WatchPlugin implements Plugin {
  name = 'watch'
  private config: Required<WatchPluginConfig>
  private lastTestRun = 0
  private changeBuffer: any[] = []
  private relevantSelectors = new Set<string>()

  constructor(config: WatchPluginConfig = {}) {
    this.config = {
      enabled: true,
      smartFiltering: true,
      performanceMode: false,
      logChanges: false,
      ...config
    }
  }

  install(runner: any): void {
    if (!this.config.enabled) return

    // Collect all selectors from test definitions
    runner.on((event: TestEvent) => {
      if (event.type === 'test-start') {
        const suites = Array.isArray(event.data?.suites) ? event.data.suites : []
        this.collectSelectors(suites)
        this.lastTestRun = performance.now()
      }

      if (event.type === 'test-result' && this.config.logChanges) {
        console.log(`🔄 [Watch] Test result: ${event.data?.test} - ${event.data?.result}`)
      }
    })

    // Set up intelligent DOM change filtering
    if (this.config.smartFiltering) {
      this.setupSmartFiltering()
    }
  }

  private collectSelectors(suites: any[]): void {
    this.relevantSelectors.clear()

    suites.forEach(suite => {
      if (suite.selector) {
        this.relevantSelectors.add(suite.selector)
      }

      suite.tests?.forEach((test: any) => {
        if (test.selector) {
          this.relevantSelectors.add(test.selector)
        }
      })
    })

    if (this.config.logChanges) {
      console.log(`🔄 [Watch] Monitoring ${this.relevantSelectors.size} selectors:`,
        Array.from(this.relevantSelectors))
    }
  }

  private setupSmartFiltering(): void {
    // Listen for DOM changes and filter intelligently
    window.addEventListener('message', (event) => {
      if (event.data?.type !== 'DOM_CHANGE') return

      const elements = event.data.data?.elements || []
      const relevantChanges = elements.filter((element: any) =>
        this.isRelevantElement(element)
      )

      if (relevantChanges.length > 0) {
        this.bufferChange({
          timestamp: performance.now(),
          elements: relevantChanges,
          changeType: event.data.data?.changeType
        })
      }
    })
  }

  private isRelevantElement(element: any): boolean {
    const selector = element.selector || element.tagName?.toLowerCase()

    // Check against our known selectors
    for (const relevantSelector of this.relevantSelectors) {
      if (this.matchesSelector(selector, relevantSelector)) {
        return true
      }
    }

    // Check for accessibility-relevant elements
    const accessibilityElements = [
      'button', 'input', 'select', 'textarea', 'a',
      '[role]', '[aria-label]', '[aria-labelledby]', '[tabindex]'
    ]

    return accessibilityElements.some(pattern =>
      this.matchesSelector(selector, pattern)
    )
  }

  private matchesSelector(elementSelector: string, pattern: string): boolean {
    // Simple pattern matching - could be enhanced
    if (pattern.startsWith('[') && pattern.endsWith(']')) {
      // Attribute selector
      const attr = pattern.slice(1, -1)
      return elementSelector.includes(attr)
    }

    if (pattern.startsWith('.')) {
      // Class selector
      return elementSelector.includes(pattern)
    }

    if (pattern.startsWith('#')) {
      // ID selector
      return elementSelector.includes(pattern)
    }

    // Tag selector
    return elementSelector === pattern || elementSelector.startsWith(pattern)
  }

  private bufferChange(change: any): void {
    this.changeBuffer.push(change)

    // In performance mode, limit buffer size
    if (this.config.performanceMode && this.changeBuffer.length > 10) {
      this.changeBuffer = this.changeBuffer.slice(-5) // Keep only last 5
    }
  }

  // Public API for getting watch statistics
  getWatchStats() {
    return {
      relevantSelectors: Array.from(this.relevantSelectors),
      bufferedChanges: this.changeBuffer.length,
      lastTestRun: this.lastTestRun,
      timeSinceLastRun: performance.now() - this.lastTestRun
    }
  }

  // Clear the change buffer
  clearBuffer(): void {
    this.changeBuffer = []
  }
}
