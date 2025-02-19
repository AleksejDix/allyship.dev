# Allyship Studio

A premium Chrome extension built with [Plasmo](https://docs.plasmo.com/) and [shadcn/ui](https://ui.shadcn.com/) that helps make the web more accessible.

## Architecture Overview

### Core Components

1. **Authentication System**

   - Built on Supabase Auth
   - Supports email/password and OAuth (GitHub) login
   - Persistent session management using `@plasmohq/storage`
   - Secure token handling and refresh mechanism

2. **Extension UI**

   - Options Page: Full-screen authentication interface
   - Side Panel: Main accessibility tools interface
   - Theme Support: System/light/dark mode using shadcn/ui

3. **Background Service**
   - Handles message passing between components
   - Manages side panel state
   - Coordinates with content scripts

### Technical Stack

```
Frontend:
├── React 18
├── TypeScript
├── shadcn/ui (Radix UI + Tailwind)
└── Plasmo Framework

Backend:
└── Supabase
    ├── Auth
    ├── Database
    └── Storage

Build Tools:
├── pnpm (Package Manager)
├── PostCSS
└── Tailwind CSS
```

## How It Works

### 1. Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Options
    participant Supabase
    participant Storage

    User->>Options: Open extension
    Options->>Supabase: Check session
    alt Has session
        Supabase->>Storage: Store tokens
        Storage->>Options: Update UI
    else No session
        Options->>User: Show login form
        User->>Options: Enter credentials
        Options->>Supabase: Authenticate
        Supabase->>Storage: Store new session
    end
```

**Implementation Details:**

```typescript
// Core authentication logic in options.tsx
const [user, setUser] = useStorage<User>({
  key: "user",
  instance: new Storage({ area: "local" })
})

// Session initialization
useEffect(() => {
  async function init() {
    const { data, error } = await supabase.auth.getSession()
    if (!!data.session) {
      setUser(data.session.user)
      sendToBackground({
        name: "init-session",
        body: {
          refresh_token: data.session.refresh_token,
          access_token: data.session.access_token
        }
      })
    }
  }
  init()
}, [])
```

### 2. Storage System

The extension uses a layered storage approach:

1. **Local Extension Storage** (`@plasmohq/storage`)

   - User preferences
   - Session data
   - Cache

2. **Supabase Storage**
   - User data
   - Scan results
   - Settings sync

```typescript
// Storage implementation
const customStorage: SupportedStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const value = await storage.get(key)
      return value ?? null
    } catch (error) {
      console.error("Storage.getItem error:", error)
      return null
    }
  }
  // ... other methods
}
```

### 3. Environment Configuration

The extension uses Plasmo's environment system:

```env
# Supabase Configuration
PLASMO_PUBLIC_SUPABASE_URL=your_supabase_url
PLASMO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Extension Configuration
PLASMO_PUBLIC_EXTENSION_ID=your_extension_id

# Development Configuration
PLASMO_PUBLIC_DEV_MODE=true
```

### 4. Background Service

The background service handles:

1. Message routing
2. Side panel management
3. Session coordination

```typescript
// Background script (background/index.ts)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL" && message.windowId) {
    chrome.sidePanel
      .open({ windowId: message.windowId })
      .then(() => sendResponse({ success: true }))
  }
  return true
})
```

## Development

### Prerequisites

- Node.js 18+
- pnpm 8.15.3+
- Chrome browser

### Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment:

```bash
cp .env.example .env
# Edit .env with your credentials
```

3. Development mode:

```bash
pnpm dev
```

4. Build for production:

```bash
pnpm build
```

### Scripts

- `pnpm dev`: Start development server
- `pnpm build`: Create production build
- `pnpm package`: Package for distribution
- `pnpm clean`: Remove build artifacts

## Project Structure

```
apps/allystudio/
├── assets/             # Static assets
├── background/         # Background scripts
├── components/         # React components
│   └── ui/            # shadcn/ui components
├── core/              # Core functionality
│   └── supabase.ts    # Supabase client
├── lib/               # Utility functions
├── types/             # TypeScript types
├── options.tsx        # Options page
└── sidepanel.tsx      # Side panel UI
```

## Security Considerations

1. **Authentication**

   - Secure token storage
   - Automatic token refresh
   - OAuth integration

2. **Data Protection**

   - Local storage encryption
   - Secure message passing
   - Content security policy

3. **Permission Model**
   - Minimal required permissions
   - Host permissions control
   - Feature-based access control

## Best Practices

1. **Code Organization**

   - Feature-based directory structure
   - Clear separation of concerns
   - Type safety throughout

2. **State Management**

   - Local state with React hooks
   - Persistent state with Plasmo storage
   - Background state coordination

3. **Error Handling**
   - Graceful degradation
   - User-friendly error messages
   - Detailed error logging

## License

This software is proprietary and confidential. Unauthorized copying, distribution, or use of this software is strictly prohibited. All rights reserved.

Copyright (c) 2024 Allyship.dev
