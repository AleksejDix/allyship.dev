# Website vs Page Machine Comparison

This document outlines the key differences between the `website-machine.ts` and `page-machine.ts` implementations. Both machines use XState for state management but have different structures and behaviors.

## Core Purpose

- **Page Machine**: Manages page selection within a website context
- **Website Machine**: Manages website selection within a space context

## Input Type Differences

| Feature | Page Machine | Website Machine |
|---------|-------------|-----------------|
| Primary ID | `websiteId` (string \| null) | `spaceId` (string) |
| URL Input | `normalizedUrl` (NormalizedUrl \| null) | `normalizedUrl` (NormalizedUrl \| null) |

## Context Structure

| Feature | Page Machine | Website Machine |
|---------|-------------|-----------------|
| Items Collection | `pages: Page[]` | `websites: Website[]` |
| Selected Item | `selectedPage: Page \| null` | `currentWebsite: Website \| null` |
| Error Handling | `error: PostgrestError \| null` | `error: PostgrestError \| null` |
| Parent Context | `websiteId: string \| null` | `spaceId: string` |

## Event Types

| Page Machine | Website Machine | Purpose |
|-------------|-----------------|---------|
| `LOAD_PAGES` | `REFRESH` | Reload items |
| `WEBSITE_CHANGED` | `SPACE_CHANGED` | Parent context changed |
| `URL_CHANGED` | `URL_CHANGED` | URL changed (match by path vs hostname) |
| `SELECT_PAGE` | `WEBSITE_SELECTED` | Manual item selection |
| `ADD_PAGE` | `ADD_WEBSITE` | Add new item |
| `BACK` | *(not present)* | Return to list view |
| `RETRY` | *(not present)* | Retry after error |
| *(not present)* | `MATCH_WEBSITE` | Find matching website (legacy) |

## URL Matching Logic

- **Page Machine**: Matches on full URL path
  ```typescript
  const page = context.pages.find(p => p.normalized_url === normalizedUrl.full)
  ```

- **Website Machine**: Matches only on domain/hostname
  ```typescript
  const hostname = event.normalizedUrl.hostname
  const website = context.websites.find(website => website.normalized_url === hostname)
  ```

## Context Provider Implementation

### Page Context Provider
The `PageProvider` includes watcher components inside it:

```typescript
export function PageProvider({
  children,
  websiteId,
  normalizedUrl
}: {
  children: ReactNode
  websiteId: string | null
  normalizedUrl: NormalizedUrl | null
}) {
  const actorRef = useActorRef(pageMachine, {
    input: {
      websiteId,
      normalizedUrl
    }
  })

  return (
    <PageContext.Provider value={actorRef}>
      {websiteId && <WebsiteWatcher websiteId={websiteId} />}
      <PagePathWatcher />
      {children}
    </PageContext.Provider>
  )
}
```

### Website Context Provider
The `WebsiteProvider` similarly includes watchers but has different components:

```typescript
export function WebsiteProvider({
  children,
  spaceId,
  normalizedUrl
}: {
  children: ReactNode
  spaceId: string
  normalizedUrl: NormalizedUrl | null
}) {
  const actorRef = useActorRef(websiteMachine, {
    input: {
      spaceId,
      normalizedUrl
    }
  })

  return (
    <WebsiteContext.Provider value={actorRef}>
      {spaceId && <WebsiteSpaceWatcher spaceId={spaceId} />}
      <WebsiteHostnameWatcher />
      {children}
    </WebsiteContext.Provider>
  )
}
```

Key differences:
1. `PageProvider` includes `WebsiteWatcher` (watches for website changes) and `PagePathWatcher` (watches for URL path changes)
2. `WebsiteProvider` includes `WebsiteSpaceWatcher` (watches for space changes) and `WebsiteHostnameWatcher` (watches for URL hostname changes)
3. Both conditionally render watchers based on the presence of their parent context ID

This architecture ensures that:
- URL changes are automatically detected and sent to the relevant machine
- Parent context changes trigger appropriate events
- Components are only mounted when their dependencies are available

## State Organization

| Feature | Page Machine | Website Machine |
|---------|-------------|-----------------|
| Initial State | `idle` | `loading` |
| Success Structure | `success` with `list`/`selected` substates | `success` with `list`/`selected` substates |
| Auto-transitions | Simple website check | Complex with multiple guards |
| Entry Actions | None in main states | `setOnlyWebsite` in success state |

