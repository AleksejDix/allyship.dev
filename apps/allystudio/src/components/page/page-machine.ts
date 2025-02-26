import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate"

// Types
type Page = Database["public"]["Tables"]["Page"]["Row"]

export type PageContext = {
  pages: Page[]
  error: PostgrestError | null
  websiteId: string | null
}

export type PageEvent =
  | { type: "LOAD_PAGES"; websiteId: string }
  | { type: "WEBSITE_CHANGED"; websiteId: string }
  | { type: "RETRY" }

// Actor to load pages from Supabase
const loadPagesActor = fromPromise<Page[], { websiteId: string }>(
  async ({ input }) => {
    console.log("Loading pages for website:", input.websiteId)

    const { data, error } = await supabase
      .from("Page")
      .select("*")
      .eq("website_id", input.websiteId)

    if (error) {
      throw error
    }

    console.log("Loaded pages data:", data, "length:", data?.length ?? 0)
    return data ?? []
  }
)

export const pageMachine = setup({
  types: {
    context: {} as PageContext,
    events: {} as PageEvent,
    input: {} as { websiteId: string | null }
  },
  actors: {
    loadPages: loadPagesActor
  },
  actions: {
    // Set pages in context when loaded successfully
    setPages: assign(({ event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const pages = event.output as Page[]
        console.log("Setting pages:", pages, "length:", pages.length)
        return {
          pages: pages
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
        return { websiteId: event.websiteId }
      }
      return {}
    }),

    // Clear error when retrying
    clearError: assign({
      error: () => null
    })
  }
}).createMachine({
  id: "page",
  context: ({ input }) => ({
    pages: [],
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
      on: {
        LOAD_PAGES: {
          target: "loading",
          actions: "updateWebsiteId"
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
