import { supabase } from "@/core/supabase"
import type { Database, TablesInsert } from "@/types/database.types"
import { type NormalizedUrl } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup, type ActorRefFrom } from "xstate"

// Define Website type
type Website = Database["public"]["Tables"]["Website"]["Row"]
type WebsiteInsert = TablesInsert<"Website">

// Define context type
export type WebsiteContext = {
  websites: Website[]
  selectedWebsite: Website | null // Renamed from currentWebsite for consistency
  error: PostgrestError | null
  spaceId: string
}

// Define user events - simplified to match page-machine
export type WebsiteEvent =
  | { type: "LOAD_WEBSITES"; spaceId: string } // Renamed from REFRESH
  | { type: "SPACE_CHANGED"; spaceId: string }
  | { type: "SELECT_WEBSITE"; websiteId: string } // Renamed from WEBSITE_SELECTED
  | { type: "ADD_WEBSITE"; payload: WebsiteInsert }
  | { type: "URL_CHANGED"; normalizedUrl: NormalizedUrl }
  | { type: "BACK" } // Added to match page-machine

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

export const websiteMachine = setup({
  types: {
    context: {} as WebsiteContext,
    events: {} as WebsiteEvent,
    input: {} as { spaceId: string; normalizedUrl: NormalizedUrl | null }
  },
  actors: {
    loadWebsites: loadWebsitesActor,
    addWebsite: addWebsiteActor
  },
  actions: {
    // Set selected website by hostname (URL-based matching)
    setSelectedWebsiteByHostname: assign(({ context, event }) => {
      if (event.type === "URL_CHANGED") {
        const hostname = event.normalizedUrl.hostname
        const website = context.websites.find(
          (website) => website.normalized_url === hostname
        )
        return {
          selectedWebsite: website || null
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

    // Set selected website by ID
    setSelectedWebsiteById: assign(({ context, event }) => {
      if (event.type === "SELECT_WEBSITE") {
        const website = context.websites.find(
          (website) => website.id === event.websiteId
        )
        return {
          selectedWebsite: website || null
        }
      }
      return {}
    }),

    // Add a new website to the list
    addWebsiteToList: assign(({ context, event }) => {
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const newWebsite = event.output as Website
        return {
          websites: [...context.websites, newWebsite],
          selectedWebsite: newWebsite
        }
      }
      return {}
    }),

    // Clear the selected website
    clearSelectedWebsite: assign(() => ({
      selectedWebsite: null
    })),

    // Update the space ID
    updateSpaceId: assign(({ event }) => {
      if (event.type === "LOAD_WEBSITES" || event.type === "SPACE_CHANGED") {
        return {
          spaceId: event.spaceId
        }
      }
      return {}
    }),

    // Set error in context
    setError: assign(({ event }) => {
      if (event.type.startsWith("xstate.error") && "error" in event) {
        return {
          error: event.error as PostgrestError
        }
      }
      return {}
    }),

    // Clear error in context
    clearError: assign(() => ({
      error: null
    }))
  }
}).createMachine({
  id: "website",
  context: ({
    input
  }: {
    input: { spaceId: string; normalizedUrl: NormalizedUrl | null }
  }) => ({
    websites: [],
    selectedWebsite: null,
    error: null,
    spaceId: input.spaceId
  }),
  initial: "idle",
  states: {
    idle: {
      on: {
        LOAD_WEBSITES: {
          target: "loading",
          actions: "updateSpaceId"
        }
      },
      // Auto-load websites when entering idle state
      always: {
        target: "loading"
      }
    },
    loading: {
      invoke: {
        id: "loadWebsites",
        src: "loadWebsites",
        input: ({ context }) => ({
          spaceId: context.spaceId
        }),
        onDone: [
          {
            // If websites are loaded and there's only one, auto-select it
            guard: ({ event }) => {
              const websites = event.output as Website[]
              return websites.length === 1
            },
            target: "success.selected",
            actions: [
              "setWebsites",
              // Auto-select the only website
              assign(({ event }) => {
                const websites = event.output as Website[]
                return {
                  selectedWebsite: websites[0]
                }
              })
            ]
          },
          {
            // If websites are loaded but there are multiple or none
            target: "success.list",
            actions: "setWebsites"
          }
        ],
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
            SELECT_WEBSITE: {
              target: "selected",
              actions: "setSelectedWebsiteById"
            }
          }
        },
        selected: {
          on: {
            SELECT_WEBSITE: {
              target: "selected",
              actions: "setSelectedWebsiteById"
            },
            BACK: {
              target: "list",
              actions: "clearSelectedWebsite"
            }
          }
        }
      },
      on: {
        LOAD_WEBSITES: {
          target: "loading",
          actions: "updateSpaceId"
        },
        ADD_WEBSITE: {
          target: "adding"
        }
      }
    },
    error: {
      on: {
        LOAD_WEBSITES: {
          target: "loading",
          actions: ["updateSpaceId", "clearError"]
        }
      }
    },
    adding: {
      invoke: {
        id: "addWebsite",
        src: "addWebsite",
        input: ({ event }) => {
          if (event.type === "ADD_WEBSITE") {
            return { payload: event.payload }
          }
          // TypeScript needs a return value, but this should never happen
          return { payload: {} as WebsiteInsert }
        },
        onDone: {
          target: "success.selected",
          actions: "addWebsiteToList"
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
      actions: ["setSelectedWebsiteByHostname"]
    }
  }
})

export type WebsiteMachineActorRef = ActorRefFrom<typeof websiteMachine>
