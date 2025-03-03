# Connector Architecture

## Architecture Overview

The connector component follows a modular architecture with clear separation of concerns.

### Component Composition

The connector is broken down into small, reusable components:

- `WebsiteSelector` - Select a website from a list
- `PageSelector` - Select a page from a list
- `PageCreateForm` - Form for creating new pages
- `ConnectorIcon` - Visual indicator for connection state
- `ConnectorButton` - Action button for untracked URLs
- `ConnectorLink` - Navigation link for tracked URLs
- `ConnectorHostname` - Displays hostname with status highlighting
- `ConnectorPath` - Displays path with status highlighting

### Custom Hooks

Business logic is extracted into custom hooks:

- `useWebsiteData` - Managing website data, fetching, and selection
- `usePageData` - Managing page data, fetching, and selection
- `usePageCreator` - Managing the creation of new pages

### Separation of Concerns

- **Data Fetching**: Managed by the hooks
- **UI Components**: Focus only on presentation
- **State Management**: Handled in hooks, not components
- **Error Handling**: Centralized in the hooks

### Theme Support

- Full support for both light and dark modes
- Uses shadcn UI theme variables for consistent appearance
- Adaptive color scheme that follows system preferences
- Semantic color usage (primary, destructive, success) instead of hardcoded values
- Proper contrast in both themes for accessibility

## State Management

### Local State

```typescript
// Primary state variables
const [websites, setWebsites] = useState<Record<string, Website>>({})
const [pages, setPages] = useState<Record<string, Page>>({})
const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(null)
const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
const [isLoading, setIsLoading] = useState<boolean>(false)
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
