import type { AllyStudioEvent, EventHandler } from "./types"

// Define high-priority event types that need immediate processing
const HIGH_PRIORITY_EVENTS = ["HIGHLIGHT", "INSPECTOR_COMMAND"]

// Direct communication channel for inspector highlights
type DirectHighlightHandler = (
  selector: string,
  message: string,
  isValid: boolean
) => void
const directHighlightHandlers: Set<DirectHighlightHandler> = new Set()

class ChromeEventBus {
  private handlers: Set<EventHandler> = new Set()
  private isContentScript: boolean
  // Store handlers by event type for faster lookup
  private eventTypeHandlers: Map<string, Set<EventHandler>> = new Map()
  // Cache for frequent operations
  private handlerCache: Map<string, EventHandler[]> = new Map()

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
          timestamp: message.timestamp ?? performance.now()
        }

        // Fast path for high-priority events
        if (HIGH_PRIORITY_EVENTS.includes(event.type)) {
          // Ultra-fast path for inspector highlights
          if (event.type === "HIGHLIGHT" && event.data?.layer === "inspector") {
            this.processInspectorHighlight(event)
            sendResponse({ success: true })
            return true
          }

          // Get handlers specific to this event type
          const typeHandlers = this.eventTypeHandlers.get(event.type)
          if (typeHandlers) {
            // Use cached array if available
            const handlersArray =
              this.handlerCache.get(event.type) || Array.from(typeHandlers)

            // Cache the array for future use
            if (!this.handlerCache.has(event.type)) {
              this.handlerCache.set(event.type, handlersArray)
            }

            // Call all handlers
            for (let i = 0; i < handlersArray.length; i++) {
              handlersArray[i](event)
            }
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

  // Ultra-fast path for inspector highlights
  private processInspectorHighlight(event: AllyStudioEvent): void {
    if (event.type === "HIGHLIGHT" && event.data) {
      const { selector, message, isValid, clear } = event.data

      // Call direct handlers first for maximum speed
      if (directHighlightHandlers.size > 0) {
        if (clear) {
          // Clear all highlights
          directHighlightHandlers.forEach((handler) => handler("", "", true))
        } else {
          // Update highlight
          directHighlightHandlers.forEach((handler) =>
            handler(selector, message || "", !!isValid)
          )
        }
      }
    }
  }

  subscribe(handler: EventHandler): () => void {
    this.handlers.add(handler)
    return () => {
      this.handlers.delete(handler)

      // Also remove from type-specific handlers
      this.eventTypeHandlers.forEach((handlers) => {
        handlers.delete(handler)
      })

      // Clear handler cache
      this.handlerCache.clear()
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

    // Clear cached array for this type
    this.handlerCache.delete(type)

    return () => {
      this.handlers.delete(handler)
      const handlers = this.eventTypeHandlers.get(type)
      if (handlers) {
        handlers.delete(handler)
        if (handlers.size === 0) {
          this.eventTypeHandlers.delete(type)
        }
      }

      // Clear cached array for this type
      this.handlerCache.delete(type)
    }
  }

  // Direct subscription for inspector highlights - bypasses event system
  subscribeToInspectorHighlights(handler: DirectHighlightHandler): () => void {
    directHighlightHandlers.add(handler)
    return () => {
      directHighlightHandlers.delete(handler)
    }
  }

  publish(event: AllyStudioEvent): void {
    // Ensure timestamp is set
    const fullEvent = {
      ...event,
      timestamp: event.timestamp ?? performance.now() // Use performance.now() for better precision
    }

    // Ultra-fast path for inspector highlights
    if (event.type === "HIGHLIGHT" && event.data?.layer === "inspector") {
      this.processInspectorHighlight(fullEvent)

      // For inspector events with direct handlers, we can skip the rest
      if (directHighlightHandlers.size > 0) {
        this.sendToExtensionIfNeeded(fullEvent)
        return
      }
    }

    // Fast path for high-priority events
    if (HIGH_PRIORITY_EVENTS.includes(event.type)) {
      // Get handlers specific to this event type
      const typeHandlers = this.eventTypeHandlers.get(event.type)
      if (typeHandlers) {
        // Use cached array if available
        const handlersArray =
          this.handlerCache.get(event.type) || Array.from(typeHandlers)

        // Cache the array for future use
        if (!this.handlerCache.has(event.type)) {
          this.handlerCache.set(event.type, handlersArray)
        }

        // Call all handlers
        for (let i = 0; i < handlersArray.length; i++) {
          handlersArray[i](fullEvent)
        }
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

  // Direct publish method for inspector highlights - bypasses event system
  publishInspectorHighlight(
    selector: string,
    message: string,
    isValid: boolean
  ): void {
    // Call direct handlers first for maximum speed
    if (directHighlightHandlers.size > 0) {
      directHighlightHandlers.forEach((handler) =>
        handler(selector, message, isValid)
      )
    }

    // Also publish through normal channels for compatibility
    if (window.requestIdleCallback) {
      window.requestIdleCallback(
        () => {
          this.publish({
            type: "HIGHLIGHT",
            timestamp: performance.now(),
            data: {
              selector,
              message,
              isValid,
              layer: "inspector"
            }
          })
        },
        { timeout: 200 }
      )
    }
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
