/**
 * Screenshot Plugin - Display captured screenshots in test results
 */

import type { TestEvent, TestResult } from '../core/types.js'
import type { Plugin } from './types.js'

// Chrome extension types
declare global {
  interface Window {
    chrome?: typeof chrome
  }
}

declare const chrome: {
  tabs: {
    captureVisibleTab(windowId?: number, options?: any): Promise<string>
    query(queryInfo: any): Promise<any[]>
  }
  permissions: {
    contains(permissions: any): Promise<boolean>
    request(permissions: any): Promise<boolean>
  }
  debugger: {
    attach(target: any, version: string): Promise<void>
    detach(target: any): Promise<void>
    sendCommand(target: any, method: string, params?: any): Promise<any>
  }
}

/**
 * Screenshot configuration options
 */
export interface ScreenshotConfig {
  enabled?: boolean
  onFailure?: boolean
  onPass?: boolean
  quality?: number // 0-1 for JPEG quality
  format?: 'png' | 'jpeg' | 'webp'
  elementPadding?: number // pixels to add around element
  fullPage?: boolean // capture full page vs just element
  maxScreenshots?: number // NEW: Limit number of stored screenshots
  autoCleanup?: boolean // NEW: Auto cleanup old screenshots
}

/**
 * Screenshot data for test results
 */
export interface Screenshot {
  dataUrl: string
  timestamp: number
  element?: {
    x: number
    y: number
    width: number
    height: number
  }
  size?: number // NEW: Track image size for memory management
}

/**
 * Extended test result with screenshot
 */
export interface TestResultWithScreenshot extends TestResult {
  screenshot?: Screenshot
}

/**
 * Chrome extension screenshot utilities
 */
export class ChromeScreenshot {
  private config: ScreenshotConfig

  constructor(config: ScreenshotConfig = {}) {
    this.config = {
      enabled: true,
      onFailure: true,
      onPass: false,
      quality: 0.8,
      format: 'png',
      elementPadding: 10,
      fullPage: false,
      maxScreenshots: 50, // NEW: Default limit
      autoCleanup: true, // NEW: Default auto cleanup
      ...config
    }
  }

  /**
   * Check if we're in a Chrome extension environment
   */
  private isExtensionEnvironment(): boolean {
    return typeof chrome !== 'undefined' &&
           chrome.tabs &&
           chrome.tabs.captureVisibleTab !== undefined
  }

  /**
   * Check Chrome extension permissions
   */
  private async checkPermissions(): Promise<boolean> {
    if (!this.isExtensionEnvironment()) return false

    try {
      const hasTabsPermission = await chrome.permissions.contains({
        permissions: ['tabs']
      })

      const hasActiveTabPermission = await chrome.permissions.contains({
        permissions: ['activeTab']
      })

      return hasTabsPermission || hasActiveTabPermission
    } catch (error) {
      console.warn('Screenshot: Permission check failed:', error)
      return false
    }
  }

  /**
   * Request Chrome extension permissions - NEW: Use minimal permissions
   */
  private async requestPermissions(): Promise<boolean> {
    if (!this.isExtensionEnvironment()) return false

    try {
      // Try activeTab first (more secure)
      const activeTabGranted = await chrome.permissions.request({
        permissions: ['activeTab']
      })

      if (activeTabGranted) return true

      // Fallback to tabs permission if needed
      return await chrome.permissions.request({
        permissions: ['tabs']
      })
    } catch (error) {
      console.warn('Screenshot: Permission request failed:', error)
      return false
    }
  }

  /**
   * Highlight element with visual indicator
   */
  private highlightElement(element: HTMLElement, success: boolean): () => void {
    const originalBorder = element.style.border
    const originalBoxShadow = element.style.boxShadow

    // Add visual indicator
    element.style.border = `3px solid ${success ? '#22c55e' : '#ef4444'}`
    element.style.boxShadow = `0 0 10px ${success ? '#22c55e' : '#ef4444'}`

    // Return cleanup function
    return () => {
      element.style.border = originalBorder
      element.style.boxShadow = originalBoxShadow
    }
  }

