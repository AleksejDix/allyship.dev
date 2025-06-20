# Focus Order Visualizer Demo

This interactive demo showcases the capabilities of the Focus Order Visualizer library.

## Features

- **Real-time Visualization**: Toggle focus order visualization on/off
- **Dynamic DOM Changes**: Add/remove elements and see the visualization update
- **Multiple Themes**: Choose from different color schemes
- **Configurable Options**: Adjust overlay size and behavior
- **Live Statistics**: Real-time stats about focusable elements
- **Tab Index Examples**: See how different tabindex values affect focus order

## Running the Demo

### Option 1: Simple HTTP Server
```bash
# From the focus-order-visualizer directory
python3 -m http.server 8080
# Then visit: http://localhost:8080/demo/
```

### Option 2: Node.js HTTP Server
```bash
# Install serve globally
npm install -g serve

# From the focus-order-visualizer directory
serve -p 8080
# Then visit: http://localhost:8080/demo/
```

### Option 3: Using Live Server (VS Code)
1. Install the "Live Server" extension in VS Code
2. Right-click on `demo/index.html`
3. Select "Open with Live Server"

## Demo Sections

### 1. Form Elements
- Text inputs, email field, select dropdown, textarea
- Shows typical form focus order patterns

### 2. Navigation Links
- Multiple navigation links demonstrating link focus behavior

### 3. Tab Index Examples
- Buttons with different tabindex values
- Demonstrates how positive tabindex affects focus order
- Shows elements that are not focusable (tabindex="-1")

### 4. Dynamic Content
- Add elements dynamically using the dropdown
- Quick-add buttons for common elements
- Clear all dynamic content
- Real-time visualization updates

## Interactive Controls

- **Start/Stop**: Toggle visualization on/off
- **Refresh**: Manually refresh the visualization
- **Color Schemes**: Blue, Green, Purple, Red themes
- **Overlay Size**: Small (20px) to Extra Large (40px)
- **Include Hidden**: Option to include hidden elements

## Keyboard Shortcuts

- `Ctrl/Cmd + F`: Toggle visualization
- `Ctrl/Cmd + R`: Refresh visualization

## What This Demonstrates

✅ **Dynamic Updates**: How the visualizer handles DOM changes
✅ **Focus Order Logic**: How tabindex affects element ordering
✅ **Real-time Feedback**: Live statistics and visual updates
✅ **Configuration Options**: Different themes and settings
✅ **Edge Cases**: Empty states, hidden elements, etc.

This demo is perfect for:
- Understanding focus order concepts
- Testing accessibility scenarios
- Demonstrating the library's capabilities
- Educational purposes
