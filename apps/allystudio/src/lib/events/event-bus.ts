import type { AllyStudioEvent, EventHandler } from "./types"

class ChromeEventBus {
  private handlers: Set<EventHandler> = new Set()

  constructor() {
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

    // Send to all contexts via Chrome messaging
    chrome.runtime.sendMessage(fullEvent).catch((error) => {
      console.error("Failed to publish event:", error)
    })

    // If we have a tabId, also send to content scripts
    if (fullEvent.tabId) {
      chrome.tabs.sendMessage(fullEvent.tabId, fullEvent).catch((error) => {
        console.error("Failed to send event to tab:", error)
      })
    }

    // Notify local handlers
    this.handlers.forEach((handler) => handler(fullEvent))
  }
}

// Create and export singleton instance
export const eventBus = new ChromeEventBus()
