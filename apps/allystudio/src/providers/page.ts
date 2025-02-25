import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"
import { normalizeUrl, type NormalizedUrl } from "@/utils/url"
import type { PostgrestError } from "@supabase/supabase-js"
import { assign, fromPromise, setup } from "xstate"

type Page = Database["public"]["Tables"]["Page"]["Row"]
type Website = Database["public"]["Tables"]["Website"]["Row"]

type PageWithWebsite = Page & {
  website: Website
}

type PageContext = {
  pages: PageWithWebsite[]
  error: PostgrestError | null
  websiteId: string | null
  currentUrl: string | null
  normalizedUrl: NormalizedUrl | null
  matchingPage: PageWithWebsite | null
}

type PageEvent =
  | { type: "URL_CHANGED"; url: string }
  | { type: "WEBSITE_CHANGED"; websiteId: string | null }
  | { type: "ADD_PAGE"; url: string; websiteId: string }
  | { type: "REFRESH" }

type DoneEvent =
  | { type: "done.invoke.loadPages"; output: PageWithWebsite[] }
  | { type: "done.invoke.addPage"; output: PageWithWebsite }

type ErrorEvent =
  | { type: "error.invoke.loadPages"; data: PostgrestError }
  | { type: "error.invoke.addPage"; data: PostgrestError }

type AllEvents = PageEvent | DoneEvent | ErrorEvent

// Helper to find a matching page for a URL
function findMatchingPage(
  normalized: NormalizedUrl | null,
  pages: PageWithWebsite[]
): PageWithWebsite | null {
  if (!normalized || !pages?.length) return null
  return (
    pages.find((page) => {
      console.log(page.normalized_url, normalized)
      return page.path === normalized.path
    }) ?? null
  )
}

const actors = {
  loadPages: fromPromise(
    async ({ input }: { input: { websiteId: string } }) => {
      const { data, error } = await supabase
        .from("Page")
        .select()
        .eq("website_id", input.websiteId)

      if (error) throw error
      return data as PageWithWebsite[]
    }
  ),
  addPage: fromPromise(
    async ({ input }: { input: { url: string; websiteId: string } }) => {
      // First normalize the URL to get the hostname and path
      const normalized = normalizeUrl(input.url)
      const normalizedUrl = `${normalized.hostname}${normalized.path}`

      // First add the page
      const { data: page, error: pageError } = await supabase
        .from("Page")
        .insert([
          {
            website_id: input.websiteId,
            url: input.url,
            normalized_url: normalizedUrl,
            path: normalized.path,
            status: "idle"
          }
        ])
        .select()
        .single()

      if (pageError) throw pageError
      return page as PageWithWebsite
    }
  )
}

export const pageMachine = setup({
  types: {
    context: {} as PageContext,
    events: {} as AllEvents
  },
  actors,
  guards: {
    hasValidWebsiteId: ({ event }) => {
      return event.type === "WEBSITE_CHANGED" && !!event.websiteId
    }
  },
  actions: {
    setPages: assign({
      pages: ({ event }) => {
        return event.output
      }
    }),
    setError: assign({
      error: ({ event }) => {
        if (!("data" in event)) return null
        return event.data
      }
    }),
    addPageToList: assign({
      pages: ({ context, event }) => {
        if (event.type !== "done.invoke.addPage") return context.pages
        return [...context.pages, event.output]
      }
    }),
    setCurrentUrl: assign({
      currentUrl: ({ event, context }) => {
        if (event.type !== "URL_CHANGED") return context.currentUrl
        return event.url
      },
      normalizedUrl: ({ event, context }) => {
        if (event.type !== "URL_CHANGED") return context.normalizedUrl
        try {
          return normalizeUrl(event.url)
        } catch (error) {
          console.error("Error normalizing URL:", error)
          return null
        }
      }
    }),
    updateMatchingPage: assign({
      matchingPage: ({ context }) => {
        return findMatchingPage(context.normalizedUrl, context.pages)
      }
    }),
    setWebsiteId: assign({
      websiteId: ({ event, context }) => {
        if (event.type !== "WEBSITE_CHANGED") return context.websiteId
        return event.websiteId
      },
      // Clear pages when website changes
      pages: () => [],
      matchingPage: () => null
    })
  }
}).createMachine({
  id: "page",
  initial: "idle",
  context: {
    pages: [],
    error: null,
    websiteId: null,
    currentUrl: null,
    normalizedUrl: null,
    matchingPage: null
  },
  states: {
    idle: {
      on: {
        URL_CHANGED: {
          actions: ["setCurrentUrl", "updateMatchingPage"]
        },
        WEBSITE_CHANGED: [
          {
            guard: "hasValidWebsiteId",
            target: "loading",
            actions: ["setWebsiteId"]
          },
          {
            actions: ["setWebsiteId"]
          }
        ],
        ADD_PAGE: {
          target: "adding"
        },
        REFRESH: {
          guard: ({ context }) => !!context.websiteId,
          target: "loading"
        }
      }
    },
    loading: {
      invoke: {
        src: "loadPages",
        input: ({ context }) => {
          if (!context.websiteId) {
            throw new Error("No website ID")
          }
          return { websiteId: context.websiteId }
        },
        onDone: {
          target: "idle",
          actions: ["setPages", "updateMatchingPage"]
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
          guard: ({ context }) => !!context.websiteId,
          target: "loading"
        },
        URL_CHANGED: {
          actions: ["setCurrentUrl", "updateMatchingPage"]
        },
        WEBSITE_CHANGED: [
          {
            guard: "hasValidWebsiteId",
            target: "loading",
            actions: ["setWebsiteId"]
          },
          {
            actions: ["setWebsiteId"]
          }
        ]
      }
    },
    adding: {
      invoke: {
        src: "addPage",
        input: ({ context, event }) => {
          if (event.type !== "ADD_PAGE") throw new Error("Invalid event")
          return {
            url: event.url,
            websiteId: event.websiteId
          }
        },
        onDone: {
          target: "idle",
          actions: ["addPageToList", "updateMatchingPage"]
        },
        onError: {
          target: "error",
          actions: ["setError"]
        }
      }
    }
  }
})
