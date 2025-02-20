---
description: Plasmo extension development patterns and best practices
globs: "apps/allystudio/**/*.{ts,tsx}"
---

# Plasmo Extension Guidelines

## Project Structure

### Directory Organization

✅ Follow this structure:

```
allystudio/
├── src/
│   ├── popup/           # Popup UI components
│   ├── options/         # Options page components
│   ├── background/      # Background scripts
│   ├── content/         # Content scripts
│   ├── features/        # Feature-specific code
│   ├── hooks/           # Custom hooks
│   ├── lib/            # Shared utilities
│   └── assets/         # Static assets
├── .plasmo/            # Plasmo build artifacts
└── assets/            # Extension assets (icons, etc.)
```

## Core Components

### Popup Components

✅ Implement popup UI:

```tsx
// src/popup/index.tsx
import { useStorage } from "@plasmohq/storage/hook"

export default function PopupPage() {
  const [settings] = useStorage("settings", {
    enabled: true,
    theme: "light",
  })

  return (
    <div className="w-80 p-4">
      <h1 className="text-xl font-bold">Extension Name</h1>
      <div className="mt-4">{/* Popup content */}</div>
    </div>
  )
}
```

### Background Service Worker

✅ Implement background logic:

```tsx
// src/background/index.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// Listen for extension installation
chrome.runtime.onInstalled.addListener(async () => {
  // Initialize default settings
  await storage.set("settings", {
    enabled: true,
    theme: "light",
  })
})

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SCAN_PAGE") {
    handlePageScan(sender.tab?.id).then(sendResponse)
    return true // Keep channel open for async response
  }
})
```

### Content Scripts

✅ Implement content scripts:

```tsx
// src/content/index.tsx
import cssText from "data-text:~/style.css"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://*/*"],
  css: ["style.css"],
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const ContentScript = () => {
  return <div className="plasmo-extension-content">{/* Injected UI */}</div>
}

export default ContentScript
```

## State Management

### Storage Patterns

✅ Use Plasmo storage:

```tsx
// src/lib/storage.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export async function getSettings() {
  return await storage.get("settings")
}

export async function updateSettings(settings: Partial<Settings>) {
  const current = await storage.get("settings")
  await storage.set("settings", { ...current, ...settings })
}

// Usage in components
export function SettingsForm() {
  const [settings, setSettings] = useStorage("settings")

  async function handleSubmit(data: Settings) {
    await setSettings(data)
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

### Message Passing

✅ Implement type-safe messaging:

```tsx
// src/lib/messages.ts
type Message =
  | { type: "SCAN_PAGE"; url: string }
  | { type: "UPDATE_SETTINGS"; settings: Settings }

export async function sendMessage<T>(message: Message): Promise<T> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      resolve(response)
    })
  })
}

// Usage in content script
export async function scanPage() {
  const result = await sendMessage({
    type: "SCAN_PAGE",
    url: window.location.href,
  })
  return result
}
```

## API Integration

### API Client

✅ Create type-safe API client:

```tsx
// src/lib/api.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export class APIClient {
  private baseUrl: string
  private storage: Storage

  constructor() {
    this.baseUrl = process.env.PLASMO_PUBLIC_API_URL
    this.storage = storage
  }

  async getAuthToken() {
    return await this.storage.get("authToken")
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = await this.getAuthToken()

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }
}

export const api = new APIClient()
```

## Authentication

### Auth Flow

✅ Implement secure authentication:

```tsx
// src/lib/auth.ts
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

export async function login(email: string, password: string) {
  const response = await api.request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })

  await storage.set("authToken", response.token)
  return response.user
}

export async function logout() {
  await storage.remove("authToken")
  await storage.remove("user")
}

// Usage in components
export function LoginForm() {
  async function handleSubmit(data: LoginData) {
    try {
      await login(data.email, data.password)
      // Redirect or update UI
    } catch (error) {
      // Handle error
    }
  }

  return <form onSubmit={handleSubmit}>{/* Login form fields */}</form>
}
```

## Performance

### Resource Loading

✅ Optimize resource loading:

```tsx
// src/lib/loader.ts
export async function loadScript(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")
    script.src = url
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

// Usage
export async function initializeFeature() {
  try {
    await loadScript(chrome.runtime.getURL("feature.js"))
    // Initialize feature
  } catch (error) {
    console.error("Failed to load feature:", error)
  }
}
```

### Memory Management

✅ Implement proper cleanup:

```tsx
// src/hooks/use-port-connection.ts
import { useEffect, useRef } from "react"

export function usePortConnection(portName: string) {
  const port = useRef<chrome.runtime.Port>()

  useEffect(() => {
    port.current = chrome.runtime.connect({ name: portName })

    return () => {
      port.current?.disconnect()
    }
  }, [portName])

  return port.current
}
```

## Error Handling

### Error Boundaries

✅ Implement error boundaries:

```tsx
// src/components/error-boundary.tsx
export class ExtensionErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service
    console.error("Extension error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
```

## Security

### Content Security

✅ Implement secure content handling:

```tsx
// src/lib/security.ts
export function sanitizeHTML(html: string): string {
  const div = document.createElement("div")
  div.textContent = html
  return div.innerHTML
}

export function validateURL(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Usage
export function ContentDisplay({ html }: { html: string }) {
  const sanitized = sanitizeHTML(html)
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />
}
```

## Testing

### Component Testing

✅ Test extension components:

```tsx
// src/components/__tests__/popup.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("Popup", () => {
  beforeEach(() => {
    // Mock chrome API
    global.chrome = {
      storage: {
        local: {
          get: vi.fn(),
          set: vi.fn(),
        },
      },
    } as any
  })

  it("renders popup content", () => {
    render(<Popup />)
    expect(screen.getByRole("heading")).toHaveTextContent("Extension Name")
  })

  it("handles user interactions", async () => {
    render(<Popup />)
    await userEvent.click(screen.getByRole("button"))
    // Assert expected behavior
  })
})
```
