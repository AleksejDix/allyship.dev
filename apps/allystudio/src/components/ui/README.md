# URL Highlighting Components

This directory contains components for highlighting UI elements based on the current URL in the browser tab.

## CurrentIndicator Components

These components provide visual feedback to users when they are viewing a website or page that is currently being analyzed in the extension.

### Components

1. **CurrentIndicator**: Base component that handles the visual highlighting
2. **CurrentWebsiteIndicator**: Highlights when the current browser tab matches a website
3. **CurrentPageIndicator**: Highlights when the current browser tab matches a specific page
4. **CurrentSpaceIndicator**: Highlights the current space (not URL-based)

### Usage Examples

#### Highlighting the current website

```tsx
import { CurrentWebsiteIndicator } from "@/components/ui/current-indicator"

// In your component
;<CurrentWebsiteIndicator domain="example.com">
  <div>Website: example.com</div>
</CurrentWebsiteIndicator>
```

#### Highlighting the current page

```tsx
import { CurrentPageIndicator } from "@/components/ui/current-indicator"

// In your component
;<CurrentPageIndicator domain="example.com" path="/products">
  <div>Page: /products</div>
</CurrentPageIndicator>
```

#### Highlighting the current space

```tsx
import { CurrentSpaceIndicator } from "@/components/ui/current-indicator"

// In your component
;<CurrentSpaceIndicator isCurrentSpace={currentSpace?.id === space.id}>
  <div>Space: {space.name}</div>
</CurrentSpaceIndicator>
```

### Customization

All indicator components accept the following props:

- `className`: Additional CSS classes
- `showIcon`: Whether to show the checkmark icon (default: true)
- `showHighlight`: Whether to show the background highlight (default: true)

Example with customization:

```tsx
<CurrentWebsiteIndicator
  domain="example.com"
  showIcon={false}
  className="rounded-lg">
  <div>Website: example.com</div>
</CurrentWebsiteIndicator>
```

## URL Provider Hooks

The URL highlighting feature relies on hooks from the URL Provider:

- `useIsCurrentWebsite(domain)`: Checks if the current URL matches a website domain
- `useIsCurrentPage(domain, path)`: Checks if the current URL matches a specific page

These hooks handle all the URL normalization and comparison logic, making it easy to implement URL-based highlighting throughout the application.
