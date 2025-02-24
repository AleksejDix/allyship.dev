import { supabase } from "@/core/supabase"
import type { AuthError, Session } from "@supabase/supabase-js"
import { assign, createActor, fromPromise, setup } from "xstate"

// Event types
export type AuthEvent = {
  type: "AUTH_STATE_CHANGE"
  event: string
  session: Session | null
}

export type TabEvent =
  | { type: "TAB_CLOSED"; tabId: number }
  | { type: "TAB_UPDATED"; tabId: number; url?: string; title?: string }
  | { type: "TAB_ACTIVATED"; tabId: number; url: string; title: string }

export type ErrorEvent = {
  type: "error"
  error: AuthError
}

export type RootEvent = AuthEvent | TabEvent | ErrorEvent

// Types for our state context
export interface RootContext {
  activeTabs: Set<number>
  session: Session | null
  error: AuthError | null
  currentTab: {
    id: number | null
    url: string | null
    title: string | null
  }
}

// Create the root machine
export const rootMachine = setup({
  types: {
    context: {} as RootContext,
    events: {} as RootEvent
  },
  actors: {
    checkInitialAuth: fromPromise(async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error
      return data
    })
  },
  actions: {
    updateSession: assign({
      session: ({ event }) => {
        if (event.type !== "AUTH_STATE_CHANGE") return null
        return event.session
      },
      error: null
    }),
    handleError: assign({
      error: ({ event }) => {
        if (event.type !== "error") return null
        return event.error
      },
      session: null
    }),
    cleanupClosedTab: assign(({ context, event }) => {
      if (event.type !== "TAB_CLOSED") return context
      const newTabs = new Set(context.activeTabs)
      newTabs.delete(event.tabId)
      return {
        ...context,
        activeTabs: newTabs,
        // Clear current tab if it was closed
        currentTab:
          context.currentTab.id === event.tabId
            ? { id: null, url: null, title: null }
            : context.currentTab
      }
    }),
    updateTabInfo: assign(({ context, event }) => {
      if (event.type === "TAB_UPDATED") {
        if (event.tabId === context.currentTab.id) {
          return {
            ...context,
            currentTab: {
              ...context.currentTab,
              url: event.url ?? context.currentTab.url,
              title: event.title ?? context.currentTab.title
            }
          }
        }
        return context
      }
      if (event.type === "TAB_ACTIVATED") {
        return {
          ...context,
          currentTab: {
            id: event.tabId,
            url: event.url,
            title: event.title
          }
        }
      }
      return context
    })
  }
}).createMachine({
  id: "rootMachine",
  initial: "initializing",
  context: {
    activeTabs: new Set<number>(),
    session: null,
    error: null,
    currentTab: {
      id: null,
      url: null,
      title: null
    }
  },
  states: {
    initializing: {
      invoke: {
        id: "checkInitialAuth",
        src: "checkInitialAuth",
        onDone: {
          target: "ready",
          actions: assign({
            session: ({ event }) => event.output.session,
            error: null
          })
        },
        onError: {
          target: "ready",
          actions: [
            assign({
              error: ({ event }) => event.error as AuthError,
              session: null
            })
          ]
        }
      }
    },
    ready: {
      on: {
        AUTH_STATE_CHANGE: {
          actions: "updateSession"
        },
        TAB_CLOSED: {
          actions: "cleanupClosedTab"
        },
        TAB_UPDATED: {
          actions: "updateTabInfo"
        },
        TAB_ACTIVATED: {
          actions: "updateTabInfo"
        }
      }
    }
  }
})

// Create and export the actor
export const rootActor = createActor(rootMachine)
