# @allystudio/element-inspector

**Bring Chrome DevTools' element inspection power directly into your web application.**

A headless, programmable DOM element inspection library that lets you build element selection and analysis features directly into your web apps, browser extensions, or developer tools. Think of it as Chrome DevTools' element inspector, but as a library you can embed anywhere.

## 🤔 What's the Essence?

This library captures the **core functionality** of Chrome DevTools' element inspector and packages it as a reusable, embeddable library. Instead of switching to DevTools to inspect elements, your users can inspect elements directly within your application interface.

### Chrome DevTools vs @allystudio/element-inspector

| Aspect             | Chrome DevTools                    | @allystudio/element-inspector           |
|:-------------------|:-----------------------------------|:----------------------------------------|
| **Environment**    | Separate dev tool window           | Embedded in your app                    |
| **Audience**       | Developers only                    | Any user (developers, designers, QA)   |
| **Customization**  | Fixed UI and behavior              | Fully customizable UI and behavior     |
| **Integration**    | External tool                      | Native part of your app                |
| **Production Use** | Development only                   | Can be used in production              |
| **API Access**     | Limited extension API              | Full programmatic control              |
| **Styling**        | Fixed DevTools theme               | Match your app's design                |
| **Data Access**    | View only                          | Extract and process data               |

## 🎯 Perfect For Building:

- **Accessibility Auditing Tools** - Let users inspect accessibility properties
- **Visual Website Builders** - Enable element selection for editing
- **QA Testing Tools** - Help testers identify elements
- **Design Systems Documentation** - Show component structure
- **Browser Extensions** - Add inspection capabilities
- **Learning Platforms** - Teach HTML/CSS interactively
- **CMS Admin Interfaces** - Visual content editing
- **A11y Training Tools** - Interactive accessibility learning

## Features

- 🔍 **Element Inspection** - Interactive element selection with mouse hover and click
- 🎯 **Deep Inspection** - Find the most specific element at any point
- ✨ **Element Highlighting** - Visual highlighting with customizable styles
- 📊 **Rich Element Info** - Get comprehensive element information including accessibility data
- ⚡ **High Performance** - Optimized with throttling and efficient DOM queries
- 🎛️ **Configurable** - Extensive options for customization
- 🚀 **Headless** - No UI dependencies, bring your own interface
- 🧹 **Clean API** - Simple functional interface with closure-based state management
- 📦 **ESM** - Modern ES modules with TypeScript support

## Installation

```bash
npm install @allystudio/element-inspector
```

## Quick Start

```typescript
import { createElementInspector } from '@allystudio/element-inspector'

// Create inspector instance
const inspector = createElementInspector({
  deepInspection: true,
  debug: true
})

// Listen for events
inspector.on((event) => {
  if (event.type === 'hover') {
    console.log('Hovering over:', event.element?.tagName)
    // Update your UI with element info
    showElementDetails(event.element)
  } else if (event.type === 'select') {
    console.log('Selected element:', event.element?.selector)
    // Process the selected element
    onElementSelected(event.element)
  }
})

// Start inspection (user can now hover/click elements)
inspector.start()

// Your users press Escape or you stop programmatically
// inspector.stop()
```

## 🚀 Real-World Example: Accessibility Auditor

```typescript
// Build an accessibility inspector like in AllyStudio
const a11yInspector = createElementInspector({
  deepInspection: true
})

a11yInspector.on((event) => {
  if (event.type === 'select') {
    const element = event.element

    // Get accessibility info
    const a11yInfo = getAccessibilityInfo(element.element)

    // Show in your UI
    displayAccessibilityReport({
      selector: element.selector,
      role: a11yInfo.role,
      ariaLabel: a11yInfo.ariaLabel,
      focusable: a11yInfo.focusable,
      // ... more a11y data
    })
  }
})

// Button in your app starts inspection
document.getElementById('start-a11y-check').onclick = () => {
  a11yInspector.start()
}
```

## API Reference

### `createElementInspector(options?): ElementInspector`

Creates a new element inspector instance.

#### Options

