---
description: Database and API patterns with Supabase
globs:
  - "**/db/**/*"
  - "**/api/**/*"
  - "**/*.server.ts"
---

# Database and API Guidelines

## Database Schema

### Type Generation

```typescript
// Never modify database.types.ts directly
// ❌ Don't do this:
export interface Database {
  public: {
    Tables: {
      Page: {
        Row: {
          status: "idle" | "scanning" | "completed" | "failed"
        }
      }
    }
  }
}

// ✅ Instead:
// 1. Create/modify database migrations
// 2. Run migrations
// 3. Generate types:
// supabase gen types typescript --project-id your-project-id > database.types.ts
```

## URL Handling

### URL Normalization

❌ Never store URLs with:

```typescript
// Don't store URLs with query parameters
"https://example.com/path?param=value" // Bad
"https://example.com/search?q=test" // Bad

// Don't store URLs with fragments
"https://example.com/path#section" // Bad

// Don't store URLs with tracking parameters
"https://example.com?utm_source=x" // Bad
```

✅ Always normalize URLs:

```typescript
// Clean base URLs only
"https://example.com/path" // Good
"https://example.com/products/item" // Good
"https://example.com/blog/post-1" // Good
```

## API Patterns

### Response Structure

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
}

// Usage
export async function handler(): Promise<ApiResponse<Data>> {
  try {
    const data = await getData()
    return { success: true, data }
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Error Handling

```typescript
export function handleApiError(error: unknown): ApiResponse<never> {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: {
        code: "validation_error",
        message: "Validation failed",
        details: error.flatten(),
      },
    }
  }

  // Default error
  return {
    success: false,
    error: {
      code: "internal_error",
      message: "An unexpected error occurred",
    },
  }
}
```

## Database Operations

### Query Patterns

```typescript
// Use type-safe queries
const { data, error } = await supabase
  .from("posts")
  .select("id, title, author(*)")
  .eq("status", "published")
  .order("created_at", { ascending: false })
  .limit(10)

// Handle errors properly
if (error) {
  throw new DatabaseError(error.message)
}
```

### Transactions

```typescript
// Use transactions for related operations
const { data, error } = await supabase.rpc("create_post_with_tags", {
  post_title: "Title",
  post_content: "Content",
  tags: ["tag1", "tag2"],
})
```

## Rate Limiting

```typescript
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "1mb",
    },
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
}
```

## Caching

### Response Caching

```typescript
export async function GET() {
  // Cache successful responses
  const cacheKey = "key"
  const cached = await redis.get(cacheKey)

  if (cached) {
    return new Response(cached, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    })
  }

  const data = await getData()
  await redis.set(cacheKey, JSON.stringify(data), "EX", 60)

  return Response.json(data)
}
```

## Security

### Input Validation

```typescript
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
})

export async function POST(req: Request) {
  const body = await req.json()
  const result = schema.safeParse(body)

  if (!result.success) {
    return Response.json({ error: "Invalid input" }, { status: 400 })
  }
}
```
