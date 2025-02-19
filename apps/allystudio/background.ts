// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "OPEN_SIDE_PANEL" && message.windowId) {
    chrome.sidePanel
      .open({ windowId: message.windowId })
      .then(() => sendResponse({ success: true }))
      .catch((error) => {
        console.error("Failed to open side panel:", error)
        sendResponse({ success: false, error: error.message })
      })
  }
  return true
})
