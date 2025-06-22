# ACT Test Runner - Modular Architecture

## 🏗️ **Architecture Overview**

The ACT Test Runner has been refactored into a clean, modular architecture following the **single responsibility principle**. Each module has a focused purpose and can be used independently.

```
src/
├── core/           # Essential testing logic (minimal)
├── plugins/        # Optional features (extensible)
├── reporters/      # Output formatting (flexible)
├── api.ts         # Main facade (simple interface)
└── index.ts       # Module exports
```

## 🎯 **Core Module** (`src/core/`)

**Purpose**: Minimal execution engine for running accessibility tests

### Files:
- **`types.ts`** - Core type definitions
- **`expectation.ts`** - Basic expectation system (`expect()`)
- **`selector.ts`** - CSS selector generation utility
- **`runner.ts`** - Test execution engine (`TestRunner` class)
- **`index.ts`** - Core module exports

### Key Features:
- ✅ Test suite management (`describe`, `test`)
- ✅ Element selection and iteration
- ✅ Event system for plugins
- ✅ Basic expectations
- ✅ Error handling and timeout support

### Usage:
```typescript
import { TestRunner, expect } from '@allystudio/act-test-runner/core'

const runner = new TestRunner()
runner.describe('Accessibility Tests', () => {
  runner.test('should be accessible', ({ element }) => {
    expect(element.tagName).toBe('BUTTON')
  })
})
```

## 🔌 **Plugins Module** (`src/plugins/`)

**Purpose**: Optional features that extend the core functionality

### Available Plugins:

#### **PerformancePlugin**
- Tracks execution time, memory usage, and processing speed
- Logs performance metrics after test completion
- Provides `getData()` method for programmatic access

#### **AllyStudioPlugin**
- Integrates with AllyStudio browser extension
- Visual highlighting of test results
- Tooltip display for failed tests

#### **ExpectationsPlugin**
- Accessibility-specific expectations (`expectA11y()`)
- Methods: `toHaveAccessibleName()`, `toHaveValidAltText()`, etc.
- Automatically installed by default

### Usage:
```typescript
import { PerformancePlugin, AllyStudioPlugin } from '@allystudio/act-test-runner/plugins'

const runner = new TestRunner()

// Install plugins
const perfPlugin = new PerformancePlugin()
perfPlugin.install(runner)

const allyPlugin = new AllyStudioPlugin({
  highlightElement: (element, type) => { /* highlight logic */ }
})
allyPlugin.install(runner)
```

## 📊 **Reporters Module** (`src/reporters/`)

**Purpose**: Flexible output formatting for test results

### Available Reporters:

#### **ConsoleReporter** (Default)
- Rich console output with emojis and colors
- Detailed failure information
- Configurable verbosity

#### **MinimalReporter**
- Essential output only: `✅ 15/20 passed (245ms)`
- Perfect for CI/CD environments

#### **JsonReporter**
- Structured JSON output
- Includes events timeline and detailed results
- Browser download or console output

### Usage:
```typescript
import { ConsoleReporter, JsonReporter } from '@allystudio/act-test-runner/reporters'

const reporter = new ConsoleReporter({ verbose: true })
runner.on(event => reporter.onEvent(event))
```

## 🎭 **Main API** (`src/api.ts`)

**Purpose**: Simple facade that combines core, plugins, and reporters

### Configuration:
```typescript
import { configure, describe, test, runTests } from '@allystudio/act-test-runner'

// Configure with plugins and reporter
configure({
  reporter: 'console',
  reporterConfig: { verbose: true },
  performance: true,
  allyStudio: {
    highlightElement: (el, type) => el.classList.add(type)
  }
})

// Define tests (Vitest-style API)
describe('Button Accessibility', () => {
  test('should have accessible name', ({ element }) => {
    expectA11y(element).toHaveAccessibleName()
  }, 'button')
})

// Run tests
const results = await runTests()
```

## 🚀 **Quick Start Examples**

### **Simple Usage** (Auto-configured)
```typescript
import { describe, test, runTests, expectA11y } from '@allystudio/act-test-runner'

describe('Images', () => {
  test('should have alt text', ({ element }) => {
    expectA11y(element).toHaveValidAltText()
  }, 'img')
})

await runTests() // Uses console reporter by default
```

