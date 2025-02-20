---
description: Next.js architecture and feature design patterns
globs: "**/*.{ts,tsx}"
---

# Next.js Architecture Guidelines

## Project Structure

### Root Directory Structure

✅ Organize root directories:

```bash
my-app/
├── app/                  # App router
├── components/          # Shared components
├── lib/                 # Utility functions
├── styles/             # Global styles
├── public/             # Static assets
├── features/           # Feature modules
├── hooks/              # Custom hooks
├── types/              # TypeScript types
└── tests/              # Test files
```

### Feature Module Structure

✅ Organize feature modules:

```bash
features/
├── auth/
│   ├── components/     # Feature-specific components
│   ├── hooks/         # Feature-specific hooks
│   ├── lib/           # Feature-specific utilities
│   ├── types/         # Feature-specific types
│   └── index.ts       # Feature entry point
├── dashboard/
│   ├── components/
│   ├── hooks/
│   └── index.ts
└── settings/
    ├── components/
    ├── hooks/
    └── index.ts
```

## App Router Organization

### Route Groups

✅ Use route groups for organization:

```bash
app/
├── (auth)/             # Authentication routes
│   ├── login/
│   ├── register/
│   └── layout.tsx
├── (dashboard)/        # Dashboard routes
│   ├── overview/
│   ├── settings/
│   └── layout.tsx
└── (marketing)/        # Marketing routes
    ├── about/
    ├── blog/
    └── layout.tsx
```

### Parallel Routes

✅ Implement parallel routes:

```tsx
// app/layout.tsx
export default function Layout({
  children,
  modal,
  auth
}: {
  children: React.ReactNode
  modal: React.ReactNode
  auth: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}
      {auth}
    </>
  )
}

// Directory structure
app/
├── @modal
│   ├── (.)photo/[id]/
│   └── default.tsx
├── @auth
│   ├── login/
│   └── default.tsx
└── photo/[id]/
    └── page.tsx
```

## Component Architecture

### Component Organization

✅ Organize components by type:

```bash
components/
├── ui/                # UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── card.tsx
├── layout/           # Layout components
│   ├── header.tsx
│   └── footer.tsx
├── forms/            # Form components
│   ├── input-field.tsx
│   └── form-section.tsx
└── shared/          # Shared components
    ├── error-boundary.tsx
    └── loading-spinner.tsx
```

### Component Composition

✅ Use component composition:

```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode
}

export function Card({ children }: CardProps) {
  return <div className="rounded-lg border p-4">{children}</div>
}

Card.Header = function CardHeader({ children }: CardProps) {
  return <div className="border-b pb-2 mb-4">{children}</div>
}

Card.Body = function CardBody({ children }: CardProps) {
  return <div>{children}</div>
}

Card.Footer = function CardFooter({ children }: CardProps) {
  return <div className="border-t pt-2 mt-4">{children}</div>
}

// Usage
export function ProductCard() {
  return (
    <Card>
      <Card.Header>Product Title</Card.Header>
      <Card.Body>Product Details</Card.Body>
      <Card.Footer>Product Actions</Card.Footer>
    </Card>
  )
}
```

## Data Flow Architecture

### Server Components

✅ Use Server Components for data fetching:

```tsx
// app/products/page.tsx
import { getProducts } from "@/lib/products"
import { ProductList } from "@/components/products/product-list"

export default async function ProductsPage() {
  const products = await getProducts()

  return <ProductList products={products} />
}
```

### Client Components

✅ Use Client Components for interactivity:

```tsx
// components/products/product-filter.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export function ProductFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [category, setCategory] = useState(
    searchParams.get("category") ?? "all"
  )

  function handleFilter(newCategory: string) {
    setCategory(newCategory)
    router.push(`/products?category=${newCategory}`)
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => handleFilter("all")}>All</button>
      <button onClick={() => handleFilter("electronics")}>Electronics</button>
    </div>
  )
}
```

## Feature Design Patterns

### Feature Module Pattern

✅ Design feature modules:

```tsx
// features/auth/index.ts
export * from "./components/login-form"
export * from "./components/register-form"
export * from "./hooks/use-auth"
export * from "./types"

// features/auth/hooks/use-auth.ts
export function useAuth() {
  // Auth logic
}

// features/auth/components/login-form.tsx
export function LoginForm() {
  const { login } = useAuth()
  // Form implementation
}
```

### Feature State Management

✅ Manage feature state:

```tsx
// features/cart/context.tsx
"use client"

import { createContext, useContext, useReducer } from "react"

interface CartState {
  items: CartItem[]
  total: number
}

const CartContext = createContext<CartState | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  )
}

// features/cart/hooks/use-cart.ts
export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within CartProvider")
  return context
}
```

## API Design

### API Route Handlers

✅ Implement API routes:

```tsx
// app/api/products/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
})

export async function POST(request: Request) {
  try {
    const json = await request.json()
    const body = productSchema.parse(json)

    const product = await db.product.create({
      data: body,
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
```

### API Client Pattern

✅ Create API clients:

```tsx
// lib/api-client.ts
export class APIClient {
  private static baseUrl = "/api"

  static async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`)
    if (!response.ok) throw new Error("API Error")
    return response.json()
  }

  static async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("API Error")
    return response.json()
  }
}

// Usage
const products = await APIClient.get("/products")
```

## Error Handling

### Error Boundaries

✅ Implement error boundaries:

```tsx
// app/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="grid place-items-center min-h-[400px]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-white rounded-md"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### Not Found Handling

✅ Handle not found states:

```tsx
// app/not-found.tsx
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="grid place-items-center min-h-[400px]">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Page not found</h2>
        <p>Could not find requested resource</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-primary text-white rounded-md"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
```

## Performance Patterns

### Route Segments

✅ Optimize route segments:

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <Header />
        </Suspense>
        {children}
        <Suspense fallback={<Loading />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}
```

### Loading UI

✅ Implement loading states:

```tsx
// app/products/loading.tsx
export default function Loading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-48 rounded-lg bg-gray-200 animate-pulse" />
      ))}
    </div>
  )
}
```

## Testing Architecture

### Test Organization

✅ Organize tests by type:

```bash
tests/
├── unit/              # Unit tests
│   ├── components/
│   └── hooks/
├── integration/       # Integration tests
│   ├── api/
│   └── features/
└── e2e/              # End-to-end tests
    └── flows/
```

### Component Testing

✅ Test components:

```tsx
// tests/unit/components/button.test.tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders successfully", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button")).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    await userEvent.click(screen.getByRole("button"))
    expect(onClick).toHaveBeenCalled()
  })
})
```