  /**
   * NEW: Calculate approximate size of base64 image
   */
  private calculateImageSize(dataUrl: string): number {
    // Base64 encoding adds ~33% overhead, and we need to account for the data URL prefix
    const base64Data = dataUrl.split(',')[1] || dataUrl
    return Math.ceil(base64Data.length * 0.75) // Approximate decoded size
  }

  /**
   * Capture screenshot using Chrome extension APIs - NEW: Enhanced security
   */
  private async captureWithChromeAPI(element?: HTMLElement): Promise<string | null> {
    try {
      // Input validation
      if (element && !(element instanceof HTMLElement)) {
        console.warn('Screenshot: Invalid element provided')
        return null
      }

      // Check permissions first
      const hasPermissions = await this.checkPermissions()
      if (!hasPermissions) {
        const granted = await this.requestPermissions()
        if (!granted) {
          console.warn('Screenshot: Chrome permissions not granted')
          return null
        }
      }

      // Get current tab
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
      const currentTab = tabs[0]
      if (!currentTab?.id) {
        console.warn('Screenshot: No active tab found')
        return null
      }

      let cleanup: (() => void) | undefined

      // Highlight element if provided
      if (element) {
        cleanup = this.highlightElement(element, true)
        // Wait a bit for the highlight to render
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      let dataUrl: string

      if (this.config.fullPage && element) {
        // Use DevTools Protocol for full page screenshot
        dataUrl = await this.captureFullPageWithDevTools(currentTab.id, element)
      } else {
        // Capture visible area
        dataUrl = await chrome.tabs.captureVisibleTab(currentTab.windowId, {
          format: this.config.format as 'png' | 'jpeg',
          quality: this.config.format === 'jpeg' ? Math.round(this.config.quality! * 100) : undefined
        })
      }

      // Clean up highlight
      if (cleanup) {
        cleanup()
      }

      return dataUrl
    } catch (error) {
      console.error('Screenshot: Chrome API capture failed:', error)
      return null
    }
  }

  /**
   * Capture full page screenshot using DevTools Protocol
   */
  private async captureFullPageWithDevTools(tabId: number, element: HTMLElement): Promise<string> {
    try {
      // Attach debugger
      await chrome.debugger.attach({ tabId }, '1.3')

      // Get layout metrics
      const { contentSize } = await chrome.debugger.sendCommand(
        { tabId },
        'Page.getLayoutMetrics'
      )

      // Capture screenshot
      const { data } = await chrome.debugger.sendCommand(
        { tabId },
        'Page.captureScreenshot',
        {
          format: this.config.format as 'png' | 'jpeg',
          quality: this.config.format === 'jpeg' ? Math.round(this.config.quality! * 100) : undefined,
          clip: {
            x: 0,
            y: 0,
            width: contentSize.width,
            height: contentSize.height,
            scale: 1
          }
        }
      )

      // Detach debugger
      await chrome.debugger.detach({ tabId })

      return `data:image/${this.config.format};base64,${data}`
    } catch (error) {
      console.error('Screenshot: DevTools capture failed:', error)
      // Fallback to visible area capture
      return await chrome.tabs.captureVisibleTab(undefined, {
        format: this.config.format as 'png' | 'jpeg',
        quality: this.config.format === 'jpeg' ? Math.round(this.config.quality! * 100) : undefined
      })
    }
  }

  /**
   * Create placeholder screenshot when Chrome APIs are not available
   */
  private createPlaceholderScreenshot(element?: HTMLElement): string {
    const canvas = document.createElement('canvas')
    canvas.width = 400
    canvas.height = 300

    const ctx = canvas.getContext('2d')!

    // Background
    ctx.fillStyle = '#f3f4f6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Border
    ctx.strokeStyle = '#d1d5db'
    ctx.lineWidth = 2
    ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2)

    // Text
    ctx.fillStyle = '#6b7280'
    ctx.font = '16px system-ui, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const lines = [
      'Screenshot Placeholder',
      '',
      element ? `Element: ${element.tagName}` : 'No Chrome Extension API',
      element ? `Selector: ${element.id ? '#' + element.id : element.className ? '.' + element.className.split(' ')[0] : element.tagName}` : 'Real screenshots need Chrome extension'
    ]

    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, (canvas.height / 2) + (index - 1.5) * 25)
    })

    return canvas.toDataURL('image/png')
  }

  /**
   * Capture screenshot of element or viewport
   */
  async capture(element?: HTMLElement): Promise<Screenshot | null> {
    if (!this.config.enabled) return null

    try {
      let dataUrl: string | null = null

      if (this.isExtensionEnvironment()) {
        dataUrl = await this.captureWithChromeAPI(element)
      }

      // Fallback to placeholder
      if (!dataUrl) {
        dataUrl = this.createPlaceholderScreenshot(element)
      }

      const screenshot: Screenshot = {
        dataUrl,
        timestamp: Date.now(),
        size: this.calculateImageSize(dataUrl) // NEW: Track size
      }

      // Add element bounds if available
      if (element) {
        const rect = element.getBoundingClientRect()
        screenshot.element = {
          x: rect.x,
          y: rect.y,
          width: rect.width,
          height: rect.height
        }
      }

      return screenshot
    } catch (error) {
      console.error('Screenshot: Capture failed:', error)
      return null
    }
  }
}

