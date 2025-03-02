# Connector Documentation

The connector is a floating UI component that allows users to connect Ally Studio to the websites and pages they're currently visiting for scan creation and issue monitoring.

## Documentation Index

- **[Business Requirements](./BUSINESS-REQUIREMENTS.md)**: User stories and business requirements
- **[Architecture](./ARCHITECTURE.md)**: High-level architecture and key design decisions
- **[URL Monitoring](./URL-MONITORING.md)**: URL detection and connection status handling
- **[API Integration](./API-INTEGRATION.md)**: API structure and implementation
- **[Hooks](./HOOKS.md)**: Custom React hooks for state management
- **[UI Components](./UI-COMPONENTS.md)**: UI component documentation

## Quick Start

```typescript
import { Connector } from "@/components/connector"

export default function DashboardPage() {
  return (
    <main>
      {/* Your dashboard content */}

      {/* Add the connector (it manages its own UI state) */}
      <Connector spaceId={spaceId} />
    </main>
  )
}
```

## Key Features

- **URL Monitoring**: Detects and matches current browser URL against saved websites/pages
- **Visual Status**: Shows connection status (connected, disconnected, partial match)
- **Quick Add**: Rapidly add current website or page to your workspace
- **Optimistic Updates**: UI updates immediately for better UX
- **Smart Matching**: Handles URL variants (www, trailing slashes, etc.)
- **Floating UI**: Non-intrusive floating panel with toggle button
- **Keyboard Navigation**: Full keyboard accessibility

## Integration Guide

### Basic Integration

```typescript
<Connector
  spaceId="space_123"
  initialIsOpen={false}
/>
```

### With Selection Callbacks

```typescript
<Connector
  spaceId="space_123"
  onWebsiteSelect={(website) => {
    console.log("Selected website:", website.url)
  }}
  onPageSelect={(page) => {
    console.log("Selected page:", page.url)
  }}
/>
```

### Connecting to Current URL

```typescript
function handleConnect() {
  const { connectToCurrentUrl } = useConnectorSelection()
  connectToCurrentUrl()
}
```

## Component Structure

```
Connector/
├── index.ts           # Main exports
├── Connector.tsx      # Root component
├── hooks/             # Custom hooks
│   ├── useConnectorState.ts
│   ├── useCurrentUrl.ts
│   ├── useUrlMatch.ts
│   ├── useWebsiteData.ts
│   └── usePageData.ts
├── ui/                # UI components
│   ├── ConnectorButton.tsx
│   ├── ConnectorPanel.tsx
│   ├── WebsiteSelector.tsx
│   └── PageSelector.tsx
└── api/               # API integration
    ├── sdk/
    │   ├── index.ts
    │   ├── core.ts
    │   ├── website-api.ts
    │   └── page-api.ts
    └── connector-utils.ts
```

## Testing

The connector has comprehensive unit and integration tests:

```bash
# Run all tests
yarn test 'src/components/connector'

# Run specific test files
yarn test 'src/components/connector/hooks/__tests__/use-website-data.test.ts'
```

## Design Principles

The connector follows these core principles:

1. **Minimal Dependencies**: Uses only essential dependencies
2. **Modular Architecture**: Components, hooks, and API layers are decoupled
3. **Progressive Enhancement**: Works with or without JavaScript
4. **Accessibility First**: Follows WCAG AA standards
5. **Performance Focused**: Optimized for minimal bundle size and runtime performance
