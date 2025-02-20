---
description: Performance optimization patterns and best practices
globs:
  - "**/*.{ts,tsx}"
  - "**/performance/**/*"
  - "**/optimizations/**/*"
---

# Performance Optimization Guidelines

## Image Optimization

### Next.js Image Component

```tsx
export function OptimizedImage({ src, alt, width, height }: ImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading="lazy"
      className="object-cover"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}
```

### Responsive Images

```tsx
export function ResponsiveImage({ src, alt }: { src: string; alt: string }) {
  return (
    <picture>
      <source
        media="(min-width: 1024px)"
        srcSet={`${src}?w=1920 1x, ${src}?w=3840 2x`}
      />
      <source
        media="(min-width: 768px)"
        srcSet={`${src}?w=1024 1x, ${src}?w=2048 2x`}
      />
      <Image
        src={src}
        alt={alt}
        width={640}
        height={360}
        className="w-full h-auto"
      />
    </picture>
  )
}
```

## Component Optimization

### Memoization

```tsx
const MemoizedComponent = memo(function ExpensiveComponent({
  data,
  onAction,
}: Props) {
  return <div>{/* Expensive rendering */}</div>
}, arePropsEqual)

function arePropsEqual(oldProps: Props, newProps: Props) {
  return (
    oldProps.data.id === newProps.data.id &&
    oldProps.onAction === newProps.onAction
  )
}
```

### Callback Optimization

```tsx
function ParentComponent() {
  const memoizedCallback = useCallback((id: string) => {
    // Handle action
  }, []) // Empty deps array if callback doesn't depend on props/state

  return <ChildComponent onAction={memoizedCallback} />
}
```

## Data Fetching

### Parallel Data Fetching

```tsx
export default async function Page() {
  // Fetch data in parallel
  const [userData, postsData, settingsData] = await Promise.all([
    fetchUser(),
    fetchPosts(),
    fetchSettings(),
  ])

  return (
    <div>
      <UserProfile user={userData} />
      <PostList posts={postsData} />
      <Settings data={settingsData} />
    </div>
  )
}
```

### Streaming with Suspense

```tsx
export default function Page() {
  return (
    <div>
      <header>
        <h1>Dashboard</h1>
      </header>

      {/* Show immediately */}
      <nav>
        <SideNav />
      </nav>

      {/* Stream in after initial load */}
      <Suspense fallback={<TableSkeleton />}>
        <DataTable />
      </Suspense>

      {/* Stream in last */}
      <Suspense fallback={<WidgetSkeleton />}>
        <Widgets />
      </Suspense>
    </div>
  )
}
```

## Code Splitting

### Dynamic Imports

```tsx
const Editor = dynamic(() => import("./Editor"), {
  loading: () => <EditorSkeleton />,
  ssr: false, // Disable SSR for client-only components
})

export function Page() {
  return (
    <div>
      <h1>Edit Document</h1>
      <Editor />
    </div>
  )
}
```

### Route Segments

```tsx
// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation"

export default async function BlogPost({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const post = await fetchPost(slug)

  if (!post) {
    notFound()
  }

  return (
    <article>
      <h1>{post.title}</h1>
      <MDXRemote source={post.content} />
    </article>
  )
}
```

## Bundle Optimization

### Import Optimization

```typescript
// ❌ Don't import entire library
import _ from "lodash"
// ✅ Import only what you need
import debounce from "lodash/debounce"
```

### Tree Shaking

```typescript
// Export individual functions
export function util1() {}
export function util2() {}

// Instead of default export
export default {
  util1,
  util2,
}
```

## Rendering Optimization

### List Virtualization

```tsx
import { useVirtualizer } from "@tanstack/react-virtual"

export function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: "absolute",
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {items[virtualItem.index].content}
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Font Optimization

### Font Loading

```tsx
import { Inter } from "next/font/google"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-inter",
})

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
```

## API Optimization

### Response Caching

```typescript
import { unstable_cache } from "next/cache"

export const getCachedData = unstable_cache(
  async (key: string) => {
    const data = await fetchData(key)
    return data
  },
  ["cache-key"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["data"],
  }
)
```

### Batch Requests

```typescript
export async function batchedApiCall<T>(
  ids: string[],
  batchSize = 50
): Promise<T[]> {
  const results: T[] = []

  for (let i = 0; i < ids.length; i += batchSize) {
    const batch = ids.slice(i, i + batchSize)
    const batchResults = await Promise.all(batch.map((id) => fetchItem(id)))
    results.push(...batchResults)
  }

  return results
}
```
