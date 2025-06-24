# @allystudio/tespack

A minimal DOM element test runner with Vitest-style API. Fast, modular architecture with clean separation between core testing logic, optional plugins, and flexible reporting.

## ✨ Features

- 🎯 **Modular Architecture** - Core, plugins, and reporters are separate
- ⚡ **Minimal Core** - Essential testing logic without bloat
- 🔌 **Plugin System** - Optional features (performance, AllyStudio integration)
- 📊 **Flexible Reporting** - Console, JSON, or minimal output
- 🧪 **Vitest-style API** - Familiar testing syntax (`describe`, `test`, `expect`)
- 🚀 **High Performance** - Optimized for speed with performance tracking
- 🎨 **AllyStudio Ready** - Built-in integration with visual highlighting

## 📦 Installation

```bash
npm install @allystudio/test
```

## 🚀 Quick Start

### Simple Usage (Auto-configured)
```typescript
import { describe, test, run, expect } from '@allystudio/test'

describe('Image Tests', () => {
  test('should have alt attribute', ({ element }) => {
    expect(element.getAttribute('alt')).toBeTruthy()
  }, 'img')
})

describe('Button Tests', () => {
  test('should have text content', ({ element }) => {
    expect(element.textContent).toBeTruthy()
  }, 'button')
})

// Run with default console reporter
const results = await run()
```

### Advanced Configuration
```typescript
import {
  configure,
  describe,
  test,
  run,
  PerformancePlugin,
  JsonReporter
} from '@allystudio/test'

// Configure with custom reporter and plugins
configure({
  reporter: 'console',
  reporterConfig: { verbose: true },
  performance: true,
  allyStudio: {
    highlightElement: (element, type) => {
      element.classList.add(`highlight-${type}`)
    }
  }
})

describe('Form Tests', () => {
  test('should have labels', ({ element }) => {
    const label = element.labels?.[0] || document.querySelector(`label[for="${element.id}"]`)
    expect(label).toBeTruthy()
  }, 'input:not([type="hidden"])')
})

const results = await run()
```

## 🏗️ Architecture

```
src/
├── core/           # Essential testing logic (minimal)
├── plugins/        # Optional features (extensible)
├── reporters/      # Output formatting (flexible)
├── api.ts         # Main facade (simple interface)
└── index.ts       # Module exports
```

### 🎯 Core Module
Minimal execution engine with:
- Test suite management (`describe`, `test`)
- Element selection and iteration
- Event system for plugins
- Basic expectations (`expect`)

### 🔌 Plugins
Optional features that extend functionality:
- **PerformancePlugin** - Execution time, memory usage, processing speed
- **AllyStudioPlugin** - Visual highlighting integration
- **ExpectationsPlugin** - Accessibility-specific assertions (`expectA11y`)

### 📊 Reporters
Flexible output formatting:
- **ConsoleReporter** - Rich console output (default)
- **MinimalReporter** - Essential output for CI/CD
- **JsonReporter** - Structured data with download

## 🧪 Testing API

### Element Testing Examples
```typescript
import { expect } from '@allystudio/test'

// Image testing
expect(imgElement.getAttribute('alt')).toBeTruthy()
expect(imgElement.getAttribute('src')).toContain('https://')

// Button testing
expect(buttonElement.textContent).toBeTruthy()
expect(buttonElement.getAttribute('type')).toBe('submit')

// Form testing
expect(inputElement.labels?.length).toBeGreaterThan(0)
expect(inputElement.getAttribute('required')).toBe('')

// Link testing
expect(linkElement.textContent?.trim()).toBeTruthy()
expect(linkElement.getAttribute('href')).toMatch(/^https?:\/\//)

// General DOM testing
expect(element.tagName).toBe('BUTTON')
expect(element.classList.contains('active')).toBe(true)
```

