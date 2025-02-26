export {}

// This will run when the background script is initialized
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

// Listen for extension installation or update
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated")
})

// Example: Listen for messages from other parts of the extension
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message)
  sendResponse({ received: true })
})
