import type { AllyStudioEvent, EventHandler } from "./types"

class ChromeEventBus {
  private handlers: Set<EventHandler> = new Set()
  private isContentScript: boolean

  constructor() {
    // Determine if we're in a content script context
    this.isContentScript =
      chrome.runtime?.getManifest !== undefined &&
      window.location.protocol !== "chrome-extension:"

    // Listen for Chrome runtime messages
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (this.isAllyStudioEvent(message)) {
        // Add tabId from sender if not present
        const event = {
          ...message,
          tabId: message.tabId ?? sender.tab?.id,
          timestamp: message.timestamp ?? Date.now()
        }

        // Notify all handlers
        this.handlers.forEach((handler) => handler(event))

        // Always send a response to avoid connection errors
        sendResponse({ success: true })
      }
      return true // Keep message channel open for async responses
    })

    console.log(
      "[EventBus] Initialized in",
      this.isContentScript ? "content script" : "extension"
    )
  }

  private isAllyStudioEvent(message: any): message is AllyStudioEvent {
    return (
      message &&
      typeof message === "object" &&
      "type" in message &&
      typeof message.type === "string"
    )
  }

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler)
    return () => {
      this.handlers.delete(handler)
    }
  }

  publish(event: AllyStudioEvent): void {
    // Ensure timestamp is set
    const fullEvent = {
      ...event,
      timestamp: event.timestamp ?? Date.now()
    }

    // Always notify local handlers first
    this.handlers.forEach((handler) => handler(fullEvent))

    // If we're in the sidepanel, send to content script
    if (!this.isContentScript) {
      // Send to active tab's content script
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, fullEvent).catch((error) => {
            console.error("[EventBus] Failed to send to content script:", error)
          })
        }
      })
    }

    // If we're in content script, send to extension
    if (this.isContentScript) {
      chrome.runtime.sendMessage(fullEvent).catch((error) => {
        console.error("[EventBus] Failed to send to extension:", error)
      })
    }
  }
}

// Create and export singleton instance
export const eventBus = new ChromeEventBus()