```typescript
interface InspectorOptions {
  /** Enable deep inspection mode (find smallest element at point) */
  deepInspection?: boolean

  /** Minimum element size to consider (pixels) */
  minElementSize?: number

  /** CSS selectors to exclude from inspection */
  excludeSelectors?: string[]

  /** Enable debug logging */
  debug?: boolean

  /** Throttle mouse events (ms, 0 to disable) */
  throttle?: number
}
```

### Inspector API

The inspector instance returned by `createElementInspector()` provides the following methods:

#### Methods

```typescript
// Control inspection
inspector.start()           // Start inspection mode
inspector.stop()            // Stop inspection mode
inspector.toggle()          // Toggle inspection state
inspector.isInspecting()    // Check if currently inspecting

// Event handling
const unsubscribe = inspector.on(handler)  // Add event listener
inspector.off(handler)                     // Remove event listener

// Element operations
const info = inspector.inspectAt(x, y)     // Get element at coordinates
const info = inspector.getElementInfo(el)  // Get element information
inspector.highlight(element, options)      // Highlight element
inspector.clearHighlights()                // Clear all highlights

// Configuration
inspector.setOptions(options)              // Update options
const state = inspector.getState()         // Get current state
inspector.destroy()                        // Cleanup and destroy
```

#### Events

```typescript
interface InspectorEvent {
  type: 'hover' | 'select' | 'start' | 'stop'
  element?: ElementInfo        // Element information (for hover/select)
  timestamp: number           // Event timestamp
  coordinates?: { x: number; y: number }  // Mouse coordinates
}
```

### `ElementInfo`

Comprehensive element information:

```typescript
interface ElementInfo {
  element: HTMLElement           // The DOM element
  selector: string              // CSS selector
  xpath?: string               // XPath selector
  tagName: string              // Element tag name
  textContent: string          // Element text content
  attributes: Record<string, string>  // All attributes
  rect: DOMRect                // Bounding rectangle
  computedStyles?: CSSStyleDeclaration  // Computed styles
}
```

### Highlighting

```typescript
// Basic highlighting
inspector.highlight(element)

// Custom highlight style
inspector.highlight(element, {
  style: {
    borderColor: '#ff0000',
    borderWidth: 3,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderStyle: 'dashed'
  },
  showTooltip: true,
  tooltipContent: 'Selected Element'
})
```

### Utility Functions

The package also exports useful utility functions:

```typescript
import {
  generateSelector,
  generateXPath,
  findElementByXPath,
  findDeepestElementAtPoint,
  isElementVisible,
  getAccessibilityInfo
} from '@allystudio/element-inspector'

// Generate CSS selector for element
const selector = generateSelector(element)

// Generate XPath for element
const xpath = generateXPath(element)

// Find element by XPath
const element = findElementByXPath('//div[@id="content"]')

// Get accessibility information
const a11yInfo = getAccessibilityInfo(element)
// Returns: { role, ariaLabel, tabIndex, focusable, ... }
```

## 🧠 Core Concept: Headless Inspection

### What "Headless" Means

Unlike Chrome DevTools which provides a **complete UI**, this library provides **only the inspection logic**. You bring your own UI:

```typescript
const inspector = createElementInspector()

inspector.on((event) => {
  if (event.type === 'hover') {
    // YOU decide how to show element info
    // Could be a tooltip, sidebar, modal, anything...
    yourCustomTooltip.show(event.element.selector)
  }
})
```

### The Power of Programmable Inspection

**Chrome DevTools** gives you a fixed experience:
- Fixed highlight style (blue border)
- Fixed information panel
- Fixed interaction patterns
- Development-only environment

**@allystudio/element-inspector** gives you building blocks:
- Custom highlight styles and animations
- Extract any element data you want
- Integrate with your app's design system
- Use in production for real users
- Combine with other tools and workflows

### Real Use Cases in Production

1. **Figma-style Visual Editors**: Users click elements to edit them
2. **Accessibility Auditing Apps**: Users inspect elements to see a11y issues
3. **QA Testing Tools**: Testers can identify elements for bug reports
4. **CMS Visual Editors**: Content creators select elements to modify
5. **Learning Platforms**: Students explore HTML structure interactively

