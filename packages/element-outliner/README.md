# @allystudio/element-outliner

A modern CSS-based element outliner for web development debugging, inspired by Pesticide CSS with enhanced features and better performance.

## Features

- 🎨 **80+ Element Types** - Distinct colors for every HTML element
- ⚡ **Zero Dependencies** - Lightweight and fast
- 🔧 **Configurable** - Custom colors, exclusions, and hover effects
- 🧹 **Clean API** - Functional programming approach with proper cleanup
- 📦 **TypeScript** - Full type safety and IntelliSense support
- 🧪 **Well Tested** - Comprehensive test suite with 100% coverage

## Installation

```bash
npm install @allystudio/element-outliner
```

## Quick Start

```typescript
import { createElementOutliner } from '@allystudio/element-outliner'

// Create an outliner instance
const outliner = createElementOutliner()

// Start outlining elements
outliner.start()

// Toggle on/off
outliner.toggle()

// Stop outlining
outliner.stop()

// Clean up when done
outliner.destroy()
```

## API Reference

### `createElementOutliner(options?)`

Creates a new element outliner instance.

#### Options

```typescript
interface ElementOutlinerOptions {
  /** Whether to show hover effects (default: true) */
  enableHover?: boolean

  /** Custom colors for specific elements */
  customColors?: Record<string, string>

  /** Elements to exclude from outlining */
  excludeSelectors?: string[]

  /** CSS selector for elements to exclude from hover effects */
  excludeFromHover?: string
}
```

#### Returns

An `ElementOutliner` instance with the following methods:

- `start()` - Start outlining elements
- `stop()` - Stop outlining elements
- `toggle()` - Toggle outlining on/off, returns current state
- `isActive()` - Check if outlining is currently active
- `configure(options)` - Update configuration at runtime
- `destroy()` - Clean up and remove all styles

## Examples

### Basic Usage

```typescript
import { createElementOutliner } from '@allystudio/element-outliner'

const outliner = createElementOutliner()
outliner.start()

// Elements will now be outlined with distinct colors
```

### Custom Colors

```typescript
const outliner = createElementOutliner({
  customColors: {
    'div': '#ff0000',
    'p': '#00ff00',
    'span': '#0000ff'
  }
})

outliner.start()
```

### Exclude Elements

```typescript
const outliner = createElementOutliner({
  excludeSelectors: ['.no-outline', '[data-test]'],
  excludeFromHover: '.tooltip, .modal'
})

outliner.start()
```

### Disable Hover Effects

```typescript
const outliner = createElementOutliner({
  enableHover: false
})

outliner.start()
```

### Runtime Configuration

```typescript
const outliner = createElementOutliner()
outliner.start()

// Later, update configuration
outliner.configure({
  customColors: { 'button': '#purple' },
  enableHover: false
})
```

### Toggle with Keyboard Shortcut

```typescript
const outliner = createElementOutliner()

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'o') {
    e.preventDefault()
    outliner.toggle()
  }
})
```

## Color Palette

The outliner includes a comprehensive color palette for 80+ HTML elements:

```typescript
import { OUTLINE_COLORS } from '@allystudio/element-outliner'

console.log(OUTLINE_COLORS.div)    // '#036cdb'
console.log(OUTLINE_COLORS.p)      // '#ac050b'
console.log(OUTLINE_COLORS.button) // '#da8301'
```

### Element Categories

- **Structure**: `body`, `main`, `header`, `footer`, `nav`, `aside`, `section`, `article`
- **Typography**: `h1-h6`, `p`, `span`, `strong`, `em`, `code`, `pre`
- **Forms**: `form`, `input`, `button`, `select`, `textarea`, `label`, `fieldset`
- **Lists**: `ul`, `ol`, `li`, `dl`, `dt`, `dd`
- **Tables**: `table`, `thead`, `tbody`, `tfoot`, `tr`, `th`, `td`
- **Media**: `img`, `video`, `audio`, `canvas`, `svg`
- **Interactive**: `a`, `button`, `details`, `summary`

## Browser Support

- Chrome/Edge 60+
- Firefox 55+
- Safari 12+
- All modern browsers with CSS outline support

## Performance

- **Lightweight**: ~3KB minified + gzipped
- **Fast**: CSS-only approach, no DOM manipulation
- **Memory Efficient**: Single style element, automatic cleanup
- **Non-blocking**: No impact on page performance

## Use Cases

- **Development Debugging** - Visualize page structure
- **CSS Layout Issues** - Identify spacing and positioning problems
- **Accessibility Testing** - See element hierarchy
- **Design System Validation** - Verify semantic markup
- **Teaching/Learning** - Understand HTML structure

## Framework Integration

### React

```typescript
import { useEffect, useRef } from 'react'
import { createElementOutliner } from '@allystudio/element-outliner'

function useElementOutliner(enabled: boolean) {
  const outlinerRef = useRef(createElementOutliner())

  useEffect(() => {
    const outliner = outlinerRef.current

    if (enabled) {
      outliner.start()
    } else {
      outliner.stop()
    }

    return () => outliner.destroy()
  }, [enabled])

  return outlinerRef.current
}
```

### Vue

```typescript
import { ref, watchEffect, onUnmounted } from 'vue'
import { createElementOutliner } from '@allystudio/element-outliner'

export function useElementOutliner() {
  const enabled = ref(false)
  const outliner = createElementOutliner()

  watchEffect(() => {
    if (enabled.value) {
      outliner.start()
    } else {
      outliner.stop()
    }
  })

  onUnmounted(() => {
    outliner.destroy()
  })

  return { enabled, outliner }
}
```

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our GitHub repository.

## License

MIT License - see LICENSE file for details.

## Inspiration

This project is inspired by the classic [Pesticide CSS](https://pesticide.io/) by Adam Morse, enhanced with modern features, TypeScript support, and a clean functional API.

## Related Packages

- [`@allystudio/element-inspector`](https://npmjs.com/package/@allystudio/element-inspector) - Interactive element inspection
- [`@allystudio/focus-order-visualizer`](https://npmjs.com/package/@allystudio/focus-order-visualizer) - Focus order visualization
- [`@allystudio/accessibility-utils`](https://npmjs.com/package/@allystudio/accessibility-utils) - Accessibility utilities
