import { supabase } from "~core/supabase"

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
