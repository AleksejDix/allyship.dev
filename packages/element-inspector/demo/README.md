# Element Inspector Demo

A vanilla JavaScript demonstration of the `@allystudio/element-inspector` functionality.

## 🚀 Quick Start

1. **Open the demo**:
   ```bash
   # From the element-inspector package directory
   open demo/index.html
   # or
   python -m http.server 8000
   # then visit http://localhost:8000/demo/
   ```

2. **Try the features**:
   - Click "Start Inspection" to begin
   - Hover over elements to see them highlighted
   - Click on elements to select them
   - Press `Escape` to stop inspection
   - Toggle deep inspection mode
   - Clear highlights and event log

## 🎯 What You'll See

### Interactive Features

- **Form Elements** - Inspect inputs, selects, and labels with accessibility attributes
- **Interactive Cards** - Hover and click on styled components
- **Nested Elements** - Test deep inspection with complex DOM structures
- **Real-time Info Panel** - See element details as you hover
- **Event Log** - Track all inspection events in real-time

### Demo Capabilities

- ✨ **Element Highlighting** - Visual feedback with customizable styles
- 🔍 **Deep Inspection** - Toggle between surface and deep element detection
- 📊 **Element Information** - Tag names, selectors, attributes, dimensions
- ⚡ **Performance** - Throttled events for smooth interaction
- ♿ **Accessibility** - Proper ARIA labels and keyboard navigation
- 📱 **Responsive** - Works on desktop and mobile devices

## 🛠️ Technical Implementation

This demo includes a simplified version of the element inspector that demonstrates:

### Core Features
```javascript
// Start/stop inspection
inspector.start()
inspector.stop()
inspector.toggle()

// Event handling
inspector.on((event) => {
  switch (event.type) {
    case 'hover': // Mouse over element
    case 'select': // Click on element
    case 'start': // Inspection started
    case 'stop': // Inspection stopped
  }
})

// Element highlighting
inspector.highlight(element, options)
inspector.clearHighlights()
```

### Element Information
```javascript
{
  element: HTMLElement,     // The actual DOM element
  tagName: 'div',          // Element tag name
  selector: '#my-id',      // Generated CSS selector
  textContent: 'Hello',    // Element text content
  attributes: {            // All element attributes
    'id': 'my-id',
    'class': 'my-class'
  },
  rect: {                  // Element dimensions
    x: 100, y: 200,
    width: 300, height: 50
  }
}
```

### Configuration Options
```javascript
const inspector = new DemoElementInspector({
  deepInspection: false,        // Find deepest element at point
  debug: true,                  // Enable console logging
  throttle: 16,                // Mouse event throttling (ms)
  excludeSelectors: ['.ignore'] // Elements to skip
})
```

## 🎨 Styling

The demo includes custom CSS for:
- **Highlight overlays** - Blue border with semi-transparent background
- **Inspection cursor** - Crosshair cursor during inspection
- **Responsive layout** - Grid layout that adapts to screen size
- **Interactive feedback** - Hover effects and transitions

## 🔧 Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- `document.elementsFromPoint()`
- Pointer Events API

## 💡 Usage Ideas

This demo shows how you could build:

1. **Accessibility Auditing Tools** - Inspect elements for a11y issues
2. **Visual Page Builders** - Let users select elements to edit
3. **QA Testing Tools** - Help testers identify elements for bug reports
4. **Learning Platforms** - Interactive HTML/CSS education
5. **Design Systems** - Document component structure
6. **Browser Extensions** - Add inspection to any website

## 🚀 Next Steps

To use the real `@allystudio/element-inspector` package:

```bash
npm install @allystudio/element-inspector
```

```javascript
import { createElementInspector } from '@allystudio/element-inspector'

const inspector = createElementInspector({
  deepInspection: true,
  debug: false
})

inspector.on((event) => {
  // Handle inspection events
})

inspector.start()
```

The real package includes additional features like:
- XPath selector generation
- Computed styles extraction
- Advanced element filtering
- TypeScript support
- Comprehensive test suite
- Performance optimizations
