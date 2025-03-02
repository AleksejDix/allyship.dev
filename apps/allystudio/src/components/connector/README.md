# Connector Component

A demonstration component that showcases the SDK API integration, proper React patterns, and accessibility features for managing websites and pages.

## Architecture

The connector component follows the following architecture patterns:

### 1. Component Composition

The connector is broken down into small, reusable components:

- `WebsiteSelector` - Select a website from a list
- `PageSelector` - Select a page from a list
- `PageCreateForm` - Form for creating new pages

### 2. Custom Hooks

Business logic is extracted into custom hooks:

- `useWebsiteData` - Managing website data, fetching, and selection
- `usePageData` - Managing page data, fetching, and selection
- `usePageCreator` - Managing the creation of new pages

### 3. Separation of Concerns

- **Data Fetching**: Managed by the hooks
- **UI Components**: Focus only on presentation
- **State Management**: Handled in hooks, not components
- **Error Handling**: Centralized in the hooks

### 4. URL Monitoring

- Integration with the Chrome extension to monitor the current URL
- Automatic matching against known websites and pages
- Visual indicators for matching/non-matching URLs
- Auto-selection of current website and page when browsing
- **Auto-filling** the creation form with current URL data

### 5. Theme Support

- Full support for both light and dark modes
- Uses shadcn UI theme variables for consistent appearance
- Adaptive color scheme that follows system preferences
- Semantic color usage (primary, destructive, success) instead of hardcoded values
- Proper contrast in both themes for accessibility

## URL Monitoring Feature

The connector integrates with the browser extension to monitor and highlight the current URL:

1. **Current URL Detection**:

   - Uses the `useCurrentUrl` hook from `url-provider.tsx` to get the current URL
   - Extracts the domain and path for comparison with known records

2. **Status Highlighting**:

   - Color highlights indicate known domains/paths (using theme-aware colors)
   - Visual badges show "Known" or "Unknown" status
   - All colors adapt to current theme (light/dark mode)

3. **Smart Behavior**:

   - Auto-selects the current website and page when navigating
   - **Always keeps form input synchronized with current browser tab data**
   - Visual indicators show when form inputs match current URL
   - Temporary notification appears when form is auto-filled

4. **Implementation Logic**:
   - Compares normalized URLs for domain matching
   - Matches paths exactly for page recognition
   - Updates highlighting in real-time as the user browses
   - **Synchronizes form inputs whenever the tab URL changes**

## Usage

Import and use the connector in any page or component:

```tsx
import { Connector } from "@/components/connector/connector"

export default function Page() {
  return (
    <div>
      <h1>Page Title</h1>
      <Connector />
    </div>
  )
}
```

## Component Structure

```
connector/
├── api/               # API related code
│   ├── connector-utils.ts
│   └── sdk/           # SDK implementation
│       ├── core.ts
│       ├── index.ts
│       ├── page-api.ts
│       ├── procedures.ts
│       ├── website-api.ts
│       └── README.md
├── components/        # UI components
│   ├── website-selector.tsx
│   ├── page-selector.tsx
│   ├── page-create-form.tsx
│   └── index.ts
├── hooks/             # Custom hooks
│   ├── use-website-data.ts
│   ├── use-page-data.ts
│   ├── use-page-creator.ts
│   └── index.ts
├── connector.tsx      # Main connector component
└── README.md          # This file
```

## Benefits of This Architecture

1. **Maintainability**: Each component and hook has a single responsibility
2. **Testability**: Components and hooks can be tested in isolation
3. **Reusability**: Components and hooks can be reused across the application
4. **Separation of Concerns**: UI, state, and business logic are separated
5. **Accessibility**: Properly structured components with semantic HTML and ARIA labels
6. **Error Handling**: Centralized error handling in hooks
7. **Real-time Monitoring**: Integration with browser extension for URL monitoring
8. **User-Friendly Form Experience**: Auto-filling forms with current context data
9. **Theme Adaptability**: Seamless support for both light and dark modes

## Development Guidelines

1. **Keep Components Small**: Each component should do one thing well
2. **Extract Logic to Hooks**: Business logic belongs in hooks, not components
3. **Handle Errors**: Always handle and display errors appropriately
4. **Loading States**: Show loading indicators during async operations
5. **Accessibility**: Use proper semantic HTML and ARIA attributes
6. **Naming Conventions**: Use clear, descriptive names for components, hooks, and functions
7. **URL Handling**: Follow URL normalization best practices for consistent matching
8. **Context Awareness**: Components should respond to the user's current context (like active browser tab)
9. **Theme Variables**: Use shadcn UI theme variables instead of hardcoded colors

## Future Improvements

1. **Add Testing**: Implement unit and integration tests
2. **Implement Pagination**: For fetching large datasets
3. **Add Filtering**: Allow filtering of websites and pages
4. **Enhanced Error Handling**: More descriptive error messages and recovery mechanisms
5. **Optimistic Updates**: Update the UI optimistically before API responses
6. **Caching**: Implement data caching for improved performance
7. **URL Pattern Matching**: Add support for URL pattern matching beyond exact matches
8. **Browser History Integration**: Track browsing history for better suggestions
9. **Bulk URL Import**: Allow importing multiple URLs at once
10. **Manual Edit Override**: Allow users to manually override auto-filled values when needed
11. **Theme Preferences**: Allow users to manually set light/dark theme preference
