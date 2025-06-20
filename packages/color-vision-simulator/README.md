# @allystudio/color-vision-simulator

A JavaScript library for simulating color vision deficiencies (color blindness) on web pages. Useful for accessibility testing, design validation, and educational purposes.

## Features

- 🎨 **Multiple Color Vision Types**: Protanopia, Deuteranopia, Tritanopia, Achromatopsia
- ⚡ **High Performance**: Direct HTML filter application with overlay fallback
- 🔧 **Configurable**: Customizable overlay IDs, z-index, and behavior
- 📱 **Event-Driven**: Subscribe to state changes with callback system
- 🧹 **Clean API**: Simple functional interface with closure-based state management
- 🧪 **Well Tested**: Comprehensive test suite with browser testing
- 📦 **Zero Dependencies**: Lightweight and self-contained

## Installation

```bash
npm install @allystudio/color-vision-simulator
```

## Quick Start

```typescript
import { createColorVisionSimulator, COLOR_VISION_PRESETS } from '@allystudio/color-vision-simulator'

// Create a simulator instance
const simulator = createColorVisionSimulator()

// Start simulating protanopia (red-blindness)
simulator.start()

// Change to deuteranopia (green-blindness)
simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA)

// Stop simulation
simulator.stop()
```

## API Reference

### createColorVisionSimulator

#### Factory Function

```typescript
createColorVisionSimulator(options?: SimulatorOptions): ColorVisionSimulator
```

#### Options

```typescript
interface SimulatorOptions {
  overlayId?: string          // Custom overlay ID (default: "color-vision-simulator-overlay")
  stylesId?: string           // Custom styles ID (default: "color-vision-simulator-styles")
  zIndex?: number             // Custom z-index (default: 2147483647)
  useDirectFilter?: boolean   // Use direct HTML filter (default: true)
}
```

#### Methods

##### State Management

```typescript
// Start the simulation
simulator.start(): void

// Stop the simulation
simulator.stop(): void

// Toggle simulation on/off
simulator.toggle(): void

// Set vision type
simulator.setVisionType(type: ColorVisionType): void

// Configure both vision type and active state
simulator.configure(visionType: ColorVisionType, isActive: boolean): void
```

##### State Queries

```typescript
// Get current state
simulator.getState(): SimulatorState

// Check if active
simulator.isActive(): boolean

// Get current vision type
simulator.getVisionType(): ColorVisionType
```

##### Event Handling

```typescript
// Subscribe to state changes
const unsubscribe = simulator.onStateChange((state) => {
  console.log('State changed:', state)
})

// Unsubscribe
unsubscribe()
```

### Vision Types

```typescript
type ColorVisionType = 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia' | 'normal'

// Presets for convenience
const COLOR_VISION_PRESETS = {
  PROTANOPIA: 'protanopia' as const,      // Red-blindness
  DEUTERANOPIA: 'deuteranopia' as const,  // Green-blindness
  TRITANOPIA: 'tritanopia' as const,      // Blue-blindness
  ACHROMATOPSIA: 'achromatopsia' as const, // Total color blindness
  NORMAL: 'normal' as const               // Normal vision (no simulation)
}
```

### Utility Functions

```typescript
import {
  createColorVisionSimulator,
  formatColorVisionType,
  getColorVisionDescription
} from '@allystudio/color-vision-simulator'

// Create a new instance
const simulator = createColorVisionSimulator(options)

// Format vision type for display
const displayName = formatColorVisionType('protanopia') // "Protanopia"

// Get description of vision type
const description = getColorVisionDescription('protanopia')
// "Difficulty distinguishing between red and green colors, with red appearing darker"
```

## Examples

### Basic Usage

```typescript
import { createColorVisionSimulator, COLOR_VISION_PRESETS } from '@allystudio/color-vision-simulator'

const simulator = createColorVisionSimulator()

// Simulate protanopia
simulator.setVisionType(COLOR_VISION_PRESETS.PROTANOPIA)
simulator.start()

// Later...
simulator.stop()
```

### With State Change Monitoring

```typescript
const simulator = createColorVisionSimulator()

// Monitor state changes
simulator.onStateChange((state) => {
  console.log(`Simulation ${state.isActive ? 'started' : 'stopped'}`)
  console.log(`Vision type: ${state.visionType}`)
})

simulator.start()
simulator.setVisionType(COLOR_VISION_PRESETS.DEUTERANOPIA)
simulator.stop()
```

### Custom Configuration

```typescript
const simulator = createColorVisionSimulator({
  overlayId: 'my-color-overlay',
  stylesId: 'my-color-styles',
  zIndex: 999999,
  useDirectFilter: false  // Disable direct HTML filtering
})
```

### Using Utility Functions

```typescript
import { formatColorVisionType, getColorVisionDescription } from '@allystudio/color-vision-simulator'

// Format for UI display
const displayName = formatColorVisionType('protanopia') // "Protanopia"

// Get user-friendly description
const description = getColorVisionDescription('deuteranopia')
// "Difficulty distinguishing between red and green colors, with green appearing darker"

// Use in UI components
function VisionTypeSelector({ currentType, onChange }) {
  const types = ['protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia', 'normal']

  return (
    <select value={currentType} onChange={(e) => onChange(e.target.value)}>
      {types.map(type => (
        <option key={type} value={type}>
          {formatColorVisionType(type)}
        </option>
      ))}
    </select>
  )
}
```

### React Integration

```tsx
import { useEffect, useState } from 'react'
import {
  createColorVisionSimulator,
  COLOR_VISION_PRESETS,
  formatColorVisionType,
  type ColorVisionType
} from '@allystudio/color-vision-simulator'

function ColorVisionControls() {
  const [simulator] = useState(() => createColorVisionSimulator())
  const [isActive, setIsActive] = useState(false)
  const [visionType, setVisionType] = useState<ColorVisionType>('protanopia')

  useEffect(() => {
    const unsubscribe = simulator.onStateChange((state) => {
      setIsActive(state.isActive)
      setVisionType(state.visionType)
    })

    return unsubscribe
  }, [simulator])

  const visionTypes: ColorVisionType[] = [
    'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia', 'normal'
  ]

  return (
    <div>
      <button onClick={() => simulator.toggle()}>
        {isActive ? 'Stop' : 'Start'} Simulation
      </button>

      <select
        value={visionType}
        onChange={(e) => simulator.setVisionType(e.target.value as ColorVisionType)}
      >
        {visionTypes.map(type => (
          <option key={type} value={type}>
            {formatColorVisionType(type)}
          </option>
        ))}
      </select>
    </div>
  )
}
```

## How It Works

The simulator uses CSS filters to modify the visual appearance of web pages:

1. **Color Matrix Filters**: For protanopia, deuteranopia, and tritanopia, scientifically accurate color transformation matrices are applied
2. **Grayscale Filter**: For achromatopsia (total color blindness)
3. **Direct HTML Filtering**: For better performance, filters are applied directly to the `<html>` element when possible
4. **Overlay Fallback**: When direct filtering isn't suitable, a full-screen overlay with the filter is used

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to our repository.

## License

MIT License - see LICENSE file for details.

## Related Packages

- `@allystudio/accessibility-utils` - Accessibility analysis utilities
- `@allystudio/element-inspector` - DOM element inspection tools
