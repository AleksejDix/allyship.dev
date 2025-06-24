import { describe, test, expect, beforeEach } from 'vitest'
import { createRunner } from '../src/core/runner.js'
import { DebuggerPlugin, debuggerPluginPresets } from '../src/plugins/debugger.js'

describe('Debugger Plugin', () => {
  let runner: ReturnType<typeof createRunner>
  let debuggerPlugin: DebuggerPlugin

  beforeEach(() => {
    runner = createRunner()
    debuggerPlugin = new DebuggerPlugin()
    document.body.innerHTML = ''
  })

  test('should track element statistics', () => {
    debuggerPlugin.install(runner)

    // Add test content
    document.body.innerHTML = `
      <img src="test.jpg" alt="Test image">
      <button>Click me</button>
      <a href="/test">Link</a>
      <h1>Heading</h1>
    `

    // Manually trigger element analysis
    debuggerPlugin.analyzeElementsNow()

    const stats = debuggerPlugin.getElementStats()
    expect(stats.size).toBeGreaterThan(0)

    // Should find our test elements
    const imgStats = stats.get('img')
    expect(imgStats?.count).toBe(1)

    const buttonStats = stats.get('button')
    expect(buttonStats?.count).toBe(1)
  })

  test('should track test execution', async () => {
    debuggerPlugin = new DebuggerPlugin({
      showTestExecution: true,
      showPerformanceMetrics: true
    })
    debuggerPlugin.install(runner)

    document.body.innerHTML = '<p>Test content</p>'

    runner.describe('Debug Test', () => {
      runner.test('should track execution', (ctx) => {
        expect(ctx.element.tagName.toLowerCase()).toBe('p')
      }, 'p')
    })

    await runner.run()

    const counts = debuggerPlugin.getTestCounts()
    expect(counts.total).toBeGreaterThan(0)
  })

  test('should provide DOM state analysis', () => {
    debuggerPlugin.install(runner)

    document.body.innerHTML = `
      <div>
        <img src="test.jpg" alt="Image">
        <button>Button</button>
        <input type="text" placeholder="Input">
      </div>
    `

    // Should not throw when analyzing DOM
    expect(() => {
      debuggerPlugin.showDOMState()
    }).not.toThrow()

    const stats = debuggerPlugin.getElementStats()
    expect(stats.size).toBeGreaterThan(0)
  })

  test('should work with preset configurations', () => {
    const devPlugin = debuggerPluginPresets.development
    expect(devPlugin.name).toBe('debugger')

    devPlugin.install(runner)
    document.body.innerHTML = '<span>Test</span>'

    expect(() => {
      devPlugin.analyzeElementsNow()
    }).not.toThrow()

    const stats = devPlugin.getElementStats()
    expect(stats).toBeDefined()
  })

  test('should be disabled when configured', () => {
    const disabledPlugin = new DebuggerPlugin({ enabled: false })

    // Should not throw when installing disabled plugin
    expect(() => {
      disabledPlugin.install(runner)
    }).not.toThrow()

    // Should not track anything when disabled
    disabledPlugin.analyzeElementsNow()
    const stats = disabledPlugin.getElementStats()
    expect(stats.size).toBe(0)
  })

  test('should reset tracking data', () => {
    debuggerPlugin.install(runner)

    document.body.innerHTML = '<div>Content</div>'
    debuggerPlugin.analyzeElementsNow()

    // Should have some data
    expect(debuggerPlugin.getElementStats().size).toBeGreaterThan(0)

    // Reset should clear everything
    debuggerPlugin.reset()
    expect(debuggerPlugin.getElementStats().size).toBe(0)
    expect(debuggerPlugin.getTestCounts().total).toBe(0)
    expect(debuggerPlugin.getExecutionLog().length).toBe(0)
  })

  test('should generate element previews', () => {
    debuggerPlugin.install(runner)

    document.body.innerHTML = `
      <div id="test-id" class="test-class">Test content</div>
      <img src="test.jpg" alt="">
      <button>Very long button text that should be truncated</button>
    `

    debuggerPlugin.analyzeElementsNow()

    // Should not throw when generating previews
    expect(() => {
      debuggerPlugin.showDOMState()
    }).not.toThrow()
  })
})
