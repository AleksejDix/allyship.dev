# Color Vision Simulator Demo

This demo showcases the `@allystudio/color-vision-simulator` package with an interactive web interface.

## Running the Demo

1. **Build the package first:**
   ```bash
   cd packages/color-vision-simulator
   npm run build
   ```

2. **Start a local server:**
   ```bash
   # Option 1: Using Python (if available)
   python -m http.server 8000

   # Option 2: Using Node.js (if http-server is installed globally)
   npx http-server . -p 8000

   # Option 3: Using any other static file server
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000/demo/`

## Demo Features

### Interactive Controls
- **Vision Type Selection**: Choose between protanopia, deuteranopia, tritanopia, achromatopsia, or normal vision
- **Real-time Toggle**: Start/stop simulation with a button click or spacebar
- **Live Status**: See current simulation state and description

### Visual Tests
- **Color Swatches**: 12 different colors to test color perception
- **Gradient Patterns**: Red-green and blue-yellow transitions
- **Complex Patterns**: Radial and striped color combinations

### Educational Content
- Information about different types of color vision deficiencies
- Prevalence statistics for each condition
- Accessibility best practices for developers

## Keyboard Shortcuts

- **Space**: Toggle simulation on/off
- **Tab**: Navigate through interactive elements

## Technical Details

The demo imports the built simulator from `../dist/index.js` and demonstrates:

- Creating a simulator instance with `createColorVisionSimulator()`
- Using the functional API to control simulation state
- Listening to state changes with `onStateChange()`
- Utilizing utility functions like `formatColorVisionType()` and `getColorVisionDescription()`

## Browser Compatibility

The demo uses modern JavaScript features:
- ES6 modules (`type="module"`)
- CSS Grid and Flexbox
- Modern CSS properties

Supported browsers:
- Chrome 61+
- Firefox 60+
- Safari 11+
- Edge 79+

## Accessibility Features

The demo itself follows accessibility best practices:
- Semantic HTML structure
- Keyboard navigation support
- ARIA labels where appropriate
- High contrast color schemes
- Descriptive text for all interactive elements

This makes it suitable for testing by users with various accessibility needs, including those with color vision deficiencies.
