import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import { assign, fromPromise, setup } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

export type SpaceContext = {
  spaces: Space[]
  currentSpace: Space | null
  error: Error | null
  userId: string | null
}

type SpaceEvent =
  | { type: "AUTH_CHANGED"; userId: string | null }
  | { type: "SPACES_LOADED"; spaces: Space[] }
  | { type: "SPACE_SELECTED"; space: Space }
  | { type: "error"; error: Error }

// Database queries
const queries = {
  loadSpaces: fromPromise(async ({ input }: { input: { userId: string } }) => {
    console.log("🔍 Loading spaces for user:", input.userId)

    const { data, error } = await supabase
      .from("Space")
      .select()
      .eq("owner_id", input.userId)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  })
}

export const spaceMachine = setup({
  types: {} as {
    context: SpaceContext
    events: SpaceEvent
  },
  actors: queries,
  actions: {
    // Log state transitions
    logSpacesLoaded: ({ event }) => {
      if (event.type === "SPACES_LOADED") {
        console.log("📚 Spaces loaded:", event.spaces.length)
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
    },
    // Assign values to context
    assignUserId: assign({
      userId: ({ event }) =>
        event.type === "AUTH_CHANGED" ? event.userId : null,
      currentSpace: null, // Clear selected space on auth change
      spaces: [] // Clear spaces on auth change
    }),
    assignSpaces: assign(({ event }) => ({
      spaces: event.type === "SPACES_LOADED" ? event.spaces : [],
      error: null
    })),
    assignSpace: assign({
      currentSpace: ({ event }) =>
        event.type === "SPACE_SELECTED" ? event.space : null
    }),
    assignError: assign({
      error: ({ event }) => (event.type === "error" ? event.error : null)
    }),
    clearError: assign({
      error: null
    })
  }
}).createMachine({
  id: "spaceMachine",
  initial: "waitingForAuth",
  context: {
    spaces: [],
    currentSpace: null,
    error: null,
    userId: null
  },
  states: {
    waitingForAuth: {
      on: {
        AUTH_CHANGED: [
          {
            guard: ({ event }) => !!event.userId,
            target: "loading",
            actions: "assignUserId"
          },
          {
            target: "waitingForAuth",
            actions: "assignUserId"
          }
        ]
      }
    },
    loading: {
      invoke: {
        src: "loadSpaces",
        input: ({ context }) => ({ userId: context.userId! }),
        onDone: {
          target: "idle",
          actions: [
            {
              type: "assignSpaces",
              params: ({ event }) => ({ spaces: event.output })
            },
            "logSpacesLoaded"
          ]
        },
        onError: {
          target: "idle",
          actions: ["assignError", "logError"]
        }
      }
    },
    idle: {
      on: {
        SPACE_SELECTED: {
          target: "idle",
          actions: ["logSpaceSelected", "assignSpace", "clearError"]
        },
        AUTH_CHANGED: {
          target: "waitingForAuth",
          actions: "assignUserId"
        }
      }
    }
  }
})
