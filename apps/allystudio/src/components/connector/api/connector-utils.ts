/**
 * Converts an array to a Record object using a specified key or key function
 */
export function toRecord<T extends Record<string, any>>(
  array: T[],
  keyField: keyof T,
  keyFn?: (item: T) => string
): Record<string, T> {
  return array.reduce(
    (acc, item) => {
      const key = keyFn ? keyFn(item) : String(item[keyField])
      acc[key] = item
      return acc
    },
    {} as Record<string, T>
  )
}

/**
 * Unified error handler for API requests
 * Provides consistent error handling across all API functions
 */
export function handleApiError<T>(
  error: unknown,
  operation: string,
  entity: string,
  context: Record<string, any> = {}
): { data: T | null; error: Error } {
  // Extract error information
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorCode = (error as any)?.code
  const errorDetails = (error as any)?.details

  // Create structured error log
  const logEntry = {
    timestamp: new Date().toISOString(),
    operation,
    entity,
    errorMessage,
    errorCode,
    errorDetails,
    ...context
  }

  // Log error (in production, send to monitoring service)
  console.error(`Error ${operation} ${entity}:`, logEntry)

  // Return user-friendly error
  return {
    data: null,
    error:
      error instanceof Error ? error : new Error(`Error ${operation} ${entity}`)
  }
}

/**
 * Type for standard API response
 */
export type ApiResponse<T> = {
  data: T | null
  error: Error | null
}

/**
 * Check authentication status
 * @returns Object with user if authenticated, error if not
 */
export async function checkAuth(supabase: any) {
  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser()

    if (error) throw error
    if (!user) throw new Error("Authentication required")

    return { user, error: null }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error : new Error("Authentication failed")
    }
  }
}
