# Connector SDK

A reusable, tree-shakable SDK for API functions to interact with connector entities.

## Features

- **Tree-shakable**: Import only what you need, reducing bundle size
- **Type-safe**: Full TypeScript support with proper typing
- **Modular**: Clearly separated API functions for different entities
- **Secure**: Built-in authentication and permission checking
- **Validation**: Entity-specific validation to ensure data integrity
- **Extensible**: Easy to add new entity types or customize existing ones

## Installation

No installation required - the SDK is part of the codebase.

## Basic Usage

### Importing specific functions

```typescript
import {
  createWebsite,
  fetchPagesForWebsite
} from "@/components/connector/api/sdk"

// Use the imported functions
const response = await createWebsite({
  /* ... */
})
```

### Importing entire API for an entity

```typescript
import { websiteApi } from "@/components/connector/api/sdk/website-api"

// Use the API methods
const response = await websiteApi.create({
  /* ... */
})
```

### Creating custom API for new entities

```typescript
import { createEntityApi } from "@/components/connector/api/sdk/core"

// Define your entity
interface MyEntity {
  id: string
  name: string
  // ...
}

// Create an API for your entity
const myEntityApi = createEntityApi<MyEntity>({
  tableName: "my_entities"
  // ...
})

// Export the API methods
export const { list, get, create, update, remove } = myEntityApi
```

## API Reference

### `createEntityApi<T>(config)`

Creates an API for a specific entity type.

#### Configuration Options

- `tableName`: The name of the database table
- `primaryKey`: The primary key field (default: "id")
- `validateInsert`: Function to validate insert data
- `validateUpdate`: Function to validate update data
- `transformRow`: Optional function to transform database rows

#### Returned API Methods

- `list(filters?)`: List entities with optional filters
- `get(id)`: Get an entity by ID
- `create(data)`: Create a new entity
- `update(id, data)`: Update an existing entity
- `remove(id)`: Delete an entity

## Built-in Entities

### Website API

```typescript
import {
  fetchWebsitesForSpace,
  websiteApi
} from "@/components/connector/api/sdk"

// List all websites
const websites = await websiteApi.list()

// Get websites for a space
const spaceWebsites = await fetchWebsitesForSpace("space-123")
```

### Page API

```typescript
import { fetchPagesForWebsite, pageApi } from "@/components/connector/api/sdk"

// List all pages
const pages = await pageApi.list()

// Get pages for a website
const websitePages = await fetchPagesForWebsite("website-123")
```

## Higher-Level Procedures

The SDK provides higher-level procedures that handle common workflows involving multiple entities:

### Entity Relationships and Dependencies

Some entities have dependencies on others. For example, pages depend on websites. The SDK provides procedures to handle these relationships:

```typescript
import { createPageWithWebsite } from "@/components/connector/api/sdk"

// This procedure will:
// 1. Check if the website exists (by URL)
// 2. Create the website if it doesn't exist
// 3. Create the page linked to the website
const response = await createPageWithWebsite(
  "space-123", // Space ID
  "example.com", // Website URL
  "/about" // Page path
)
```

### Benefits of Using Procedures

1. **Handle Entity Dependencies**: Ensures parent entities exist before creating child entities
2. **Simplify Complex Workflows**: Abstracts multi-step processes into single function calls
3. **Consistent Error Handling**: Provides unified error handling for complex operations
4. **Input Validation**: Validates all inputs before proceeding with operations
5. **Transaction-like Behavior**: Ensures related operations succeed or fail together

## Benefits Over Direct Supabase Calls

- Centralized authentication and permission checks
- Consistent error handling and response format
- Type-safe API with proper TypeScript definitions
- Entity-specific validation
- Reusable helper functions
- Handling of entity relationships and dependencies

## Error Handling

All SDK functions return a standard response format:

```typescript
interface ApiResponse<T> {
  data: T | null
  error: Error | null
}
```

Example error handling:

```typescript
const response = await createWebsite({ /* ... */ })

if (response.error) {
  // Handle error
  console.error("Failed to create website:", response.error.message)
  return
}

// Use the data
const website = response.data
```

## Advanced Usage

### Custom Queries

For more complex queries, you can extend the basic API:

```typescript
import { checkAuth } from "@/components/connector/api/connector-utils"
import { supabase } from "@/lib/supabase"

export async function complexPageQuery() {
  // Check authentication
  const auth = await checkAuth()
  if (!auth.session) {
    return { data: null, error: new Error("Unauthorized") }
  }

  // Custom query
  const { data, error } = await supabase
    .from("pages")
    .select(
      `
      id,
      path,
      website:websites(url)
    `
    )
    .order("created_at", { ascending: false })
    .limit(10)

  if (error) {
    return { data: null, error }
  }

  return { data, error: null }
}
```

### Batch Operations

Perform multiple operations efficiently:

```typescript
import { batchCreatePages } from "@/components/connector/api/sdk/batch"

// Create multiple pages at once
const response = await batchCreatePages([
  { website_id: "123", path: "/page1" },
  { website_id: "123", path: "/page2" },
  { website_id: "123", path: "/page3" }
])
```
