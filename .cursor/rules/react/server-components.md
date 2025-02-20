---
description: Next.js Server Components patterns and best practices
globs:
  - "app/**/*.tsx"
  - "app/**/page.tsx"
  - "app/**/layout.tsx"
  - "app/**/loading.tsx"
  - "app/**/error.tsx"
---

# Server Components Guidelines

## Component Types

### Server Components (Default)

```tsx
// Default server component
export default function ProductPage() {
  // Can use async/await directly
  const products = await fetchProducts()
  return <ProductList products={products} />
}
```

### Client Components

```tsx
"use client" // Must be at the top of the file

export function InteractiveComponent() {
  const [state, setState] = useState()
  // Client-side interactivity
}
```

## Data Fetching

### Server-side Data Fetching

```tsx
async function ProductPage() {
  // ✅ Fetch data directly in Server Components
  const products = await db.products.findMany()

  // ✅ Pass data down as props
  return <ProductList products={products} />
}
```

### Route Handlers

```tsx
// app/api/products/route.ts
export async function GET() {
  const products = await db.products.findMany()
  return Response.json({ products })
}
```

## Component Patterns

### Composition

```tsx
// ✅ Keep server components at the top level
export default async function Page() {
  const data = await fetchData()

  return (
    <div>
      <ServerComponent data={data} />
      <ClientComponent /> {/* Load client components lower in the tree */}
    </div>
  )
}
```

### Data Flow

- Pass data down from Server Components
- Minimize client-side data fetching
- Use React Suspense for loading states
- Handle errors with error boundaries
- Keep state management close to UI

## Performance Optimization

### Static vs Dynamic

```tsx
// Force dynamic rendering
export const dynamic = 'force-dynamic'

// Force static rendering
export const dynamic = 'force-static'

// Revalidate on a schedule
export const revalidate = 3600 // Revalidate every hour
```

### Streaming

```tsx
import { Suspense } from "react"

export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SlowComponent />
    </Suspense>
  )
}
```

## Best Practices

### Component Organization

- Keep Server Components as close to the data as possible
- Move client-side logic down the component tree
- Use shared layouts for common UI
- Implement proper loading states
- Handle errors at appropriate levels

### State Management

- Keep state in Client Components
- Use Server Actions for mutations
- Implement optimistic updates
- Handle form submissions server-side
- Use React Cache for data

### Security

- Validate data server-side
- Handle authentication in layout
- Protect API routes
- Sanitize user input
- Implement proper CORS

## Server Actions

### Form Handling

```tsx
// Server Action
async function createProduct(formData: FormData) {
  "use server"

  const product = await db.products.create({
    data: {
      name: formData.get("name"),
      price: formData.get("price"),
    },
  })

  revalidatePath("/products")
  return product
}

// Usage in Client Component
;("use client")
export function ProductForm() {
  return (
    <form action={createProduct}>
      <input name="name" />
      <input name="price" type="number" />
      <button type="submit">Create</button>
    </form>
  )
}
```

### Optimistic Updates

```tsx
"use client"
export function OptimisticProduct() {
  const [optimisticData, setOptimisticData] = useState()

  async function action() {
    setOptimisticData(newData) // Show immediately
    await serverAction() // Update server
  }
}
```

## File Conventions

### Special Files

- `page.tsx` - Route pages
- `layout.tsx` - Shared layouts
- `loading.tsx` - Loading UI
- `error.tsx` - Error handling
- `not-found.tsx` - 404 pages
- `route.ts` - API endpoints

### Metadata

```tsx
export const metadata = {
  title: "Page Title",
  description: "Page description",
}
```
