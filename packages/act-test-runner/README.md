# @allystudio/act-test-runner

A fast, modular accessibility test runner with a clean separation between core testing logic, optional plugins, and flexible reporting.

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
npm install @allystudio/act-test-runner
```

## 🚀 Quick Start

### Simple Usage (Auto-configured)
```typescript
import { describe, test, runTests, expectA11y } from '@allystudio/act-test-runner'

describe('Image Accessibility', () => {
  test('should have alt text', ({ element }) => {
    expectA11y(element).toHaveValidAltText()
  }, 'img')
})

describe('Button Accessibility', () => {
  test('should have accessible name', ({ element }) => {
    expectA11y(element).toHaveAccessibleName()
  }, 'button')
})

// Run with default console reporter
const results = await runTests()
```

### Advanced Configuration
```typescript
import {
  configure,
  describe,
  test,
  runTests,
  PerformancePlugin,
  JsonReporter
} from '@allystudio/act-test-runner'

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

describe('Form Accessibility', () => {
  test('should have proper labels', ({ element }) => {
    expectA11y(element).toHaveProperLabel()
  }, 'input:not([type="hidden"])')
})

const results = await runTests()
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

### Accessibility Expectations
```typescript
import { expectA11y } from '@allystudio/act-test-runner'

// Image accessibility
expectA11y(imgElement).toHaveValidAltText()

// Button accessibility
expectA11y(buttonElement).toHaveAccessibleName()
expectA11y(buttonElement).toHaveAccessibleName('Save Document')

// Form accessibility
expectA11y(inputElement).toHaveProperLabel()

// Link accessibility
expectA11y(linkElement).toHaveMeaningfulLinkText()

// Heading hierarchy
expectA11y(headingElement).toHaveProperHeadingLevel()
```

### Basic Expectations
```typescript
import { expect } from '@allystudio/act-test-runner'

expect(element.tagName).toBe('BUTTON')
expect(element.getAttribute('role')).not.toBe('presentation')
```

## ⚡ Performance Tracking

```typescript
import { configure, PerformancePlugin } from '@allystudio/act-test-runner'

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
import { configure } from '@allystudio/act-test-runner'

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
