/// <reference types="vitest" />

import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"

import { PageCreateForm } from "../page-create-form"

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

describe("PageCreateForm", () => {
  const defaultProps = {
    websiteUrl: "example.com",
    onWebsiteUrlChange: vi.fn(),
    pagePath: "/test-path",
    onPagePathChange: vi.fn(),
    onSubmit: vi.fn(),
    isCreating: false,
    error: null,
    isDisabled: false,
    currentDomain: "example.com",
    currentPath: "/test-path"
  }

  test("renders with default props", () => {
    render(<PageCreateForm {...defaultProps} />)

    expect(screen.getByText("Add New Page")).toBeInTheDocument()
    expect(screen.getByLabelText("Website URL")).toHaveValue("example.com")
    expect(screen.getByLabelText("Page Path")).toHaveValue("/test-path")
    expect(screen.getByRole("button", { name: "Create Page" })).toBeEnabled()
  })

  test("shows loading state when creating", () => {
    render(<PageCreateForm {...defaultProps} isCreating={true} />)

    expect(
      screen.getByRole("button", { name: "Creating..." })
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Creating..." })).toBeDisabled()
  })

  test("shows error message when there is an error", () => {
    const errorMessage = "Error creating page"
    render(<PageCreateForm {...defaultProps} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  test("disables button when form is disabled", () => {
    render(<PageCreateForm {...defaultProps} isDisabled={true} />)

    expect(screen.getByRole("button", { name: "Create Page" })).toBeDisabled()
  })

  test("calls onWebsiteUrlChange when input changes", () => {
    render(<PageCreateForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText("Website URL"), {
      target: { value: "new-example.com" }
    })

    expect(defaultProps.onWebsiteUrlChange).toHaveBeenCalledWith(
      "new-example.com"
    )
  })

  test("calls onPagePathChange when input changes", () => {
    render(<PageCreateForm {...defaultProps} />)

    fireEvent.change(screen.getByLabelText("Page Path"), {
      target: { value: "/new-path" }
    })

    expect(defaultProps.onPagePathChange).toHaveBeenCalledWith("/new-path")
  })

  test("calls onSubmit when form is submitted", () => {
    render(<PageCreateForm {...defaultProps} />)

    // Get the form element by querying the DOM
    const form = screen.getByText("Create Page").closest("form")
    // Make sure the form element exists
    expect(form).not.toBeNull()
    if (form) {
      fireEvent.submit(form)
      expect(defaultProps.onSubmit).toHaveBeenCalled()
    }
  })

  test("shows current path notice when paths differ", () => {
    render(<PageCreateForm {...defaultProps} pagePath="/different-path" />)

    expect(screen.getByText(/Current path:/)).toBeInTheDocument()
  })
})
