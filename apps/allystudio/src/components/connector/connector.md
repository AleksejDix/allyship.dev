# Connector Component

The Connector component establishes connections between the current URL in the browser and websites/pages stored in the database. It provides visual feedback about URL matching status and enables users to track new URLs or navigate to existing tracked pages.

## Architecture Overview

### Purpose

- Bridges the gap between current browser URL and tracked resources in the database
- Provides real-time visual feedback about connection status
- Enables users to manage tracked URLs directly from their browser

### Component Composition

- **Main Component**: `Connector`
- **UI Components**:
  - `ConnectorIcon`: Visual indicator for connection state
  - `ConnectorButton`: Action button for untracked URLs
  - `ConnectorLink`: Navigation link for tracked URLs
  - `ConnectorHostname`: Displays hostname with status highlighting
  - `ConnectorPath`: Displays path with status highlighting

## Business Requirements

### Core Requirements

- [ ] Establish connections between browser URLs and database resources
- [ ] Track websites at the domain level (e.g., "example.com")
- [ ] Track pages at the path level (e.g., "/products")
- [ ] Associate websites with specific spaces for organization
- [ ] Allow quick creation of website and page entries from current URL
- [ ] Provide status indicators for the connection state

### URL Handling

- [ ] Support proper URL normalization (remove www., http://, etc.)
- [ ] Handle path normalization (handle trailing slashes, etc.)
- [ ] Strip query parameters and fragments for consistent matching
- [ ] Support manual URL input for non-browser-extension scenarios
- [ ] Validate URL input to prevent malformed entries
- [ ] Prevent duplicate URL entries within the same space

### Real-Time Status

- [ ] Visual feedback for URL matching status (connected/disconnected)
- [ ] Status indicator for hostname matches
- [ ] Status indicator for path matches
- [ ] Loading indicators during connection state changes
- [ ] Clear error states for failed connections

### User Workflows

- [ ] Support direct navigation to tracked pages
- [ ] Enable quick tracking of new URLs
- [ ] Allow selection from previously tracked websites/pages
- [ ] Support manual refresh of connection state
- [ ] Provide form pre-filling based on current URL
- [ ] Support keyboard-accessible navigation and actions

### Data Management

- [ ] Efficiently fetch website data for the current space
- [ ] Fetch page data only for the currently selected website
- [ ] Cache website and page data to minimize API calls
- [ ] Handle error states for failed data fetching
- [ ] Support optimistic updates for better user experience
- [ ] Clean up data subscriptions when component unmounts

### Integration

- [ ] Integrate with space context for proper data scoping
- [ ] Connect with URL provider for current browser location
- [ ] Expose clean APIs for parent components
- [ ] Support proper theme integration for light/dark mode
- [ ] Ensure accessibility throughout all connection states

## State Management

### Local State

```typescript
// Primary state variables
const [websites, setWebsites] = useState<Record<string, Website>>({})
const [pages, setPages] = useState<Record<string, Page>>({})
const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(null)
const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState<string | null>(null)
const [state, setState] = useState<"loading" | "connected" | "disconnected">(
  "loading"
)
```

### External State

```typescript
// State from context providers
const { normalizedUrl } = useCurrentUrl()
const spaceActor = useSpaceContext()
const currentSpace = useSelector(
  spaceActor,
  (state) => state.context.currentSpace
)
```

## Data Flow

### Initialization & Data Fetching

1. **Context Loading**:

   - Component receives space context and current URL from providers
   - Establishes initial loading state

2. **Website Data Loading**:

   ```typescript
   useEffect(() => {
     if (!currentSpace) return

     async function fetchWebsites() {
       setState("loading")
       const { data } = await fetchWebsitesForSpace(currentSpace.id)

       if (data) {
         setWebsites(toRecord(data, "url", (website) => website.normalized_url))
       }
     }

     fetchWebsites()
   }, [currentSpace])
   ```

3. **Website Matching**:

   ```typescript
   const matchedWebsite = normalizedUrl?.hostname
     ? Object.values(websites).find(
         (website) => website.normalized_url === normalizedUrl.hostname
       )
     : null

   const isHostnameMatch = !!matchedWebsite
   ```

4. **Page Data Loading**:

   ```typescript
   useEffect(() => {
     if (!currentWebsiteId) {
       setPages({})
       setState("disconnected")
       return
     }

     async function fetchPages() {
       setState("loading")
       const { data } = await fetchPagesForWebsite(currentWebsiteId)

       if (data) {
         setPages(toRecord(data, "path", (page) => page.path))

         const isPathMatch =
           normalizedUrl?.path &&
           data.some((page) => page.path === normalizedUrl.path)
         setState(isPathMatch ? "connected" : "disconnected")
       } else {
         setState("disconnected")
       }
     }

     fetchPages()
   }, [currentWebsiteId, normalizedUrl?.path])
   ```

## Connection States

### State Transitions

1. **Loading**: Initial state or during data fetching
2. **Connected**: Both hostname and path match tracked resources
3. **Disconnected**: Either hostname or path (or both) don't match

### Visual Indicators

- **Loading**: Spinner animation
- **Connected**: Green link icon with connected indicator
- **Disconnected**: Red broken link icon

## UI Rendering

### Conditional Rendering

```typescript
// Dynamic component selection based on connection state
const LinkOrButton = state === "disconnected" ? ConnectorButton : ConnectorLink
```

### Component Structure

```tsx
<div>
  {/* URL Display */}
  <div>
    <h1>Hostname: {normalizedUrl?.hostname}</h1>
    <h1>Path: {normalizedUrl?.path}</h1>
  </div>

  {/* Websites List */}
  <div className="flex flex-wrap gap-2">
    {Object.values(websites).map((website) => (
      <Badge
        variant={
          website.normalized_url === normalizedUrl?.hostname
            ? "default"
            : "outline"
        }
        key={website.url}
        className="cursor-pointer"
        onClick={() => {
          chrome.tabs.update({ url: website.url })
        }}>
        {website.normalized_url}
      </Badge>
    ))}
  </div>

  {/* Connection Action */}
  <div className="mt-4">
    <LinkOrButton>
      <ConnectorIcon state={state} />
    </LinkOrButton>
  </div>

  {/* Pages List (when connected) */}
  {isHostnameMatch && currentWebsiteUrl && (
    <div className="mt-4">
      <h3>
        Pages for {currentWebsiteUrl}: {Object.keys(pages).length}
      </h3>
      <ul className="list-disc pl-5 mt-2">
        {Object.values(pages).map((page) => (
          <li
            key={page.id}
            className={
              page.path === normalizedUrl?.path
                ? "text-green-600 dark:text-green-400"
                : ""
            }>
            {page.path}
          </li>
        ))}
      </ul>
    </div>
  )}
</div>
```

## Accessibility Considerations

- Color is not the only indicator of state (icons used alongside color)
- Interactive elements (buttons, links) are properly labeled
- Component states are clearly communicated visually

## API Integration

### Data Models

```typescript
type Website = {
  id: string
  url: string
  normalized_url: string
  // Additional fields...
}

type Page = {
  id: string
  path: string
  // Additional fields...
}
```

### API Functions

- `fetchWebsitesForSpace(spaceId: string)`: Retrieves all websites for a given space
- `fetchPagesForWebsite(websiteId: string)`: Retrieves all pages for a given website
- `toRecord<T>(array: T[], key: keyof T, normalizer?: (item: T) => string)`: Utility to convert arrays to record objects

### Treeshakable SDK

The connector API has been refactored into a modular, treeshakable SDK that allows for efficient code splitting. The SDK provides:

```typescript
// Import only what you need
// Use namespaced imports

// Create custom APIs for new entities
import {
  createEntityApi,
  createWebsite,
  fetchPagesForWebsite,
  updateWebsite,
  WebsiteApi
} from "@/components/connector/api/sdk"

const allWebsites = await WebsiteApi.list()

const scanApi = createEntityApi({
  tableName: "Scan",
  entityName: "scan"
  // Custom error handlers and validation
})
```

#### Architecture

1. **Factory Function**

   The core of the SDK is a factory function that generates CRUD operations for any entity:

   ```typescript
   function createEntityApi<T, TInsert>(config: EntityConfig<T, TInsert>) {
     // Returns standardized API operations
     return {
       list, // Get filtered list of entities
       get, // Get single entity by ID
       create, // Create new entity
       update, // Update existing entity
       remove, // Delete entity by ID
       query // Access raw query builder
     }
   }
   ```

2. **Entity-Specific Configuration**

   Each entity defines its specific error handling and validation:

   ```typescript
   const websiteApi = createEntityApi<Website, WebsiteInsert>({
     tableName: "Website",
     entityName: "website",
     errorHandlers: {
       onCreateError: (error) => {
         if (error.code === "23505") {
           return new Error("This website already exists in this space")
         }
         return undefined
       }
     },
     validateInsert: (data) => {
       if (!data.space_id || !data.url) {
         return new Error(
           "Valid website data with space_id and url is required"
         )
       }
       return undefined
     }
   })
   ```

3. **Named Exports for Tree-Shaking**

   Functions are exported individually to enable tree-shaking:

   ```typescript
   export const {
     list: listWebsites,
     get: getWebsite,
     create: createWebsite,
     update: updateWebsite,
     remove: deleteWebsite
   } = websiteApi
   ```

#### Benefits

- **Treeshaking**: Only the functions you import are included in the bundle
- **Type Safety**: Full TypeScript support with proper generics
- **Consistent Error Handling**: Standardized approach to errors
- **Centralized Authentication**: Authentication checks in one place
- **Entity-Specific Validation**: Custom validation per entity
- **Flexible**: Easy to extend with new entities and operations

### API Security & Error Handling

The connector API implements production-ready security and error handling patterns:

#### Authentication Checking

```typescript
/**
 * Check authentication status using Supabase getUser()
 */
export async function checkAuth(supabase: any) {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) throw new Error("Authentication required")

    return { user, error: null }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Authentication failed")
    }
  }
}
```

#### Unified Error Handling

```typescript
/**
 * Unified error handler that provides contextual information
 */
export function handleApiError<T>(
  error: unknown,
  operation: string,
  entity: string,
  context: Record<string, any> = {}
): { data: T | null; error: Error } {
  // Extract error information
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorCode = (error as any)?.code
  const errorDetails = (error as any)?.details

  // Create structured error log with context
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    entity,
    errorMessage,
    errorCode,
    errorDetails,
    ...context
  }

  // Log the structured error
  console.error(`Error ${operation} ${entity}:`, logEntry)

  return {
    data: null,
    error:
      error instanceof Error ? error : new Error(`Error ${operation} ${entity}`)
  }
}
```

#### API Function Structure

Each API function follows this secure pattern:

```typescript
export async function fetchPagesForWebsite(
  websiteId: string
): Promise<ApiResponse<Page[]>> {
  try {
    // 1. Input validation
    if (!websiteId) {
      throw new Error("Website ID is required")
    }

    // 2. Authentication check
    const { user, error: authError } = await checkAuth(supabase)
    if (authError) throw authError

    // 3. Database operation with error handling
    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", websiteId)

    // 4. Specific error handling with user-friendly messages
    if (error) {
      if (error.code === "PGRST116") {
        // Permission error
        throw new Error("You don't have permission to view these pages")
      }
      throw error
    }

    // 5. Return standardized successful response
    return { data: data || [], error: null }
  } catch (error) {
    // 6. Centralized error handling with context
    return handleApiError<Page[]>(error, "fetching", "pages", { websiteId })
  }
}
```

Security features implemented in the API:

- User authentication verification
- Input validation
- Row-level security (RLS) integration
- Specific error code handling
- User-friendly error messages
- Structured error logging
- Contextual error information

## Performance Optimizations

- Minimal re-rendering through focused effect dependencies
- Conditional data fetching based on existence of required IDs
- Record-based data structures for O(1) lookups
- Efficient state updates through computed values
