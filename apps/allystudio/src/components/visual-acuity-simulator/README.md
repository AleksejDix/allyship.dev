# Visual Acuity Simulator

The Visual Acuity Simulator is a tool that allows users to experience websites as they would appear to people with different refractive errors and other common vision impairments. This helps designers and developers create more accessible websites by seeing how content appears to users with varying visual acuity needs.

## Features

- Simulation of refractive errors with adjustable prescription strengths:
  - **Nearsightedness (Myopia)**: Difficulty seeing distant objects clearly
  - **Farsightedness (Hyperopia)**: Difficulty seeing nearby objects clearly
- Prescription strength options:
  - **Mild**: Subtle blurring (-1.0/+1.0 diopters)
  - **Moderate**: Medium blurring (-3.0/+2.0 diopters)
  - **Severe**: Strong blurring (-6.0/+4.0 diopters)
- Additional vision conditions:
  - **Low Vision**: General reduced visual acuity
  - **Cataracts**: Clouded vision with reduced contrast and clarity
- Non-invasive overlay approach that doesn't modify the page's content
- Instant toggling between different simulation modes

## Components and File Structure

The feature is implemented across several files:

### 1. UI Component

**Location**: `/src/components/visual-acuity-simulator/`

- `visual-acuity-simulator.tsx`: The main UI component that provides the toggle button and context menu with options
- `index.ts`: Exports the main component for easier imports

This component appears in the toolbar alongside other visual testing tools.

### 2. Simulation Engine

**Location**: `/src/lib/vision/visual-acuity-simulator.ts`

The core implementation that:

- Defines the visual acuity impairment types
- Manages the simulation state
- Creates and updates the visual overlay
- Applies CSS filters to simulate different vision impairments
- Handles commands from the UI component

### 3. Content Script

**Location**: `/src/contents/visual-acuity-simulator.ts`

A simple Plasmo content script that initializes the simulation engine in the web page.

### 4. Event Definitions

**Location**: `/src/lib/events/types.ts`

Defines the event types used for communication:

- `VISUAL_ACUITY_COMMAND`: Events from the UI to the simulator
- `VISUAL_ACUITY_STATE_CHANGE`: Events from the simulator to the UI

## How It Works

### Technical Implementation

1. **Filter-based Approach**: The simulator uses CSS filters (blur, contrast, brightness) to simulate visual impairments.

2. **Prescription-Based Blur**: The blur intensity is determined by simulated prescription strength, measured in diopters:

   - Negative values (-1.0, -3.0, -6.0) for nearsightedness
   - Positive values (+1.0, +2.0, +4.0) for farsightedness

3. **Event-based Communication**:

   - UI component sends commands like "start", "stop", "setType", and "setStrength"
   - Simulator responds with state change events containing the current simulation state

4. **State Management**:
   - The simulator maintains its state (active/inactive, acuity type, prescription strength)
   - The UI component reflects this state with visual indicators

### Visual Implementation

The simulation techniques are based on approximations of how different vision impairments affect visual perception at a typical arm's length viewing distance:

- **Nearsightedness (Myopia)**: Uses a blur filter to simulate difficulty focusing on distant objects
- **Farsightedness (Hyperopia)**: Uses a blur filter to simulate difficulty focusing on nearby objects
- **Low Vision**: Uses stronger blur and slightly reduced brightness
- **Cataracts**: Uses blur with reduced contrast and brightness to simulate clouded vision

## Usage

1. Click the glasses icon in the toolbar to toggle the simulation on/off
2. Right-click the icon to open a context menu with options:
   - Select a vision type (Nearsightedness, Farsightedness, etc.)
   - For refractive errors, select a prescription strength (Mild, Moderate, Severe)
3. The button border color indicates the currently selected vision impairment type:
   - Purple border: Nearsightedness
   - Blue border: Farsightedness
   - Yellow border: Low Vision
   - Amber border: Cataracts
4. A green dot appears in the corner when the simulation is active

## Integration

The Visual Acuity Simulator is integrated into the main toolbar via:

- `/src/components/space/space.tsx`: Adds the component to the toolbar
- `/src/components/index.ts`: Exports the component for use in other parts of the application

## Technical Notes

- The simulator uses CSS filters for realistic vision impairment simulation
- For performance reasons, the simulator attempts to apply filters directly to the HTML element when supported
- The simulator is initialized in all frames via the `all_frames: true` config in the content script

## Accessibility Considerations

When testing with the Visual Acuity Simulator, consider the following:

- **Text Size and Clarity**: Users with refractive errors often need larger text with clear fonts
- **Contrast**: Higher contrast is essential for users with reduced visual acuity
- **Readability**: Ensure text spacing and layout are optimized for readability
- **Visual Hierarchy**: Strong visual hierarchy helps users with blurred vision navigate content
- **Responsive Design**: Ensure content works well at different zoom levels for users who need magnification
