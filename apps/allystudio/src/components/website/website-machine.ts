import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { TablesInsert } from "@/types/database.types"
import { extractDomain, normalizeUrl as normalizeUrlUtil } from "@/utils/url"
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
  | { type: "WEBSITE_SELECTED"; website: Website }
  | { type: "ADD_WEBSITE"; payload: WebsiteInsert }
  | { type: "MATCH_WEBSITE"; url: string }

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
    console.log("Loading websites for space:", input.spaceId)

    const { data, error } = await supabase
      .from("Website")
      .select("*")
      .eq("space_id", input.spaceId)
      .order("normalized_url", { ascending: true })

    if (error) {
      throw error
    }

    console.log("Loaded websites data:", data, "length:", data?.length ?? 0)
    return data ?? []
  }
)

// Actor to add a new website
const addWebsiteActor = fromPromise<Website, { payload: WebsiteInsert }>(
  async ({ input }) => {
    try {
      console.log("Adding website with payload:", input.payload)

      // Insert the new website
      const { data, error } = await supabase
        .from("Website")
        .update([input.payload])
        .eq("normalized_url", input.payload.normalized_url)
        .select()
        .single()

      if (error) {
        console.error("Error adding website:", error)
        throw error
      }

      console.log("Added website:", data)
      return data
    } catch (error) {
      console.error("Error adding website:", error)
      throw error
    }
  }
)

