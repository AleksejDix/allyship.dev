import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup } from "xstate"

type Website = Database["public"]["Tables"]["Website"]["Row"]

type InitialContext = {
  websites: never[]
  currentWebsite: never
  error: never
  spaceId: string
}

type LoadedContext = {
  websites: Website[]
  currentWebsite: null
  error: null
  spaceId: string
}

type ErrorContext = {
  websites: never[]
  currentWebsite: never
  error: PostgrestError
  spaceId: string
}

type SelectedContext = {
  websites: Website[]
  currentWebsite: Website
  error: null
  spaceId: string
}

type WebsiteContext =
  | InitialContext
  | LoadedContext
  | ErrorContext
  | SelectedContext

type WebsiteEvent =
  | { type: "WEBSITE_SELECTED"; website: Website }
  | { type: "REFRESH" }
  | { type: "error"; error: Error }
  | DoneEvent

type DoneEvent = { type: "done.invoke.loadWebsites"; output: Website[] }
type ErrorEvent = { type: "error.invoke.loadWebsites"; data: PostgrestError }

const actors = {
  loadWebsites: fromPromise(({ input }: { input: { spaceId: string } }) => {
    console.log("loadWebsites", input)
    return supabase
      .from("Website")
      .select("*")
      .eq("space_id", input.spaceId)
      .then(({ data, error }) => {
        if (error) throw error
        return data ?? []
      })
  })
}

export const websiteMachine = setup({
  types: {
    context: {} as WebsiteContext,
    events: {} as WebsiteEvent | DoneEvent | ErrorEvent,
    input: {} as { spaceId: string }
  },
  actors,
  actions: {
    setWebsites: assign({
      websites: ({ event }: { event: DoneEvent }) => event.output
    }),
    setError: assign({
      error: ({ event }: { event: ErrorEvent }) => event.data
    }),
    setCurrentWebsite: assign({
      currentWebsite: ({
        event
      }: {
        event: { type: "WEBSITE_SELECTED"; website: Website }
      }) => event.website
    })
  },
  guards: {
    hasNone: ({ context }: { context: WebsiteContext }) => {
      return context.websites.length === 0
    },
    hasSome: ({ context }: { context: WebsiteContext }) => {
      return context.websites.length > 0
    },
    hasOne: ({ context }: { context: WebsiteContext }) => {
      return context.websites.length === 1
    }
  }
}).createMachine({
  initial: "loading",
  context: ({ input }) => ({
    websites: [],
    currentWebsite: null,
    error: null,
    spaceId: input.spaceId
  }),
  states: {
    loading: {
      invoke: {
        src: "loadWebsites",
        input: ({ context }) => ({
          spaceId: context.spaceId
        }),
        onDone: {
          target: "loaded",
          actions: ["setWebsites"]
        },
        onError: {
          target: "error",
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
      type: "parallel",
      states: {
        count: {
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
            one: {
              entry: assign({
                currentWebsite: ({ context }) => context.websites[0]
              })
            },
            some: {}
          }
        },
        selection: {
          initial: "unselected",
          states: {
            unselected: {
              on: {
                WEBSITE_SELECTED: {
                  target: "selected",
                  actions: ["setCurrentWebsite"]
                }
              }
            },
            selected: {
              on: {
                WEBSITE_SELECTED: {
                  target: "selected",
                  actions: ["setCurrentWebsite"]
                }
              }
            }
          }
        }
      },
      on: {
        REFRESH: {
          target: "loading"
        }
      }
    }
  }
})
