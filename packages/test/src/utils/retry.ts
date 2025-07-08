/**
 * Retry utilities for test execution
 */

/**
 * Execute a function with retry logic
 */
export async function withRetry<T>(
  fn: () => Promise<T> | T,
  maxRetries: number,
  _testName: string
): Promise<{ result: T; attempts: number }> {
  if (maxRetries < 0) {
    maxRetries = 0
  }

  let lastError: Error | null = null
  let attempts = 0

  // Try initial execution + retries
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    attempts = attempt + 1

    try {
      const result = await fn()
      return { result, attempts }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        break
      }

      // Add small delay between retries to avoid hammering
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  // All attempts failed, throw the last error
  throw lastError
}
