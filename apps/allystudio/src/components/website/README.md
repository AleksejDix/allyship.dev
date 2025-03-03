# Website Component

## Overview

The Website component manages websites within a space in the Allyship Studio application. It sits between the Space and Page components in the component hierarchy, providing context for loading and managing websites. The component uses XState for state management and React Context for sharing state with child components.

## Architecture

The Website component is in the middle of the component hierarchy:

```
Space → Website → Page
```

Websites exist within a Space and contain Pages.

### Key Files

- `website.tsx`: Root component that sets up the context provider and renders child components based on state
- `website-context.tsx`: Context provider and hooks for accessing the website state
- `website-machine.ts`: XState machine that manages website state and side effects
- `website-add.tsx`: Form for adding new websites
- `website-selected.tsx`: Displays the selected website and its content
- `website-empty.tsx`: Empty state when no websites exist
- `website-debug.tsx`: Development tool for debugging website state
- `website-options.tsx`: Displays website selection options and management UI

## State Management

The Website component uses XState for state management with the following key states:

- `idle`: Initial state before any loading occurs
- `loading`: Loading websites from the database
- `error`: Error state when loading fails
- `empty`: When no websites exist for the space
- `loaded`: When websites have been successfully loaded
- `selected`: When a specific website is selected
- `adding`: When a new website is being added

### Events

- `REFRESH`: Refresh the list of websites
- `SPACE_CHANGED`: When the parent space changes
- `WEBSITE_SELECTED`: Select a specific website
- `ADD_WEBSITE`: Start adding a new website
- `MATCH_WEBSITE`: Match a URL to an existing website

## Usage

The Website component is designed to be used between the Space and Page components:

```tsx
<SpaceProvider>
  <WebsiteProvider spaceId={spaceId}>
    <PageProvider websiteId={websiteId}>
      {/* Application content */}
    </PageProvider>
  </WebsiteProvider>
</SpaceProvider>
```

### Accessing Website State

```tsx
import { useWebsiteContext } from "./website-context"

function WebsiteComponent() {
  const websiteActor = useWebsiteContext()
  const websiteState = useSelector(websiteActor, (state) => state)

  // Use website state...
}
```

## Data Flow

1. The Website component receives a space ID from the Space component
2. It loads websites associated with that space
3. When a website is selected, it provides the website ID to the Page component
4. The Page component uses this ID to load pages for the selected website

## URL Integration

The Website component includes functionality for:

- Normalizing URLs for consistent storage
- Extracting domains from URLs
- Adding new websites via URL input
- Matching entered URLs to existing websites

## Best Practices

1. Always access website state through the context hooks
2. Handle loading and error states appropriately
3. Use the debug component during development to inspect state
4. Follow the event-based pattern for state transitions
5. Normalize URLs before storing them
6. Handle the space ID change appropriately

## Accessibility

The Website component implements accessibility best practices:

- Proper ARIA attributes for dynamic content
- Loading indicators with appropriate ARIA roles
- Error messages with role="alert"
- Focus management between website states

## Related Components

- `Space`: Parent component that provides space context
- `Page`: Child component that uses website context
- Form components for adding and editing websites