### Standard Expectations
```typescript
import { expect } from '@allystudio/test'

expect(element.tagName).toBe('BUTTON')
expect(element.getAttribute('role')).not.toBe('presentation')
expect(element.classList.contains('active')).toBe(true)
expect(element.textContent?.trim()).toBeTruthy()
```

## ⚡ Performance Tracking

```typescript
import { configure, PerformancePlugin } from '@allystudio/test'

configure({
  performance: true, // Enable performance plugin
  reporter: 'console',
  reporterConfig: { verbose: true }
})

// After running tests, see metrics like:
// ⚡ Performance Metrics:
//    Duration: 245.67ms
//    Elements: 1,247
//    Tests: 4,988
//    Speed: 5,073 elements/sec
//    Memory: 12.4MB
```

## 🎨 AllyStudio Integration

```typescript
import { configure } from '@allystudio/test'

configure({
  allyStudio: {
    highlightElement: (element, type) => {
      // Integrate with AllyStudio's layer system
      element.classList.add(`ally-${type}`)
      element.setAttribute('data-ally-result', type)
    },
    clearHighlights: () => {
      document.querySelectorAll('[data-ally-result]').forEach(el => {
        el.classList.remove('ally-pass', 'ally-fail', 'ally-skip')
        el.removeAttribute('data-ally-result')
      })
    },
    showTooltip: (element, message) => {
      element.title = message
    }
  }
})
```

## 📊 Reporters

### Console Reporter (Default)
```typescript
configure({ reporter: 'console', reporterConfig: { verbose: true } })
// Output:
// 🚀 Starting 3 test suite(s)
// 📋 Image Accessibility
//    ✅ Passed: 12
//    ❌ Failed: 3
//    Duration: 45.67ms
```

### Minimal Reporter
```typescript
configure({ reporter: 'minimal' })
// Output: ✅ 156/160 passed (234ms)
```

### JSON Reporter
```typescript
configure({
  reporter: 'json',
  reporterConfig: { output: 'test-results.json' }
})
// Downloads structured JSON with full results
```

## 🔧 Custom Extensions

### Custom Plugin
```typescript
import type { Plugin } from '@allystudio/act-test-runner/plugins'

class CustomPlugin implements Plugin {
  name = 'custom'

  install(runner: TestRunner): void {
    runner.on(event => {
      if (event.type === 'element-tested') {
        // Custom logic for each tested element
        console.log(`Tested ${event.data.element}: ${event.data.result}`)
      }
    })
  }
}

configure({ plugins: [new CustomPlugin()] })
```

### Custom Reporter
```typescript
import type { Reporter } from '@allystudio/act-test-runner/reporters'

class CustomReporter implements Reporter {
  onEvent(event: TestEvent): void {
    // Handle real-time events
  }

  async onComplete(results: SuiteResult[]): Promise<void> {
    // Process final results
    console.log(`Custom report: ${results.length} suites completed`)
  }
}

configure({ reporter: new CustomReporter() })
```

## 📈 Migration from v1.x

```typescript
// OLD (monolithic)
import { run, describe, test } from '@allystudio/act-test-runner'
await run()

// NEW (modular)
import { runTests, describe, test } from '@allystudio/act-test-runner'
await runTests()
```

**Breaking Changes:**
- `run()` → `runTests()`
- Configuration moved to `configure()`
- Accessibility expectations moved to `expectA11y()`
- Advanced features require explicit plugin installation

**Benefits:**
- 🎯 Cleaner API surface
- 📦 Smaller bundle size (tree-shakable)
- 🚀 Better performance
- 🔧 More flexible configuration
- 🧩 Easier to extend

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Detailed modular architecture
- [Demo](./demo-modular.html) - Interactive browser demo
- [Benchmarks](./benchmarks/) - Performance comparison tools

## 🤝 Contributing

The modular architecture makes contributions easier:
- **Core**: Focus on test execution performance
- **Plugins**: Add new features without affecting core
- **Reporters**: Create new output formats
- **API**: Improve developer experience

## 📄 License

MIT
