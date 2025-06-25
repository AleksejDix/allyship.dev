import type { Plugin, PerformanceData } from './types.js'
import type { createRunner } from '../core/runner.js'
import type { TestEvent } from '../core/types.js'

export interface PerformanceConfig {
  enabled?: boolean
  collectDetailedMetrics?: boolean
  thresholds?: {
    maxExecutionTime?: number // ms
    maxMemoryUsage?: number // bytes
    minTestsPerSecond?: number
  }
  onThresholdExceeded?: (metric: string, value: number, threshold: number) => void
}

/**
 * Performance tracking plugin with thresholds and detailed metrics
 */
export class PerformancePlugin implements Plugin {
  name = 'performance'
  private data: PerformanceData | null = null
  private config: PerformanceConfig

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enabled: true,
      collectDetailedMetrics: false,
      thresholds: {},
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
        this.startTracking()
        break

      case 'test-complete':
        this.endTracking(event.data)
        this.logPerformance()
        this.checkThresholds()
        break
    }
  }

  private startTracking(): void {
    this.data = {
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      elementsProcessed: 0,
      testsRun: 0
    }

    // Track memory if available - Store initial memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.data.memoryUsage = {
        used: memory.usedJSHeapSize, // Store initial value for comparison
        total: memory.totalJSHeapSize,
        initial: memory.usedJSHeapSize // NEW: Store initial value separately
      }
    }
  }

  private endTracking(data: { results: any[] }): void {
    if (!this.data) return

    this.data.endTime = performance.now()
    this.data.duration = this.data.endTime - this.data.startTime

    // Count all test results from the final results
    for (const suiteResult of data.results) {
      this.data.elementsProcessed += suiteResult.tests.length
      this.data.testsRun += suiteResult.tests.length
    }

    // Update memory usage if available - Show current usage instead of delta
    if ('memory' in performance && this.data.memoryUsage) {
      const memory = (performance as any).memory
      const currentUsed = memory.usedJSHeapSize

      // Store current memory usage (not delta) for display
      this.data.memoryUsage.used = currentUsed
      this.data.memoryUsage.total = memory.totalJSHeapSize
      // initial value is already stored from startTracking
    }
  }

  private logPerformance(): void {
    if (!this.data) return

    const testsPerSecond = (this.data.elementsProcessed / this.data.duration * 1000).toFixed(1)

    console.log('\n🚀 Performance Summary:')
    console.log('=======================')
    console.log(`⚡ Speed: ${testsPerSecond} tests/sec`)
    console.log(`⏱️ Duration: ${this.data.duration.toFixed(2)}ms`)

    // Log memory usage if available
    if (this.data.memoryUsage) {
      console.log(`💾 Memory Used: ${this.formatMemory(this.data.memoryUsage.used)}`)
      if (this.data.memoryUsage.initial) {
        const delta = this.data.memoryUsage.used - this.data.memoryUsage.initial
        console.log(`📈 Memory Delta: ${this.formatMemory(delta)}`)
      }
      console.log(`📊 Total Heap: ${this.formatMemory(this.data.memoryUsage.total)}`)
    }
  }

  private checkThresholds(): void {
    if (!this.data || !this.config.thresholds) return

    const { thresholds, onThresholdExceeded } = this.config

    // Check execution time threshold
    if (thresholds.maxExecutionTime && this.data.duration > thresholds.maxExecutionTime) {
      onThresholdExceeded?.('maxExecutionTime', this.data.duration, thresholds.maxExecutionTime)
    }

    // Check memory threshold
    if (thresholds.maxMemoryUsage && this.data.memoryUsage) {
      const memoryUsed = this.data.memoryUsage.used
      if (memoryUsed > thresholds.maxMemoryUsage) {
        onThresholdExceeded?.('maxMemoryUsage', memoryUsed, thresholds.maxMemoryUsage)
      }
    }

    // Check tests per second threshold
    if (thresholds.minTestsPerSecond) {
      const testsPerSecond = this.data.elementsProcessed / (this.data.duration / 1000)
      if (testsPerSecond < thresholds.minTestsPerSecond) {
        onThresholdExceeded?.('minTestsPerSecond', testsPerSecond, thresholds.minTestsPerSecond)
      }
    }
  }

  /**
   * Get current performance data
   */
  getData(): PerformanceData | null {
    return this.data
  }

  /**
   * Get detailed test metrics (if collection enabled)
   */
  getDetailedMetrics(): Map<string, any> {
    return new Map()
  }

  /**
   * Format memory size for display
   */
  formatMemory(bytes: number): string {
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
   * Format time for display
   */
  formatTime(ms: number): string {
    if (ms < 1000) return `${Math.round(ms * 100) / 100}ms`
    return `${Math.round(ms / 10) / 100}s`
  }

  /**
   * Reset performance tracking
   */
  reset(): void {
    this.data = null
  }
}

// Export preset configurations
export const performancePluginPresets = {
  // For development - detailed metrics, relaxed thresholds
  development: new PerformancePlugin({
    enabled: true,
    collectDetailedMetrics: true,
    thresholds: {
      maxExecutionTime: 5000, // 5s
      maxMemoryUsage: 100 * 1024 * 1024, // 100MB
      minTestsPerSecond: 10
    },
    onThresholdExceeded: (metric: string, value: number, threshold: number) => {
      console.warn(`⚠️ Performance threshold exceeded: ${metric} = ${value} (threshold: ${threshold})`)
    }
  }),

  // For production - minimal overhead, strict thresholds
  production: new PerformancePlugin({
    enabled: true,
    collectDetailedMetrics: false,
    thresholds: {
      maxExecutionTime: 1000, // 1s
      maxMemoryUsage: 50 * 1024 * 1024, // 50MB
      minTestsPerSecond: 100
    },
    onThresholdExceeded: (metric: string, value: number, threshold: number) => {
      console.error(`🚨 Performance issue: ${metric} = ${value} (threshold: ${threshold})`)
    }
  }),

  // For benchmarking - maximum detail collection
  benchmark: new PerformancePlugin({
    enabled: true,
    collectDetailedMetrics: true,
    thresholds: {},
    onThresholdExceeded: () => {} // No warnings during benchmarking
  })
}
