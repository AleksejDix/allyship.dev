# API Integration

The connector uses a modular, treeshakable SDK for all data operations.

## Data Models

```typescript
type Website = {
  id: string
  space_id: string
  user_id: string | null
  url: string
  normalized_url: string
  theme: "BOTH" | "LIGHT" | "DARK"
  created_at: string
  updated_at: string
}

type Page = {
  id: string
  website_id: string
  path: string
  url: string
  normalized_url: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}
```

## Core API Functions

- `fetchWebsitesForSpace(spaceId: string)`: Retrieves all websites for a space
- `fetchPagesForWebsite(websiteId: string)`: Retrieves all pages for a website
- `createWebsite(data: WebsiteInsert)`: Creates a new website
- `createPage(data: PageInsert)`: Creates a new page
- `updateWebsite(id: string, data: WebsiteUpdate)`: Updates a website
- `updatePage(id: string, data: PageUpdate)`: Updates a page
- `deleteWebsite(id: string)`: Deletes a website
- `deletePage(id: string)`: Deletes a page

## Treeshakable SDK

The connector API uses a factory pattern for creating entity-specific APIs:

```typescript
// Import only what you need
import {
  createEntityApi,
  createWebsite,
  fetchPagesForWebsite
} from "@/components/connector/api/sdk"
// Use namespaced imports
import * as WebsiteApi from "@/components/connector/api/sdk/website-api"

// Create custom APIs for new entities
const scanApi = createEntityApi({
  tableName: "Scan",
  entityName: "scan"
  // Custom error handlers and validation
})
```

## Factory Pattern

The core of the SDK is a factory function that generates CRUD operations:

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

## Entity-Specific Configuration

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
      return new Error("Valid website data with space_id and url is required")
    }
    return undefined
  }
})
```

## Named Exports for Tree-Shaking

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

## API Response Pattern

All API functions return a consistent response structure:

```typescript
type ApiResponse<T> = {
  data: T | null
  error: Error | null
}
```

## Error Handling

The API implements a unified error handling approach:

```typescript
export function handleApiError<T>(
  error: unknown,
  operation: string,
  entity: string,
  context: Record<string, any> = {}
): ApiResponse<T> {
  // Extract error information
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorCode = (error as any)?.code

  // Create structured error log
  console.error(`Error ${operation} ${entity}:`, {
    errorMessage,
    errorCode,
    ...context
  })

  return {
    data: null,
    error:
      error instanceof Error ? error : new Error(`Error ${operation} ${entity}`)
  }
}
```

## API Function Pattern

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

    // 3. Database operation
    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", websiteId)

    // 4. Error handling
    if (error) throw error

    // 5. Return success response
    return { data: data || [], error: null }
  } catch (error) {
    // 6. Centralized error handling
    return handleApiError<Page[]>(error, "fetching", "pages", { websiteId })
  }
}
```
