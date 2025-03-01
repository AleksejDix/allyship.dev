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
- `VALIDATE_PATH`: Validate a path for adding a new page
- `URL_CHANGED`: Handle when the current URL changes
- `CLEAR_MESSAGES`: Clear validation messages

## Business Logic

The Page component centralizes business logic in the state machine to ensure consistent behavior across the application.

### URL Validation

URL validation is handled by dedicated functions and actions in the state machine:

```typescript
// In page-machine.ts
const validatePagePath = (path: string): string | null => {
  if (!path.startsWith("/")) {
    return "Path must start with /"
  }
  if (path.includes("?") || path.includes("#")) {
    return "Path cannot contain query parameters or fragments"
  }
  return null
}
```

Components dispatch validation events rather than performing validation themselves:

```typescript
// In page-add.tsx
pageActor.send({
  type: "VALIDATE_PATH",
  path
})
```

### URL-Website Relationship

The website machine handles checking if a URL belongs to a website:

```typescript
// In website-machine.ts
function urlBelongsToWebsite(url: string, website: Website): boolean {
  try {
    const urlInfo = normalizeUrlUtil(url)
    const urlDomain = urlInfo.domain
    const websiteUrlInfo = normalizeUrlUtil(website.url)
    const websiteDomain = websiteUrlInfo.domain
    return urlDomain === websiteDomain
  } catch (error) {
    return false
  }
}
```

Components request validation through events:

```typescript
// In page-add.tsx
websiteActor.send({
  type: "VALIDATE_URL_OWNERSHIP",
  url: `https://${normalizedUrl.hostname}${normalizedUrl.path}`
})
```

### Message Handling

Success and error messages are managed centrally in the state machine context:

```typescript
// In page-machine.ts context
pageValidationError: string | null
pageValidationSuccess: string | null
```

Components retrieve these messages through selectors:

```typescript
// In page-add.tsx
const { pageValidationError, pageValidationSuccess } = useSelector(
  pageActor,
  (state) => ({
    pageValidationError: state.context.pageValidationError,
    pageValidationSuccess: state.context.pageValidationSuccess
  }),
  Object.is
)
```

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
6. Delegate business logic like validation to state machines
7. Use the centralized URL utilities rather than implementing custom URL logic
8. Let the website machine handle URL-website relationship checks

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
