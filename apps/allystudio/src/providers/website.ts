import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import type { PostgrestError } from "@supabase/supabase-js"
import {
  assign,
  fromPromise,
  setup,
  type DoneActorEvent,
  type DoneStateEvent
} from "xstate"

type Website = Database["public"]["Tables"]["Website"]["Row"]

type WebsiteContext = {
  websites: Website[]
  error: PostgrestError | null
  spaceId: string
  currentUrl: string | null
  matchingWebsite: Website | null
}

type WebsiteEvent =
  | { type: "REFRESH" }
  | { type: "ADD_WEBSITE"; url: string }
  | { type: "URL_CHANGED"; url: string }

type LoadWebsitesDone = { type: "done.invoke.loadWebsites"; output: Website[] }
type AddWebsiteDone = { type: "done.invoke.addWebsite"; output: Website }
type DoneEvent = LoadWebsitesDone | AddWebsiteDone

type ErrorEvent =
  | { type: "error.invoke.loadWebsites"; data: PostgrestError }
  | { type: "error.invoke.addWebsite"; data: PostgrestError }

type AllEvents = WebsiteEvent | DoneEvent | ErrorEvent

// Helper to find a matching website for a URL
function findMatchingWebsite(
  url: string | null,
  websites: Website[]
): Website | null {
  if (!url || !websites?.length) return null

  try {
    const domain = new URL(url).hostname.replace(/^www\./, "")
    return websites.find((website) => website.normalized_url === domain) ?? null
  } catch {
    return null
  }
}

const actors = {
  loadWebsites: fromPromise(({ input }: { input: { spaceId: string } }) => {
    return supabase
      .from("Website")
      .select("*")
      .eq("space_id", input.spaceId)
      .then(({ data, error }) => {
        if (error) throw error
        return data ?? []
      })
  }),
  addWebsite: fromPromise(
    async ({ input }: { input: { spaceId: string; url: string } }) => {
      const { data, error } = await supabase
        .from("Website")
        .insert([
          {
            space_id: input.spaceId,
            url: input.url,
            normalized_url: input.url
              .replace(/^https?:\/\//, "")
              .replace(/^www\./, ""),
            theme: "LIGHT"
          }
        ])
        .select()
        .single()

      if (error) throw error
      return data
    }
  )
}

export const websiteMachine = setup({
  types: {
    context: {} as WebsiteContext,
    events: {} as AllEvents,
    input: {} as { spaceId: string }
  },
  actors,
  actions: {
    setWebsites: assign({
      websites: ({ event }: { event: LoadWebsitesDone }) => event.output
    }),
    setError: assign({
      error: ({ event }) => {
        if (!("data" in event)) return null
        return event.data
      }
    }),
    addWebsiteToList: assign({
      websites: ({
        context,
        event
      }: {
        context: WebsiteContext
        event: AddWebsiteDone
      }) => {
        return [...context.websites, event.output]
      }
    }),
    setCurrentUrl: assign({
      currentUrl: ({ event, context }) => {
        if (event.type !== "URL_CHANGED") return context.currentUrl
        return event.url
      }
    }),
    updateMatchingWebsite: assign({
      matchingWebsite: ({ context }) => {
        return findMatchingWebsite(context.currentUrl, context.websites)
      }
    })
  }
}).createMachine({
  id: "website",
  initial: "loading",
  context: ({ input }) => ({
    websites: [],
    error: null,
    spaceId: input.spaceId,
    currentUrl: null,
    matchingWebsite: null
  }),
  states: {
    loading: {
      invoke: {
        src: "loadWebsites",
        input: ({ context }) => ({
          spaceId: context.spaceId
        }),
        onDone: {
          target: "idle",
          actions: ["setWebsites", "updateMatchingWebsite"]
        },
        onError: {
          target: "error",
          actions: ["setError"]
        }
      }
    },
    error: {
      on: {
        REFRESH: "loading",
        URL_CHANGED: {
          actions: ["setCurrentUrl"]
        }
      }
    },
    idle: {
      on: {
        REFRESH: "loading",
        ADD_WEBSITE: {
          target: "adding"
        },
        URL_CHANGED: {
          actions: ["setCurrentUrl", "updateMatchingWebsite"]
        }
      }
    },
    adding: {
      invoke: {
        src: "addWebsite",
        input: ({ context, event }) => {
          if (event.type !== "ADD_WEBSITE") throw new Error("Invalid event")
          return {
            spaceId: context.spaceId,
            url: event.url
          }
        },
        onDone: {
          target: "idle",
          actions: ["addWebsiteToList", "updateMatchingWebsite"]
        },
        onError: {
          target: "error",
          actions: ["setError"]
        }
      }
    }
  }
})
