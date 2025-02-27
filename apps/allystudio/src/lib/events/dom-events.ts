import { createEventBus } from "./event-bus"

export type DOMChangeEvent = {
  type: "dom-change"
  elements: HTMLElement[]
  timestamp: number
}

/**
 * Event bus for DOM change events
 *
 * Usage:
 * ```
 * // Subscribe to DOM changes
 * const unsubscribe = domEvents.subscribe("dom-change", (event) => {
 *   console.log("DOM changed:", event.elements)
 * })
 *
 * // Unsubscribe when done
 * unsubscribe()
 *
 * // Publish DOM changes
 * domEvents.publish("dom-change", {
 *   type: "dom-change",
 *   elements: changedElements,
 *   timestamp: Date.now()
 * })
 * ```
 */
export const domEvents = createEventBus<DOMChangeEvent>()
