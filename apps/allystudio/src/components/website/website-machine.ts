import { supabase } from "@/core/supabase"
import type { Database, TablesInsert } from "@/types/database.types"
import { type NormalizedUrl } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate"

// Define Website type
type Website = Database["public"]["Tables"]["Website"]["Row"]
type WebsiteInsert = TablesInsert<"Website">

// Define context type
type WebsiteContext = {
  websites: Website[]
  currentWebsite: Website | null
  error: PostgrestError | null
  spaceId: string
}

// Define user events
export type WebsiteEvent =
  | { type: "REFRESH" }
  | { type: "SPACE_CHANGED"; spaceId: string }
  | { type: "WEBSITE_SELECTED"; websiteId: string }
  | { type: "ADD_WEBSITE"; payload: WebsiteInsert }
  | { type: "URL_CHANGED"; normalizedUrl: NormalizedUrl }

// Define event types for better typing
type LoadWebsitesSuccessEvent = {
  type: "done.invoke.loadWebsites"
  output: Website[]
}

type LoadWebsitesErrorEvent = {
  type: "error.invoke.loadWebsites"
  error: PostgrestError
}

// Combine all event types
type AllEvents =
  | WebsiteEvent
  | LoadWebsitesSuccessEvent
  | LoadWebsitesErrorEvent
  | { type: "done.invoke.addWebsite"; output: Website }
  | { type: "error.invoke.addWebsite"; error: PostgrestError }

// Actor to load websites from Supabase
const loadWebsitesActor = fromPromise<Website[], { spaceId: string }>(
  async ({ input }) => {
    const { data, error } = await supabase
      .from("Website")
      .select("*")
      .eq("space_id", input.spaceId)
      .order("normalized_url", { ascending: true })

    if (error) {
      throw error
    }

    return data ?? []
  }
)

// Actor to add a new website
const addWebsiteActor = fromPromise<Website, { payload: WebsiteInsert }>(
  async ({ input }) => {
    try {
      // Insert the new website
      const { data, error } = await supabase
        .from("Website")
        .upsert([input.payload])
        .eq("normalized_url", input.payload.normalized_url)
        .select()
        .single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      throw error
    }
  }
)

// Create the machine with proper typing
export const websiteMachine = setup({
  types: {
    context: {} as WebsiteContext,
    events: {} as AllEvents,
    input: {} as { spaceId: string; normalizedUrl: NormalizedUrl | null }
  },
  actors: {
    loadWebsites: loadWebsitesActor,
    addWebsite: addWebsiteActor
  },
  actions: {
    // Set current website by hostname (URL-based matching)
    setCurrentWebsiteByHostname: assign(({ context, event }) => {
      if (event.type === "URL_CHANGED") {
        console.log("URL_CHANGED event received:", event.normalizedUrl)
        const hostname = event.normalizedUrl.hostname

        const website = context.websites.find(
          (website) => website.normalized_url === hostname
        )

        console.log("Matched website:", website || "No match found")
        return {
          currentWebsite: website || null
        }
      }
      return {}
    }),

    // Set websites in context when loaded successfully
    setWebsites: assign(({ event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        return {
          websites: websites,
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

    // Set website by ID (manual selection)
    setCurrentWebsiteById: assign(({ context, event }) => {
      if (event.type === "WEBSITE_SELECTED") {
        const website =
          context.websites.find((w) => w.id === event.websiteId) || null
        return { currentWebsite: website }
      }
      return {}
    }),

    // Set the only website (when there's just one)
    setOnlyWebsite: assign(({ context, event }) => {
      console.log("🧨", { context, event })
      if (context.websites.length === 1) {
        return { currentWebsite: context.websites[0] }
      }
      return {}
    }),

    // Add a new website to the list and select it
    addNewWebsite: assign(({ context, event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const newWebsite = event.output as Website
        return {
          websites: [...context.websites, newWebsite],
          currentWebsite: newWebsite,
          error: null // Clear any errors
        }
      }
      return {}
    }),

    // Update space ID when space changes
    updateSpaceId: assign(({ event }) => {
      if (event.type === "SPACE_CHANGED") {
        return {
          spaceId: event.spaceId,
          currentWebsite: null // Clear current website when space changes
        }
      }
      return {}
    }),

    // Clear error when refreshing
    clearError: assign({
      error: () => null
    }),

    // Clear selected website
    clearCurrentWebsite: assign({
      currentWebsite: () => null
    })
  },
  guards: {
    // Check if there are websites
    hasWebsites: ({ context }) => context.websites.length > 0,

    // Check if there's exactly one website
    hasOnlyOneWebsite: ({ context }) => context.websites.length === 1,

    // Check if current website is set
    hasCurrentWebsite: ({ context }) => context.currentWebsite !== null
  }
}).createMachine({
  id: "website",
  context: ({ input }) => ({
    websites: [],
    currentWebsite: null,
    error: null,
    spaceId: input.spaceId
  }),
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "loadWebsites",
        src: "loadWebsites",
        input: ({ context }) => ({ spaceId: context.spaceId }),
        onDone: {
          target: "success",
          actions: "setWebsites"
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },
    success: {
      initial: "list",
      entry: ["setOnlyWebsite"],
      states: {
        list: {
          on: {
            WEBSITE_SELECTED: {
              target: "selected",
              actions: "setCurrentWebsiteById"
            }
          },
          always: [
            // Auto-transition to selected if there's only one website
            {
              guard: "hasOnlyOneWebsite",
              target: "selected"
            },
            // Auto-transition to selected if current website is set
            {
              guard: "hasCurrentWebsite",
              target: "selected"
            }
          ]
        },
        selected: {
          on: {
            REFRESH: {
              target: "#website.loading",
              actions: "clearError"
            }
          },
          // Go back to list if current website becomes null
          always: [
            {
              guard: ({ context }) => context.currentWebsite === null,
              target: "list"
            }
          ]
        }
      },
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        },
        ADD_WEBSITE: {
          target: "adding"
        }
      }
    },
    error: {
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      }
    },
    adding: {
      invoke: {
        id: "addWebsite",
        src: "addWebsite",
        input: ({ context, event }) => {
          // Make sure we're handling the ADD_WEBSITE event
          if (event.type === "ADD_WEBSITE") {
            return { payload: event.payload }
          }

          // Return a default payload to prevent errors
          return { payload: { url: "", space_id: context.spaceId } }
        },
        onDone: {
          target: "success.selected",
          actions: "addNewWebsite"
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    }
  },
  on: {
    SPACE_CHANGED: {
      target: ".loading",
      actions: "updateSpaceId"
    },
    URL_CHANGED: {
      actions: "setCurrentWebsiteByHostname"
    }
  }
})

export type WebsiteMachineActorRef = ActorRefFrom<typeof websiteMachine>
