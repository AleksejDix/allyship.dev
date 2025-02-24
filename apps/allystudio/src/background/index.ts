import { supabase } from "@/core/supabase"
import { assign, createActor, createMachine, fromPromise, setup } from "xstate"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

import "./layers" // Import layers script to execute it

const storage = new Storage()

// Event types
type AuthEvent = {
  type: "AUTH_STATE_CHANGE"
  event: string
  session: any
}

type HeadingAnalysisEvent = {
  type: "HEADING_ANALYSIS_STATE"
  tabId: number
  data: {
    isActive: boolean
  }
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

type RootEvent = AuthEvent | HeadingAnalysisEvent | HeadingDataEvent | TabEvent

// Types for our state context
interface RootContext {
  activeTabs: Set<number>
  session: any | null
  headingAnalysis: {
    [tabId: number]: {
      isActive: boolean
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
    checkAuth: fromPromise(async () => {
      const { data } = await supabase.auth.getSession()
      return data
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
        id: "checkAuth",
        src: "checkAuth",
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
          actions: assign({
            session: ({ event }) => {
              if (event.type !== "AUTH_STATE_CHANGE") return null
              return event.session
            }
          })
        },
        HEADING_ANALYSIS_STATE: {
          actions: [
            assign({
              headingAnalysis: ({ context, event }) => {
                if (event.type !== "HEADING_ANALYSIS_STATE")
                  return context.headingAnalysis
                return {
                  ...context.headingAnalysis,
                  [event.tabId]: {
                    ...context.headingAnalysis[event.tabId],
                    isActive: event.data.isActive
                  }
                }
              }
            }),
            ({ context, event }) => {
              if (event.type !== "HEADING_ANALYSIS_STATE") return
              chrome.tabs.sendMessage(event.tabId, {
                type: "HEADING_ANALYSIS_STATE",
                data: {
                  isActive: context.headingAnalysis[event.tabId]?.isActive
                }
              })
            }
          ]
        },
        HEADING_DATA_UPDATE: {
          actions: [
            assign({
              headingAnalysis: ({ context, event }) => {
                if (event.type !== "HEADING_DATA_UPDATE")
                  return context.headingAnalysis
                return {
                  ...context.headingAnalysis,
                  [event.tabId]: {
                    ...context.headingAnalysis[event.tabId],
                    overlayData: event.data.overlayData,
                    issues: event.data.issues
                  }
                }
              }
            }),
            ({ context, event }) => {
              if (event.type !== "HEADING_DATA_UPDATE") return
              chrome.tabs.sendMessage(event.tabId, {
                type: "HEADING_DATA_UPDATE",
                data: {
                  overlayData: context.headingAnalysis[event.tabId]?.overlayData
                }
              })
              chrome.tabs.sendMessage(event.tabId, {
                type: "HEADING_ISSUES_UPDATE",
                data: {
                  issues: context.headingAnalysis[event.tabId]?.issues
                }
              })
            }
          ]
        },
        TAB_CLOSED: {
          actions: assign(({ context, event }) => {
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
      }
    }
  }
})

// Create and start the actor
const rootActor = createActor(rootMachine)
rootActor.start()

// Handle browser action click
chrome.action.onClicked.addListener(async () => {
  const snapshot = rootActor.getSnapshot()

  if (snapshot.context.session?.user) {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.sidePanel.setOptions({
        enabled: true,
        path: "sidepanel.html"
      })
      await chrome.sidePanel.open({ windowId: tab.windowId })
    }
  } else {
    chrome.runtime.openOptionsPage()
  }
})

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
      chrome.tabs.query(
        { url: chrome.runtime.getURL("options.html") },
        (tabs) => {
          tabs.forEach((tab) => {
            if (tab.id) chrome.tabs.remove(tab.id)
          })
        }
      )

      chrome.sidePanel
        .setOptions({
          enabled: true,
          path: "sidepanel.html"
        })
        .then(() => {
          chrome.sidePanel.open({ windowId })
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
