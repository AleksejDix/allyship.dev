---
description: Data fetching patterns and best practices
globs: "**/*.{ts,tsx}"
---

# Data Fetching Guidelines

## Server Components

### Basic Data Fetching

✅ Use Server Components for initial data:

```tsx
// app/posts/page.tsx
import { createClient } from "@/lib/supabase/server"

export default async function PostsPage() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      created_at,
      author:profiles(
        id,
        username,
        avatar_url
      )
    `
    )
    .order("created_at", { ascending: false })

  return <PostList posts={posts} />
}
```

### Parallel Data Fetching

✅ Fetch data in parallel:

```tsx
// app/dashboard/page.tsx
import { Suspense } from "react"

import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch data in parallel
  const [userPromise, postsPromise, statsPromise] = await Promise.all([
    supabase.from("profiles").select().single(),
    supabase.from("posts").select().limit(5),
    supabase.from("analytics").select().single(),
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfile promise={userPromise} />
      </Suspense>

      <Suspense fallback={<RecentPostsSkeleton />}>
        <RecentPosts promise={postsPromise} />
      </Suspense>

      <Suspense fallback={<StatsSkeleton />}>
        <Stats promise={statsPromise} />
      </Suspense>
    </div>
  )
}
```

## Server Actions

### Data Mutations

✅ Use Server Actions for mutations:

```tsx
// app/actions/posts.ts
"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { postSchema } from "@/lib/validations/post"

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  // Validate input
  const validatedFields = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return { error: "Invalid fields" }
  }

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Create post
  const { error } = await supabase.from("posts").insert({
    ...validatedFields.data,
    user_id: user.id,
  })

  if (error) return { error: "Failed to create post" }

  // Revalidate cache
  revalidatePath("/posts")
  return { success: true }
}
```

## Client Components

### Realtime Data

✅ Use Client Components for realtime updates:

```tsx
// components/realtime-posts.tsx
"use client"

import { useEffect, useState } from "react"

import { createClient } from "@/lib/supabase/client"

export function RealtimePosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "posts",
        },
        (payload) => {
          switch (payload.eventType) {
            case "INSERT":
              setPosts((current) => [payload.new as Post, ...current])
              break
            case "UPDATE":
              setPosts((current) =>
                current.map((post) =>
                  post.id === payload.new.id ? (payload.new as Post) : post
                )
              )
              break
            case "DELETE":
              setPosts((current) =>
                current.filter((post) => post.id !== payload.old.id)
              )
              break
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return <PostList posts={posts} />
}
```

## Error Handling

### Error Boundaries

✅ Use Error Boundaries for data fetching:

```tsx
// components/error-boundary.tsx
"use client"

import { useEffect } from "react"

interface ErrorBoundaryProps {
  error: Error
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">
            Error Loading Data
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              onClick={reset}
              className="rounded-md bg-red-100 px-2 py-1.5"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
```

## Loading States

### Loading Skeletons

✅ Create meaningful loading states:

```tsx
// components/skeletons/post-skeleton.tsx
export function PostSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="space-y-3 mt-4">
        <div className="h-3 bg-gray-200 rounded" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  )
}

// app/posts/loading.tsx
export default function Loading() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  )
}
```

## Caching & Revalidation

### Cache Revalidation

✅ Implement proper cache revalidation:

```tsx
// app/actions/cache.ts
"use server"

import { revalidatePath, revalidateTag } from "next/cache"

export async function revalidateData(path: string) {
  revalidatePath(path)
}

export async function revalidatePost(id: string) {
  revalidateTag(`post-${id}`)
}

// Usage in components
export async function PostPage({ id }: { id: string }) {
  const supabase = await createClient()

  const { data: post } = await supabase
    .from("posts")
    .select()
    .eq("id", id)
    .single()
    .withTags([`post-${id}`])

  return <PostDetail post={post} />
}
```

## Optimistic Updates

### Optimistic UI

✅ Implement optimistic updates:

```tsx
// components/post-like-button.tsx
"use client"

import { experimental_useOptimistic as useOptimistic } from "react"

import { likePost } from "@/app/actions/posts"

export function LikeButton({ post }: { post: Post }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    post.likes,
    (state: number) => state + 1
  )

  async function handleLike() {
    addOptimisticLike(undefined)
    await likePost(post.id)
  }

  return (
    <button onClick={handleLike} className="flex items-center gap-2">
      <HeartIcon />
      <span>{optimisticLikes}</span>
    </button>
  )
}
```

## Pagination

### Cursor Pagination

✅ Implement efficient pagination:

```tsx
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

// lib/pagination.ts
export async function getPaginatedPosts(cursor?: string) {
  const supabase = await createClient()

  const query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (cursor) {
    query.lt("created_at", cursor)
  }

  const { data: posts, error } = await query

  return {
    posts,
    nextCursor: posts?.[posts.length - 1]?.created_at,
  }
}

// components/infinite-posts.tsx
;("use client")

export function InfinitePosts({ initialPosts }: { initialPosts: Post[] }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteScroll({
      initialData: initialPosts,
      fetchFn: getPaginatedPosts,
    })

  return (
    <div>
      {data.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  )
}
```
