import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database.types"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate"

// Types
type Page = Database["public"]["Tables"]["Page"]["Row"]
type PageInsert = Database["public"]["Tables"]["Page"]["Insert"]

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
  | { type: "ADD_PAGE"; payload: PageInsert }

// Actor to load pages from Supabase
const loadPagesActor = fromPromise<Page[], { websiteId: string }>(
  async ({ input }) => {
    console.log("Loading pages for website:", input.websiteId)

    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", input.websiteId)
      .order("created_at", { ascending: false }) // Order by creation date, newest first

    if (error) {
      throw error
    }

    console.log("Loaded pages data:", data, "length:", data?.length ?? 0)
    return data ?? []
  }
)

// Actor to add a page to Supabase
const addPageActor = fromPromise<Page, { payload: PageInsert }>(
  async ({ input }) => {
    try {
      console.log(
        "Starting addPageActor with payload:",
        JSON.stringify(input.payload, null, 2)
      )

      if (!input.payload || !input.payload.website_id) {
        console.error("Invalid payload for addPageActor:", input.payload)
        throw new Error("Missing required payload fields for adding page")
      }

      // Log normalized_url format
      console.log(
        "Using normalized_url (hostname + path):",
        input.payload.normalized_url
      )
      console.log("Using standalone path:", input.payload.path)
      console.log("Using website_id:", input.payload.website_id)
      console.log(
        "Page uniqueness will be on website_id + normalized_url:",
        `[${input.payload.website_id}, ${input.payload.normalized_url}]`
      )

      // Log auth state
      const { data: authData } = await supabase.auth.getSession()
      console.log("Auth session exists:", !!authData.session)

      // Perform the upsert operation
      const { data, error } = await supabase
        .from("Page")
        .upsert(input.payload, { onConflict: "normalized_url,website_id" })
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
  }
)

export const pageMachine = setup({
  types: {
    context: {} as PageContext,
    events: {} as PageEvent,
    input: {} as { websiteId: string | null }
  },
  actors: {
    loadPages: loadPagesActor,
    addPage: addPageActor
  },
  actions: {
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
            error: null
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
          error: null // Clear any errors
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
          error: event.error as PostgrestError
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
            return { payload: event.payload }
          }
          return { payload: {} as PageInsert }
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
    }
  }
})

export type PageMachineActorRef = ActorRefFrom<typeof pageMachine>
