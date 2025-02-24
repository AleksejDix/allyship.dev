import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import { assign, fromPromise, setup } from "xstate"
import type { DoneActorEvent, ErrorActorEvent } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

// Base context type for loading states
type LoadingContext = {
  spaces: never[]
  currentSpace: null
  error: null
}

// Error state should have never[] for spaces
type ErrorContext = {
  spaces: never[]
  currentSpace: never
  error: Error
}

// Discriminated union for the context based on spaces array shape
type SpaceContext =
  | LoadingContext
  | ErrorContext
  | {
      spaces: [] // Empty state
      currentSpace: null
      error: null
    }
  | {
      spaces: readonly [Space] // Tuple of exactly one space
      currentSpace: Space
      error: null
    }
  | {
      spaces: readonly Space[] // Array of 2 or more spaces, no selection
      currentSpace: null
      error: null
    }
  | {
      spaces: readonly Space[] // Array of 2 or more spaces, with selection
      currentSpace: Space // Must be non-null in selected state
      error: null
    }

export type SpaceEvent =
  | { type: "SPACES_LOADED"; spaces: Space[] }
  | { type: "SPACE_SELECTED"; space: Space }
  | { type: "REFRESH" }
  | { type: "error"; error: Error }
  | DoneActorEvent<Space[], string>
  | ErrorActorEvent<Error, string>

// Database queries
const queries = {
  loadSpaces: fromPromise(async () => {
    console.log("🔍 Loading spaces")

    const { data, error } = await supabase
      .from("Space")
      .select()
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  })
}

export const spaceMachine = setup({
  types: {
    context: {} as SpaceContext,
    events: {} as SpaceEvent
  },
  actors: queries,
  guards: {
    // Guard for when exactly one space is loaded
    hasSingleSpace: ({ event }) => {
      if (!("output" in event)) return false
      const spaces = event.output as Space[]
      return spaces?.length === 1
    },
    // Guard for when multiple spaces are loaded
    hasMultipleSpaces: ({ event }) => {
      if (!("output" in event)) return false
      const spaces = event.output as Space[]
      return (spaces?.length ?? 0) > 1
    },
    // Guard for when no spaces are loaded
    hasNoSpaces: ({ event }) => {
      if (!("output" in event)) return false
      const spaces = event.output as Space[]
      return (spaces?.length ?? 0) === 0
    }
  },
  actions: {
    // Log state transitions
    logSpacesLoaded: ({ context }) => {
      console.log("📚 Spaces loaded:", context.spaces.length)
    },
    logSpaceSelected: ({ event }) => {
      if (event.type === "SPACE_SELECTED") {
        console.log("🏢 Space selected:", event.space)
      }
    },
    logError: ({ event }) => {
      if (event.type === "error") {
        console.error("❌ Error in space machine:", event.error)
      }
    },
    // Assign actions with proper type narrowing
    assignSpaces: assign(({ event }) => {
      if (!("output" in event)) return {} as SpaceContext
      const spaces = event.output
      if (spaces.length === 0) {
        return {
          spaces: [] as const,
          currentSpace: null,
          error: null
        }
      }
      if (spaces.length === 1) {
        return {
          spaces: [spaces[0]] as const,
          currentSpace: spaces[0],
          error: null
        }
      }
      return {
        spaces: spaces as readonly Space[],
        currentSpace: null,
        error: null
      }
    }),
    assignSelectedSpace: assign(({ context, event }) => {
      if (event.type !== "SPACE_SELECTED") return context
      if (context.spaces.length <= 1) return context
      return {
        spaces: context.spaces,
        currentSpace: event.space, // This will always be non-null
        error: null
      }
    }),
    assignError: assign({
      spaces: () => [] as never[],
      currentSpace: null as never,
      error: ({ event }) =>
        new Error(
          "error" in event && event.error instanceof Error
            ? event.error.message
            : String("error" in event ? event.error : "Unknown error")
        )
    })
  }
}).createMachine({
  id: "spaceMachine",
  initial: "initializing",
  context: {
    spaces: [],
    currentSpace: null,
    error: null
  } as SpaceContext,
  states: {
    initializing: {
      always: {
        target: "loading"
      }
    },
    loading: {
      entry: assign({
        spaces: [] as never[],
        currentSpace: null,
        error: null
      }),
      invoke: {
        src: "loadSpaces",
        onDone: [
          {
            guard: "hasSingleSpace",
            target: "idle.single",
            actions: ["assignSpaces", "logSpacesLoaded"]
          },
          {
            guard: "hasMultipleSpaces",
            target: "idle.selection",
            actions: ["assignSpaces", "logSpacesLoaded"]
          },
          {
            guard: "hasNoSpaces",
            target: "idle.empty",
            actions: "assignSpaces"
          }
        ],
        onError: {
          target: "idle.error",
          actions: ["assignError", "logError"]
        }
      }
    },
    idle: {
      initial: "empty",
      states: {
        empty: {
          entry: assign({
            spaces: [] as const,
            currentSpace: null,
            error: null
          })
        },
        error: {},
        single: {
          entry: assign(({ context }) => ({
            currentSpace: context.spaces[0]
          }))
        },
        selection: {
          on: {
            SPACE_SELECTED: {
              target: "selected",
              actions: ["assignSelectedSpace", "logSpaceSelected"]
            }
          }
        },
        selected: {}
      },
      on: {
        REFRESH: {
          target: "loading"
        }
      }
    }
  }
})
