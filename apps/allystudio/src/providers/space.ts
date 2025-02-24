import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup } from "xstate"

type Space = Database["public"]["Tables"]["Space"]["Row"]

type InitialContext = {
  spaces: never[]
  currentSpace: never
  error: never
}

type LoadedContext = {
  spaces: Space[]
  currentSpace: null
  error: null
}

type ErrorContext = {
  spaces: never[]
  currentSpace: never
  error: PostgrestError
}

type ManualContext = {
  spaces: Space[]
  currentSpace: null
  error: null
}

type SelectedContext = {
  spaces: Space[]
  currentSpace: Space
  error: null
}

type SpaceContext =
  | InitialContext
  | LoadedContext
  | ErrorContext
  | ManualContext
  | SelectedContext
type SpaceEvent =
  | { type: "SPACES_LOADED"; spaces: Space[] }
  | { type: "SPACE_SELECTED"; space: Space }
  | { type: "REFRESH" }
  | { type: "error"; error: Error }
  | DoneEvent

type DoneEvent = { type: "done.invoke.loadSpaces"; output: Space[] }
type ErrorEvent = { type: "error.invoke.loadSpaces"; data: PostgrestError }

const actors = {
  loadSpaces: fromPromise(() => {
    return supabase
      .from("Space")
      .select("*")
      .then(({ data, error }) => {
        console.log(error)
        if (error) console.log("guck of")
        return data ?? []
      })
  })
}

export const spaceMachine = setup({
  types: {
    context: {} as SpaceContext,
    events: {} as SpaceEvent | DoneEvent | ErrorEvent
  },
  actors,
  actions: {
    setSpaces: assign({
      spaces: ({ event }: { event: DoneEvent }) => event.output
    }),
    setError: assign({
      error: ({ event }: { event: ErrorEvent }) => {
        console.log("WHY", event)
        return event.data
      }
    })
  },
  guards: {
    hasNone: ({ context }: { context: SpaceContext }) => {
      return context.spaces.length === 0
    },
    hasSome: ({ context }: { context: SpaceContext }) => {
      return context.spaces.length > 0
    },
    hasOne: ({ context }: { context: SpaceContext }) => {
      return context.spaces.length === 1
    }
  }
}).createMachine({
  initial: "loading",
  context: {
    spaces: [],
    currentSpace: null,
    error: null
  },
  states: {
    loading: {
      invoke: {
        src: "loadSpaces",
        onDone: {
          target: "loaded",
          actions: ["setSpaces"]
        },
        onError: {
          target: "loaded",
          actions: ["setError"]
        }
      }
    },
    error: {
      on: {
        REFRESH: {
          target: "loading"
        }
      }
    },
    loaded: {
      initial: "unknown",
      states: {
        unknown: {
          always: [
            {
              guard: "hasNone",
              target: "none"
            },
            {
              guard: "hasOne",
              target: "one"
            },
            {
              guard: "hasSome",
              target: "some"
            }
          ]
        },
        none: {},
        one: {},
        some: {}
      }
    }
  }
})
