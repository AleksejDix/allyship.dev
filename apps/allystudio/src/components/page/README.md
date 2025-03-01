# Page Component

## Overview

The Page component provides functionality for managing and displaying pages associated with a website in the Allyship Studio application. It uses XState for state management and React Context for passing state throughout the component tree.

## Architecture

The Page component follows a state machine architecture using XState:

```
Space → Website → Page
```

Pages exist within the context of a Website, which exists within a Space.

### Key Files

- `page.tsx`: Root component that sets up the context provider and renders child components based on state
- `page-context.tsx`: Context provider and hooks for accessing the page state
- `page-machine.ts`: XState machine that manages page state and side effects
- `page-list.tsx`: Displays a list of pages for the selected website
- `page-selected.tsx`: Displays the selected page and its content
- `page-skeleton.tsx`: Loading states for page components
- `page-error.tsx`: Error handling component
- `page-list-empty.tsx`: Empty state when no pages exist
- `page-debug.tsx`: Development tool for debugging page state

## State Management

The Page component uses XState for state management with the following key states:

- `idle`: Initial state before any loading occurs
- `loading`: Loading pages from the database
- `error`: Error state when loading fails
- `empty`: When no pages exist for the website
- `loaded`: When pages have been successfully loaded
- `selected`: When a specific page is selected

### Events

- `LOAD_PAGES`: Trigger loading pages for a website
- `WEBSITE_CHANGED`: When the parent website changes
- `RETRY`: Retry loading after an error
- `SELECT_PAGE`: Select a specific page
- `BACK`: Go back to the page list

## Usage

The Page component is designed to be used within the Website component:

```tsx
<WebsiteProvider spaceId={spaceId}>
  <PageProvider websiteId={websiteId}>{/* Page content */}</PageProvider>
</WebsiteProvider>
```

### Accessing Page State

```tsx
import { usePageContext } from "./page-context"

function PageComponent() {
  const pageActor = usePageContext()
  const pageState = useSelector(pageActor, (state) => state)

  // Use page state...
}
```

## Data Flow

1. The Space component provides a Space context
2. The Website component consumes the Space context and provides a Website context
3. The Page component consumes the Website context and provides a Page context
4. Child components consume the Page context to render UI based on the current state

## Best Practices

1. Always access page state through the context hooks
2. Handle loading and error states appropriately
3. Use the debug component during development to inspect state
4. Follow the event-based pattern for state transitions

## Accessibility

The Page component implements accessibility best practices:

- Proper ARIA attributes for dynamic content
- Loading indicators with appropriate ARIA roles
- Error messages with role="alert"
- Focus management between page states

## Related Components

- `Space`: Parent component that provides space context
- `Website`: Intermediary component that provides website context within a space
- Child components that consume page context
