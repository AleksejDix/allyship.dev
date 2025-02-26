import { rootActor } from "../machines/root"

// Handle messages from UI components
export function setupMessageHandlers() {
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
}
