import { supabase } from "@/core/supabase"
import { assign, createActor, fromPromise, setup } from "xstate"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import "./layers" // Import layers script to execute it

// Configure sidebar to open on action click
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set panel behavior:", error))

const storage = new Storage()

// Event types
type AuthEvent = {
  type: "AUTH_STATE_CHANGE"
  event: string
  session: any
}

type HeadingDataEvent = {
  type: "HEADING_DATA_UPDATE"
  tabId: number
  data: {
    overlayData?: Array<{
      selector: string
      message: string
    }>
    issues?: Array<any>
  }
}

type TabEvent = {
  type: "TAB_CLOSED"
  tabId: number
}

type RootEvent = AuthEvent | HeadingDataEvent | TabEvent

// Types for our state context
interface RootContext {
  activeTabs: Set<number>
  session: any | null
  headingAnalysis: {
    [tabId: number]: {
      overlayData?: Array<{
        selector: string
        message: string
      }>
      issues?: Array<any>
    }
  }
}

// Create the root machine
const rootMachine = setup({
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
    updateHeadingData: assign({
      headingAnalysis: ({ context, event }) => {
        if (event.type !== "HEADING_DATA_UPDATE") return context.headingAnalysis
        return {
          ...context.headingAnalysis,
          [event.tabId]: {
            overlayData: event.data.overlayData,
            issues: event.data.issues
          }
        }
      }
    }),
    notifyHeadingDataUpdate: ({ context, event }) => {
      if (event.type !== "HEADING_DATA_UPDATE") return
      chrome.tabs.sendMessage(event.tabId, {
        type: "HEADING_DATA_UPDATE",
        data: {
          overlayData: context.headingAnalysis[event.tabId]?.overlayData
        }
      })
    },
    notifyHeadingIssuesUpdate: ({ context, event }) => {
      if (event.type !== "HEADING_DATA_UPDATE") return
      chrome.tabs.sendMessage(event.tabId, {
        type: "HEADING_ISSUES_UPDATE",
        data: {
          issues: context.headingAnalysis[event.tabId]?.issues
        }
      })
    },
    cleanupClosedTab: assign(({ context, event }) => {
      if (event.type !== "TAB_CLOSED") return context
      const newTabs = new Set(context.activeTabs)
      newTabs.delete(event.tabId)
      const newAnalysis = { ...context.headingAnalysis }
      delete newAnalysis[event.tabId]
      return {
        activeTabs: newTabs,
        headingAnalysis: newAnalysis
      }
    })
  }
}).createMachine({
  id: "rootMachine",
  initial: "initializing",
  context: {
    activeTabs: new Set<number>(),
    session: null,
    headingAnalysis: {}
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
        HEADING_DATA_UPDATE: {
          actions: [
            "updateHeadingData",
            "notifyHeadingDataUpdate",
            "notifyHeadingIssuesUpdate"
          ]
        },
        TAB_CLOSED: {
          actions: "cleanupClosedTab"
        }
      }
    }
  }
})

// Create and start the actor
const rootActor = createActor(rootMachine)
rootActor.start()

// Handle messages from UI components
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const senderTabId = sender.tab?.id

  if (message.type === "AUTH_STATE_CHECK") {
    const snapshot = rootActor.getSnapshot()
    sendResponse({ session: snapshot.context.session })
    return true
  }

  if (message.type === "LOGIN_SUCCESS") {
    const windowId = message.windowId
    if (windowId) {
      // Just send a message to update the UI state
      chrome.runtime.sendMessage({
        type: "AUTH_STATE_CHANGE",
        session: message.session
      })
    }
    return true
  }

  if (senderTabId) {
    rootActor.send({
      ...message,
      tabId: senderTabId
    })
  }

  sendResponse({ success: true })
  return true
})

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  rootActor.send({
    type: "AUTH_STATE_CHANGE",
    event,
    session
  })
})

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  rootActor.send({
    type: "TAB_CLOSED",
    tabId
  })
})
