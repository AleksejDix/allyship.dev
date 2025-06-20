# Diopter Simulator Demo

A beautiful, interactive demonstration of the diopter simulator using vanilla JavaScript.

## Features

- 🎨 Modern, responsive design
- 👁️ Real-time vision simulation
- ⌨️ Keyboard shortcuts (Ctrl+Space to toggle)
- 📱 Mobile-friendly interface
- 🔧 Developer-friendly console logging

## Running the Demo

1. Build the package:
   ```bash
   yarn build
   ```

2. Start a local server from the package root:
   ```bash
   python3 -m http.server 8080
   ```

3. Open in browser:
   ```
   http://localhost:8080/demo/
   ```

## Usage

- Select vision type (nearsighted, farsighted, normal)
- Choose prescription strength (mild, moderate, severe)
- Toggle simulation on/off
- Experience how vision impairments affect content readability

## Code Example

```javascript
import { createDiopterSimulator } from '../dist/index.js'

const simulator = createDiopterSimulator()

simulator.setAcuityType('nearsighted')
simulator.setPrescriptionStrength('moderate')
simulator.start()
```
