import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createElementInspector } from '../src/index.js'

describe('ElementInspector', () => {
  let inspector: ReturnType<typeof createElementInspector>

  beforeEach(() => {
    // Clear any existing highlights or overlays
    const existingHighlights = document.querySelectorAll('[data-highlight-box], [data-inspector-overlay]')
    existingHighlights.forEach(el => el.remove())

    inspector = createElementInspector({
      debug: false
    })
  })

  afterEach(() => {
    inspector?.destroy()

    // Reset body styles
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  })

  it('should create inspector instance', () => {
    expect(inspector).toBeDefined()
    expect(typeof inspector.start).toBe('function')
    expect(typeof inspector.stop).toBe('function')
    expect(typeof inspector.toggle).toBe('function')
  })

  it('should start and stop inspection', () => {
    expect(inspector.isInspecting()).toBe(false)

    inspector.start()
    expect(inspector.isInspecting()).toBe(true)

    inspector.stop()
    expect(inspector.isInspecting()).toBe(false)
  })

  it('should toggle inspection state', () => {
    expect(inspector.isInspecting()).toBe(false)

    inspector.toggle()
    expect(inspector.isInspecting()).toBe(true)

    inspector.toggle()
    expect(inspector.isInspecting()).toBe(false)
  })

  it('should get element info', () => {
    // Create a test element
    const testElement = document.createElement('div')
    testElement.id = 'test-element'
    testElement.className = 'test-class'
    testElement.textContent = 'Test content'
    document.body.appendChild(testElement)

    const elementInfo = inspector.getElementInfo(testElement)

    expect(elementInfo.element).toBe(testElement)
    expect(elementInfo.tagName).toBe('div')
    expect(elementInfo.textContent).toBe('Test content')
    expect(elementInfo.selector).toContain('#test-element')
    expect(elementInfo.attributes.id).toBe('test-element')
    expect(elementInfo.attributes.class).toBe('test-class')

    // Cleanup
    testElement.remove()
  })

  it('should handle event listeners', () => {
    let eventReceived = false

    const unsubscribe = inspector.on((event) => {
      eventReceived = true
      expect(event.type).toBe('start')
      expect(typeof event.timestamp).toBe('number')
    })

    inspector.start()

    expect(eventReceived).toBe(true)

    unsubscribe()
    inspector.stop()
  })

  it('should update options', () => {
    const initialState = inspector.getState()
    expect(initialState.options.deepInspection).toBe(false)

    inspector.setOptions({ deepInspection: true })

    const updatedState = inspector.getState()
    expect(updatedState.options.deepInspection).toBe(true)
  })

  it('should highlight elements', () => {
    const testElement = document.createElement('div')
    document.body.appendChild(testElement)

    inspector.highlight(testElement)

    // Check that highlight overlay was created
    const highlights = document.querySelectorAll('[data-highlight-box]')
    expect(highlights.length).toBeGreaterThan(0)

    inspector.clearHighlights()

    // Check that highlights were cleared
    const remainingHighlights = document.querySelectorAll('[data-highlight-box]')
    expect(remainingHighlights.length).toBe(0)

    // Cleanup
    testElement.remove()
  })
})
