import { createDiopterSimulator } from './simulator.js'
import type { SimulatorOptions } from './types.js'
import type { DiopterValue, ViewingDistance } from './types'

// Singleton instance for global use
let globalSimulator: ReturnType<typeof createDiopterSimulator> | null = null

/**
 * Create a new DiopterSimulator instance
 */
export { createDiopterSimulator }

/**
 * Get or create the global singleton diopter simulator instance
 */
export function getSingletonSimulator(options?: SimulatorOptions) {
  if (!globalSimulator) {
    globalSimulator = createDiopterSimulator(options)
  }
  return globalSimulator
}

/**
 * Destroy the global singleton instance
 */
export function destroySingletonSimulator() {
  if (globalSimulator) {
    globalSimulator.destroy()
    globalSimulator = null
  }
}

/**
 * Calculate blur amount in pixels based on diopter value and viewing distance
 * Uses the mathematical relationship: effective blur = |diopters| * distance_factor
 */
export function calculateBlur(diopters: DiopterValue, viewingDistance: ViewingDistance): number {
  if (diopters === 0) return 0

  const absDiopters = Math.abs(diopters)

  // Calculate distance factor based on vision condition
  let distanceFactor: number

  if (diopters < 0) {
    // Myopia: blur increases with distance (farther = more blur)
    // Use viewing distance directly - farther distances = more blur
    distanceFactor = Math.max(0.5, viewingDistance * 0.8)
  } else {
    // Hyperopia: blur is more consistent across distances but slightly worse up close
    // Inverse relationship - closer = slightly more blur
    distanceFactor = Math.max(0.4, 1.2 / viewingDistance)
  }

  // Calculate base blur amount
  const baseBlur = absDiopters * 0.8 * distanceFactor

  // Cap blur for usability (max 12px for severe cases)
  return Math.min(baseBlur, 12)
}

/**
 * Create or update a style sheet element
 */
export function createStyleSheet(id: string, css: string): HTMLStyleElement {
  let styleEl = document.getElementById(id) as HTMLStyleElement

  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = id
    document.head.appendChild(styleEl)
  }

  styleEl.textContent = css
  return styleEl
}

/**
 * Remove DOM element by ID if it exists
 */
export function removeElement(id: string): void {
  const element = document.getElementById(id)
  if (element) {
    element.remove()
  }
}

/**
 * Format diopter value for display
 */
export function formatDiopters(diopters: DiopterValue): string {
  if (diopters === 0) return 'Normal vision'

  const sign = diopters > 0 ? '+' : ''
  const type = diopters > 0 ? 'farsighted' : 'nearsighted'

  return `${sign}${diopters.toFixed(1)}D (${type})`
}

/**
 * Format viewing distance for display
 */
export function formatViewingDistance(distance: ViewingDistance): string {
  if (distance < 1) {
    return `${(distance * 100).toFixed(0)}cm`
  }
  return `${distance.toFixed(1)}m`
}

/**
 * Get device type suggestion based on viewing distance
 */
export function getDeviceType(distance: ViewingDistance): string {
  if (distance <= 0.35) return 'Smartphone'
  if (distance <= 0.55) return 'Tablet'
  if (distance <= 0.65) return 'Laptop'
  if (distance <= 0.8) return 'Desktop'
  if (distance <= 2.5) return 'Small TV'
  if (distance <= 3.5) return 'Large TV'
  return 'Projector'
}
