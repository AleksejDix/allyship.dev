---
description: Monitoring and analytics patterns and best practices
globs: "**/*.{ts,tsx}"
---

# Monitoring Guidelines

## Error Tracking

### Error Boundary

✅ Set up error boundaries:

```tsx
// components/error-boundary.tsx
"use client"

import { useEffect } from "react"
import * as Sentry from "@sentry/nextjs"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error to error reporting service
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="grid place-items-center min-h-[400px] px-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          {error.message || "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p className="text-sm text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### Error Logging

✅ Implement error logging:

```tsx
// lib/error-logging.ts
import * as Sentry from "@sentry/nextjs"

interface ErrorContext {
  userId?: string
  action?: string
  metadata?: Record<string, unknown>
}

export function logError(error: unknown, context?: ErrorContext) {
  if (error instanceof Error) {
    Sentry.withScope((scope) => {
      if (context?.userId) {
        scope.setUser({ id: context.userId })
      }
      if (context?.action) {
        scope.setTag("action", context.action)
      }
      if (context?.metadata) {
        scope.setContext("metadata", context.metadata)
      }
      Sentry.captureException(error)
    })
  } else {
    Sentry.captureMessage(String(error))
  }
}

// Usage in components
try {
  await submitForm(data)
} catch (error) {
  logError(error, {
    userId: user.id,
    action: "form_submission",
    metadata: { formData: data },
  })
}
```

## Performance Monitoring

### Web Vitals

✅ Track web vitals:

```tsx
// lib/vitals.ts
import { onCLS, onFID, onLCP } from "web-vitals"

export function reportWebVitals(metric: any) {
  const body = {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
  }

  // Send to analytics
  fetch("/api/vitals", {
    method: "POST",
    body: JSON.stringify(body),
  })
}

// Usage in app
export function WebVitals() {
  useEffect(() => {
    onCLS(reportWebVitals)
    onFID(reportWebVitals)
    onLCP(reportWebVitals)
  }, [])

  return null
}
```

### Performance Events

✅ Track performance events:

```tsx
// lib/performance.ts
export function trackTiming(
  name: string,
  duration: number,
  category = "performance"
) {
  if (typeof window !== "undefined") {
    // Send to analytics
    window.gtag("event", "timing_complete", {
      name,
      value: duration,
      event_category: category,
    })
  }
}

// Usage in components
const startTime = performance.now()

try {
  await fetchData()
} finally {
  const duration = performance.now() - startTime
  trackTiming("data_fetch", duration)
}
```

## Analytics

### Page Views

✅ Track page views:

```tsx
// components/analytics.tsx
"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"

export function AnalyticsProvider() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      // Track page view
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_search: searchParams.toString(),
      })
    }
  }, [pathname, searchParams])

  return <Analytics />
}
```

### User Events

✅ Track user interactions:

```tsx
// lib/analytics.ts
type EventName =
  | "button_click"
  | "form_submit"
  | "link_click"
  | "search"
  | "filter"
  | "sort"

interface EventProperties {
  [key: string]: string | number | boolean
}

export function trackEvent(name: EventName, properties?: EventProperties) {
  if (typeof window !== "undefined") {
    window.gtag("event", name, properties)
  }
}

// Usage in components
export function SearchForm() {
  const handleSubmit = async (data: SearchFormData) => {
    trackEvent("search", {
      query: data.query,
      filters: data.filters.join(","),
    })

    await performSearch(data)
  }

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>
}
```

## User Monitoring

### Session Recording

✅ Set up session recording:

```tsx
// components/session-recording.tsx
"use client"

import { useEffect } from "react"
import * as LogRocket from "logrocket"

interface SessionRecordingProps {
  user?: {
    id: string
    email: string
    name: string
  }
}

export function SessionRecording({ user }: SessionRecordingProps) {
  useEffect(() => {
    LogRocket.init("app/id")

    if (user) {
      LogRocket.identify(user.id, {
        name: user.name,
        email: user.email,
      })
    }
  }, [user])

  return null
}
```

### User Feedback

✅ Collect user feedback:

```tsx
// components/feedback-widget.tsx
"use client"

import { useState } from "react"

import { trackEvent } from "@/lib/analytics"

export function FeedbackWidget() {
  const [rating, setRating] = useState<number>()
  const [feedback, setFeedback] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    trackEvent("feedback_submit", {
      rating,
      feedback,
      page: window.location.pathname,
    })

    await submitFeedback({
      rating,
      feedback,
      url: window.location.href,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label>How would you rate your experience?</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className={cn(
                "h-10 w-10 rounded-full",
                rating === value ? "bg-primary text-white" : "bg-muted"
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <label>Any additional feedback?</label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full rounded-md border p-2"
          rows={3}
        />
      </div>
      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-white"
      >
        Submit Feedback
      </button>
    </form>
  )
}
```

## API Monitoring

### API Performance

✅ Monitor API performance:

```tsx
// lib/api-monitoring.ts
interface APIMetrics {
  endpoint: string
  method: string
  duration: number
  status: number
  error?: string
}

export function trackAPIMetrics({
  endpoint,
  method,
  duration,
  status,
  error,
}: APIMetrics) {
  // Send to monitoring service
  fetch("/api/metrics", {
    method: "POST",
    body: JSON.stringify({
      type: "api_request",
      endpoint,
      method,
      duration,
      status,
      error,
      timestamp: new Date().toISOString(),
    }),
  })
}

// Usage in API routes
export async function GET(request: Request) {
  const startTime = performance.now()
  let status = 200
  let error: string | undefined

  try {
    const data = await fetchData()
    return Response.json(data)
  } catch (e) {
    status = 500
    error = e instanceof Error ? e.message : "Unknown error"
    throw e
  } finally {
    trackAPIMetrics({
      endpoint: request.url,
      method: "GET",
      duration: performance.now() - startTime,
      status,
      error,
    })
  }
}
```

### Health Checks

✅ Implement health checks:

```tsx
// app/api/health/route.ts
import { headers } from "next/headers"

export async function GET() {
  const services = {
    database: await checkDatabase(),
    cache: await checkCache(),
    search: await checkSearch(),
  }

  const isHealthy = Object.values(services).every(
    (status) => status === "healthy"
  )

  return Response.json(
    {
      status: isHealthy ? "healthy" : "unhealthy",
      services,
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_VERSION,
    },
    {
      status: isHealthy ? 200 : 503,
      headers: headers(),
    }
  )
}
```
