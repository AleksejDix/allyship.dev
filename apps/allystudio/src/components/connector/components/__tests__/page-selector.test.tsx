/// <reference types="vitest" />

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { PageSelector } from "../page-selector"

// Mock the Supabase module to avoid environment variable errors
vi.mock("@/core/supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          data: [],
          error: null
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [],
          error: null
        }))
      }))
    })),
    auth: {
      getUser: vi.fn(() => ({
        data: { user: { id: "mock-user-id" } },
        error: null
      }))
    }
  }
}))

// Mock the API SDK to avoid actual data fetching
vi.mock("../../api/sdk", () => ({
  getPages: vi.fn().mockResolvedValue([]),
  createPage: vi.fn().mockResolvedValue({ id: "mock-page-id" })
}))

describe("PageSelector", () => {
  const mockPages = [
    {
      id: "page-1",
      website_id: "website-1",
      path: "/path-1",
      url: "example.com/path-1",
      normalized_url: "example.com/path-1",
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "page-2",
      website_id: "website-1",
      path: "/path-2",
      url: "example.com/path-2",
      normalized_url: "example.com/path-2",
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const defaultProps = {
    pageOptions: mockPages,
    selectedPageId: null,
    onPageChange: vi.fn(),
    onRefresh: vi.fn(),
    isLoading: false,
    disabled: false,
    highlightStatus: undefined,
    currentPath: "/path-1",
    optimisticPage: null,
    currentDomain: "example.com"
  }

  test("renders with default props", () => {
    render(<PageSelector {...defaultProps} />)

    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByText("/path-1")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument()
  })

  test("shows loading state", () => {
    render(<PageSelector {...defaultProps} isLoading={true} />)

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })

  test("disables selector when disabled", () => {
    render(<PageSelector {...defaultProps} disabled={true} />)

    expect(screen.getByRole("combobox")).toBeDisabled()
  })

  test("shows empty state when no pages", () => {
    render(<PageSelector {...defaultProps} pageOptions={[]} />)

    expect(screen.getByText("/path-1")).toBeInTheDocument()
    const button = screen.getByRole("combobox")
    expect(button).toHaveClass("text-destructive")
    expect(button).toHaveClass("border-destructive")
  })

  test("calls onRefresh when refresh button is clicked", () => {
    render(<PageSelector {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: /Refresh/i }))

    expect(defaultProps.onRefresh).toHaveBeenCalled()
  })

  test("shows highlight status when provided", () => {
    render(<PageSelector {...defaultProps} highlightStatus="known" />)

    const button = screen.getByRole("combobox")
    expect(button).toHaveClass("border-success")
    expect(button).toHaveClass("bg-success/10")
  })

  test("shows optimistic page when provided", () => {
    const optimisticPage = {
      id: "temp-1",
      website_id: "website-1",
      path: "/optimistic-path",
      url: "example.com/optimistic-path",
      normalized_url: "example.com/optimistic-path",
      deleted_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    render(<PageSelector {...defaultProps} optimisticPage={optimisticPage} />)

    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })
})
