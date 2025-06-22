import type { Plugin, PerformanceData } from './types.js'
import type { createTestRunner } from '../core/runner.js'
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
  private elementsProcessed = 0
  private testsRun = 0
  private config: PerformanceConfig
  private testMetrics: Map<string, any> = new Map()

  constructor(config: PerformanceConfig = {}) {
    this.config = {
      enabled: true,
      collectDetailedMetrics: false,
      thresholds: {},
      ...config
    }
  }

  install(runner: ReturnType<typeof createTestRunner>): void {
    if (!this.config.enabled) return
    runner.on((event: TestEvent) => this.handleEvent(event))
  }

  private handleEvent(event: TestEvent): void {
    switch (event.type) {
      case 'test-start':
        this.startTracking()
        break

      case 'element-tested':
        this.elementsProcessed++
        this.testsRun++
        break

      case 'test-complete':
        this.endTracking()
        this.logPerformance()
        this.checkThresholds()
        break
    }
  }

  private startTracking(): void {
    this.elementsProcessed = 0
    this.testsRun = 0

    this.data = {
      startTime: performance.now(),
      endTime: 0,
      duration: 0,
      elementsProcessed: 0,
      testsRun: 0
    }

    // Track memory if available - FIXED: Store initial memory usage
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.data.memoryUsage = {
        used: memory.usedJSHeapSize, // Store initial value
        total: memory.totalJSHeapSize
      }
    }
  }

  private endTracking(): void {
    if (!this.data) return

    this.data.endTime = performance.now()
    this.data.duration = this.data.endTime - this.data.startTime
    this.data.elementsProcessed = this.elementsProcessed
    this.data.testsRun = this.testsRun

    // Update memory usage if available - FIXED: Calculate difference properly
    if ('memory' in performance && this.data.memoryUsage) {
      const memory = (performance as any).memory
      const initialUsed = this.data.memoryUsage.used
      const currentUsed = memory.usedJSHeapSize

      // Calculate the actual memory difference (could be positive or negative)
      this.data.memoryUsage.used = currentUsed - initialUsed
      this.data.memoryUsage.total = memory.totalJSHeapSize
    }
  }

  private logPerformance(): void {
    if (!this.data) return

    const testsPerSecond = (this.data.elementsProcessed / this.data.duration * 1000).toFixed(1)

    console.log('\n🚀 Performance Summary:')
    console.log('=======================')
    console.log(`⚡ Speed: ${testsPerSecond} tests/sec`)
    console.log(`⏱️ Duration: ${this.data.duration.toFixed(2)}ms`)
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
    return this.testMetrics
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
    this.elementsProcessed = 0
    this.testsRun = 0
    this.testMetrics.clear()
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
