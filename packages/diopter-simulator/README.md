# Diopter Simulator

A JavaScript library for simulating visual impairments caused by refractive errors (nearsightedness, farsightedness) by applying realistic blur effects to web elements.

## Features

- 🔬 **Scientific Accuracy**: Real diopter calculations with viewing distance effects
- ⚡ **High Performance**: CSS filter-based blur rendering
- 🧹 **Clean API**: Simple functional interface with closure-based state
- 📱 **Viewing Distance**: Realistic simulation for different devices (phone, laptop, TV)
- 🧪 **Well Tested**: Comprehensive test suite with 94%+ coverage
- 📦 **Zero Dependencies**: Lightweight and self-contained

## Installation

```bash
npm install @allystudio/diopter-simulator
```

## Quick Start

```javascript
import { createDiopterSimulator } from '@allystudio/diopter-simulator'

const simulator = createDiopterSimulator()

// Simulate -3.0 diopters (moderate myopia) at laptop distance
simulator.configure(-3.0, 0.6)
simulator.applyToElement(document.body)

// Remove simulation
simulator.reset()
```

## API

### `createDiopterSimulator()`

Creates a new simulator instance.

```javascript
const simulator = createDiopterSimulator()
```

### Configuration Methods

#### `setDiopters(value: number)`
Set diopter strength (-8 to +8 range):
- **Negative values**: Myopia (nearsightedness) - distant objects blurry
- **Positive values**: Hyperopia (farsightedness) - close objects blurry
- **Zero**: No refractive error

#### `setViewingDistance(meters: number)`
Set viewing distance in meters (0.2 to 4.0 range):
- **0.3m**: Phone/tablet distance
- **0.6m**: Laptop/desktop distance
- **2.0m**: TV viewing distance

#### `configure(diopters: number, viewingDistance: number)`
Set both values at once.

### Simulation Methods

#### `applyToElement(element: HTMLElement)`
Apply blur effect to specified element and all children.

#### `applyToPage()`
Apply blur effect to entire page (document.body).

#### `reset()`
Remove all blur effects and reset state.

### State Methods

#### `isActive(): boolean`
Check if simulation is currently active.

#### `getCurrentConfig()`
Get current diopter and viewing distance values.

## Presets

### Diopter Presets
```javascript
import { DIOPTER_PRESETS } from '@allystudio/diopter-simulator'

// Common prescription strengths
DIOPTER_PRESETS.MILD_MYOPIA        // -1.5
DIOPTER_PRESETS.MODERATE_MYOPIA    // -3.0
DIOPTER_PRESETS.SEVERE_MYOPIA      // -6.0
DIOPTER_PRESETS.MILD_HYPEROPIA     // +1.5
DIOPTER_PRESETS.MODERATE_HYPEROPIA // +3.0
```

### Viewing Distance Presets
```javascript
import { VIEWING_DISTANCE_PRESETS } from '@allystudio/diopter-simulator'

VIEWING_DISTANCE_PRESETS.PHONE   // 0.3m
VIEWING_DISTANCE_PRESETS.LAPTOP  // 0.6m
VIEWING_DISTANCE_PRESETS.DESKTOP // 0.7m
VIEWING_DISTANCE_PRESETS.TV      // 2.0m
```

## Examples

### Testing Mobile App Accessibility
```javascript
const simulator = createDiopterSimulator()

// Simulate user with -4D prescription using phone
simulator.configure(DIOPTER_PRESETS.MODERATE_MYOPIA, VIEWING_DISTANCE_PRESETS.PHONE)
simulator.applyToPage()

// Test if UI is still usable with blur
// Reset when done
simulator.reset()
```

### Progressive Testing
```javascript
const simulator = createDiopterSimulator()

// Test multiple prescription strengths
const testCases = [
  { diopters: -1.5, distance: 0.6, label: 'Mild myopia at laptop' },
  { diopters: -3.0, distance: 0.6, label: 'Moderate myopia at laptop' },
  { diopters: +2.0, distance: 0.3, label: 'Hyperopia reading phone' }
]

testCases.forEach(test => {
  simulator.configure(test.diopters, test.distance)
  simulator.applyToPage()
  console.log(`Testing: ${test.label}`)
  // Perform your accessibility tests here
  simulator.reset()
})
```

### Dynamic Simulation
```javascript
const simulator = createDiopterSimulator()

// Create interactive controls
const diopterSlider = document.getElementById('diopter-slider')
const distanceSlider = document.getElementById('distance-slider')

function updateSimulation() {
  const diopters = parseFloat(diopterSlider.value)
  const distance = parseFloat(distanceSlider.value)

  simulator.configure(diopters, distance)
  simulator.applyToPage()
}

diopterSlider.addEventListener('input', updateSimulation)
distanceSlider.addEventListener('input', updateSimulation)
```

## Understanding Diopters

- **-1.5D**: Mild myopia - slight blur at distance
- **-3.0D**: Moderate myopia - significant blur beyond arm's length
- **-6.0D**: Severe myopia - only close objects are clear
- **+1.5D**: Mild hyperopia - slight difficulty with close work
- **+3.0D**: Moderate hyperopia - reading and close tasks affected

## Viewing Distance Impact

The same prescription affects vision differently at various distances:

- **Myopia**: More blur at greater distances (TV > laptop > phone)
- **Hyperopia**: More consistent blur, slightly worse up close

## Browser Support

- Modern browsers with CSS filter support
- Chrome 53+, Firefox 35+, Safari 9.1+, Edge 12+

## License

MIT License - see LICENSE file for details.
