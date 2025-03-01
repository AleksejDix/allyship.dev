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
  pageValidationError: string | null
  pageValidationSuccess: string | null
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
    console.log(
      "Starting addPageActor with payload:",
      JSON.stringify(input.payload, null, 2)
    )

    if (!input.payload || !input.payload.website_id) {
      console.error("Invalid payload for addPageActor:", input.payload)
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
        console.error(
          "CRITICAL SECURITY VIOLATION: Attempted to add page from a different website",
          {
            pageHostnamePart,
            websiteHostname,
            pageNormalizedUrl,
            pageId: input.payload.id,
            websiteId: input.website.id
          }
        )
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
          console.error(
            "DOMAIN MISMATCH: Page and website domains do not match",
            {
              pageDomain: pageUrlInfo.domain,
              websiteDomain: websiteUrlInfo.domain,
              pageHostnamePart,
              websiteHostname
            }
          )
          throw new Error(
            "Security violation: Domain mismatch between page and website"
          )
        }

        console.log("Security check passed: Page belongs to website", {
          pageDomain: pageUrlInfo.domain,
          websiteDomain: websiteUrlInfo.domain,
          pageHostnamePart,
          websiteHostname
        })
      } catch (error) {
        console.error("Error during domain normalization check:", error)
        throw new Error("Cannot add page: URL validation failed")
      }
    } catch (error) {
      console.error("Error during security check:", error)
      throw new Error("Cannot add page: Security validation failed")
    }

    // Log normalized_url format
    console.log(
      "Using normalized_url (hostname+path):",
      input.payload.normalized_url
    )
    console.log("Using standalone path:", input.payload.path)
    console.log("Using website_id:", input.payload.website_id)
    console.log(
      "Page uniqueness will be on website_id + normalized_url (containing hostname+path):",
      `[${input.payload.website_id}, ${input.payload.normalized_url}]`
    )

    // Log auth state
    const { data: authData } = await supabase.auth.getSession()
    console.log("Auth session exists:", !!authData.session)

    // Perform the upsert operation
    const { data, error } = await supabase
      .from("Page")
      .upsert(input.payload, { onConflict: "website_id,normalized_url" })
      .select()
      .single()

    if (error) {
      console.error("Supabase upsert error:", error)
      throw error
    }

    if (!data) {
      console.error("No data returned from Page upsert operation")
      throw new Error("Failed to add page - no data returned")
    }

    console.log("Successfully added page:", data)
    return data
  } catch (error) {
    console.error("Error in addPageActor:", error)
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
      if (event.type === "PATH_CHANGED") {
        console.log("Path changed:", event.normalizedUrl)
      }
      return {}
    }),
    setSelectedPageByPath: assign(({ context, event }) => {
      if (event.type === "PATH_CHANGED") {
        const normalizedUrl = event.normalizedUrl.full
        const page = context.pages.find(
          (p) => p.normalized_url === normalizedUrl
        )
        console.log("Setting selected page by path:", page)
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
        console.log("Setting pages:", pages, "length:", pages.length)
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
        console.log(
          "Adding page to list optimistically:",
          JSON.stringify(newPage, null, 2)
        )
        console.log("Current pages in context:", context.pages.length)

        // Check if the page already exists in the list to prevent duplicates
        const pageExists = context.pages.some(
          (p) => p.path === newPage.path && p.website_id === newPage.website_id
        )

        if (pageExists) {
          console.log("Page already exists in list, not adding duplicate")
          return {
            // Don't modify the pages array, just clear errors
            error: null,
            pageValidationSuccess: "Page already exists"
          }
        }

        // Log the page we're adding
        console.log(
          "Adding new page to context:",
          JSON.stringify(newPage, null, 2)
        )

        // Put the new page at the beginning of the array (newest first)
        const updatedPages = [newPage, ...context.pages]
        console.log("Updated pages length:", updatedPages.length)

        return {
          pages: updatedPages,
          error: null, // Clear any errors
          pageValidationSuccess: "Page added successfully"
        }
      }
      return {}
    }),

    // Set error in context when loading fails
    setError: assign(({ event }) => {
      // Check if this is an error event from an actor
      if (event.type.startsWith("xstate.error") && "error" in event) {
        console.log("Setting error:", event.error)
        return {
          error: event.error as PostgrestError,
          pageValidationError:
            (event.error as PostgrestError).message || "An error occurred"
        }
      }
      return {}
    }),

    // Update website ID when website changes
    updateWebsiteId: assign(({ event }) => {
      if (event.type === "WEBSITE_CHANGED" || event.type === "LOAD_PAGES") {
        console.log("Updating websiteId to:", event.websiteId)
        return {
          websiteId: event.websiteId,
          selectedPage: null // Clear selected page when website changes
        }
      }
      return {}
    }),

    // Clear error when retrying
    clearError: assign({
      error: () => null,
      pageValidationError: () => null
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
    }),

    // Prepare page payload with normalized URL
    preparePagePayload: assign(({ context, event }) => {
      if (event.type === "ADD_PAGE") {
        // Return validation success message based on existing pages
        return {
          pageValidationSuccess: checkPageExists(
            context.pages,
            event.payload.path,
            event.website.id
          )
            ? "Page already exists"
            : "Page added successfully"
        }
      }
      return {}
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
    websiteId: input.websiteId,
    pageValidationError: null,
    pageValidationSuccess: null
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
      entry: ({ context }) => {
        console.log("Entered loading state with websiteId:", context.websiteId)
      },
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
          target: "adding",
          actions: "preparePagePayload"
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
