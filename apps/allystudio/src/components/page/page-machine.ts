import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database.types"
import { compareUrlPaths, normalizeUrl, type NormalizedUrl } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate"

// Types
type Page = Database["public"]["Tables"]["Page"]["Row"]
type PageInsert = Database["public"]["Tables"]["Page"]["Insert"]
type Website = Database["public"]["Tables"]["Website"]["Row"]

export type PageContext = {
  pages: Page[]
  selectedPage: Page | null
  error: PostgrestError | null
  websiteId: string | null
}

export type PageEvent =
  | { type: "LOAD_PAGES"; websiteId: string }
  | { type: "WEBSITE_CHANGED"; websiteId: string }
  | { type: "RETRY" }
  | { type: "SELECT_PAGE"; pageId: string }
  | { type: "BACK" }
  | { type: "ADD_PAGE"; payload: PageInsert; website: Website }
  | { type: "PATH_CHANGED"; normalizedUrl: NormalizedUrl }

const checkPageExists = (
  pages: Page[],
  path: string,
  websiteId: string
): boolean => {
  return pages.some(
    (page) => compareUrlPaths(page.path, path) && page.website_id === websiteId
  )
}

// Actor to load pages from Supabase
const loadPagesActor = fromPromise<Page[], { websiteId: string }>(
  async ({ input }) => {
    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", input.websiteId)
      .order("normalized_url", { ascending: true })

    if (error) {
      throw error
    }

    return data ?? []
  }
)

// Actor to add a page to Supabase
const addPageActor = fromPromise<
  Page,
  { payload: PageInsert; website: Website }
>(async ({ input }) => {
  try {
    if (!input.payload || !input.payload.website_id) {
      throw new Error("Missing required payload fields for adding page")
    }

    // SECURITY CHECK: Verify that the page actually belongs to the website
    try {
      // Extract just the hostname part from the page's normalized_url (which is now hostname+path)
      const pageNormalizedUrl = input.payload.normalized_url || ""
      const pageHostnamePart = pageNormalizedUrl.split("/")[0]

      // Extract hostname from website's normalized_url (removing protocol if present)
      const websiteHostname = input.website.normalized_url.replace(
        /^https?:\/\//,
        ""
      )

      // Exact match comparison of hostnames
      if (pageHostnamePart !== websiteHostname) {
        throw new Error(
          "Security violation: Cannot add page from a different website"
        )
      }

      // Double check with normalizeUrl utility
      const pageUrl = `https://${pageHostnamePart}${input.payload.path}`
      const websiteUrl = input.website.url

      try {
        const pageUrlInfo = normalizeUrl(pageUrl)
        const websiteUrlInfo = normalizeUrl(websiteUrl)

        if (pageUrlInfo.domain !== websiteUrlInfo.domain) {
          throw new Error(
            "Security violation: Domain mismatch between page and website"
          )
        }
      } catch (error) {
        throw new Error("Cannot add page: URL validation failed")
      }
    } catch (error) {
      throw new Error("Cannot add page: Security validation failed")
    }

    // Perform the upsert operation
    const { data, error } = await supabase
      .from("Page")
      .upsert(input.payload, { onConflict: "website_id,normalized_url" })
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!data) {
      throw new Error("Failed to add page - no data returned")
    }

    return data
  } catch (error) {
    throw error
  }
})

