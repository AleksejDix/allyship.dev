# Allyship.dev Next.js Architecture

## Project Structure

We use a monorepo structure with the following organization:

```bash
allyship.dev/
├── apps/
│   ├── allyship/        # Main Next.js application
│   └── allystudio/      # Chrome extension
├── packages/            # Shared packages
└── .cursor/            # Project rules and guidelines
```

## Main Application Architecture (apps/allyship)

### Core Directories

```bash
apps/allyship/
├── app/                # App router pages and API routes
├── components/         # Shared UI components
├── features/          # Feature-specific modules
├── lib/               # Core utilities and configurations
├── providers/         # Context providers
├── public/            # Static assets
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Feature Organization

We organize features by domain:

```bash
features/
├── auth/              # Authentication feature
├── curriculum/        # Curriculum management
├── dashboard/         # User dashboard
└── assessment/        # Assessment system
```

Each feature follows this structure:

```bash
features/auth/
├── components/        # Feature-specific components
├── hooks/            # Custom hooks
├── lib/              # Feature-specific utilities
├── types/            # Feature-specific types
└── index.ts          # Public API
```

### Data Flow Architecture

1. **Database Layer**

```typescript
// lib/db.ts
import { Database } from "@/database.types"
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

2. **Server Actions**

```typescript
// app/actions/assessment.ts
"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"

export async function submitAssessment(data: AssessmentData) {
  const supabase = createClient()

  try {
    const { data: result, error } = await supabase
      .from("assessments")
      .insert(data)
      .select()
      .single()

    revalidatePath("/dashboard")
    return { data: result, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
```

3. **React Server Components**

```typescript
// app/dashboard/page.tsx
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { AssessmentList } from './assessment-list'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: assessments } = await supabase
    .from('assessments')
    .select()

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <AssessmentList assessments={assessments} />
    </Suspense>
  )
}
```

### State Management

1. **Server State**

- Use React Server Components for initial state
- Implement server actions for mutations
- Use revalidation for cache management

2. **Client State**

```typescript
// features/assessment/hooks/use-assessment-form.ts
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { submitAssessment } from "@/app/actions/assessment"

import { assessmentSchema } from "../schemas"

export function useAssessmentForm() {
  const form = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      // ...
    },
  })

  async function onSubmit(data: AssessmentData) {
    const result = await submitAssessment(data)
    // Handle result
  }

  return { form, onSubmit }
}
```

### Authentication Flow

We use Supabase Auth with middleware protection:

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return res
}
```

### Error Handling

We use a combination of error boundaries and toast notifications:

```typescript
// components/error-boundary.tsx
'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { toast } from 'sonner'

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

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

### Performance Optimization

1. **Route Segments**

```typescript
// app/layout.tsx
import { Suspense } from 'react'
import { Navigation } from '@/components/navigation'
import { Loading } from '@/components/loading'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loading />}>
          <Navigation />
        </Suspense>
        {children}
      </body>
    </html>
  )
}
```

2. **Image Optimization**

```typescript
// components/optimized-image.tsx
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
}

export function OptimizedImage({
  src,
  alt,
  className
}: OptimizedImageProps) {
  return (
    <div className={cn('relative aspect-video', className)}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}
```

### Testing Strategy

1. **Unit Tests** (Vitest)

```typescript
// features/assessment/__tests__/use-assessment-form.test.ts
import { act, renderHook } from "@testing-library/react"

import { useAssessmentForm } from "../hooks/use-assessment-form"

describe("useAssessmentForm", () => {
  it("validates form data", async () => {
    const { result } = renderHook(() => useAssessmentForm())

    await act(async () => {
      await result.current.onSubmit({
        // Test data
      })
    })

    expect(result.current.form.errors).toEqual({})
  })
})
```

2. **E2E Tests** (Playwright)

```typescript
// e2e/assessment.spec.ts
import { expect, test } from "@playwright/test"

test("user can complete assessment", async ({ page }) => {
  await page.goto("/assessment")
  await page.fill('[name="answer1"]', "Test answer")
  await page.click('button[type="submit"]')
  await expect(page.locator("text=Assessment submitted")).toBeVisible()
})
```

## Development Workflow

1. **Environment Setup**

```bash
# .env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

2. **Development Commands**

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest",
    "e2e": "playwright test",
    "lint": "next lint"
  }
}
```

3. **Database Type Generation**

```bash
supabase gen types typescript --project-id your-project-id > database.types.ts
```

## Deployment

We use Vercel for deployment with the following configuration:

```json
// vercel.json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "dev": false
    }
  }
}
```

This architecture provides:

- Clear separation of concerns
- Type-safe database operations
- Efficient state management
- Optimized performance
- Comprehensive testing strategy
- Streamlined deployment process
