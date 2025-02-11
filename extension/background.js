// Listen for extension installation
chrome.runtime.onInstalled.addListener(() => {
  console.log("AllyStudio extension installed")
})

// Modify headers to allow iframe embedding and remove CSP
chrome.webRequest.onHeadersReceived.addListener(
  ({ responseHeaders }) => {
    if (!responseHeaders) return { responseHeaders }

    // Remove X-Frame-Options header
    const frameOptionsIndex = responseHeaders.findIndex(
      (header) => header.name.toLowerCase() === "x-frame-options"
    )
    if (frameOptionsIndex !== -1) {
      responseHeaders.splice(frameOptionsIndex, 1)
    }

    // Remove Content-Security-Policy header
    const cspIndex = responseHeaders.findIndex(
      (header) => header.name.toLowerCase() === "content-security-policy"
    )
    if (cspIndex !== -1) {
      responseHeaders.splice(cspIndex, 1)
    }

    // Add permissive headers
    responseHeaders.push({
      name: "Content-Security-Policy",
      value: "frame-ancestors 'self' *",
    })

    responseHeaders.push({
      name: "Access-Control-Allow-Origin",
      value: "*",
    })

    return { responseHeaders }
  },
  {
    urls: ["<all_urls>"],
    types: ["main_frame", "sub_frame"],
  },
  [
    "blocking",
    "responseHeaders",
    ...(chrome.webRequest.OnHeadersReceivedOptions.EXTRA_HEADERS
      ? ["extraHeaders"]
      : []),
  ]
)

// Listen for extension button click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Check if we can access the tab
    if (!tab.url.startsWith("chrome://") && !tab.url.startsWith("edge://")) {
      // Inject content script
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["content.js"],
      })

      // Send message to content script
      await chrome.tabs.sendMessage(tab.id, { action: "initializeOverlay" })
    }
  } catch (error) {
    console.error("Failed to initialize overlay:", error)
  }
})

// Function to be injected
function initializeAccessibilityOverlay() {
  // Send message to content script to initialize overlay
  chrome.runtime.sendMessage({ action: "initializeOverlay" })
}

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request) => {
  console.log("Background script received message:", request)
  return true
})

// Handle unhandled errors
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "error") {
    console.error("Content script error:", message.error)
  }
  return true
})

function analyzePageAccessibility() {
  // Will be called from within the editor wrapper
  console.log("Analyzing page accessibility...")
}
