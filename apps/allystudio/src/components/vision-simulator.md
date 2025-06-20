# Vision Simulator

A unified vision simulation component that combines color vision and visual acuity simulation in a single, intuitive interface. The simulators run on the actual web page via content scripts, not in the extension context.

## Key Innovations

### Unified Interface
- **Single component** instead of separate color vision + visual acuity simulators
- **Content script execution** - simulators run on the actual web page using published packages
- **Message-based communication** - UI sends commands to content script via Chrome extension messaging

### Simplified UX
- **Quick presets** for common vision conditions
- **Real-time sliders** for diopter strength and viewing distance
- **Visual feedback** with color-coded button states
- **Contextual controls** - distance matters for blur simulation

### Minimal Code
- **180 lines** UI component + **60 lines** content script vs 500+ lines in the old approach
- **No enums or complex types** - simple string literals
- **No event bus complexity** - direct Chrome messaging API
- **Direct package usage** - content script uses published packages directly

## Architecture

```
Extension UI Component (vision-simulator.tsx)
    ↓ chrome.tabs.sendMessage()
Content Script (vision-simulator.ts)
    ↓ direct function calls
Published Packages (@allystudio/color-vision-simulator, @allystudio/diopter-simulator)
    ↓ DOM manipulation
Web Page (actual vision simulation)
```

## Usage

```tsx
import { VisionSimulator } from "@/components/vision-simulator"

<VisionSimulator />
```

The component provides:
- Color vision simulation (protanopia, deuteranopia, tritanopia, achromatopsia)
- Diopter-based blur simulation (-5D to +5D)
- Viewing distance adjustment (20cm to 3m)
- Quick presets for common conditions
- Real-time toggle and reset functionality

## Technical Implementation

### UI Component (`vision-simulator.tsx`)
- React state management with `useState`
- Chrome extension messaging via `chrome.tabs.sendMessage()`
- Popover interface for compact toolbar integration
- Real-time settings synchronization

### Content Script (`vision-simulator.ts`)
- Uses `createColorVisionSimulator()` and `createDiopterSimulator()` from published packages
- Listens for messages via `chrome.runtime.onMessage`
- Applies simulations directly to the web page DOM
- Automatic cleanup on page unload

### Message Protocol
```typescript
// Color vision change
{
  type: "VISION_SIMULATOR",
  action: "SET_COLOR_VISION",
  data: { visionType: "protanopia" }
}

// Diopter blur change
{
  type: "VISION_SIMULATOR",
  action: "SET_DIOPTER",
  data: { diopters: -2, distance: 0.6 }
}

// Stop all simulations
{
  type: "VISION_SIMULATOR",
  action: "STOP_ALL",
  data: {}
}
```

## Benefits

1. **Correct execution context** - simulators run on the actual web page, not in extension UI
2. **Simpler maintenance** - single component + content script vs multiple files
3. **Better UX** - unified controls, quick presets, real-time feedback
4. **Scientific accuracy** - uses published, tested simulation algorithms
5. **Minimal bundle impact** - leverages optimized published packages
6. **Type safety** - direct TypeScript integration with packages
7. **Proper isolation** - UI logic separate from simulation logic
