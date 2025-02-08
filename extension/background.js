chrome.runtime.onInstalled.addListener(() => {
  console.log("AllyStudio extension installed")
})

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "analyzePage") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: analyzePageAccessibility,
      })
    })
  }
  return true
})

function analyzePageAccessibility() {
  // Will be called from within the editor wrapper
  console.log("Analyzing page accessibility...")
}
