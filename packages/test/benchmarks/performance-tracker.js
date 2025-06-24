/**
 * Performance Tracker for @allystudio/test
 * Measures execution time, memory usage, and other performance metrics
 */
class PerformanceTracker {
  constructor() {
    this.measurements = new Map()
    this.memorySnapshots = []
    this.startTimes = new Map()
  }

  /**
   * Start measuring a test operation
   */
  startTest(testName) {
    performance.mark(`${testName}-start`)
    this.startTimes.set(testName, performance.now())

    // Capture memory usage if available
    if (performance.memory) {
      this.memorySnapshots.push({
        test: testName,
        phase: 'start',
        timestamp: performance.now(),
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      })
    }
  }

  /**
   * End measuring a test operation
   */
  endTest(testName) {
    const endTime = performance.now()
    const startTime = this.startTimes.get(testName)

    if (!startTime) {
      console.warn(`No start time found for test: ${testName}`)
      return null
    }

    performance.mark(`${testName}-end`)
    performance.measure(testName, `${testName}-start`, `${testName}-end`)

    const measure = performance.getEntriesByName(testName, 'measure')[0]
    const duration = endTime - startTime

    // Capture end memory usage
    let memoryUsed = 0
    if (performance.memory) {
      const endMemory = performance.memory.usedJSHeapSize
      const startMemorySnapshot = this.memorySnapshots.find(
        s => s.test === testName && s.phase === 'start'
      )

      if (startMemorySnapshot) {
        memoryUsed = endMemory - startMemorySnapshot.usedJSHeapSize
      }

      this.memorySnapshots.push({
        test: testName,
        phase: 'end',
        timestamp: endTime,
        usedJSHeapSize: endMemory,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      })
    }

    const result = {
      testName,
      duration: duration,
      performanceDuration: measure ? measure.duration : duration,
      memoryUsed: memoryUsed,
      startTime: startTime,
      endTime: endTime,
      timestamp: new Date().toISOString()
    }

    this.measurements.set(testName, result)
    this.startTimes.delete(testName)

    return result
  }

  /**
   * Get measurement results for a specific test
   */
  getResult(testName) {
    return this.measurements.get(testName)
  }

  /**
   * Get all measurement results
   */
  getAllResults() {
    return Array.from(this.measurements.values())
  }

  /**
   * Get memory snapshots
   */
  getMemorySnapshots() {
    return this.memorySnapshots
  }

  /**
   * Clear all measurements and snapshots
   */
  clear() {
    this.measurements.clear()
    this.memorySnapshots = []
    this.startTimes.clear()
    performance.clearMarks()
    performance.clearMeasures()
  }

  /**
   * Generate a performance report
   */
  generateReport() {
    const results = this.getAllResults()

    if (results.length === 0) {
      return 'No performance measurements available.'
    }

    const report = {
      summary: {
        totalTests: results.length,
        totalDuration: results.reduce((sum, r) => sum + r.duration, 0),
        averageDuration: results.reduce((sum, r) => sum + r.duration, 0) / results.length,
        totalMemoryUsed: results.reduce((sum, r) => sum + r.memoryUsed, 0),
        averageMemoryUsed: results.reduce((sum, r) => sum + r.memoryUsed, 0) / results.length
      },
      tests: results.map(r => ({
        name: r.testName,
        duration: `${r.duration.toFixed(2)}ms`,
        memory: `${(r.memoryUsed / 1024 / 1024).toFixed(2)}MB`,
        timestamp: r.timestamp
      })),
      memoryProfile: this.getMemoryProfile()
    }

    return report
  }

  /**
   * Get memory usage profile
   */
  getMemoryProfile() {
    if (this.memorySnapshots.length === 0) {
      return 'Memory profiling not available (requires Chrome/Chromium)'
    }

    const profile = {
      snapshots: this.memorySnapshots.length,
      peakUsage: Math.max(...this.memorySnapshots.map(s => s.usedJSHeapSize)),
      averageUsage: this.memorySnapshots.reduce((sum, s) => sum + s.usedJSHeapSize, 0) / this.memorySnapshots.length,
      heapLimit: this.memorySnapshots[0]?.jsHeapSizeLimit || 'Unknown'
    }

    return {
      ...profile,
      peakUsageMB: `${(profile.peakUsage / 1024 / 1024).toFixed(2)}MB`,
      averageUsageMB: `${(profile.averageUsage / 1024 / 1024).toFixed(2)}MB`,
      heapLimitMB: typeof profile.heapLimit === 'number'
        ? `${(profile.heapLimit / 1024 / 1024).toFixed(2)}MB`
        : profile.heapLimit
    }
  }

  /**
   * Log performance report to console
   */
  logReport() {
    const report = this.generateReport()

    console.group('🚀 Performance Report')
    console.log('📊 Summary:', report.summary)
    console.table(report.tests)
    console.log('🧠 Memory Profile:', report.memoryProfile)
    console.groupEnd()

    return report
  }

  /**
   * Export performance data as JSON
   */
  exportData() {
    return {
      measurements: this.getAllResults(),
      memorySnapshots: this.getMemorySnapshots(),
      report: this.generateReport(),
      exportedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    }
  }

  /**
   * Compare performance with baseline
   */
  compareWithBaseline(baseline) {
    const current = this.generateReport()

    if (!baseline || !baseline.summary) {
      return 'No baseline data provided for comparison'
    }

    const comparison = {
      duration: {
        current: current.summary.averageDuration,
        baseline: baseline.summary.averageDuration,
        improvement: ((baseline.summary.averageDuration - current.summary.averageDuration) / baseline.summary.averageDuration * 100).toFixed(1)
      },
      memory: {
        current: current.summary.averageMemoryUsed,
        baseline: baseline.summary.averageMemoryUsed,
        improvement: ((baseline.summary.averageMemoryUsed - current.summary.averageMemoryUsed) / baseline.summary.averageMemoryUsed * 100).toFixed(1)
      }
    }

    console.group('📈 Performance Comparison')
    console.log(`⏱️  Duration: ${comparison.duration.current.toFixed(2)}ms vs ${comparison.duration.baseline.toFixed(2)}ms (${comparison.duration.improvement}% improvement)`)
    console.log(`🧠 Memory: ${(comparison.memory.current / 1024 / 1024).toFixed(2)}MB vs ${(comparison.memory.baseline / 1024 / 1024).toFixed(2)}MB (${comparison.memory.improvement}% improvement)`)
    console.groupEnd()

    return comparison
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PerformanceTracker
} else if (typeof window !== 'undefined') {
  window.PerformanceTracker = PerformanceTracker
}