// Create the machine with proper typing
export const websiteMachine = setup({
  types: {
    context: {} as WebsiteContext,
    events: {} as AllEvents,
    input: {} as { spaceId: string }
  },
  actors: {
    loadWebsites: loadWebsitesActor,
    addWebsite: addWebsiteActor
  },
  actions: {
    // Set websites in context when loaded successfully
    setWebsites: assign(({ event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        console.log("Setting websites:", websites, "length:", websites.length)
        return {
          websites: websites
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

    // Set the current website when selected
    setCurrentWebsite: assign(({ event }) => {
      if (event.type === "WEBSITE_SELECTED") {
        return { currentWebsite: event.website }
      }
      return {}
    }),

    // Add a new website to the list and select it
    addNewWebsite: assign(({ context, event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const newWebsite = event.output as Website
        console.log("Adding new website:", newWebsite)
        return {
          websites: [...context.websites, newWebsite],
          currentWebsite: newWebsite
        }
      }
      return {}
    }),

    // Auto-select the first website if there's only one
    autoSelectSingleWebsite: assign(({ context, event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        if (websites.length === 1) {
          return { currentWebsite: websites[0] }
        }
      }
      return {}
    }),

    // Match and select a website based on URL
    matchWebsite: assign(({ context, event }) => {
      if (event.type === "MATCH_WEBSITE") {
        console.log("Matching website URL:", event.url)

        try {
          // Use the utility to normalize URLs
          const eventUrlInfo = normalizeUrlUtil(event.url)
          const eventDomain = eventUrlInfo.domain

          console.log("Normalized event URL domain:", eventDomain)

          // Find a matching website
          const matchedWebsite = context.websites.find((website) => {
            try {
              const websiteUrlInfo = normalizeUrlUtil(website.url)
              const websiteDomain = websiteUrlInfo.domain

              console.log("Comparing with website domain:", websiteDomain)

              // Match if domains are the same
              return eventDomain === websiteDomain
            } catch (error) {
              console.error(
                "Error normalizing website URL:",
                website.url,
                error
              )
              return false
            }
          })

          if (matchedWebsite) {
            console.log("Found matching website:", matchedWebsite)
            return { currentWebsite: matchedWebsite }
          } else {
            console.log("No matching website found for domain:", eventDomain)
          }
        } catch (error) {
          console.error("Error normalizing event URL:", event.url, error)
        }
      }
      return {}
    }),

    // Update space ID when space changes
    updateSpaceId: assign(({ event }) => {
      if (event.type === "SPACE_CHANGED") {
        return { spaceId: event.spaceId }
      }
      return {}
    }),

    // Clear error when refreshing
    clearError: assign({
      error: () => null
    })
  },
  guards: {
    // Check if there are no websites in the event output
    hasNoWebsites: ({ event }) => {
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        console.log(
          "hasNoWebsites check from event:",
          websites,
          "length:",
          websites.length
        )
        return websites.length === 0
      }
      return false
    },

    // Check if there is exactly one website in the event output
    hasOneWebsite: ({ event }) => {
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        console.log(
          "hasOneWebsite check from event:",
          websites,
          "length:",
          websites.length
        )
        return websites.length === 1
      }
      return false
    },

    // Check if there are multiple websites in the event output
    hasMultipleWebsites: ({ event }) => {
      if (event.type.startsWith("xstate.done") && "output" in event) {
        const websites = event.output as Website[]
        console.log(
          "hasMultipleWebsites check from event:",
          websites,
          "length:",
          websites.length
        )
        return websites.length > 1
      }
      return false
    },

    // Check if a website matches the URL
    hasMatchingWebsite: ({ context, event }) => {
      if (event.type === "MATCH_WEBSITE") {
        try {
          // Use the utility to normalize URLs
          const eventUrlInfo = normalizeUrlUtil(event.url)
          const eventDomain = eventUrlInfo.domain

          return context.websites.some((website) => {
            try {
              const websiteUrlInfo = normalizeUrlUtil(website.url)
              const websiteDomain = websiteUrlInfo.domain

              // Match if domains are the same
              return eventDomain === websiteDomain
            } catch (error) {
              return false
            }
          })
        } catch (error) {
          return false
        }
      }
      return false
    }
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
      entry: ({ context }) => {
        console.log("Entered loading state with spaceId:", context.spaceId)
      },
      invoke: {
        id: "loadWebsites",
        src: "loadWebsites",
        input: ({ context }) => ({ spaceId: context.spaceId }),
        onDone: [
          {
            guard: "hasNoWebsites",
            target: "empty",
            actions: "setWebsites"
          },
          {
            guard: "hasOneWebsite",
            target: "loaded.selected",
            actions: ["setWebsites", "autoSelectSingleWebsite"]
          },
          {
            guard: "hasMultipleWebsites",
            target: "loaded.options",
            actions: "setWebsites"
          },
          {
            // Default case if no guard matches
            target: "empty",
            actions: "setWebsites"
          }
        ],
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },
    empty: {
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        },
        MATCH_WEBSITE: {
          // No matching possible in empty state
          // But we could potentially auto-add the website here
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
            console.log(
              "Processing ADD_WEBSITE event with payload:",
              event.payload
            )
            return { payload: event.payload }
          }

          // Fallback with more detailed logging
          console.warn(
            "Unexpected event in adding state:",
            JSON.stringify(event)
          )
          console.warn("Current context:", JSON.stringify(context))

          // Return a default payload to prevent errors
          return { payload: { url: "", space_id: context.spaceId } }
        },
        onDone: {
          target: "loaded.selected",
          actions: "addNewWebsite"
        },
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },
    loaded: {
      initial: "options",
      states: {
        options: {
          on: {
            WEBSITE_SELECTED: {
              target: "selected",
              actions: "setCurrentWebsite"
            },
            MATCH_WEBSITE: [
              {
                guard: "hasMatchingWebsite",
                target: "selected",
                actions: "matchWebsite"
              }
            ]
          }
        },
        selected: {
          on: {
            WEBSITE_SELECTED: {
              target: "selected",
              actions: "setCurrentWebsite"
            },
            MATCH_WEBSITE: {
              // If already in selected state, only change selection if there's a match
              guard: "hasMatchingWebsite",
              actions: "matchWebsite"
            }
          }
        }
      },
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      }
    },
    error: {
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        },
        MATCH_WEBSITE: {
          // Allow matching even in error state
          guard: "hasMatchingWebsite",
          target: "loaded.selected",
          actions: "matchWebsite"
        }
      }
    }
  },
  on: {
    SPACE_CHANGED: {
      target: ".loading",
      actions: "updateSpaceId"
    },
    ADD_WEBSITE: {
      target: ".adding"
    }
  }
})

export type WebsiteMachineActorRef = ActorRefFrom<typeof websiteMachine>
