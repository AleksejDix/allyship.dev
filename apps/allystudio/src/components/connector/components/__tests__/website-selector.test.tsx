/// <reference types="vitest" />

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { WebsiteSelector } from "../website-selector"

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
  getWebsites: vi.fn().mockResolvedValue([]),
  createWebsite: vi.fn().mockResolvedValue({ id: "mock-website-id" })
}))

describe("WebsiteSelector", () => {
  const mockWebsites = [
    {
      id: "website-1",
      space_id: "space-1",
      user_id: null,
      url: "https://example1.com",
      normalized_url: "example1.com",
      theme: "BOTH" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: "website-2",
      space_id: "space-1",
      user_id: null,
      url: "https://example2.com",
      normalized_url: "example2.com",
      theme: "BOTH" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const defaultProps = {
    websiteOptions: mockWebsites,
    selectedWebsiteId: null,
    onWebsiteChange: vi.fn(),
    onRefresh: vi.fn(),
    isLoading: false,
    highlightStatus: undefined,
    currentDomain: "example1.com",
    optimisticWebsite: null
  }

  test("renders with default props", () => {
    render(<WebsiteSelector {...defaultProps} />)

    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByText("example1.com")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Refresh/i })).toBeInTheDocument()
  })

  test("shows loading state", () => {
    render(<WebsiteSelector {...defaultProps} isLoading={true} />)

    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })

  test("shows empty state when no websites", () => {
    render(<WebsiteSelector {...defaultProps} websiteOptions={[]} />)

    expect(screen.getByText(/example1.com/i)).toBeInTheDocument()
    expect(screen.getByText(/not in list/i)).toBeInTheDocument()
  })

  test("calls onRefresh when refresh button is clicked", () => {
    render(<WebsiteSelector {...defaultProps} />)

    fireEvent.click(screen.getByRole("button", { name: /Refresh/i }))

    expect(defaultProps.onRefresh).toHaveBeenCalled()
  })

  test("calls onWebsiteChange when a website is selected", () => {
    render(<WebsiteSelector {...defaultProps} />)

    // Simulate selecting a website
    // Note: The actual implementation of the Select component might require more specific selection logic
    // This is a simplified example
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "website-1" }
    })

    expect(defaultProps.onWebsiteChange).toHaveBeenCalledWith("website-1")
  })

  test("shows highlight status when provided", () => {
    render(<WebsiteSelector {...defaultProps} highlightStatus="known" />)

    const button = screen.getByRole("combobox")
    expect(button).toHaveClass("border-success")
    expect(button).toHaveClass("bg-success/10")
  })

  test("shows optimistic website when provided", () => {
    const optimisticWebsite = {
      id: "temp-1",
      space_id: "space-1",
      user_id: null,
      url: "https://optimistic.com",
      normalized_url: "optimistic.com",
      theme: "BOTH" as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    render(
      <WebsiteSelector
        {...defaultProps}
        optimisticWebsite={optimisticWebsite}
      />
    )

    expect(screen.getByRole("combobox")).toBeInTheDocument()
  })
})
