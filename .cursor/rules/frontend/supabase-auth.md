---
description: Guidelines for writing Next.js apps with Supabase Auth
globs: "**/*.ts, **/*.tsx, **/*.js, **/*.jsx"
---

# Next.js + Supabase Auth Guidelines

## Core Principles

### Server-Side Data Fetching

✅ Always fetch data on the server:

```tsx
// app/page.tsx
import { createClient } from "@/lib/supabase/server"

export default async function Page() {
  const supabase = await createClient()

  const { data: posts } = await supabase.from("posts").select("*")

  return <PostList posts={posts} />
}
```

❌ Avoid client-side data fetching:

```tsx
// Don't fetch data on the client except for realtime
"use client"
export default function Page() {
  const { data } = await supabase  // Bad: Client-side fetching
    .from('posts')
    .select('*')
}
```

### Client Setup

✅ Correct browser client implementation:

```typescript
// lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Server Setup

✅ Correct server client implementation:

```typescript
// lib/supabase/server.ts
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
```

### Middleware Configuration

✅ Correct middleware implementation:

```typescript
// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect routes
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
```

## Auth Components

### Sign In Form

✅ Correct auth implementation:

```tsx
// components/auth/sign-in-form.tsx
"use client"

import { createClient } from "@/lib/supabase/client"

export function SignInForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    })

    if (error) {
      return console.error(error)
    }

    // Redirect handled by middleware
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" required />
      <input name="password" type="password" required />
      <button type="submit">Sign In</button>
    </form>
  )
}
```

### Auth Provider

✅ Correct provider implementation:

```tsx
// components/providers/supabase-provider.tsx
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { createClient } from "@/lib/supabase/client"

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase])

  return children
}
```

## Realtime Subscriptions

### Client-Side Subscriptions

✅ Correct realtime implementation:

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
          // Handle realtime updates
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

## Protected Routes

### Route Protection

✅ Correct route protection:

```tsx
// app/protected/layout.tsx
import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return children
}
```

## Error Handling

### Auth Error Handling

✅ Proper error handling:

```tsx
// components/auth/sign-up-form.tsx
"use client"

import { useState } from "react"

import { createClient } from "@/lib/supabase/client"

export function SignUpForm() {
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      return
    }

    // Show success message
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div role="alert" className="error">
          {error}
        </div>
      )}
      {/* Form fields */}
    </form>
  )
}
```

## Environment Setup

### Required Variables

✅ Include all required variables:

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### TypeScript Configuration

✅ Add type definitions:

```typescript
// types/supabase.ts
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          // ... other columns
        }
        Insert: {
          id: string
          username: string
          // ... insertable columns
        }
        Update: {
          id?: string
          username?: string
          // ... updatable columns
        }
      }
      // ... other tables
    }
  }
}
```
