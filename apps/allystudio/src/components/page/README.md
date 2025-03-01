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
- `page-add.tsx`: Component for adding new pages to a website

## State Management

The Page component uses XState for state management with the following key states:

- `idle`: Initial state before any loading occurs
- `loading`: Loading pages from the database
- `error`: Error state when loading fails
- `empty`: When no pages exist for the website
- `loaded`: When pages have been successfully loaded
- `selected`: When a specific page is selected
- `adding`: When a new page is being added to the database

### Events

- `LOAD_PAGES`: Trigger loading pages for a website
- `WEBSITE_CHANGED`: When the parent website changes
- `RETRY`: Retry loading after an error
- `SELECT_PAGE`: Select a specific page
- `BACK`: Go back to the page list
- `ADD_PAGE`: Add a new page to the current website

## URL Handling

### Normalized URL Format

Pages use a specific URL format to ensure uniqueness and proper navigation:

- `normalized_url`: Combined hostname + path (e.g., "example.com/blog")
- `path`: The path component only (e.g., "/blog")
- `url`: The full URL including protocol (e.g., "https://example.com/blog")

When adding a new page, the normalized URL is constructed by:

```typescript
// Extract hostname from the website's normalized_url
const hostname = currentWebsite.normalized_url.replace(/^https?:\/\//, "")
// Combine hostname and path
const pageNormalizedUrl = `${hostname}${path}`
```

### Database Operations

Page uniqueness is enforced at the database level with a constraint on `(website_id, normalized_url)`. The component uses Supabase's upsert operation to handle potential duplicates:

```typescript
// In page-machine.ts
const { data, error } = await supabase
  .from("Page")
  .upsert(input.payload, { onConflict: "normalized_url,website_id" })
  .select()
  .single()
```

This ensures that:

1. Each page is uniquely identified by its website and normalized URL
2. Attempting to add a duplicate page will update the existing one
3. Race conditions are handled efficiently at the database level

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
5. Ensure normalized_url follows the hostname + path pattern for uniqueness

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
