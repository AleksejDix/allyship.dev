# UI Components

The connector uses a set of reusable UI components to provide a consistent user experience.

## Main Components

### `Connector`

The root component that provides the floating UI for website/page selection.

```typescript
<Connector
  spaceId="space_123"           // Required: Current space ID
  initialIsOpen={false}         // Optional: Initially open state
  onWebsiteSelect={handleSelect} // Optional: Callback on website selection
  onPageSelect={handleSelect}    // Optional: Callback on page selection
/>
```

### `ConnectorButton`

Floating button that toggles the connector panel.

```typescript
<ConnectorButton
  isOpen={isOpen}               // Required: Current open state
  onClick={toggle}              // Required: Toggle function
  connectionStatus="connected"  // Optional: Current connection status
/>
```

### `ConnectorPanel`

The main panel containing tabs and selection UI.

```typescript
<ConnectorPanel
  isOpen={isOpen}               // Required: Current open state
  activeTab={activeTab}         // Required: Current active tab
  onTabChange={setActiveTab}    // Required: Tab change handler
  onClose={() => setIsOpen(false)} // Required: Close handler
  spaceId={spaceId}             // Required: Current space ID
  onWebsiteSelect={onWebsiteSelect} // Optional: Website selection callback
  onPageSelect={onPageSelect}    // Optional: Page selection callback
/>
```

## Selection Components

### `WebsiteSelector`

Component for selecting a website.

```typescript
<WebsiteSelector
  spaceId="space_123"           // Required: Current space ID
  selectedId="website_456"      // Optional: Selected website ID
  onSelect={handleSelect}       // Required: Selection handler
/>
```

### `PageSelector`

Component for selecting a page.

```typescript
<PageSelector
  websiteId="website_123"       // Required: Current website ID
  selectedId="page_456"         // Optional: Selected page ID
  onSelect={handleSelect}       // Required: Selection handler
/>
```

### `QuickAddForm`

Form for quickly adding a website or page based on the current URL.

```typescript
<QuickAddForm
  spaceId="space_123"           // Required: Current space ID
  websiteId="website_123"       // Optional: Current website ID (for page add)
  onSuccess={handleSuccess}     // Optional: Success callback
  mode="website"                // Optional: 'website' or 'page'
/>
```

## Status Components

### `ConnectionStatus`

Component that displays the current connection status.

```typescript
<ConnectionStatus
  status="connected"            // Required: Current status
  url="https://example.com"     // Required: Current URL
  confidence={0.9}              // Optional: Match confidence (0-1)
/>
```

### `ConnectionBadge`

Small badge showing connection status.

```typescript
<ConnectionBadge
  status="connected"            // Required: Current status
  variant="small"               // Optional: 'small' or 'large'
/>
```

## Tab Components

### `ConnectorTabs`

Tab navigation for the connector panel.

```typescript
<ConnectorTabs
  activeTab="websites"          // Required: Current active tab
  onTabChange={setActiveTab}    // Required: Tab change handler
  tabs={[                       // Required: Available tabs
    { id: "websites", label: "Websites" },
    { id: "pages", label: "Pages" }
  ]}
/>
```

## Layout Components

### `FloatingPanel`

Reusable floating panel with consistent styling.

```typescript
<FloatingPanel
  isOpen={isOpen}               // Required: Current open state
  position="bottom-right"       // Optional: Panel position
  onClose={handleClose}         // Required: Close handler
>
  {children}
</FloatingPanel>
```

## Empty States

### `EmptyState`

Component for displaying empty states with appropriate actions.

```typescript
<EmptyState
  title="No websites found"     // Required: Title
  description="Connect to your first website" // Required: Description
  actionLabel="Add Website"     // Optional: Action button label
  onAction={handleAddWebsite}   // Optional: Action handler
  icon={<GlobeIcon />}          // Optional: Icon component
/>
```

## Loading States

### `LoadingState`

Component for displaying loading states.

```typescript
<LoadingState
  label="Loading websites..."  // Optional: Loading label
  size="medium"                // Optional: 'small', 'medium', 'large'
/>
```

## Error States

### `ErrorState`

Component for displaying error states.

```typescript
<ErrorState
  title="Connection failed"    // Required: Error title
  error={error}                // Optional: Error object
  onRetry={handleRetry}        // Optional: Retry handler
/>
```

## Component Hierarchies

The connector components are organized in the following hierarchy:

```
Connector
├── ConnectorButton
└── ConnectorPanel
    ├── ConnectorTabs
    │   ├── WebsitesTab
    │   │   ├── WebsiteSelector
    │   │   │   ├── WebsiteList
    │   │   │   └── QuickAddForm
    │   │   └── ConnectionStatus
    │   └── PagesTab
    │       ├── PageSelector
    │       │   ├── PageList
    │       │   └── QuickAddForm
    │       └── ConnectionStatus
    └── ConnectorFooter
```

## Component Guidelines

### Accessibility

All components follow these accessibility guidelines:

- All interactive elements are keyboard accessible
- Proper ARIA labels and roles are used
- Focus management is implemented for modal dialogs
- Color contrast meets WCAG AA standards
- Icon buttons have text labels or aria-label

Example:

```typescript
<button
  onClick={onClose}
  aria-labelledby="close-label"
  className="focus:ring-2 focus:ring-blue-500"
>
  <XIcon aria-hidden="true" className="w-4 h-4" />
  <span id="close-label" className="sr-only">Close panel</span>
</button>
```

### Responsive Design

Components adapt to different screen sizes:

- Floating panel expands to full-width on mobile
- Lists use virtual scrolling for performance
- Touch targets are at least 44x44px on mobile
- Typography scales based on viewport size

### Visual Feedback

Components provide clear visual feedback:

- Loading states for async operations
- Success/error states for form submissions
- Hover/focus states for interactive elements
- Animation for state transitions

### Error Handling

Components handle errors gracefully:

- Form validation errors are displayed inline
- Network errors show retry options
- Authentication errors redirect to login
- Unexpected errors show friendly error messages
