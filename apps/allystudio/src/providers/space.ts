import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import { assign, fromPromise, setup } from "xstate"
import type { DoneActorEvent, ErrorActorEvent } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

// Define the context as a discriminated union
export type SpaceContext =
  | {
      type: "initializing"
      spaces: never
      currentSpace: null
      error: null
    }
  | {
      type: "loading"
      spaces: never
      currentSpace: null
      error: null
    }
  | {
      type: "empty"
      spaces: Space[]
      currentSpace: null
      error: Error | null
    }
  | {
      type: "loaded"
      spaces: Space[]
      currentSpace: Space | null
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
  actions: {
    // Log state transitions
    logSpacesLoaded: ({ context }) => {
      if (context.type === "loaded") {
        console.log("📚 Spaces loaded:", context.spaces.length)
      }
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
    }
  }
}).createMachine({
  id: "spaceMachine",
  initial: "initializing",
  context: {
    type: "initializing",
    spaces: null,
    currentSpace: null,
    error: null
  } as SpaceContext,
  states: {
    initializing: {
      invoke: {
        src: "loadSpaces",
        onDone: [
          {
            guard: ({ event }) => event.output?.length > 0,
            target: "idle",
            actions: assign(({ event }) => ({
              type: "loaded",
              spaces: event.output,
              currentSpace: null,
              error: null
            }))
          },
          {
            target: "idle",
            actions: assign(() => ({
              type: "empty",
              spaces: [],
              currentSpace: null,
              error: null
            }))
          }
        ],
        onError: {
          target: "idle",
          actions: assign(({ event }) => ({
            type: "empty",
            spaces: [],
            currentSpace: null,
            error: new Error(
              event.error instanceof Error
                ? event.error.message
                : String(event.error)
            )
          }))
        }
      }
    },
    loading: {
      invoke: {
        src: "loadSpaces",
        onDone: [
          {
            guard: ({ event }) => event.output?.length > 0,
            target: "idle",
            actions: assign(({ event }) => ({
              type: "loaded",
              spaces: event.output,
              currentSpace: null,
              error: null
            }))
          },
          {
            target: "idle",
            actions: assign(() => ({
              type: "empty",
              spaces: [],
              currentSpace: null,
              error: null
            }))
          }
        ],
        onError: {
          target: "idle",
          actions: assign(({ event }) => ({
            type: "empty",
            spaces: [],
            currentSpace: null,
            error: new Error(
              event.error instanceof Error
                ? event.error.message
                : String(event.error)
            )
          }))
        }
      }
    },
    idle: {
      on: {
        SPACE_SELECTED: {
          guard: ({ context }) => context.type === "loaded",
          target: "idle",
          actions: [
            assign(({ context, event }) => {
              if (
                context.type !== "loaded" ||
                event.type !== "SPACE_SELECTED"
              ) {
                return context
              }
              return {
                ...context,
                currentSpace: event.space
              }
            })
          ]
        },
        REFRESH: {
          target: "loading"
        }
      }
    }
  }
})
