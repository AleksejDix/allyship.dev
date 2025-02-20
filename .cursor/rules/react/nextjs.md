---
description: Next.js 14 patterns and best practices
globs:
  - "app/**/*"
  - "public/**/*"
  - "next.config.*"
---

# Next.js Guidelines

## Project Structure

```
app/
├── (routes)/          # Route groups
│   ├── dashboard/     # Dashboard routes
│   └── auth/         # Auth routes
├── api/              # API routes
├── components/       # Shared components
├── lib/             # Utility functions
├── styles/          # Global styles
└── types/           # TypeScript types
```

## Routing Patterns

### Dynamic Routes

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await getPost(slug)
  return <Article post={post} />
}
```

### Route Groups

```tsx
app/
├── (marketing)      # Marketing pages
│   ├── about/
│   └── blog/
└── (app)           # App pages
    ├── dashboard/
    └── settings/
```

## Data Fetching

### Parallel Data Fetching

```tsx
export default async function Page() {
  // Fetch in parallel
  const [userData, productData] = await Promise.all([
    fetchUser(),
    fetchProducts(),
  ])

  return (
    <>
      <UserProfile user={userData} />
      <ProductList products={productData} />
    </>
  )
}
```

### Static Data

```tsx
// Generate static params
export async function generateStaticParams() {
  const posts = await fetchPosts()

  return posts.map((post) => ({
    slug: post.slug,
  }))
}
```

## Image Optimization

### Next Image Component

```tsx
import Image from "next/image"

export function OptimizedImage() {
  return (
    <Image
      src="/image.jpg"
      alt="Description"
      width={800}
      height={600}
      priority={true}
      quality={75}
    />
  )
}
```

## Performance

### Font Optimization

```tsx
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
})

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      {children}
    </html>
  )
}
```

### Metadata

```tsx
export const metadata = {
  title: {
    template: "%s | Site Name",
    default: "Site Name",
  },
  description: "Site description",
  openGraph: {
    title: "Site Name",
    description: "Site description",
    url: "https://example.com",
    siteName: "Site Name",
    images: [
      {
        url: "https://example.com/og.jpg",
      },
    ],
    locale: "en_US",
    type: "website",
  },
}
```

## Environment Variables

### Type-safe Env Variables

```typescript
// env.ts
import { z } from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),
})

export const env = envSchema.parse(process.env)
```

## Error Handling

### Error Components

```tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

## Loading States

### Loading Components

```tsx
// loading.tsx
export default function Loading() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin">Loading...</div>
    </div>
  )
}
```

## Configuration

### Next Config

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.example.com"],
  },
  experimental: {
    serverActions: true,
  },
  redirects() {
    return [
      {
        source: "/old-path",
        destination: "/new-path",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
```

## Deployment

### Production Build

```bash
# Build commands
next build        # Production build
next start        # Start production server
next lint        # Run linting
```

### Environment Configuration

```env
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
DATABASE_URL=postgresql://...
```
