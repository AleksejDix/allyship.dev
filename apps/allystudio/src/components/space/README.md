# Space Component

## Overview

The Space component is the top-level container in the Allyship Studio application's component hierarchy. It manages spaces, which are the highest-level organizational unit in the application, containing websites and their associated pages. The component uses XState for state management and React Context for sharing state with child components.

## Architecture

The Space component sits at the top of the component hierarchy:

```
Space → Website → Page
```

All websites and pages exist within the context of a Space.

### Key Files

- `space.tsx`: Root component that sets up the context provider and renders child components based on state
- `space-context.tsx`: Context provider and hooks for accessing the space state
- `space-machine.ts`: XState machine that manages space state and side effects
- `space-options.tsx`: Displays space selection options and management UI
- `space-selected.tsx`: Displays the selected space and its content
- `space-empty.tsx`: Empty state when no spaces exist
- `space-debug.tsx`: Development tool for debugging space state
- `space-options-dropdown.tsx`: Dropdown menu for space actions

## State Management

The Space component uses XState for state management with the following key states:

- `loading`: Initial state while loading spaces from the database
- `error`: Error state when loading fails
- `empty`: When no spaces exist in the system
- `loaded`: When spaces have been successfully loaded
  - `idle`: Spaces loaded but none selected
  - `selected`: A specific space is selected

### Events

- `REFRESH`: Refresh the list of spaces
- `SPACE_SELECTED`: Select a specific space
- `SPACE_ADDED`: A new space has been added

## Usage

The Space component is designed to be used as a wrapper for the Website and Page components:

```tsx
<SpaceProvider>
  <WebsiteProvider spaceId={spaceId}>
    <PageProvider websiteId={websiteId}>
      {/* Application content */}
    </PageProvider>
  </WebsiteProvider>
</SpaceProvider>
```

### Accessing Space State

```tsx
import { useSpaceContext } from "./space-context"

function SpaceComponent() {
  const spaceActor = useSpaceContext()
  const spaceState = useSelector(spaceActor, (state) => state)

  // Use space state...
}
```

## Data Flow

1. The Space component loads spaces from the database
2. The user selects a space, triggering a state change
3. The Website component uses the selected space's ID to load associated websites
4. The Page component uses the selected website's ID to load associated pages

## Additional Features

In addition to the core space management, the Space component renders accessibility tools including:

- Element Inspector
- Element Outliner
- Focus Order Visualizer
- DOM Monitor Toggle
- Application Header

These tools are available across the entire application regardless of the current space.

## Best Practices

1. Always access space state through the context hooks
2. Handle loading and error states appropriately
3. Use the debug component during development to inspect state
4. Follow the event-based pattern for state transitions

## Accessibility

The Space component implements accessibility best practices:

- Proper ARIA attributes for dynamic content
- Loading indicators with appropriate ARIA roles
- Error messages with role="alert"
- Accessibility inspection tools for development

## Related Components

- `Website`: Child component that uses space context to load websites
- `Page`: Grandchild component that relies on website context
- Accessibility tools for inspecting and enhancing accessibility
