import { sendToBackground } from "@plasmohq/messaging"

/**
 * Sends a message to the background script and returns the response.
 */
export const sendMessage = async (message: any) => {
  return sendToBackground({ name: message.type, body: message })
}
