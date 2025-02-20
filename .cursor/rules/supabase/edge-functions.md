---
description: Coding rules for Supabase Edge Functions
globs: "supabase/functions/**/*.ts"
---

# Supabase Edge Functions Guidelines

## Core Principles

### Use Web and Deno APIs

✅ Use built-in APIs:

```typescript
// Use native fetch
const response = await fetch(url)

// Use WebSocket API
const ws = new WebSocket(url)
```

❌ Avoid external HTTP clients:

```typescript
// Don't use axios or other HTTP clients
import axios from "npm:axios" // Bad
```

### Shared Utilities

✅ Correct shared utility imports:

```typescript
// functions/auth/index.ts
import { parseToken } from "../_shared/utils.ts"

// _shared/utils.ts
export function parseToken(token: string) {
  // Implementation
}
```

❌ Avoid cross-function dependencies:

```typescript
// Don't import directly from other functions
import { handler } from "../other-function/index.ts" // Bad
```

## Import Patterns

### Package Imports

✅ Use correct import specifiers:

```typescript
// Use npm: prefix with version

// Use node: for Node.js built-ins
import { randomBytes } from "node:crypto"
// Use jsr: for JSR packages
import { compress } from "jsr:@std/compress@0.218.2"
import { createClient } from "npm:@supabase/supabase-js@2.39.0"
import express from "npm:express@4.18.2"
```

❌ Avoid bare imports and CDNs:

```typescript
// Don't use bare imports
import express from "express" // Bad

// Don't use CDN imports
import { serve } from "https://deno.land/std@0.168.0/http/server.ts" // Bad
import pkg from "https://esm.sh/package" // Bad
```

## Server Setup

### Using Deno.serve

✅ Use built-in serve:

```typescript
Deno.serve(async (req: Request) => {
  const { name } = await req.json()
  return new Response(JSON.stringify({ message: `Hello ${name}!` }), {
    headers: {
      "Content-Type": "application/json",
      Connection: "keep-alive",
    },
  })
})
```

### Route Handling

✅ Use Express/Hono for multiple routes:

```typescript
import express from "npm:express@4.18.2"

const app = express()

// Prefix all routes with function name
app.get("/auth/login", async (req, res) => {
  // Handle login
})

app.post("/auth/register", async (req, res) => {
  // Handle registration
})

app.listen(8000)
```

## Environment Variables

### Built-in Variables

```typescript
// These are pre-populated
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const supabaseDbUrl = Deno.env.get("SUPABASE_DB_URL")
```

### Custom Variables

```typescript
// Set custom secrets using:
// supabase secrets set --env-file .env.local

const apiKey = Deno.env.get("CUSTOM_API_KEY")
const secretToken = Deno.env.get("SECRET_TOKEN")
```

## File Operations

### Temporary Files

✅ Use /tmp directory:

```typescript
// Using Node API
import { writeFile } from "node:fs/promises"

// Using Deno API
await Deno.writeFile("/tmp/data.json", new TextEncoder().encode(data))

await writeFile("/tmp/data.json", data)
```

❌ Avoid writing to other directories:

```typescript
// Don't write to other directories
await Deno.writeFile("./data.json", data) // Bad
```

## Background Tasks

### Using EdgeRuntime.waitUntil

✅ Handle long-running tasks:

```typescript
Deno.serve(async (req: Request) => {
  const response = new Response("Task started")

  // Run task in background
  EdgeRuntime.waitUntil(
    (async () => {
      await longRunningTask()
      await cleanup()
    })()
  )

  return response
})
```

## AI Integration

### Using Supabase.ai

```typescript
const model = new Supabase.ai.Session("gte-small")

Deno.serve(async (req: Request) => {
  const { text } = await req.json()

  const embeddings = await model.run(text, {
    mean_pool: true,
    normalize: true,
  })

  return new Response(JSON.stringify({ embeddings }), {
    headers: {
      "Content-Type": "application/json",
    },
  })
})
```

## Error Handling

### Standard Error Response

```typescript
interface ErrorResponse {
  error: {
    message: string
    code: string
    details?: unknown
  }
}

function handleError(error: unknown): Response {
  const response: ErrorResponse = {
    error: {
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
      code: "INTERNAL_ERROR",
    },
  }

  return new Response(JSON.stringify(response), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  })
}
```

## Type Safety

### Request/Response Types

```typescript
interface RequestPayload {
  name: string
  email: string
}

interface ResponsePayload {
  id: string
  message: string
}

Deno.serve(async (req: Request) => {
  try {
    const payload: RequestPayload = await req.json()

    const response: ResponsePayload = {
      id: crypto.randomUUID(),
      message: `Hello ${payload.name}`,
    }

    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    return handleError(error)
  }
})
```
