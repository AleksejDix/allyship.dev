---
description: Error handling patterns and best practices
globs:
  - "**/*.{ts,tsx}"
  - "**/error.{ts,tsx}"
  - "**/errors/**/*"
---

# Error Handling Guidelines

## Error Boundaries

### React Error Boundary

```tsx
"use client"

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundaryComponent
      fallback={
        <div role="alert" className="error-container">
          <h2>Something went wrong</h2>
          <p>Please try again or contact support</p>
        </div>
      }
    >
      {children}
    </ErrorBoundaryComponent>
  )
}
```

## Server Errors

### API Error Handling

```typescript
export function handleServerError(error: unknown): ServerResponse<never> {
  if (error instanceof ZodError) {
    return {
      success: false,
      error: {
        message: "Validation failed",
        status: 400,
        code: "validation_failed",
        details: error.flatten(),
      },
    }
  }

  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: {
        message: "Database operation failed",
        status: 500,
        code: "database_error",
      },
    }
  }

  // Default error response
  return {
    success: false,
    error: {
      message: "An unexpected error occurred",
      status: 500,
      code: "internal_server_error",
    },
  }
}
```

## Client Errors

### Form Error Handling

```tsx
export function Form() {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div role="alert" aria-live="polite">
        {form.formState.errors.root?.message}
      </div>
      {/* Form fields */}
    </form>
  )
}
```

## Error Types

### Custom Error Classes

```typescript
export class ValidationError extends Error {
  constructor(
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = "ValidationError"
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "AuthenticationError"
  }
}

export class DatabaseError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "DatabaseError"
  }
}
```

## Error Logging

### Error Monitoring

```typescript
export function logError(error: unknown, context: Record<string, unknown>) {
  console.error({
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  })
}
```

## Error Recovery

### Retry Logic

```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts: number
    delay: number
  }
): Promise<T> {
  let lastError: unknown

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === options.maxAttempts) break
      await new Promise((resolve) => setTimeout(resolve, options.delay))
    }
  }

  throw lastError
}
```

## User Feedback

### Error Messages

```tsx
export function ErrorMessage({ error }: { error: Error }) {
  const message = useMemo(() => {
    if (error instanceof ValidationError) {
      return "Please check your input and try again"
    }
    if (error instanceof AuthenticationError) {
      return "Please sign in to continue"
    }
    return "An unexpected error occurred"
  }, [error])

  return (
    <div role="alert" className="error-message">
      {message}
    </div>
  )
}
```

## Error Prevention

### Input Validation

```typescript
const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export function validateInput<T>(
  data: unknown,
  schema: z.Schema<T>
): Result<T, ValidationError> {
  const result = schema.safeParse(data)
  if (!result.success) {
    return {
      success: false,
      error: new ValidationError("Validation failed", result.error),
    }
  }
  return { success: true, data: result.data }
}
```
