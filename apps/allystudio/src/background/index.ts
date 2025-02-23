import { supabase } from "@/core/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"
import { Storage } from "@plasmohq/storage"

const storage = new Storage()

// Handle browser action click
chrome.action.onClicked.addListener(async () => {
  // Check if user is already logged in
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session?.user) {
    // User is logged in, open side panel
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.windowId) {
      await chrome.sidePanel.setOptions({
        enabled: true,
        path: "sidepanel.html"
      })
      await chrome.sidePanel.open({ windowId: tab.windowId })
    }
  } else {
    // User is not logged in, open options page
    chrome.runtime.openOptionsPage()
  }
})

// Handle messages from UI components
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle auth state changes
  if (message.type === "AUTH_STATE_CHECK") {
    supabase.auth.getSession().then(({ data: { session } }) => {
      sendResponse({ session })
    })
    return true // Keep the message channel open for async response
  }

  // Handle successful login
  if (message.type === "LOGIN_SUCCESS") {
    // Close options page if it's open
    chrome.tabs.query(
      { url: chrome.runtime.getURL("options.html") },
      (tabs) => {
        tabs.forEach((tab) => {
          if (tab.id) chrome.tabs.remove(tab.id)
        })
      }
    )

    // Open side panel
    const windowId = message.windowId
    if (windowId) {
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
})

// Listen for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  // Broadcast auth state changes to all extension contexts
  chrome.runtime.sendMessage({
    type: "AUTH_STATE_CHANGE",
    event,
    session
  })
})

// Message types for type safety
type HeadingMessage = {
  type:
    | "HEADING_DATA_UPDATE"
    | "HEADING_ANALYSIS_STATE"
    | "HEADING_ISSUES_UPDATE"
  data: {
    overlayData?: Array<{
      selector: string
      message: string
      element?: HTMLElement
    }>
    issues?: Array<any>
    isActive?: boolean
  }
}

// Keep track of active tabs
const activeTabs = new Set<number>()

// Central message handler
chrome.runtime.onMessage.addListener(
  async (message: HeadingMessage, sender, sendResponse) => {
    const senderTabId = sender.tab?.id

    switch (message.type) {
      case "HEADING_DATA_UPDATE": {
        // Forward overlay data to plasmo-storage in the same tab
        if (senderTabId) {
          chrome.tabs.sendMessage(senderTabId, {
            type: "HEADING_DATA_UPDATE",
            data: {
              overlayData: message.data.overlayData
            }
          })
        }

        // Forward issues to heading-order in the same tab
        if (senderTabId) {
          chrome.tabs.sendMessage(senderTabId, {
            type: "HEADING_ISSUES_UPDATE",
            data: {
              issues: message.data.issues
            }
          })
        }
        break
      }

      case "HEADING_ANALYSIS_STATE": {
        // Track active tabs
        if (message.data.isActive && senderTabId) {
          activeTabs.add(senderTabId)
        } else if (senderTabId) {
          activeTabs.delete(senderTabId)
        }

        // Forward state change to all components in the tab
        if (senderTabId) {
          chrome.tabs.sendMessage(senderTabId, {
            type: "HEADING_ANALYSIS_STATE",
            data: {
              isActive: message.data.isActive
            }
          })
        }
        break
      }
    }

    // Always send a response to avoid connection errors
    sendResponse({ success: true })
  }
)

// Clean up when tabs are closed
chrome.tabs.onRemoved.addListener((tabId) => {
  activeTabs.delete(tabId)
})
