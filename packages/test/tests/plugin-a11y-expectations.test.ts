import { describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createRunner } from '../src/core/runner.js'
import { ExpectationsPlugin } from '../src/plugins/expectations.js'

describe('Expectations Plugin', () => {
  let runner: ReturnType<typeof createRunner>
  let expectationsPlugin: ExpectationsPlugin

  beforeEach(() => {
    runner = createRunner()
    expectationsPlugin = new ExpectationsPlugin()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    expectationsPlugin.uninstall()
  })

  test('should install and provide expectA11y global', () => {
    expectationsPlugin.install(runner)

    expect(expectationsPlugin.name).toBe('expectations')
    expect(typeof (globalThis as any).expectA11y).toBe('function')
  })

  test('should validate alt text', async () => {
    expectationsPlugin.install(runner)

    document.body.innerHTML = `
      <img src="test.jpg" alt="Valid alt text">
      <img src="test2.jpg" alt="">
      <img src="test3.jpg">
    `

    runner.describe('Alt Text Tests', () => {
      runner.test('valid alt text should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveValidAltText()
      }, 'img[alt="Valid alt text"]')

      runner.test('empty alt text should fail', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toHaveValidAltText()
        }).toThrow('Image should have meaningful alt text')
      }, 'img[alt=""]')

      runner.test('missing alt attribute should fail', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toHaveValidAltText()
        }).toThrow('Image must have an alt attribute')
      }, 'img:not([alt])')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(3)
    expect(results[0]?.passed).toBe(1)
    expect(results[0]?.failed).toBe(2)
  })

  test.skip('should validate accessible names', async () => {
    expectationsPlugin.install(runner)

    document.body.innerHTML = `
      <button>Click me</button>
      <button aria-label="Custom label"></button>
      <button></button>
      <input type="text" placeholder="Enter text">
      <input type="text" aria-label="Name field">
      <input type="text">
    `

    runner.describe('Accessible Name Tests', () => {
      runner.test('button with text should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveAccessibleName()
      }, 'button:first-child')

      runner.test('button with aria-label should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveAccessibleName()
      }, 'button[aria-label]')

      runner.test('empty button should fail', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toHaveAccessibleName()
        }).toThrow('Element should have an accessible name')
      }, 'button:empty')

      runner.test('input with placeholder should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveAccessibleName()
      }, 'input[placeholder]')

      runner.test('input with aria-label should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveAccessibleName()
      }, 'input[aria-label]')

      runner.test('input without name should fail', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toHaveAccessibleName()
        }).toThrow('Element should have an accessible name')
      }, 'input:not([placeholder]):not([aria-label])')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(6)
    expect(results[0]?.passed).toBe(4)
    expect(results[0]?.failed).toBe(2)
  })

  test('should validate proper heading hierarchy', async () => {
    expectationsPlugin.install(runner)

    document.body.innerHTML = `
      <h1>Main Title</h1>
      <h2>Section</h2>
      <h3>Subsection</h3>
      <h4>Deep section</h4>
    `

    runner.describe('Heading Tests', () => {
      runner.test('h1 should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveProperHeadingLevel()
      }, 'h1')

      runner.test('h2 after h1 should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveProperHeadingLevel()
      }, 'h2')

      runner.test('h3 after h2 should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveProperHeadingLevel()
      }, 'h3')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(3)
    expect(results[0]?.passed).toBe(3)
    expect(results[0]?.failed).toBe(0)
  })

  test.skip('should validate focus management', async () => {
    expectationsPlugin.install(runner)

    document.body.innerHTML = `
      <button>Focusable</button>
      <div>Not focusable</div>
      <input type="text">
      <a href="/test">Link</a>
      <div tabindex="0">Focusable div</div>
      <div tabindex="-1">Not in tab order</div>
    `

    runner.describe('Focus Tests', () => {
      runner.test('button should be focusable', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toBeFocusable()
      }, 'button')

      runner.test('regular div should not be focusable', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toBeFocusable()
        }).toThrow('Element should be focusable')
      }, 'div:first-of-type')

      runner.test('input should be focusable', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toBeFocusable()
      }, 'input')

      runner.test('link should be focusable', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toBeFocusable()
      }, 'a')

      runner.test('div with tabindex=0 should be focusable', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toBeFocusable()
      }, 'div[tabindex="0"]')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(5)
    expect(results[0]?.passed).toBe(4)
    expect(results[0]?.failed).toBe(1)
  })

  test.skip('should validate color contrast', async () => {
    expectationsPlugin.install(runner)

    document.body.innerHTML = `
      <div style="color: black; background: white;">High contrast</div>
      <div style="color: #333; background: #fff;">Good contrast</div>
      <div style="color: #999; background: #fff;">Low contrast</div>
    `

    runner.describe('Color Contrast Tests', () => {
      runner.test('high contrast should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveGoodColorContrast()
      }, 'div:first-child')

      runner.test('good contrast should pass', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveGoodColorContrast()
      }, 'div:nth-child(2)')

      runner.test('low contrast should fail', (ctx) => {
        const expectA11y = (globalThis as any).expectA11y
        expect(() => {
          expectA11y(ctx.element).toHaveGoodColorContrast()
        }).toThrow('Element should have sufficient color contrast')
      }, 'div:nth-child(3)')
    })

    const results = await runner.run()
    expect(results).toHaveLength(1)
    expect(results[0]?.tests).toHaveLength(3)
    expect(results[0]?.passed).toBe(2)
    expect(results[0]?.failed).toBe(1)
  })

  test('should uninstall cleanly', () => {
    expectationsPlugin.install(runner)

    expect(typeof (globalThis as any).expectA11y).toBe('function')

    expectationsPlugin.uninstall()

    expect((globalThis as any).expectA11y).toBeUndefined()
  })
})
