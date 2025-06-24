import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/core/runner'
import { ExpectationsPlugin } from '../src/plugins/expectations'
import type { Plugin } from '../src/plugins/types'

describe('Plugin System', () => {
  let runner: ReturnType<typeof createRunner>

  beforeEach(() => {
    document.body.innerHTML = ''
    runner = createRunner()
  })

  test('installs plugin', () => {
    const plugin = new ExpectationsPlugin()

    expect(() => plugin.install(runner)).not.toThrow()
    expect(plugin.name).toBe('expectations')
  })

  test('plugin enhances functionality', async () => {
    document.body.innerHTML = '<img alt="test image" src="test.jpg">'

    const plugin = new ExpectationsPlugin()
    plugin.install(runner)

    let passed = false
    runner.describe('suite', () => {
      runner.test('test', (ctx) => {
        // Use plugin-enhanced expectation
        const expectA11y = (globalThis as any).expectA11y
        expectA11y(ctx.element).toHaveValidAltText()
        passed = true
      }, 'img')
    })

    const results = await runner.run()
    expect(passed).toBe(true)
    expect(results).toHaveLength(1)
    expect(results[0]?.passed).toBe(1)
    expect(typeof (globalThis as any).expectA11y).toBe('function')
  })

  test('custom plugin works', () => {
    const mockPlugin: Plugin = {
      name: 'mock',
      install: (runner) => {
        runner.on((event) => {
          if (event.type === 'test-start') {
            // Plugin responds to events
          }
        })
      }
    }

    expect(() => mockPlugin.install(runner)).not.toThrow()
    expect(mockPlugin.name).toBe('mock')
  })

  test('plugin uninstall works', () => {
    const plugin = new ExpectationsPlugin()
    plugin.install(runner)

    expect(() => plugin.uninstall()).not.toThrow()
  })
})
