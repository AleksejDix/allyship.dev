import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

// Simplified context type
export type SpaceContext = {
  spaces: Space[]
  currentSpace: Space | null
  error: PostgrestError | null
}

export type SpaceEvent =
  | { type: "SPACE_SELECTED"; space: Space }
  | { type: "REFRESH" }
  | { type: "SPACE_ADDED"; space: Space }

// Actor to load spaces from Supabase
const loadSpacesActor = fromPromise<Space[], void>(async () => {
  const { data, error } = await supabase.from("Space").select("*")

  if (error) {
    throw error
  }

  return data ?? []
})

// Create the machine with proper typing
export const spaceMachine = setup({
  types: {
    context: {} as SpaceContext
  },
  actors: {
    loadSpaces: loadSpacesActor
  },
  actions: {
    // Set spaces in context when loaded successfully
    setSpaces: assign(({ event }) => {
      // Check if this is a done event from an actor
      if (event.type.startsWith("xstate.done")) {
        return {
          // @ts-ignore - We know this event has an output property
          spaces: event.output || []
        }
      }
      return {}
    }),

    // Set error in context when loading fails
    setError: assign(({ event }) => {
      // Check if this is an error event from an actor
      if (event.type.startsWith("xstate.error")) {
        return {
          // @ts-ignore - We know this event has a data property
          error: event.data
        }
      }
      return {}
    }),

    // Set the current space when selected
    setCurrentSpace: assign(({ event }) => {
      if (event.type === "SPACE_SELECTED") {
        return { currentSpace: event.space }
      }
      return {}
    }),

    // Add a new space to the list and select it
    addSpace: assign(({ context, event }) => {
      if (event.type === "SPACE_ADDED") {
        return {
          spaces: [...context.spaces, event.space],
          currentSpace: event.space
        }
      }
      return {}
    }),

    // Auto-select the first space if there's only one
    autoSelectSingleSpace: assign(({ context }) => {
      if (context.spaces.length > 0) {
        return { currentSpace: context.spaces[0] }
      }
      return {}
    }),

    // Clear error when refreshing
    clearError: assign({
      error: () => null
    })
  },
  guards: {
    // Check if there are no spaces
    hasNoSpaces: ({ context }) => {
      return context.spaces.length === 0
    },

    // Check if there's exactly one space
    hasOneSpace: ({ context }) => {
      return context.spaces.length === 1
    },

    // Check if there are multiple spaces
    hasMultipleSpaces: ({ context }) => {
      return context.spaces.length > 1
    }
  }
}).createMachine({
  id: "spaceMachine",
  initial: "idle",
  context: {
    spaces: [],
    currentSpace: null,
    error: null
  },
  states: {
    // Initial state before loading
    idle: {
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      },
      always: {
        target: "loading"
      }
    },

    // Loading spaces from the database
    loading: {
      invoke: {
        src: "loadSpaces",
        onDone: [
          {
            // If no spaces are loaded, go to empty state
            guard: ({ event }) => {
              // Check if this is a done event from an actor
              if (event.type.startsWith("xstate.done")) {
                // @ts-ignore - We know this event has an output property
                const spaces = event.output || []
                return spaces.length === 0
              }
              return false
            },
            target: "empty",
            actions: "setSpaces"
          },
          {
            // Otherwise go to loaded state
            target: "loaded",
            actions: "setSpaces"
          }
        ],
        onError: {
          target: "error",
          actions: "setError"
        }
      }
    },

    // Error state when loading fails
    error: {
      on: {
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      }
    },

    // Empty state when no spaces exist
    empty: {
      on: {
        // When a space is added, go to the loaded state
        SPACE_ADDED: {
          target: "loaded",
          actions: "addSpace"
        },
        // Allow refreshing from empty state
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      }
    },

    // Loaded state with spaces available
    loaded: {
      initial: "options",
      states: {
        // Options state to handle different space counts
        options: {
          always: [
            {
              // If there's exactly one space, auto-select it
              guard: "hasOneSpace",
              target: "selected",
              actions: "autoSelectSingleSpace"
            },
            {
              // If there are multiple spaces, stay in options state
              guard: "hasMultipleSpaces"
            }
          ],
          on: {
            // When a space is selected, transition to selected state
            SPACE_SELECTED: {
              target: "selected",
              actions: "setCurrentSpace"
            }
          }
        },

        // Selected state when a space is chosen
        selected: {
          on: {
            // Allow selecting a different space
            SPACE_SELECTED: {
              actions: "setCurrentSpace"
            },
            // Handle adding a new space
            SPACE_ADDED: {
              actions: "addSpace"
            }
          }
        }
      },
      on: {
        // Allow refreshing from any loaded state
        REFRESH: {
          target: "loading",
          actions: "clearError"
        }
      }
    }
  }
})
