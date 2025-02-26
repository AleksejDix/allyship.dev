import type { AllyStudioEvent, EventHandler } from "./types"

// Define high-priority event types that need immediate processing
const HIGH_PRIORITY_EVENTS = ["HIGHLIGHT", "INSPECTOR_COMMAND"]

class ChromeEventBus {
  private handlers: Set<EventHandler> = new Set()
  private isContentScript: boolean
  // Store handlers by event type for faster lookup
  private eventTypeHandlers: Map<string, Set<EventHandler>> = new Map()

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

        // Fast path for high-priority events
        if (HIGH_PRIORITY_EVENTS.includes(event.type)) {
          // Get handlers specific to this event type
          const typeHandlers = this.eventTypeHandlers.get(event.type)
          if (typeHandlers) {
            typeHandlers.forEach((handler) => handler(event))
          }
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

      // Also remove from type-specific handlers
      this.eventTypeHandlers.forEach((handlers) => {
        handlers.delete(handler)
      })
    }
  }

  // Subscribe to specific event type for better performance
  subscribeToType(type: string, handler: EventHandler): () => void {
    // Add to general handlers
    this.handlers.add(handler)

    // Add to type-specific handlers
    let typeHandlers = this.eventTypeHandlers.get(type)
    if (!typeHandlers) {
      typeHandlers = new Set()
      this.eventTypeHandlers.set(type, typeHandlers)
    }
    typeHandlers.add(handler)

    return () => {
      this.handlers.delete(handler)
      const handlers = this.eventTypeHandlers.get(type)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.eventTypeHandlers.delete(type)
        }
      }
    }
  }

  publish(event: AllyStudioEvent): void {
    // Ensure timestamp is set
    const fullEvent = {
      ...event,
      timestamp: event.timestamp ?? performance.now() // Use performance.now() for better precision
    }

    // Fast path for high-priority events
    if (HIGH_PRIORITY_EVENTS.includes(event.type)) {
      // Get handlers specific to this event type
      const typeHandlers = this.eventTypeHandlers.get(event.type)
      if (typeHandlers) {
        typeHandlers.forEach((handler) => handler(fullEvent))
      }

      // For inspector events, we can skip the general handlers if type-specific handlers exist
      if (
        event.type === "HIGHLIGHT" &&
        event.data?.layer === "inspector" &&
        typeHandlers?.size
      ) {
        // Skip general handlers for inspector highlights if we have specific handlers
        this.sendToExtensionIfNeeded(fullEvent)
        return
      }
    }

    // Always notify local handlers for other events
    this.handlers.forEach((handler) => handler(fullEvent))

    this.sendToExtensionIfNeeded(fullEvent)
  }

  private sendToExtensionIfNeeded(event: AllyStudioEvent): void {
    // If we're in the sidepanel, send to content script
    if (!this.isContentScript) {
      // Send to active tab's content script
      chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
        if (tab?.id) {
          chrome.tabs.sendMessage(tab.id, event).catch((error) => {
            console.error("[EventBus] Failed to send to content script:", error)
          })
        }
      })
    }

    // If we're in content script, send to extension
    if (this.isContentScript) {
      chrome.runtime.sendMessage(event).catch((error) => {
        console.error("[EventBus] Failed to send to extension:", error)
      })
    }
  }
}

// Create and export singleton instance
export const eventBus = new ChromeEventBus()
