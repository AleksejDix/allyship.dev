/// <reference types="vitest" />

import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { fetchWebsitesForSpace } from "../../api/sdk"
// Import the hook after mocking the dependencies
import { useWebsiteData } from "../use-website-data"

// Mock the API SDK to avoid actual data fetching
vi.mock("../../api/sdk", () => {
  const mockWebsite = {
    id: "website-1",
    space_id: "space-123",
    user_id: null,
    url: "example.com",
    normalized_url: "example.com",
    theme: "BOTH",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return {
    fetchWebsitesForSpace: vi.fn().mockResolvedValue({
      data: [mockWebsite],
      error: null
    }),
    toRecord: vi.fn((array: any[], key: string) => {
      return array.reduce((acc: Record<string, any>, item: any) => {
        acc[item[key]] = item
        return acc
      }, {})
    })
  }
})

// Mock Supabase to avoid environment variable errors
vi.mock("@/core/supabase", () => {
  const mockClient: any = {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => ({
            data: [],
            error: null
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [{ id: "mock-id" }],
          error: null
        }))
      }))
    })),
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } })
    }
  }

  return {
    createClient: vi.fn(() => mockClient),
    supabase: mockClient
  }
})

describe("useWebsiteData Hook", () => {
  const spaceId = "space-123"

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("initializes with default values", async () => {
    const { result } = renderHook(() => useWebsiteData(spaceId))

    // Initially loading should be true
    expect(result.current.isLoading).toBe(true)

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verify the API was called
    expect(fetchWebsitesForSpace).toHaveBeenCalledWith(spaceId)

    // After loading, we should have the mocked data
    expect(result.current.websiteOptions.length).toBe(1)
    expect(result.current.websiteOptions[0].id).toBe("website-1")
    expect(result.current.selectedWebsiteId).toBeNull()
    expect(result.current.selectedWebsite).toBeNull()
    expect(result.current.error).toBeNull()
  })

  test("allows setting selected website ID", async () => {
    const { result } = renderHook(() => useWebsiteData(spaceId))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setSelectedWebsiteId("website-1")
    })

    expect(result.current.selectedWebsiteId).toBe("website-1")
    expect(result.current.selectedWebsite).toBeTruthy()
    expect(result.current.selectedWebsite?.id).toBe("website-1")
  })

  test("adds optimistic website updates", async () => {
    const { result } = renderHook(() => useWebsiteData(spaceId))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCount = result.current.websiteOptions.length

    const mockWebsite = {
      id: "website-2",
      space_id: spaceId,
      user_id: null,
      url: "example2.com",
      normalized_url: "example2.com",
      theme: "BOTH" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    act(() => {
      result.current.addOptimisticWebsite(mockWebsite)
    })

    // Check that the website was added to the options
    expect(result.current.websiteOptions.length).toBe(initialCount + 1)
    expect(
      result.current.websiteOptions.find((w) => w.id === "website-2")
    ).toEqual(mockWebsite)
    expect(result.current.selectedWebsiteId).toBe(mockWebsite.id)
  })

  test("handles undefined spaceId", () => {
    const { result } = renderHook(() => useWebsiteData(undefined))

    expect(result.current.websites).toEqual({})
    expect(result.current.websiteOptions).toEqual([])
    expect(result.current.selectedWebsiteId).toBeNull()
    expect(result.current.selectedWebsite).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test("can fetch websites manually", async () => {
    const { result } = renderHook(() => useWebsiteData(spaceId))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Clear the mock calls
    vi.clearAllMocks()

    // Trigger manual fetch
    act(() => {
      result.current.fetchWebsites()
    })

    // Should be loading again
    expect(result.current.isLoading).toBe(true)

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verify the API was called again
    expect(fetchWebsitesForSpace).toHaveBeenCalledWith(spaceId)
  })
})
