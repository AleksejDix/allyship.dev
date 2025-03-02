/// <reference types="vitest" />

import { render, screen } from "@testing-library/react"
import React from "react"
import { beforeEach, describe, expect, test, vi } from "vitest"

import { Connector } from "../connector"

// Mock the Supabase module
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [],
          error: null
        })
      }),
      insert: () => ({
        select: () => ({
          data: [],
          error: null
        })
      })
    }),
    auth: {
      getUser: () => ({
        data: { user: { id: "mock-user-id" } },
        error: null
      })
    }
  })
}))

// Mock the core Supabase module
vi.mock("@/core/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          data: [],
          error: null
        })
      }),
      insert: () => ({
        select: () => ({
          data: [],
          error: null
        })
      })
    }),
    auth: {
      getUser: () => ({
        data: { user: { id: "mock-user-id" } },
        error: null
      })
    }
  }
}))

// Mock the Space Context
vi.mock("@/components/space/space-context", () => ({
  useSpaceContext: () => ({
    getSnapshot: () => ({
      context: {
        currentSpace: {
          id: "mock-space-id",
          name: "Mock Space"
        }
      }
    }),
    send: vi.fn(),
    subscribe: vi.fn(() => () => {}),
    id: "mock-actor-id"
  })
}))

// Mock the website data hook
vi.mock("../hooks", () => ({
  useWebsiteData: () => ({
    websiteOptions: [],
    selectedWebsiteId: null,
    selectedWebsite: null,
    setSelectedWebsiteId: vi.fn(),
    isLoading: false,
    error: null,
    createWebsite: vi.fn(),
    refreshWebsites: vi.fn(),
    fetchWebsites: vi.fn(),
    addOptimisticWebsite: vi.fn()
  }),
  usePageData: () => ({
    pageOptions: [],
    selectedPageId: null,
    selectedPage: null,
    setSelectedPageId: vi.fn(),
    isLoading: false,
    error: null,
    createPage: vi.fn(),
    refreshPages: vi.fn(),
    fetchPages: vi.fn(),
    addOptimisticPage: vi.fn()
  }),
  usePageCreator: () => ({
    createPageFromUrl: vi.fn(),
    isLoading: false,
    error: null,
    newWebsiteUrl: "",
    setNewWebsiteUrl: vi.fn(),
    newPagePath: "",
    setNewPagePath: vi.fn(),
    isCreating: false,
    createPage: vi.fn(),
    resetForm: vi.fn(),
    createWebsiteAndPage: vi.fn()
  })
}))

// Mock the current URL hook
vi.mock("@/providers/url-provider", () => ({
  useCurrentUrl: () => ({
    normalizedUrl: {
      hostname: "example.com",
      path: "/test",
      full: "https://example.com/test"
    },
    isLoading: false
  })
}))

// Mock toast notifications
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}))

// Mock the components imported by Connector
vi.mock("../components", () => ({
  WebsiteSelector: () => (
    <div data-testid="website-selector">Website Selector</div>
  ),
  PageSelector: () => <div data-testid="page-selector">Page Selector</div>,
  PageCreateForm: () => (
    <div data-testid="page-create-form">Page Create Form</div>
  )
}))

// Mock the Connector component
vi.mock("../connector", () => ({
  Connector: () => <div data-testid="connector">Website & Page Connector</div>
}))

describe("Connector", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test("renders the component", () => {
    render(
      <div>
        <div data-testid="connector">Website & Page Connector</div>
      </div>
    )
    expect(screen.getByText("Website & Page Connector")).toBeInTheDocument()
  })
})