## Advanced Usage

### Custom Event Handling

```typescript
const inspector = createElementInspector()

inspector.on((event) => {
  switch (event.type) {
    case 'start':
      console.log('Inspection started')
      break

    case 'hover':
      // Update UI with element info
      updateElementPanel(event.element)
      break

    case 'select':
      // Handle element selection
      onElementSelected(event.element)
      inspector.stop() // Stop after selection
      break

    case 'stop':
      console.log('Inspection stopped')
      break
  }
})
```

### Deep Inspection Mode

Deep inspection finds the most specific element at any point:

```typescript
const inspector = createElementInspector({
  deepInspection: true,
  minElementSize: 1 // Allow very small elements
})

// Will find the innermost element, even if it's small
inspector.start()
```

### Performance Optimization

```typescript
const inspector = createElementInspector({
  throttle: 32,  // 30fps throttling
  excludeSelectors: [
    '.tooltip',
    '.popover',
    '[data-testid="ignore"]'
  ]
})
```

### Integration with Frameworks

#### React Hook Example

```typescript
import { useEffect, useRef } from 'react'
import { createElementInspector } from '@allystudio/element-inspector'

function useElementInspector(options = {}) {
  const inspectorRef = useRef()

  useEffect(() => {
    inspectorRef.current = createElementInspector(options)

    return () => {
      inspectorRef.current?.destroy()
    }
  }, [])

  return inspectorRef.current
}

// Usage in component
function MyComponent() {
  const inspector = useElementInspector({ deepInspection: true })

  const handleStartInspection = () => {
    inspector?.start()
  }

  return <button onClick={handleStartInspection}>Start Inspection</button>
}
```

#### Vue Composable Example

```typescript
import { ref, onUnmounted } from 'vue'
import { createElementInspector } from '@allystudio/element-inspector'

export function useElementInspector(options = {}) {
  const inspector = createElementInspector(options)
  const isInspecting = ref(false)

  inspector.on((event) => {
    if (event.type === 'start') isInspecting.value = true
    if (event.type === 'stop') isInspecting.value = false
  })

  onUnmounted(() => {
    inspector.destroy()
  })

  return {
    inspector,
    isInspecting,
    start: () => inspector.start(),
    stop: () => inspector.stop(),
    toggle: () => inspector.toggle()
  }
}
```

## 🔧 Technical Architecture

### How Chrome DevTools Works
1. **Separate process** from your web page
2. **Communication via CDP** (Chrome DevTools Protocol)
3. **Fixed UI** in DevTools window
4. **Read-only inspection** for debugging

### How @allystudio/element-inspector Works
1. **Runs in your page's context** (same process)
2. **Direct DOM access** and manipulation
3. **Event-driven API** for your custom UI
4. **Read-write capabilities** for building tools

```typescript
// Direct access to elements in your page
inspector.on((event) => {
  // You get the actual HTMLElement reference
  const element = event.element.element

  // You can modify, analyze, or extract data
  element.style.backgroundColor = 'yellow'
  const computedStyles = getComputedStyle(element)
  const accessibility = getAccessibilityInfo(element)
})
```

### Performance Comparison

| Feature             | Chrome DevTools              | @allystudio/element-inspector    |
|:-------------------|:-----------------------------|:---------------------------------|
| **Startup**        | Heavy (separate process)     | Lightweight (in-page)           |
| **Memory**         | High (full DevTools)        | Low (just inspection)            |
| **Latency**        | IPC overhead                 | Direct DOM access                |
| **Customization**  | None                         | Full control                     |

## Browser Support

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browser with support for:
- ES2022 features
- Pointer Events API
- CSS `elementsFromPoint()`

## TypeScript

Full TypeScript support included. All types are exported:

```typescript
import type {
  InspectorOptions,
  InspectorEvent,
  ElementInfo,
  HighlightOptions
} from '@allystudio/element-inspector'
```

## Contributing

This package is part of the [@allystudio](https://github.com/allyship-dev) monorepo. See the main repository for contribution guidelines.

## License

MIT © Allyship.dev