### **Advanced Usage** (Custom configuration)
```typescript
import {
  configure,
  describe,
  test,
  runTests,
  PerformancePlugin,
  JsonReporter
} from '@allystudio/act-test-runner'

// Custom configuration
configure({
  reporter: new JsonReporter({ output: 'results.json' }),
  plugins: [new PerformancePlugin()],
  timeout: 10000,
  bail: true
})

describe('Form Accessibility', () => {
  test('should have proper labels', ({ element }) => {
    expectA11y(element).toHaveProperLabel()
  }, 'input:not([type="hidden"])')
})

const results = await runTests()
```

### **Core-Only Usage** (Maximum control)
```typescript
import { TestRunner, expect } from '@allystudio/act-test-runner/core'
import { MinimalReporter } from '@allystudio/act-test-runner/reporters'

const runner = new TestRunner({ timeout: 5000 })
const reporter = new MinimalReporter()

runner.on(event => reporter.onEvent(event))
runner.on(event => {
  if (event.type === 'test-complete') {
    reporter.onComplete(event.data.results)
  }
})

runner.describe('Custom Tests', () => {
  runner.test('custom logic', ({ element }) => {
    expect(element.getAttribute('role')).toBe('button')
  })
})

await runner.runTests()
```

## 🔧 **Extension Points**

### **Custom Plugin**
```typescript
import type { Plugin } from '@allystudio/act-test-runner/plugins'

class CustomPlugin implements Plugin {
  name = 'custom'

  install(runner: TestRunner): void {
    runner.on(event => {
      if (event.type === 'element-tested') {
        // Custom logic here
      }
    })
  }
}
```

### **Custom Reporter**
```typescript
import type { Reporter } from '@allystudio/act-test-runner/reporters'

class CustomReporter implements Reporter {
  onEvent(event: TestEvent): void {
    // Handle events
  }

  async onComplete(results: SuiteResult[]): Promise<void> {
    // Output results
  }
}
```

### **Custom Expectation**
```typescript
import { ExpectationError } from '@allystudio/act-test-runner/core'

function expectCustom(element: HTMLElement) {
  return {
    toHaveCustomProperty() {
      if (!element.hasAttribute('data-custom')) {
        throw new ExpectationError('Element missing custom property')
      }
    }
  }
}
```

## 📈 **Benefits of Modular Architecture**

### **For Users:**
- 🎯 **Simple API**: Just import what you need
- 🔧 **Configurable**: Choose your reporter and plugins
- 📦 **Lightweight**: Core is minimal, plugins are optional
- 🚀 **Fast**: No unused code loaded

### **For Developers:**
- 🧩 **Modular**: Each module has single responsibility
- 🧪 **Testable**: Easy to unit test individual modules
- 🔌 **Extensible**: Plugin system for new features
- 🛠️ **Maintainable**: Clear separation of concerns

### **For Performance:**
- ⚡ **Tree-shakable**: Bundle only what you use
- 🎯 **Focused**: Core execution without bloat
- 📊 **Measurable**: Performance plugin tracks metrics
- 🔄 **Optimizable**: Each module can be optimized independently

## 🎛️ **Migration Guide**

### **From Old API:**
```typescript
// OLD (monolithic)
import { run, describe, test } from '@allystudio/act-test-runner'

// NEW (modular)
import { runTests, describe, test } from '@allystudio/act-test-runner'
```

### **Breaking Changes:**
- ✅ `run()` → `runTests()`
- ✅ Configuration moved to `configure()`
- ✅ Advanced features now require explicit plugin installation
- ✅ Expectations moved to `expectA11y()` (via ExpectationsPlugin)

### **Benefits:**
- 🎯 Cleaner API surface
- 🔧 More flexible configuration
- 📦 Smaller bundle size
- 🚀 Better performance
- 🧩 Easier to extend

---

**The modular architecture makes ACT Test Runner more maintainable, extensible, and performant while keeping the simple use cases extremely easy.**