export const pageMachine = setup({
  types: {
    context: {} as PageContext,
    events: {} as PageEvent,
    input: {} as {
      websiteId: string | null
      normalizedUrl: NormalizedUrl | null
    }
  },
  actors: {
    loadPages: loadPagesActor,
    addPage: addPageActor
  },
  actions: {
    logPathChange: assign(({ event }) => {
      return {}
    }),
    setSelectedPageByPath: assign(({ context, event }) => {
      if (event.type === "PATH_CHANGED") {
        const normalizedUrl = event.normalizedUrl.full
        const page = context.pages.find(
          (p) => p.normalized_url === normalizedUrl
        )
        return {
          selectedPage: page || null
        }
      }
      return {}
    }),
    // Set pages in context when loaded successfully
    setPages: assign(({ event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const pages = event.output as Page[]
        return {
          pages: pages, // Completely replace the pages array
          error: null // Clear any errors
        }
      }
      return {}
    }),

    // Add a single page to the pages array (optimistic update)
    addPageToList: assign(({ context, event }) => {
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const newPage = event.output as Page

        // Check if the page already exists in the list to prevent duplicates
        const pageExists = context.pages.some(
          (p) => p.path === newPage.path && p.website_id === newPage.website_id
        )

        if (pageExists) {
          return {
            // Don't modify the pages array, just clear errors
            error: null
          }
        }

        // Put the new page at the beginning of the array (newest first)
        const updatedPages = [newPage, ...context.pages]

        return {
          pages: updatedPages,
          error: null // Clear any errors
        }
      }
      return {}
    }),

    // Set error in context when loading fails
    setError: assign(({ event }) => {
      // Check if this is an error event from an actor
      if (event.type.startsWith("xstate.error") && "error" in event) {
        return {
          error: event.error as PostgrestError
        }
      }
      return {}
    }),

    // Update website ID when website changes
    updateWebsiteId: assign(({ event }) => {
      if (event.type === "WEBSITE_CHANGED" || event.type === "LOAD_PAGES") {
        return {
          websiteId: event.websiteId,
          selectedPage: null // Clear selected page when website changes
        }
      }
      return {}
    }),

    // Clear error when retrying
    clearError: assign({
      error: () => null
    }),

    // Set selected page
    selectPage: assign(({ context, event }) => {
      if (event.type === "SELECT_PAGE") {
        const page = context.pages.find((p) => p.id === event.pageId) || null
        return { selectedPage: page }
      }
      return {}
    }),

    // Clear selected page
    clearSelectedPage: assign({
      selectedPage: () => null
    })
  },
  guards: {
    // Check if page already exists
    pageAlreadyExists: ({ context, event }) => {
      if (event.type === "ADD_PAGE") {
        return checkPageExists(
          context.pages,
          event.payload.path,
          event.website.id
        )
      }
      return false
    }
  }
}).createMachine({
  id: "page",
  context: ({ input }) => ({
    pages: [],
    selectedPage: null,
    error: null,
    websiteId: input.websiteId
  }),
  initial: "idle",

  states: {
    idle: {
      entry: "setSelectedPageByPath",
      on: {
        LOAD_PAGES: {
          target: "loading",
          actions: "updateWebsiteId"
        }
      },
      always: [
        {
          // If we have a websiteId, start loading
          guard: ({ context }) => !!context.websiteId,
          target: "loading"
        }
      ]
    },
    loading: {
      invoke: {
        id: "loadPages",
        src: "loadPages",
        input: ({ context }) => ({
          websiteId: context.websiteId as string
        }),
        onDone: {
          target: "success",
          actions: "setPages"
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },
    success: {
      initial: "list",
      states: {
        list: {
          on: {
            SELECT_PAGE: {
              target: "selected",
              actions: "selectPage"
            }
          }
        },
        selected: {
          on: {
            BACK: {
              target: "list",
              actions: "clearSelectedPage"
            }
          }
        }
      },
      on: {
        LOAD_PAGES: {
          target: "loading",
          actions: "updateWebsiteId"
        },
        ADD_PAGE: {
          target: "adding"
        }
      }
    },
    error: {
      on: {
        RETRY: {
          target: "loading",
          actions: "clearError"
        },
        LOAD_PAGES: {
          target: "loading",
          actions: ["updateWebsiteId", "clearError"]
        }
      }
    },
    adding: {
      invoke: {
        id: "addPage",
        src: "addPage",
        input: ({ event }) => {
          if (event.type === "ADD_PAGE") {
            return {
              payload: event.payload,
              website: event.website
            }
          }
          // Return empty objects with correct types if not ADD_PAGE event
          return {
            payload: {} as PageInsert,
            website: {} as Website
          }
        },
        onDone: {
          // Go back to success state instead of loading
          target: "success",
          // Just add the new page to the existing list
          actions: "addPageToList"
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    }
  },
  on: {
    WEBSITE_CHANGED: {
      target: ".loading",
      actions: "updateWebsiteId"
    },
    PATH_CHANGED: {
      actions: "setSelectedPageByPath"
    }
  }
})

export type PageMachineActorRef = ActorRefFrom<typeof pageMachine>
