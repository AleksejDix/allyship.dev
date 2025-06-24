import type { Expectation } from './types.js'

// Error constructor function
export function ExpectationError(message: string): Error {
  const error = new Error(message)
  error.name = 'ExpectationError'
  return error
}

// Create expectation using functional approach
function createExpectation<T>(actual: T): Expectation<T> {
  return {
  toBe(expected: T): void {
      if (actual !== expected) {
        throw ExpectationError(
          `Expected ${String(actual)} to be ${String(expected)}`
      )
    }
    },

  get not() {
    return {
      toBe: (expected: T) => {
          if (actual === expected) {
            throw ExpectationError(
              `Expected ${String(actual)} not to be ${String(expected)}`
          )
          }
        }
      }
    }
  }
}

/**
 * Create an expectation for testing
 */
export function expect<T>(actual: T): Expectation<T> {
  return createExpectation(actual)
}