/**
 * Screenshot Plugin for ACT Test Runner
 *
 * This plugin automatically captures screenshots on test failures and optionally on passes.
 * It works independently of the core runner and can be developed/maintained separately.
 */
export class ScreenshotPlugin implements Plugin {
  name = 'screenshot'
  private screenshotUtil: ChromeScreenshot
  private testResults = new Map<string, TestResultWithScreenshot>()
  private totalMemoryUsed = 0 // NEW: Track memory usage

  constructor(config: ScreenshotConfig = {}) {
    this.screenshotUtil = new ChromeScreenshot(config)
  }

  /**
   * Install the plugin on a test runner
   */
  install(runner: { on: (listener: (event: TestEvent) => void) => void }): void {
    runner.on(this.handleTestEvent.bind(this))
  }

  /**
   * Handle test events from the runner
   */
  private async handleTestEvent(event: TestEvent): Promise<void> {
    switch (event.type) {
      case 'test-start':
        this.handleTestStart()
        break

      case 'test-result':
        await this.handleTestResult(event)
        break

      case 'test-complete':
        this.handleTestComplete(event)
        break
    }
  }

  /**
   * NEW: Handle test start - cleanup if needed
   */
  private handleTestStart(): void {
    if (this.screenshotUtil['config'].autoCleanup) {
      this.cleanup()
    }
  }

  /**
   * Handle individual element test completion
   */
  private async handleTestResult(event: TestEvent & { type: 'test-result' }): Promise<void> {
    const { element: selector, test: testName, result } = event.data

    // Determine if we should capture screenshot
    const shouldCapture = (
      (result === 'fail' && this.screenshotUtil['config'].onFailure !== false) ||
      (result === 'pass' && this.screenshotUtil['config'].onPass === true)
    )

    if (!shouldCapture) return

    try {
      // Find the element in the DOM
      const element = document.querySelector(selector) as HTMLElement
      if (!element) {
        console.warn(`Screenshot: Element not found for selector: ${selector}`)
        return
      }

      // Check memory limits before capturing
      const maxScreenshots = this.screenshotUtil['config'].maxScreenshots || 50
      if (this.testResults.size >= maxScreenshots) {
        this.cleanupOldestScreenshots(Math.floor(maxScreenshots * 0.3)) // Remove 30% of oldest
      }

      // Capture screenshot
      const screenshot = await this.screenshotUtil.capture(element)

      if (screenshot) {
        // Store the screenshot result
        const resultId = `${testName}-${selector}-${Date.now()}` // Add timestamp for uniqueness
        const testResult: TestResultWithScreenshot = {
          id: resultId,
          name: testName,
          outcome: result,
          message: result === 'pass' ? 'Test passed' : 'Test failed',
          duration: 0, // We don't have access to duration in this event
          screenshot
        }

        this.testResults.set(resultId, testResult)

        // Track memory usage
        if (screenshot.size) {
          this.totalMemoryUsed += screenshot.size
        }

        console.log(`Screenshot captured for ${result} test: ${testName} on ${selector}`)
      }
    } catch (error) {
      console.error('Screenshot: Failed to capture for element test:', error)
    }
  }

