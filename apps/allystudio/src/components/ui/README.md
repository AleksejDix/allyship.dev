# URL Highlighting Components

This directory contains components for highlighting UI elements based on the current URL in the browser tab.

## Current Indicator Components

The `CurrentIndicator` and `CurrentPathIndicator` components provide visual feedback when an item matches the current URL's hostname or path.

### Features

- Highlights items that match the current URL hostname or path
- Shows a checkmark icon for the current item
- Supports custom styling
- Accessible with screen reader support

### Usage

```tsx
import { CurrentIndicator, CurrentPathIndicator } from "@/components/ui/current-indicator"

// Highlight based on hostname
<CurrentIndicator hostname="example.com">
  <div>Example Website</div>
</CurrentIndicator>

// Highlight based on path
<CurrentPathIndicator path="/products">
  <div>Products Page</div>
</CurrentPathIndicator>
```

### Props for CurrentIndicator

| Prop      | Type                        | Default | Description                              |
| --------- | --------------------------- | ------- | ---------------------------------------- |
| hostname  | string \| null \| undefined | -       | The hostname to compare with current URL |
| className | string                      | -       | Optional custom CSS classes              |
| showIcon  | boolean                     | true    | Whether to show the checkmark icon       |
| children  | React.ReactNode             | -       | Content to display inside the indicator  |

### Props for CurrentPathIndicator

| Prop      | Type                        | Default | Description                             |
| --------- | --------------------------- | ------- | --------------------------------------- |
| path      | string \| null \| undefined | -       | The path to compare with current URL    |
| className | string                      | -       | Optional custom CSS classes             |
| showIcon  | boolean                     | true    | Whether to show the checkmark icon      |
| children  | React.ReactNode             | -       | Content to display inside the indicator |

### Example with Custom Styling

```tsx
<CurrentIndicator
  hostname="example.com"
  className="rounded-md p-2"
  showIcon={false}
>
  <div className="flex items-center gap-2">
    <Globe size={16} />
    <span>Example Website</span>
  </div>
</CurrentIndicator>

<CurrentPathIndicator
  path="/products"
  className="rounded-md p-2"
  showIcon={false}
>
  <div className="flex items-center gap-2">
    <FileText size={16} />
    <span>Products Page</span>
  </div>
</CurrentPathIndicator>
```

## URL Provider Hooks

The URL highlighting feature relies on hooks from the URL Provider:

- `useIsCurrentWebsite(domain)`: Checks if the current URL matches a website domain
- `useIsCurrentPage(domain, path)`: Checks if the current URL matches a specific page

These hooks handle all the URL normalization and comparison logic, making it easy to implement URL-based highlighting throughout the application.
