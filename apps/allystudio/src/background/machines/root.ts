import { supabase } from "@/core/supabase"
import { assign, createActor, fromPromise, setup } from "xstate"

// Event types
export type AuthEvent = {
  type: "AUTH_STATE_CHANGE"
  event: string
  session: any
}

export type TabEvent = {
  type: "TAB_CLOSED"
  tabId: number
}

export type RootEvent = AuthEvent | TabEvent

// Types for our state context
export interface RootContext {
  activeTabs: Set<number>
  session: any | null
}

// Create the root machine
export const rootMachine = setup({
  types: {
    context: {} as RootContext,
    events: {} as RootEvent
  },
  actors: {
    checkInitialAuth: fromPromise(async () => {
      const { data } = await supabase.auth.getSession()
      return data
    })
  },
  actions: {
    updateSession: assign({
      session: ({ event }) => {
        if (event.type !== "AUTH_STATE_CHANGE") return null
        return event.session
      }
    }),
    cleanupClosedTab: assign(({ context, event }) => {
      if (event.type !== "TAB_CLOSED") return context
      const newTabs = new Set(context.activeTabs)
      newTabs.delete(event.tabId)
      return {
        ...context,
        activeTabs: newTabs
      }
    })
  }
}).createMachine({
  id: "rootMachine",
  initial: "initializing",
  context: {
    activeTabs: new Set<number>(),
    session: null
  },
  states: {
    initializing: {
      invoke: {
        id: "checkInitialAuth",
        src: "checkInitialAuth",
        onDone: {
          target: "ready",
          actions: assign({
            session: ({ event }) => event.output.session
          })
        },
        onError: "ready"
      }
    },
    ready: {
      on: {
        AUTH_STATE_CHANGE: {
          actions: "updateSession"
        },
        TAB_CLOSED: {
          actions: "cleanupClosedTab"
        }
      }
    }
  }
})

// Create and export the actor
export const rootActor = createActor(rootMachine)
