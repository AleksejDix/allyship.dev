/**
 * Screenshot utilities for test results
 */

import type { Screenshot, ScreenshotConfig } from '../core/types.js'

/**
 * Default screenshot configuration
 */
const DEFAULT_CONFIG: Required<ScreenshotConfig> = {
  enabled: true,
  onFailure: true,
  onPass: false,
  quality: 0.8,
  format: 'png',
  elementPadding: 10,
  fullPage: false
}

/**
 * Capture a screenshot of an element or the full page
 */
export async function captureScreenshot(
  element?: HTMLElement,
  config: ScreenshotConfig = {}
): Promise<Screenshot | null> {
  const finalConfig = { ...DEFAULT_CONFIG, ...config }

  if (!finalConfig.enabled) {
    return null
  }

  try {
    let canvas: HTMLCanvasElement
    let elementBounds: { x: number; y: number; width: number; height: number } | undefined

    if (finalConfig.fullPage || !element) {
      // Capture full page
      canvas = await captureFullPage(finalConfig)
    } else {
      // Capture specific element
      const result = await captureElement(element, finalConfig)
      canvas = result.canvas
      elementBounds = result.bounds
    }

    // Convert canvas to data URL
    const dataUrl = canvas.toDataURL(`image/${finalConfig.format}`, finalConfig.quality)

    return {
      dataUrl,
      timestamp: Date.now(),
      element: elementBounds
    }
  } catch (error) {
    console.warn('Failed to capture screenshot:', error)
    return null
  }
}

/**
 * Capture the full page as a screenshot
 */
async function captureFullPage(config: Required<ScreenshotConfig>): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  // Set canvas size to viewport
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // Use html2canvas-like approach with DOM-to-canvas rendering
  // For now, we'll use a simpler approach that works in browsers
  return await renderDOMToCanvas(document.body, canvas, ctx)
}

/**
 * Capture a specific element as a screenshot
 */
async function captureElement(
  element: HTMLElement,
  config: Required<ScreenshotConfig>
): Promise<{ canvas: HTMLCanvasElement; bounds: { x: number; y: number; width: number; height: number } }> {
  const rect = element.getBoundingClientRect()
  const padding = config.elementPadding

  // Calculate bounds with padding
  const bounds = {
    x: Math.max(0, rect.left - padding),
    y: Math.max(0, rect.top - padding),
    width: rect.width + (padding * 2),
    height: rect.height + (padding * 2)
  }

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = bounds.width
  canvas.height = bounds.height

  // Highlight the element temporarily
  const originalOutline = element.style.outline
  const originalBoxShadow = element.style.boxShadow

  element.style.outline = '2px solid #ff4444'
  element.style.boxShadow = '0 0 10px rgba(255, 68, 68, 0.5)'

  try {
    // Render the element area to canvas
    await renderDOMToCanvas(element, canvas, ctx, bounds)
  } finally {
    // Restore original styles
    element.style.outline = originalOutline
    element.style.boxShadow = originalBoxShadow
  }

  return { canvas, bounds }
}

/**
 * Render DOM element to canvas (simplified implementation)
 * In a real implementation, you'd want to use a library like html2canvas
 */
async function renderDOMToCanvas(
  element: HTMLElement,
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  bounds?: { x: number; y: number; width: number; height: number }
): Promise<HTMLCanvasElement> {
  // This is a simplified implementation
  // In practice, you'd use html2canvas or similar library

  // For now, we'll create a simple visual representation
  ctx.fillStyle = '#f8f9fa'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw element outline
  ctx.strokeStyle = '#ff4444'
  ctx.lineWidth = 2
  ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20)

  // Add text indicating this is a screenshot placeholder
  ctx.fillStyle = '#333'
  ctx.font = '14px system-ui, -apple-system, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Screenshot Captured', canvas.width / 2, canvas.height / 2)
  ctx.fillText(`Element: ${element.tagName.toLowerCase()}`, canvas.width / 2, canvas.height / 2 + 20)

  if (element.className) {
    ctx.fillText(`Class: ${element.className}`, canvas.width / 2, canvas.height / 2 + 40)
  }

  return canvas
}

/**
 * Check if screenshot capture is supported in the current environment
 */
export function isScreenshotSupported(): boolean {
  return typeof HTMLCanvasElement !== 'undefined' &&
         typeof CanvasRenderingContext2D !== 'undefined'
}

/**
 * Get screenshot file size in bytes
 */
export function getScreenshotSize(screenshot: Screenshot): number {
  // Estimate size from data URL
  const base64Data = screenshot.dataUrl.split(',')[1]
  if (!base64Data) return 0
  return Math.round((base64Data.length * 3) / 4)
}

/**
 * Convert screenshot to blob for download
 */
export function screenshotToBlob(screenshot: Screenshot): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert screenshot to blob'))
        }
      })
    }

    img.onerror = () => reject(new Error('Failed to load screenshot image'))
    img.src = screenshot.dataUrl
  })
}
