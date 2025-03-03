import { storage } from "@/storage"

import type { PlasmoMessaging } from "@plasmohq/messaging"

// Handler for toggling the DOM monitor
const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { enabled, toggleLogging } = req.body

  if (toggleLogging !== undefined) {
    // Store the DOM monitor logging state
    await storage.set("dom_monitor_logging_enabled", toggleLogging)

    // Notify all content scripts about the logging state change
    const tabs = await chrome.tabs.query({})
    for (const tab of tabs) {
      if (tab.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            type: "DOM_MONITOR_LOGGING_CHANGE",
            enabled: toggleLogging
          })
        } catch (error) {
          // Ignore errors for tabs where content script isn't loaded
        }
      }
    }

    res.send({ status: "ok", loggingEnabled: toggleLogging })
    return
  }

  // Handle regular DOM monitor toggle
  // Store the DOM monitor state
  await storage.set("dom_monitor_enabled", enabled)

  // Notify all content scripts about the state change
  const tabs = await chrome.tabs.query({})
  for (const tab of tabs) {
    if (tab.id) {
      try {
        await chrome.tabs.sendMessage(tab.id, {
          type: "DOM_MONITOR_STATE_CHANGE",
          enabled
        })
      } catch (error) {
        // Ignore errors for tabs where content script isn't loaded
      }
    }
  }

  res.send({ status: "ok", enabled })
}

// Initialize the DOM monitor to be off by default when the extension is first installed
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === "install") {
    await storage.set("dom_monitor_enabled", false)
    await storage.set("dom_monitor_logging_enabled", false)
    console.log("[DOM Monitor] Initialized to disabled state by default")
  }
})

export default handler
