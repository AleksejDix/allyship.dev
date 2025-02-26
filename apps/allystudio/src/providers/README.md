# URL Provider

The URL Provider is a React context provider that tracks the current URL in the browser tab and provides normalized URL information for matching against websites and pages in the application.

## Features

- Tracks the current URL in the browser tab
- Normalizes URLs for consistent matching
- Provides hooks for accessing URL information
- Handles URL changes in real-time
- Manages loading and error states

## Hooks

### Basic URL Hooks

- `useUrl()`: Access the full URL context
- `useCurrentDomain()`: Access just the domain information
- `useCurrentUrl()`: Access the full URL information

### URL Matching Hooks

- `useIsCurrentWebsite(domain)`: Check if the current URL matches a website domain
- `useIsCurrentPage(domain, path)`: Check if the current URL matches a specific page

## Usage Examples

### Checking if a website matches the current URL

```tsx
import { useIsCurrentWebsite } from "@/providers/url-provider"

function WebsiteItem({ domain }) {
  const { isMatch, isLoading } = useIsCurrentWebsite(domain)

  return (
    <div className={isMatch ? "bg-primary/10" : ""}>
      {isLoading ? "Loading..." : domain}
      {isMatch && <span> (Current)</span>}
    </div>
  )
}
```

### Checking if a page matches the current URL

```tsx
import { useIsCurrentPage } from "@/providers/url-provider"

function PageItem({ domain, path }) {
  const { isMatch, isDomainMatch, isPathMatch, isLoading } = useIsCurrentPage(
    domain,
    path
  )

  return (
    <div className={isMatch ? "bg-primary/10" : ""}>
      {isLoading ? "Loading..." : `${domain}${path}`}
      {isMatch && <span> (Current)</span>}
    </div>
  )
}
```

### Accessing raw URL data

```tsx
import { useUrl } from "@/providers/url-provider"

function UrlDebug() {
  const {
    currentUrl,
    normalizedUrl,
    currentDomain,
    normalizedDomain,
    isLoading,
    error
  } = useUrl()

  if (isLoading) return <div>Loading URL...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div>Current URL: {currentUrl}</div>
      <div>Normalized URL: {normalizedUrl?.full}</div>
      <div>Domain: {normalizedDomain}</div>
    </div>
  )
}
```

## Integration with UI Components

The URL Provider is designed to work with the `CurrentIndicator` components in the UI directory:

- `CurrentWebsiteIndicator`: Uses `useIsCurrentWebsite` to highlight matching websites
- `CurrentPageIndicator`: Uses `useIsCurrentPage` to highlight matching pages

See the UI components README for more details on these components.
