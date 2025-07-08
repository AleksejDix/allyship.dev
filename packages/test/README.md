# @allystudio/test

> Minimal DOM element test runner with Vitest-style API

[![npm version](https://img.shields.io/npm/v/@allystudio/test.svg)](https://www.npmjs.com/package/@allystudio/test)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@allystudio/test.svg)](https://bundlephobia.com/package/@allystudio/test)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A **31KB** accessibility-focused test runner that makes DOM testing simple, fast, and enjoyable. Built with modern patterns, Vue composition-style plugins, and a familiar Vitest-like API.

## ✨ Features

- 🎯 **Minimal Bundle**: 31KB vs competitors' 100KB+
- 🧩 **Vue Composition Plugins**: Modern, chainable plugin system
- 🔍 **DOM-Focused**: Built specifically for accessibility and DOM testing
- ⚡ **Fast**: Lightweight architecture with signal-based reactivity
- 🛡️ **Type-Safe**: Full TypeScript support with excellent IntelliSense
- 🎨 **Familiar API**: Vitest-style `describe()`, `test()`, `expect()`
- 🌐 **Browser Ready**: Works in browsers and Chrome extensions
- ♿ **Accessibility First**: Built-in WCAG and ACT rule support

## 📦 Installation

```bash
npm install @allystudio/test
```

```bash
yarn add @allystudio/test
```

```bash
pnpm add @allystudio/test
```

## 🚀 Quick Start

### Basic Usage

```javascript
import { describe, test, expect, run } from '@allystudio/test'

// Test accessibility of DOM elements
describe('Button Accessibility', () => {
  test('should have accessible name', (ctx) => {
    const button = ctx.element
    expect(button.getAttribute('aria-label')).toBe('Close dialog')
  })

  test('should be keyboard accessible', (ctx) => {
    const button = ctx.element
    expect(button.tabIndex).not.toBe(-1)
  })
}, 'button') // CSS selector

// Run all tests
const results = await run()
console.log(results)
```

### With Plugins

```javascript
import { createRunner, useMetrics, useConsoleReporter } from '@allystudio/test'

const runner = createRunner()
  .use(useMetrics)           // Performance tracking
  .use(useConsoleReporter)   // Beautiful console output

// Your tests...
describe('Navigation', () => {
  test('should have skip links', (ctx) => {
    const skipLink = ctx.element.querySelector('a[href="#main"]')
    expect(skipLink).toBeTruthy()
  })
}, 'nav')

await runner.run()
```

## 📚 API Reference

### Core Functions

#### `describe(name, fn, selector?)`
Creates a test suite that runs against DOM elements matching the selector.

```javascript
describe('Form Validation', () => {
  test('required fields have aria-required', (ctx) => {
    expect(ctx.element.getAttribute('aria-required')).toBe('true')
  })
}, 'input[required]')
```

#### `test(name, fn, selector?)`
Defines a test case. Receives a context object with the matched element.

```javascript
test('image has alt text', (ctx) => {
  expect(ctx.element.alt).toBeTruthy()
})
```

#### `expect(actual)`
Assertion helper with familiar API:

```javascript
expect(value).toBe(expected)
expect(value).not.toBe(expected)
```

#### `run()`
Executes all defined tests and returns results.

```javascript
const results = await run()
// Returns: SuiteResult[]
```

#### `clear()`
Clears all test suites and resets state.

```javascript
clear() // Clean slate for new tests
```

### Configuration

```javascript
import { createRunner } from '@allystudio/test'

const runner = createRunner({
  // Core execution options
  timeout: 5000,      // Test timeout in ms (default: 5000)
  retry: 2,           // Retry failed tests (default: 0)
  bail: true,         // Stop on first failure (default: false)

  // Event callbacks
  onStart: (suites) => console.log(`Running ${suites} suites`),
  onComplete: (results) => console.log('Tests complete!'),
  onError: (error) => console.error('Test error:', error)
})
```

### Test Context

Each test receives a context object:

```javascript
test('context example', (ctx) => {
  ctx.element   // The matched DOM element
  ctx.selector  // CSS selector used to find element
  ctx.document  // Document containing the element
  ctx.skip()    // Skip this test
  ctx.todo('reason') // Mark as todo
})
```

### Watch Mode

```javascript
import { watch } from '@allystudio/test'

const watcher = await watch({
  onRerun: (results) => console.log('Tests rerun:', results)
})

// Trigger test rerun
watcher.trigger()

// Stop watching
watcher.stop()
```

## 🧩 Plugin System

The library uses a Vue composition-inspired plugin system:

### Built-in Plugins

#### `useMetrics`
Tracks performance metrics and logs them to console.

```javascript
import { useMetrics } from '@allystudio/test'

runner.use(useMetrics)
// Logs: Duration, test count, elements tested, avg per test
```

#### `useConsoleReporter`
Beautiful console output with colors and formatting.

```javascript
import { useConsoleReporter } from '@allystudio/test'

runner.use(useConsoleReporter)
// Provides: Colored output, progress indicators, error details
```

#### `useExpectations`
Enhanced assertion helpers (automatically included).

```javascript
// Available globally after using plugin
expect(element).toHaveText('Hello')
expect(element).toHaveAttribute('role', 'button')
expect(element).toBeVisible()
expect(element).toHaveClass('active')
```

#### `useACTMetadata`
Enriches tests with WCAG and ACT rule metadata.

```javascript
import { useACTMetadata } from '@allystudio/test'

runner.use(useACTMetadata)
// Adds: Rule IDs, WCAG mappings, severity levels
```

#### `useDebugger`
Minimal debugging and analysis tools.

```javascript
import { useDebugger } from '@allystudio/test'

runner.use(useDebugger)
// Provides: Element inspection, selector validation
```

### Creating Custom Plugins

```javascript
function useCustomPlugin(runner) {
  // Modify runner behavior
  const originalRun = runner.run

  runner.run = async function() {
    console.log('Starting custom behavior...')
    const results = await originalRun.call(this)
    console.log('Custom behavior complete!')
    return results
  }
}

// Use your plugin
runner.use(useCustomPlugin)
```

## 🌐 Browser Compatibility

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Node.js**: 16+ (for headless testing)
- **TypeScript**: 4.5+ (peer dependency)
- **Chrome Extensions**: Full support with manifest v3

### Browser Testing Setup

```html
<!DOCTYPE html>
<html>
<head>
  <title>Accessibility Tests</title>
</head>
<body>
  <button aria-label="Close dialog">×</button>
  <nav>
    <a href="#main">Skip to main content</a>
  </nav>

  <script type="module">
    import { describe, test, expect, run } from './node_modules/@allystudio/test/dist/index.js'

    // Your tests here...

    run().then(results => {
      console.log('Test results:', results)
    })
  </script>
</body>
</html>
```

### Headless Testing

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom', // or 'happy-dom'
    setupFiles: ['./test-setup.js']
  }
})
```

```javascript
// test-setup.js
import { beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

beforeAll(() => {
  const dom = new JSDOM(`
    <!DOCTYPE html>
    <html><body>
      <!-- Your test HTML -->
    </body></html>
  `)

  global.document = dom.window.document
  global.window = dom.window
})
```

## 🎯 Use Cases

### Accessibility Testing
```javascript
describe('WCAG Compliance', () => {
  test('headings have proper hierarchy', (ctx) => {
    const heading = ctx.element
    const level = parseInt(heading.tagName.charAt(1))
    expect(level).toBeLessThanOrEqual(6)
  })
}, 'h1, h2, h3, h4, h5, h6')
```

### Form Validation
```javascript
describe('Form Accessibility', () => {
  test('required fields are marked', (ctx) => {
    expect(ctx.element.hasAttribute('required')).toBe(true)
    expect(ctx.element.getAttribute('aria-required')).toBe('true')
  })
}, 'input[required]')
```

### Chrome Extension Testing
```javascript
// content-script.js
import { describe, test, expect, run } from '@allystudio/test'

// Test the current page
describe('Page Accessibility', () => {
  test('images have alt text', (ctx) => {
    expect(ctx.element.alt.length).toBeGreaterThan(0)
  })
}, 'img')

// Run tests on the active page
run().then(results => {
  chrome.runtime.sendMessage({ type: 'test-results', results })
})
```

## 🔧 Advanced Usage

### Custom Test Runner

```javascript
import { createRunner } from '@allystudio/test'

const runner = createRunner({
  timeout: 10000,
  retry: 3,
  bail: false,
  onStart: (suites) => {
    console.log(`🧪 Running ${suites} test suites`)
  },
  onComplete: (results) => {
    const passed = results.flatMap(s => s.tests).filter(t => t.outcome === 'pass').length
    console.log(`✅ ${passed} tests passed`)
  },
  onError: (error) => {
    console.error('💥 Test runner error:', error)
  }
})

// Chain multiple plugins
runner
  .use(useMetrics)
  .use(useConsoleReporter)
  .use(useACTMetadata)

// Define tests
runner.describe('Custom Suite', () => {
  runner.test('custom test', (ctx) => {
    // Test logic
  })
}, '.my-selector')

// Execute
await runner.run()
```

### Error Handling

```javascript
import { TimeoutError } from '@allystudio/test'

try {
  const results = await run()
} catch (error) {
  if (error instanceof TimeoutError) {
    console.log('Test timed out:', error.message)
  } else {
    console.error('Test failed:', error)
  }
}
```

## 📊 Performance

- **Bundle Size**: 31.65 KB (minified)
- **Load Time**: ~5ms initialization
- **Memory Usage**: ~2MB baseline
- **Test Speed**: ~100 tests/second (typical DOM tests)

### Benchmarks vs Competitors

| Library | Bundle Size | API Methods | Plugin System |
|---------|-------------|-------------|---------------|
| @allystudio/test | **31KB** | **5 core** | **Vue composition** |
| jest-dom | 87KB | 20+ | Class-based |
| testing-library | 156KB | 30+ | Utility functions |
| playwright | 2.1MB | 100+ | Full browser automation |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/aleksejdix/allyship.dev.git
cd allyship.dev/packages/test

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## 📄 License

MIT © [Aleksej Dix](https://github.com/aleksejdix)

## 🔗 Links

- [npm Package](https://www.npmjs.com/package/@allystudio/test)
- [GitHub Repository](https://github.com/aleksejdix/allyship.dev)
- [Documentation](https://allyship.dev/test)
- [Issue Tracker](https://github.com/aleksejdix/allyship.dev/issues)
- [Changelog](CHANGELOG.md)

---

<div align="center">
  <p>Built with ❤️ for the accessibility community</p>
  <p>
    <a href="https://allyship.dev">allyship.dev</a> •
    <a href="https://twitter.com/aleksejdix">@aleksejdix</a>
  </p>
</div>
