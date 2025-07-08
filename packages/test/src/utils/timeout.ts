/**
 * Timeout utilities for test execution
 */

/**
 * Custom timeout error class
 */
export class TimeoutError extends Error {
  constructor(timeout: number, testName: string) {
    super(`Test "${testName}" timed out after ${timeout}ms`)
    this.name = 'TimeoutError'
  }
}

/**
 * Create a timeout promise that rejects after specified time
 */
function createTimeoutPromise(timeout: number, testName: string): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(timeout, testName))
    }, timeout)
  })
}

/**
 * Execute a function with timeout using Promise.race
 */
export async function withTimeout<T>(
  fn: () => Promise<T> | T,
  timeout: number,
  testName: string
): Promise<T> {
  if (timeout <= 0) {
    // No timeout, execute directly
    return await fn()
  }

  const result = fn()

  // If result is not a promise, return immediately
  if (!(result instanceof Promise)) {
    return result
  }

  // Race between the actual execution and timeout
  return Promise.race([
    result,
    createTimeoutPromise(timeout, testName)
  ])
}