## Guard Implementation

- **Page Machine**: Single guard for adding pages
  ```typescript
  pageAlreadyExists: ({ context, event }) => {
    if (event.type === "ADD_PAGE") {
      return checkPageExists(context.pages, event.payload.path, event.website.id)
    }
    return false
  }
  ```

- **Website Machine**: Multiple guards for state transitions
  ```typescript
  hasWebsites: ({ context }) => context.websites.length > 0,
  hasOnlyOneWebsite: ({ context }) => context.websites.length === 1,
  hasCurrentWebsite: ({ context }) => context.currentWebsite !== null
  ```

## Key Functional Differences

### Page Machine
1. Detailed security checks in `addPageActor`
2. Simple linear state flow
3. URL path-based matching
4. No automatic selection based on count
5. Uses `normalizeUrl().full` (includes path)

### Website Machine
1. Automatic website selection when there's only one
2. Entry actions in states
3. URL hostname-based matching
4. More complex state transitions
5. Uses `normalizeUrl().hostname` (domain only)
6. Contains debug logging with console.log statements

## Critical Issues

### Problematic `setOnlyWebsite` Implementation

The `setOnlyWebsite` function in the website machine contains a debug statement that should be removed:

```typescript
// Set the only website (when there's just one)
setOnlyWebsite: assign(({ context, event }) => {
  console.log("🧨", { context, event }) // Unnecessary debug log
  if (context.websites.length === 1) {
    return { currentWebsite: context.websites[0] }
  }
  return {}
}),
```

This is problematic because:
1. It includes unnecessary debug logging in production code
2. It logs `event` parameter which isn't used in the function
3. The emoji makes it harder to search for in logs

**Recommended Fix:**
```typescript
// Set the only website (when there's just one)
setOnlyWebsite: assign(({ context }) => {
  if (context.websites.length === 1) {
    return { currentWebsite: context.websites[0] }
  }
  return {}
}),
```

This simplified version removes the logging and unused parameter, making the code cleaner and more efficient.

## Common Patterns

Both machines share:
1. Database operations through actors
2. Loading/success/error state patterns
3. URL change event handlers
4. Similar action structure
5. Parent context change handling

## Implementation Quality

### Page Machine Strengths
- Cleaner code with fewer console logs
- More security checks for data operations
- Simpler state transitions

### Website Machine Strengths
- Better handling of single-item cases
- More detailed state organization
- More robust event handling

## Recommended Improvements

1. Standardize URL matching approach across both machines
2. Remove console logs from production code
3. Standardize naming patterns (`selectedPage` vs `currentWebsite`)
4. Add security checks to `addWebsiteActor` similar to `addPageActor`
5. Consider consolidating duplicate code into shared utilities
6. Standardize the approach to auto-transitions

## Conclusion

The `website-machine` and `page-machine` share common architectural patterns but have evolved with significant differences in implementation. These differences create potential maintenance challenges and inconsistent behavior across the application.

### Standardization Path Forward

1. **Create Shared Base Machine Factory**: Consider creating a factory function for generating base state machines with consistent patterns:

   ```typescript
   function createItemSelectionMachine<T>(config: {
     itemType: 'website' | 'page';
     loadItems: (context: any) => Promise<T[]>;
     matchItem: (items: T[], normalizedUrl: NormalizedUrl) => T | null;
     // Other configuration options
   }) {
     // Return a properly configured XState machine
   }
   ```

2. **Unified Naming Conventions**: Standardize naming patterns across machines:
   - Use `selectedItem` instead of mixing `selectedPage` and `currentWebsite`
   - Name actions consistently (e.g., `setSelectedItemByUrl` vs `setCurrentWebsiteByHostname`)
   - Use consistent event type names (`ITEM_SELECTED`, `PARENT_CHANGED`, etc.)

3. **Shared Utilities**: Extract common functionality:
   - URL matching logic into shared utilities
   - Error handling into a reusable pattern
   - Loading/success state patterns into a template

4. **Consistent Context Structure**: Standardize context properties and shape across machines

5. **Documentation**: Create central documentation for the state machine patterns used across the application

By aligning these state machines more closely, the application will benefit from:
- Improved developer experience through consistent patterns
- Easier debugging with predictable state transitions
- Better testability with standardized interfaces
- Reduced code duplication and maintenance burden
- More predictable user experience
