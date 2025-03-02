/// <reference types="vitest" />

import { act, renderHook } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { usePageCreator } from "../use-page-creator"

// Mock Supabase to avoid environment variable errors
vi.mock("@/core/supabase", () => {
  const mockClient = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            is: vi.fn(() => ({
              data: [],
              error: null
            }))
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [{ id: "mock-id" }],
          error: null
        }))
      }))
    }))
  }

  return {
    createClient: vi.fn(() => mockClient),
    supabase: mockClient
  }
})

describe("usePageCreator Hook", () => {
  const spaceId = "space-123"
  const onSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("initializes with default values", () => {
    const { result } = renderHook(() => usePageCreator(spaceId, onSuccess))

    expect(result.current.newWebsiteUrl).toBe("")
    expect(result.current.newPagePath).toBe("")
    expect(result.current.error).toBeNull()
    expect(result.current.isCreating).toBe(false)
  })

  test("allows setting website URL", () => {
    const { result } = renderHook(() => usePageCreator(spaceId, onSuccess))

    act(() => {
      result.current.setNewWebsiteUrl("example.com")
    })

    expect(result.current.newWebsiteUrl).toBe("example.com")
  })

  test("allows setting page path", () => {
    const { result } = renderHook(() => usePageCreator(spaceId, onSuccess))

    act(() => {
      result.current.setNewPagePath("/test-path")
    })

    expect(result.current.newPagePath).toBe("/test-path")
  })

  // Additional tests would be added here to test the hook's functionality
  // The tests would check createPage, createWebsiteAndPage, resetForm, error handling, etc.
})
