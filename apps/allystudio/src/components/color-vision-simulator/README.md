# Color Vision Simulator

The Color Vision Simulator is a tool that allows users to experience websites as they would appear to people with various types of color vision deficiencies (color blindness). This helps designers and developers create more accessible websites by identifying potential issues with color contrast and information conveyed through color alone.

## Features

- Simulation of multiple color vision deficiency types:
  - **Protanopia** (red-blindness)
  - **Deuteranopia** (green-blindness)
  - **Tritanopia** (blue-blindness)
  - **Achromatopsia** (total color blindness/grayscale)
- Non-invasive overlay approach that doesn't modify the page's content
- Instant toggling between different simulation modes
- Includes prevalence information for each deficiency type

## About Color Vision Deficiencies

The simulator focuses on complete color vision deficiencies (the "-opia" types), where specific types of color cone cells are entirely missing from the retina:

- **Protanopia**: Complete absence of red-sensitive cones (common in males, rare in females)
- **Deuteranopia**: Complete absence of green-sensitive cones (common in males, rare in females)
- **Tritanopia**: Complete absence of blue-sensitive cones (very rare)
- **Achromatopsia**: Complete absence of all color cone cells (extremely rare)

Note that partial deficiencies (the "-omaly" types) where cone cells function abnormally are more common but less severe than the complete deficiencies we simulate.

## Components and File Structure

The feature is implemented across several files:

### 1. UI Component

**Location**: `/src/components/color-vision-simulator/`

- `color-vision-simulator.tsx`: The main UI component that provides the toggle button and context menu with options
- `index.ts`: Exports the main component for easier imports

This component appears in the toolbar alongside other visual testing tools.

### 2. Simulation Engine

**Location**: `/src/lib/vision/color-vision-simulator.ts`

The core implementation that:

- Defines the color vision deficiency types
- Manages the simulation state
- Creates and updates the visual overlay
- Applies CSS filters to simulate different vision types
- Handles commands from the UI component

### 3. Content Script

**Location**: `/src/contents/color-vision-simulator.ts`

A simple Plasmo content script that initializes the simulation engine in the web page.

### 4. Event Definitions

**Location**: `/src/lib/events/types.ts`

Defines the event types used for communication:

- `VISION_SIMULATOR_COMMAND`: Events from the UI to the simulator
- `VISION_SIMULATOR_STATE_CHANGE`: Events from the simulator to the UI

## How It Works

### Technical Implementation

1. **Filter-based Approach**: The simulation uses CSS filter matrices to transform colors as they would appear to someone with color vision deficiency.

2. **Overlay Method**: Instead of modifying page content directly, the simulator adds an overlay that applies the filter to the entire viewport.

3. **Event-based Communication**:

   - UI component sends commands like "start", "stop", and "setType"
   - Simulator responds with state change events containing the current simulation state

4. **State Management**:
   - The simulator maintains its state (active/inactive, vision type)
   - The UI component reflects this state with visual indicators

### Visual Implementation

The color matrices used in the CSS filters are based on research-backed transformations that accurately simulate how colors appear to people with different types of color vision deficiencies:

- **Protanopia**: Affects red-green perception, with reduced sensitivity to red light (common in males, rare in females)
- **Deuteranopia**: Affects red-green perception, with reduced sensitivity to green light (common in males, rare in females)
- **Tritanopia**: Affects blue-yellow perception (very rare)
- **Achromatopsia**: Complete absence of color vision/grayscale (extremely rare)

## Usage

1. Click the eye icon in the toolbar to toggle the simulation on/off
2. Right-click the icon to open a context menu with options:
   - Select a different vision type (includes prevalence information)
3. The button border color indicates the currently selected vision type:
   - Red border: Protanopia
   - Green border: Deuteranopia
   - Blue border: Tritanopia
   - Gray border: Achromatopsia
4. A green dot appears in the corner when the simulation is active

## Integration

The Color Vision Simulator is integrated into the main toolbar via:

- `/src/components/space/space.tsx`: Adds the component to the toolbar
- `/src/components/index.ts`: Exports the component for use in other parts of the application

## Technical Notes

- The simulator uses the SVG filter technique with feColorMatrix for accurate color transformation
- For performance reasons, the simulator attempts to apply filters directly to the HTML element when supported
- The simulator is initialized in all frames via the `all_frames: true` config in the content script
