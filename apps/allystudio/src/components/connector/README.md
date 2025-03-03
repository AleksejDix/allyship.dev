# Connector Component

A component that connects the current browser URL with websites and pages stored in the database. It provides visual feedback about connection status and enables managing tracked URLs.

## Documentation

The documentation is split into several focused files:

- [Business Requirements](./docs/BUSINESS-REQUIREMENTS.md) - Complete list of business requirements
- [Architecture](./docs/ARCHITECTURE.md) - Component architecture and design patterns
- [URL Monitoring](./docs/URL-MONITORING.md) - Details on the URL monitoring features
- [API Integration](./docs/API-INTEGRATION.md) - API design and implementation details
- [Usage Guide](./docs/USAGE-GUIDE.md) - How to use the component

## Quick Start

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
├── components/        # UI components
├── docs/              # Documentation
├── hooks/             # Custom hooks
├── __tests__/         # Tests
├── connector.tsx      # Main connector component
└── README.md          # This file
```

## Key Features

- Track websites at the domain level
- Track pages at the path level
- Automatically detect current URL
- Visual indicators for URL matching
- One-click creation of websites and pages
- Optimistic UI updates
- Light/dark theme support
