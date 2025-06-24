import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/core/runner.js'

describe('Skip Behavior', () => {
  let runner: ReturnType<typeof createRunner>

  beforeEach(() => {
    runner = createRunner()
    document.body.innerHTML = ''
  })

  test('should skip tests when no elements found for selector', async () => {
    // No images on the page
    document.body.innerHTML = '<p>Just some text</p>'

    runner.describe('Image Tests', () => {
      runner.test('should have alt text', (ctx) => {
        expect(ctx.element.getAttribute('alt')).not.toBe(null)
      }, 'img')
    })

    const results = await runner.run()

    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(1)
    expect(results[0]?.tests[0]?.outcome).toBe('skip')
    expect(results[0]?.tests[0]?.message).toBe('No elements found for selector "img"')
    expect(results[0]?.skipped).toBe(1)
    expect(results[0]?.passed).toBe(0)
    expect(results[0]?.failed).toBe(0)
  })

  test('should run tests when elements are found', async () => {
    // Add an image
    document.body.innerHTML = '<img src="test.jpg" alt="Test image">'

    runner.describe('Image Tests', () => {
      runner.test('should have alt text', (ctx) => {
        expect(ctx.element.getAttribute('alt')).not.toBe(null)
      }, 'img')
    })

    const results = await runner.run()

    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(1)
    expect(results[0]?.tests[0]?.outcome).toBe('pass')
    expect(results[0]?.skipped).toBe(0)
    expect(results[0]?.passed).toBe(1)
    expect(results[0]?.failed).toBe(0)
  })

  test('should skip some tests and run others', async () => {
    // Only add buttons, no images
    document.body.innerHTML = '<button>Click me</button>'

    runner.describe('Mixed Tests', () => {
      runner.test('images should have alt text', (ctx) => {
        expect(ctx.element.getAttribute('alt')).not.toBe(null)
      }, 'img')

      runner.test('buttons should have text', (ctx) => {
        expect(ctx.element.textContent?.trim()).not.toBe('')
      }, 'button')
    })

    const results = await runner.run()

    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(2)

    // Image test should be skipped
    const imageTest = results[0]?.tests.find(t => t.name.includes('images'))
    expect(imageTest?.outcome).toBe('skip')

    // Button test should pass
    const buttonTest = results[0]?.tests.find(t => t.name.includes('buttons'))
    expect(buttonTest?.outcome).toBe('pass')

    expect(results[0]?.skipped).toBe(1)
    expect(results[0]?.passed).toBe(1)
    expect(results[0]?.failed).toBe(0)
  })

  test('handles multiple tests with mixed skip status', async () => {
    document.body.innerHTML = '<div>test</div>'

    let normalRan = false
    let skippedRan = false

    runner.describe('Mixed Suite', () => {
      runner.test('normal test', () => { normalRan = true }, 'div')
      runner.test('skip test', (ctx) => {
        skippedRan = true
        ctx.skip()
      }, 'div')
    })

    const results = await runner.run()

    expect(normalRan).toBe(true)
    expect(skippedRan).toBe(true) // Skip function should still run
    expect(results[0]?.passed).toBe(1)
    expect(results[0]?.skipped).toBe(1)
  })

  test('handles todo tests', async () => {
    document.body.innerHTML = '<div>test</div>'

    let todoRan = false

    runner.describe('Todo Suite', () => {
      runner.test('todo test', (ctx) => {
        todoRan = true
        ctx.todo('Not implemented yet')
      }, 'div')
    })

    const results = await runner.run()

    expect(todoRan).toBe(true)
    expect(results[0]?.passed).toBe(0)
    expect(results[0]?.todo).toBe(1)
  })
})
