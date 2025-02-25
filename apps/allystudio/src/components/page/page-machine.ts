import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup } from "xstate"

// Types
type Page = Database["public"]["Tables"]["Page"]["Row"]

export type PageContext = {
  pages: Page[]
  error: PostgrestError | null
  websiteId: string | null
}

export type PageEvent =
  | { type: "LOAD_PAGES"; websiteId: string }
  | { type: "RETRY" }

export const pageMachine = setup({
  types: {
    context: {} as PageContext,
    events: {} as PageEvent
  },
  actors: {
    loadPages: fromPromise(
      async ({ input }: { input: { websiteId: string } }) => {
        const { data, error } = await supabase
          .from("pages")
          .select("*")
          .eq("website_id", input.websiteId)

        if (error) throw error
        return data
      }
    )
  },
  actions: {
    assignPages: assign({
      pages: (_, event) => {
        console.warn("assignPages", event)
        return []
      }
    }),
    assignError: assign({
      error: (_, event) => {
        console.warn("assignError", event)
        return null
      }
    }),
    assignWebsiteId: assign({
      websiteId: (_, event) => {
        console.warn("assignWebsiteId", event)
        return "12312"
      }
    })
  }
}).createMachine({
  id: "page",
  initial: "idle",
  context: {
    pages: [],
    error: null,
    websiteId: null
  },
  states: {
    idle: {
      on: {
        LOAD_PAGES: {
          target: "loading",
          actions: "assignWebsiteId"
        }
      }
    },
    loading: {
      invoke: {
        src: "loadPages",
        input: ({ event }) => {
          if (event.type === "LOAD_PAGES") {
            return {
              websiteId: event.websiteId
            }
          }
          return null
        },
        onDone: {
          target: "success",
          actions: "assignPages"
        },
        onError: {
          target: "error",
          actions: "assignError"
        }
      }
    },
    success: {
      on: {
        LOAD_PAGES: {
          target: "loading",
          actions: "assignWebsiteId"
        }
      }
    },
    error: {
      on: {
        RETRY: "loading",
        LOAD_PAGES: {
          target: "loading",
          actions: "assignWebsiteId"
        }
      }
    }
  }
})
