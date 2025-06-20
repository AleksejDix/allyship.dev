# @allystudio/focus-order-visualizer

A lightweight, fast library for visualizing focus order on web pages with numbered overlays and connecting lines. Perfect for accessibility testing and development.

## Features

- 🎯 **Visual Focus Order**: Shows numbered circles on focusable elements
- 🔗 **Connecting Lines**: Solid straight lines showing tab flow
- ⚡ **Real-time Updates**: Responds to DOM changes and scrolling
- 🎨 **Customizable**: Colors, sizes, and visibility options
- ♿ **Accessibility Focused**: Follows HTML tabindex specification
- 🪶 **Lightweight**: Zero dependencies except focusable-selectors
- 📱 **Responsive**: Works with scrollable content and dynamic layouts

## Installation

```bash
npm install @allystudio/focus-order-visualizer
```

## Quick Start

```javascript
import { createFocusOrderVisualizer } from '@allystudio/focus-order-visualizer';

// Create visualizer
const visualizer = createFocusOrderVisualizer();

// Start visualization
visualizer.start();

// Stop visualization
visualizer.stop();

// Toggle visualization
visualizer.toggle();
```

## Configuration

```javascript
const visualizer = createFocusOrderVisualizer({
  includeHidden: false,
  showConnectingLines: true,
  colors: {
    overlay: '#2563eb',
    overlayText: '#ffffff',
    connectingLine: 'rgba(37, 99, 235, 0.3)',
    focusOutline: '#2563eb',
  },
  zIndex: 2147483646,
  overlaySize: 24,
});
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `includeHidden` | `boolean` | `false` | Include hidden focusable elements |
| `showConnectingLines` | `boolean` | `true` | Show lines between elements |
| `colors.overlay` | `string` | `'#2563eb'` | Circle background color |
| `colors.overlayText` | `string` | `'#ffffff'` | Circle text color |
| `colors.connectingLine` | `string` | `'rgba(37, 99, 235, 0.3)'` | Line color |
| `zIndex` | `number` | `2147483646` | Z-index for overlays |
| `overlaySize` | `number` | `24` | Circle size in pixels |

## API Reference

### Methods

#### `start()`
Start the focus order visualization.

#### `stop()`
Stop the visualization and clean up all elements.

#### `toggle()`
Toggle visualization on/off. Returns current state.

#### `isActive()`
Check if visualization is currently active.

#### `getStats()`
Get statistics about focusable elements:

```javascript
const stats = visualizer.getStats();
// {
//   total: 15,
//   positiveTabIndex: 3,
//   actuallyFocusable: 12
// }
```

#### `updateConfig(options)`
Update configuration options:

```javascript
visualizer.updateConfig({
  colors: { overlay: '#10b981' },
  overlaySize: 32
});
```

#### `destroy()`
Completely destroy the visualizer instance.

## Focus Order Rules

The visualizer follows the HTML specification for focus order:

1. **Positive tabindex** (1, 2, 3...) - focused first, in ascending order
2. **Zero tabindex** (0) and naturally focusable elements - focused after positive tabindex
3. **Negative tabindex** (-1) - excluded from tab order

## Browser Support

- Chrome/Edge 88+
- Firefox 87+
- Safari 14+

## Use Cases

- **Accessibility Testing**: Verify focus order matches visual layout
- **Development**: Debug keyboard navigation issues
- **QA**: Validate tabindex implementation
- **Education**: Demonstrate focus flow to designers/stakeholders

## Demo

Check out the [interactive demo](./demo/index.html) for examples of:
- Form elements
- Navigation links
- Custom tabindex values
- Scrollable content
- Dynamic content changes

## License

MIT License - see [LICENSE](./LICENSE) file for details.

## Contributing

Part of the [Allyship.dev](https://github.com/allyship-dev/allyship.dev) accessibility toolkit.

Join us in building the next generation of accessibility testing tools that will make the web accessible for everyone.
