import type { DOMChange, DOMMonitorOptions, PerformanceMetrics } from "./types"
import {
  ACCESSIBILITY_ATTRIBUTES,
  DOMChangeType as ChangeType,
  DEFAULT_OPTIONS,
} from "./types"
import { isElementHidden, shouldIgnoreElement } from "./utils"

/**
 * Ultra-performant DOM monitor for 120+ FPS with advanced features
 */
export function createDOMMonitor(options: DOMMonitorOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }

  let observer: MutationObserver | null = null
  let pendingChanges: DOMChange[] = []
  let frameId: number | null = null
  let changeCallback: ((changes: DOMChange[]) => void) | null = null
  let isRunning = false

  // Performance tracking
  let performanceMetrics: PerformanceMetrics = {
    totalChanges: 0,
    changesPerSecond: 0,
    averageProcessingTime: 0,
    maxProcessingTime: 0,
    droppedChanges: 0,
    frameRate: 0,
  }
  let lastMetricsUpdate = performance.now()
  let processingTimes: number[] = []
  let frameCount = 0
  let lastFrameTime = performance.now()

  // Frame rate calculation
  const targetFrameTime = 1000 / config.targetFrameRate // e.g., 8.33ms for 120 FPS

  const isAccessibilityAttribute = (attributeName: string): boolean => {
    return ACCESSIBILITY_ATTRIBUTES.includes(attributeName)
  }

  const shouldIgnoreEl = (element: HTMLElement): boolean => {
    // Fast path - check tag name first (most common filters)
    const tagName = element.tagName
    if (tagName === "SCRIPT" || tagName === "STYLE" || tagName === "NOSCRIPT") {
      return true
    }

    // Check built-in filters
    if (shouldIgnoreElement(element)) {
      return true
    }

    // Check custom filter (don't cache custom filters as they can vary)
    if (!config.elementFilter(element)) {
      return true
    }

    // Check if hidden (expensive, do last)
    if (config.ignoreHiddenElements && isElementHidden(element)) {
      return true
    }

    return false
  }

  const updatePerformanceMetrics = (processingTime: number): void => {
    if (!config.trackPerformance) return

    processingTimes.push(processingTime)
    performanceMetrics.maxProcessingTime = Math.max(
      performanceMetrics.maxProcessingTime,
      processingTime
    )

    // Keep only last 100 measurements for rolling average
    if (processingTimes.length > 100) {
      processingTimes.shift()
    }

    performanceMetrics.averageProcessingTime =
      processingTimes.reduce((sum, time) => sum + time, 0) /
      processingTimes.length

    // Update metrics every second
    const now = performance.now()
    if (now - lastMetricsUpdate >= 1000) {
      performanceMetrics.changesPerSecond = performanceMetrics.totalChanges
      performanceMetrics.frameRate = frameCount

      if (config.debug) {
        console.log("DOM Monitor Performance:", performanceMetrics)
      }

      config.onPerformanceUpdate(performanceMetrics)

      // Reset counters
      performanceMetrics.totalChanges = 0
      frameCount = 0
      lastMetricsUpdate = now
    }
  }

  const processFrame = (): void => {
    const frameStart = performance.now()
    frameId = null
    frameCount++

    if (pendingChanges.length === 0) return

    // Adaptive processing based on frame budget
    const timeLeft = targetFrameTime - (frameStart - lastFrameTime)
    let maxChangesToProcess = config.maxChanges

    // If we're running behind, process fewer changes
    if (timeLeft < 2) {
      // Less than 2ms left
      maxChangesToProcess = Math.max(1, Math.floor(config.maxChanges / 2))
    }

    // Process changes within frame budget
    const changesToReport = pendingChanges.splice(0, maxChangesToProcess)

    // Track dropped changes
    if (pendingChanges.length > 0 && config.trackPerformance) {
      performanceMetrics.droppedChanges += pendingChanges.length
    }

    if (changeCallback && changesToReport.length > 0) {
      changeCallback(changesToReport)
    }

    // Update performance metrics
    const processingTime = performance.now() - frameStart
    updatePerformanceMetrics(processingTime)
    lastFrameTime = performance.now()

    // Schedule next frame if more changes pending
    if (pendingChanges.length > 0) {
      frameId = requestAnimationFrame(processFrame)
    }
  }

  const scheduleFrame = (): void => {
    if (frameId === null) {
      frameId = requestAnimationFrame(processFrame)
    }
  }

  const createChange = (
    type: ChangeType,
    element: HTMLElement,
    details?: DOMChange["details"]
  ): DOMChange => {
    const change: DOMChange = {
      type,
      element,
      timestamp: performance.now(),
      details,
    }

    // Track accessibility impact
    if (config.trackAccessibility && details?.attributeName) {
      change.details!.accessibilityImpact = isAccessibilityAttribute(
        details.attributeName
      )
    }

    return change
  }

  const processMutations = (mutations: MutationRecord[]): void => {
    const mutationStart = performance.now()

    // Fast path - pre-allocate for common case
    const mutationCount = mutations.length
    if (mutationCount === 0) return

    let hasChanges = false

    // Process mutations in order for consistency
    for (let i = 0; i < mutationCount; i++) {
      const mutation = mutations[i]!
      const mutationType = mutation.type

      if (mutationType === "childList") {
        // Process added nodes
        const addedNodes = mutation.addedNodes
        for (let j = 0; j < addedNodes.length; j++) {
          const node = addedNodes[j]!
          if (node.nodeType === 1 && !shouldIgnoreEl(node as HTMLElement)) {
            const change = createChange(
              ChangeType.ELEMENT_ADDED,
              node as HTMLElement
            )
            pendingChanges.push(change)
            hasChanges = true
            performanceMetrics.totalChanges++
          }
        }

        // Process removed nodes
        const removedNodes = mutation.removedNodes
        for (let j = 0; j < removedNodes.length; j++) {
          const node = removedNodes[j]!
          if (node.nodeType === 1 && !shouldIgnoreEl(node as HTMLElement)) {
            const change = createChange(
              ChangeType.ELEMENT_REMOVED,
              node as HTMLElement
            )
            pendingChanges.push(change)
            hasChanges = true
            performanceMetrics.totalChanges++
          }
        }
      } else if (mutationType === "attributes") {
        const element = mutation.target as HTMLElement
        const attributeName = mutation.attributeName!

        // Fast attribute filtering
        if (
          (attributeName === "class" && config.ignoreClassChanges) ||
          (attributeName === "style" && config.ignoreStyleChanges) ||
          !config.attributeFilter(attributeName, element) ||
          shouldIgnoreEl(element)
        ) {
          continue
        }

        const details = {
          attributeName,
          oldValue: mutation.oldValue || "",
          newValue: element.getAttribute(attributeName) || "",
        }

        // Determine change type based on accessibility impact
        const changeType =
          config.trackAccessibility && isAccessibilityAttribute(attributeName)
            ? ChangeType.ACCESSIBILITY_CHANGE
            : ChangeType.ATTRIBUTE_CHANGED

        const change = createChange(changeType, element, details)
        pendingChanges.push(change)
        hasChanges = true
        performanceMetrics.totalChanges++
      } else if (config.observeText && mutationType === "characterData") {
        const parentElement = (mutation.target as Text).parentElement
        if (parentElement && !shouldIgnoreEl(parentElement)) {
          const details = {
            oldValue: mutation.oldValue || "",
            newValue: mutation.target.textContent || "",
          }
          const change = createChange(
            ChangeType.CONTENT_CHANGED,
            parentElement,
            details
          )
          pendingChanges.push(change)
          hasChanges = true
          performanceMetrics.totalChanges++
        }
      }
    }

    // Track mutation processing performance
    if (config.trackPerformance) {
      const mutationTime = performance.now() - mutationStart
      if (mutationTime > 1) {
        // Only track if significant
        const change = createChange(
          ChangeType.PERFORMANCE_IMPACT,
          document.body,
          {
            performanceImpact: mutationTime,
          }
        )
        pendingChanges.push(change)
        hasChanges = true
      }
    }

    if (hasChanges) {
      scheduleFrame()
    }
  }

  const start = (callback?: (changes: DOMChange[]) => void): void => {
    if (isRunning) return

    changeCallback = callback || null
    isRunning = true

    // Reset performance metrics
    performanceMetrics = {
      totalChanges: 0,
      changesPerSecond: 0,
      averageProcessingTime: 0,
      maxProcessingTime: 0,
      droppedChanges: 0,
      frameRate: 0,
    }
    lastMetricsUpdate = performance.now()
    lastFrameTime = performance.now()

    observer = new MutationObserver(processMutations)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeOldValue: true,
      characterData: config.observeText,
      characterDataOldValue: config.observeText,
    })

    if (config.debug) {
      console.log("DOM Monitor started with config:", config)
    }
  }

  const stop = (): void => {
    if (!isRunning) return

    isRunning = false

    if (observer) {
      observer.disconnect()
      observer = null
    }

    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    // Clear pending changes
    pendingChanges.length = 0

    if (config.debug) {
      console.log("DOM Monitor stopped. Final metrics:", performanceMetrics)
    }
  }

  const isActive = (): boolean => isRunning

  const getMetrics = (): PerformanceMetrics => ({ ...performanceMetrics })

  return { start, stop, isActive, getMetrics }
}

/**
 * Simple DOM monitoring function
 */
export function monitorDOM(
  callback: (changes: DOMChange[]) => void,
  options?: DOMMonitorOptions
) {
  const monitor = createDOMMonitor(options)
  monitor.start(callback)
  return monitor
}
