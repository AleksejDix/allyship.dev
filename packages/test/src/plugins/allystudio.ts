import type { Plugin, AllyStudioData } from './types.js'
import type { createRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

/**
 * AllyStudio integration plugin
 */
export class AllyStudioPlugin implements Plugin {
  name = 'allystudio'
  private integration: AllyStudioData

  constructor(integration: AllyStudioData = {}) {
    this.integration = integration
  }

  install(runner: ReturnType<typeof createRunner>): void {
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.clearHighlights()
        break

      case 'element-tested':
        this.highlightElement(event.data)
        break

      case 'test-complete':
        // Keep highlights visible after completion
        break
    }
  }

  private clearHighlights(): void {
    if (this.integration.clearHighlights) {
      this.integration.clearHighlights()
    }
  }

  private highlightElement(data: any): void {
    if (!this.integration.highlightElement) return

    try {
      // Find element by selector
      const element = document.querySelector(data.element) as HTMLElement
      if (element) {
        const type = data.result as 'pass' | 'fail' | 'skip'
        this.integration.highlightElement(element, type)

        // Show tooltip if available
        if (this.integration.showTooltip && type === 'fail') {
          // Get the failure message from the test result
          // This would need to be passed in the event data
          this.integration.showTooltip(element, `Failed: ${data.test}`)
        }
      }
    } catch (error) {
      console.warn('AllyStudio highlighting failed:', error)
    }
  }

  /**
   * Update integration callbacks
   */
  setIntegration(integration: Partial<AllyStudioData>): void {
    this.integration = { ...this.integration, ...integration }
  }

  /**
   * Get current integration
   */
  getIntegration(): AllyStudioData {
    return this.integration
  }
}
