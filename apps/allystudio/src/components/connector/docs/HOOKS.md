# Custom Hooks

The connector uses a set of custom React hooks to manage state and data fetching.

## Data Hooks

### `useWebsiteData`

Manages website data for a specific space.

```typescript
const {
  websites, // Array of websites
  isLoading, // Loading state
  error, // Error state
  selectedWebsite, // Currently selected website
  setSelectedWebsiteId, // Function to select a website by ID
  refresh, // Function to manually refresh data
  optimisticAdd // Function to optimistically add a new website
} = useWebsiteData({
  spaceId, // Required: ID of the space
  initialSelectedId // Optional: Initially selected website ID
})
```

#### Optimistic Updates

The hook supports optimistic updates for a better user experience:

```typescript
// Example usage
const handleCreateWebsite = async (url: string) => {
  // 1. Add to UI immediately with temporary ID
  const tempId = uuid()
  optimisticAdd({
    id: tempId,
    url,
    normalized_url: normalizeUrl(url),
    space_id: spaceId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    theme: "BOTH"
  })

  // 2. Create in database
  const { data, error } = await createWebsite({
    url,
    space_id: spaceId,
    theme: "BOTH"
  })

  // 3. Refresh to get actual data
  await refresh()

  // 4. Select the newly created website (if created successfully)
  if (data) {
    setSelectedWebsiteId(data.id)
  }
}
```

### `usePageData`

Manages page data for a specific website.

```typescript
const {
  pages, // Array of pages
  isLoading, // Loading state
  error, // Error state
  selectedPage, // Currently selected page
  setSelectedPageId, // Function to select a page by ID
  refresh, // Function to manually refresh data
  optimisticAdd // Function to optimistically add a new page
} = usePageData({
  websiteId, // Required: ID of the website
  initialSelectedId // Optional: Initially selected page ID
})
```

## URL Hooks

### `useCurrentUrl`

Detects the current browser URL and normalizes it for matching.

```typescript
const {
  currentUrl, // Current URL as string
  normalizedUrl, // Normalized URL for matching
  websiteDomain, // Extracted domain from URL
  pagePath, // Extracted path from URL
  isValidUrl // Boolean indicating if URL is valid
} = useCurrentUrl()
```

### `useUrlMatch`

Determines if a URL matches the current browser URL.

```typescript
const {
  status, // 'connected', 'disconnected', or 'partial'
  matchType, // 'exact', 'domain', or 'none'
  confidence // Number between 0-1 indicating match confidence
} = useUrlMatch({
  websites, // Array of websites to match against
  pages, // Array of pages to match against
  currentUrl // Current browser URL
})
```

## Selection Hooks

### `useConnectorSelection`

Manages selection state for websites and pages.

```typescript
const {
  selectedWebsiteId, // Currently selected website ID
  selectedPageId, // Currently selected page ID
  setSelectedWebsiteId, // Function to select a website
  setSelectedPageId, // Function to select a page
  connectToCurrentUrl // Function to connect to current URL
} = useConnectorSelection({
  initialWebsiteId, // Optional: Initially selected website ID
  initialPageId, // Optional: Initially selected page ID
  onWebsiteSelect, // Optional: Callback when website is selected
  onPageSelect // Optional: Callback when page is selected
})
```

## Component State Hooks

### `useConnectorState`

Manages the overall state of the connector component.

```typescript
const {
  isOpen, // Boolean indicating if connector is open
  activeTab, // Currently active tab
  setIsOpen, // Function to open/close connector
  setActiveTab, // Function to set active tab
  toggle // Function to toggle connector open/closed
} = useConnectorState({
  initialIsOpen, // Optional: Initially open state
  initialActiveTab // Optional: Initially active tab
})
```

## Implementation Guidelines

### Custom Hook Pattern

All hooks follow this standard pattern:

```typescript
function useMyHook(options: Options): Result {
  // 1. Define state
  const [data, setData] = useState<Data[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // 2. Fetch data on mount or when dependencies change
  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error } = await apiFetchFunction(options.id)

        if (!isMounted) return

        if (error) throw error

        setData(data || [])
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err : new Error("Unknown error"))
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchData()

    return () => {
      isMounted = false
    }
  }, [options.id])

  // 3. Define helper functions
  const refresh = useCallback(async () => {
    // Implementation
  }, [options.id])

  // 4. Return object with state and functions
  return {
    data,
    isLoading,
    error,
    refresh
  }
}
```

### Optimistic Updates

All data hooks support optimistic updates for better UX:

1. Add/modify local state immediately
2. Make API request
3. Refresh data to sync with server
4. Handle errors and rollbacks if needed

### Memoization

Avoid unnecessary renders by memoizing derived values:

```typescript
const selectedWebsite = useMemo(() => {
  return websites.find((website) => website.id === selectedWebsiteId) || null
}, [websites, selectedWebsiteId])
```

### Loading States

Always expose loading states for UI feedback:

```typescript
{isLoading && <Spinner />}
{!isLoading && data.length === 0 && <EmptyState />}
{!isLoading && error && <ErrorState error={error} />}
{!isLoading && !error && data.length > 0 && (
  <DataList data={data} />
)}
```