  /**
   * Handle test completion
   */
  private handleTestComplete(event: TestEvent & { type: 'test-complete' }): void {
    const screenshotCount = this.testResults.size

    if (screenshotCount > 0) {
      console.log(`Screenshot Plugin: Captured ${screenshotCount} screenshots`)
      console.log(`Memory used: ${this.formatMemorySize(this.totalMemoryUsed)}`)

      // Optionally display screenshots in console (for debugging)
      if (typeof window !== 'undefined' && window.console && typeof window.console.table === 'function') {
        const screenshotSummary = Array.from(this.testResults.values()).map(result => ({
          test: result.name,
          outcome: result.outcome,
          hasScreenshot: !!result.screenshot,
          size: result.screenshot?.size ? this.formatMemorySize(result.screenshot.size) : 'N/A',
          timestamp: result.screenshot?.timestamp ? new Date(result.screenshot.timestamp).toLocaleTimeString() : 'N/A'
        }))

        console.table(screenshotSummary)
      }
    }

    // Don't auto-clear here - let user decide when to cleanup
  }

    /**
   * NEW: Cleanup old screenshots to prevent memory leaks
   */
  private cleanupOldestScreenshots(count: number): void {
    if (count <= 0) return

    // Sort by timestamp and remove oldest
    const entries = Array.from(this.testResults.entries())
    entries.sort((a, b) => {
      const timestampA = a[1].screenshot?.timestamp || 0
      const timestampB = b[1].screenshot?.timestamp || 0
      return timestampA - timestampB
    })

    const entriesToRemove = entries.slice(0, Math.min(count, entries.length))

    for (const [key, result] of entriesToRemove) {
      // Update memory tracking
      if (result.screenshot?.size) {
        this.totalMemoryUsed -= result.screenshot.size
      }

      this.testResults.delete(key)
    }

    console.log(`Screenshot: Cleaned up ${entriesToRemove.length} old screenshots`)
  }

  /**
   * NEW: Full cleanup of all screenshots
   */
  cleanup(): void {
    const count = this.testResults.size
    this.testResults.clear()
    this.totalMemoryUsed = 0

    if (count > 0) {
      console.log(`Screenshot: Cleaned up ${count} screenshots`)
    }
  }

  /**
   * NEW: Format memory size for display
   */
  private formatMemorySize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`
  }

  /**
   * Get screenshot results
   */
  getScreenshots(): TestResultWithScreenshot[] {
    return Array.from(this.testResults.values())
  }

  /**
   * Get screenshot for specific test
   */
  getScreenshot(testId: string): TestResultWithScreenshot | undefined {
    return this.testResults.get(testId)
  }

  /**
   * NEW: Get memory usage information
   */
  getMemoryUsage(): {
    screenshotCount: number
    totalMemoryUsed: number
    averageScreenshotSize: number
    maxScreenshots: number
  } {
    const avgSize = this.testResults.size > 0 ? this.totalMemoryUsed / this.testResults.size : 0

    return {
      screenshotCount: this.testResults.size,
      totalMemoryUsed: this.totalMemoryUsed,
      averageScreenshotSize: avgSize,
      maxScreenshots: this.screenshotUtil['config'].maxScreenshots || 50
    }
  }
}
