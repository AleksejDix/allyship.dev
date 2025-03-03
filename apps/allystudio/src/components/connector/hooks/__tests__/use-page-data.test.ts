/// <reference types="vitest" />

import { act, renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { fetchPagesForWebsite } from "../../api/sdk"
// Import the hook after mocking the dependencies
import { usePageData } from "../use-page-data"

// Mock the API SDK to avoid actual data fetching
vi.mock("../../api/sdk", () => {
  const mockPage = {
    id: "page-1",
    website_id: "website-1",
    path: "/test-path",
    url: "example.com/test-path",
    normalized_url: "example.com/test-path",
    deleted_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  return {
    fetchPagesForWebsite: vi.fn().mockResolvedValue({
      data: [mockPage],
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

describe("usePageData Hook", () => {
  const mockWebsite = {
    id: "website-1",
    space_id: "space-123",
    user_id: null,
    url: "example.com",
    normalized_url: "example.com",
    theme: "BOTH" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("initializes with default values when no website is selected", () => {
    const { result } = renderHook(() => usePageData(null))

    expect(result.current.pages).toEqual({})
    expect(result.current.pageOptions).toEqual([])
    expect(result.current.selectedPageId).toBeNull()
    expect(result.current.selectedPage).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  test("fetches pages when a website is selected", async () => {
    const { result } = renderHook(() => usePageData(mockWebsite))

    // Initially loading should be true
    expect(result.current.isLoading).toBe(true)

    // Wait for the async operations to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verify the API was called
    expect(fetchPagesForWebsite).toHaveBeenCalledWith(mockWebsite.id)

    // After loading, we should have the mocked data
    expect(result.current.pageOptions.length).toBe(1)
    expect(result.current.pageOptions[0].id).toBe("page-1")
    expect(result.current.selectedPageId).toBeNull()
    expect(result.current.selectedPage).toBeNull()
    expect(result.current.error).toBeNull()
  })

  test("allows setting selected page ID", async () => {
    const { result } = renderHook(() => usePageData(mockWebsite))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    act(() => {
      result.current.setSelectedPageId("page-1")
    })

    expect(result.current.selectedPageId).toBe("page-1")
    expect(result.current.selectedPage).toBeTruthy()
    expect(result.current.selectedPage?.id).toBe("page-1")
  })

  test("adds optimistic page updates", async () => {
    const { result } = renderHook(() => usePageData(mockWebsite))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    const initialCount = result.current.pageOptions.length

    const mockPage = {
      id: "page-2",
      website_id: mockWebsite.id,
      path: "/new-path",
      url: "example.com/new-path",
      normalized_url: "example.com/new-path",
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    act(() => {
      result.current.addOptimisticPage(mockPage)
    })

    // Check that the page was added to the options
    expect(result.current.pageOptions.length).toBe(initialCount + 1)
    expect(result.current.pageOptions.find((p) => p.id === "page-2")).toEqual(
      mockPage
    )
    expect(result.current.selectedPageId).toBe(mockPage.id)
  })

  test("can fetch pages manually", async () => {
    const { result } = renderHook(() => usePageData(mockWebsite))

    // Wait for the initial load
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Clear the mock calls
    vi.clearAllMocks()

    // Trigger manual fetch
    act(() => {
      result.current.fetchPages()
    })

    // Should be loading again
    expect(result.current.isLoading).toBe(true)

    // Wait for the fetch to complete
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    // Verify the API was called again
    expect(fetchPagesForWebsite).toHaveBeenCalledWith(mockWebsite.id)
  })
})
