import { describe, test, expect as vitestExpect } from 'vitest'
import { expect, ExpectationError } from '../src/core/expectation'

describe('Expectation System', () => {
  test('basic toBe works', () => {
    expect(5).toBe(5)
    expect('hello').toBe('hello')
    expect(true).toBe(true)
    expect(null).toBe(null)
  })

  test('toBe throws on mismatch', () => {
    vitestExpect(() => {
      expect(5).toBe(10)
    }).toThrow('Expected 5 to be 10')

    vitestExpect(() => {
      expect('hello').toBe('world')
    }).toThrow('Expected hello to be world')
  })

  test('negation with not.toBe works', () => {
    expect(5).not.toBe(10)
    expect('hello').not.toBe('world')
    expect(true).not.toBe(false)
  })

  test('negation throws when values match', () => {
    vitestExpect(() => {
      expect(5).not.toBe(5)
    }).toThrow('Expected 5 not to be 5')

    vitestExpect(() => {
      expect('test').not.toBe('test')
    }).toThrow('Expected test not to be test')
  })

  test('ExpectationError function works', () => {
    const error = ExpectationError('test message')
    vitestExpect(error).toBeInstanceOf(Error)
    vitestExpect(error.message).toBe('test message')
    vitestExpect(error.name).toBe('ExpectationError')
  })

  test('handles undefined and null correctly', () => {
    expect(undefined).toBe(undefined)
    expect(null).toBe(null)

    vitestExpect(() => {
      expect(undefined).toBe(null as any)
    }).toThrow()
  })

  test('handles string formatting in errors', () => {
    vitestExpect(() => {
      expect('hello').toBe('world')
    }).toThrow('Expected hello to be world')
  })
})
