import { rootActor } from "../machines/root"

export function setupTabHandlers() {
  // Clean up when tabs are closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    rootActor.send({
      type: "TAB_CLOSED",
      tabId
    })
  })

  // Handle tab updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url || changeInfo.title) {
      rootActor.send({
        type: "TAB_UPDATED",
        tabId,
        url: changeInfo.url,
        title: changeInfo.title
      })
    }
  })

  // Handle tab activation
  chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId)
    if (tab.url && tab.title) {
      rootActor.send({
        type: "TAB_ACTIVATED",
        tabId: activeInfo.tabId,
        url: tab.url,
        title: tab.title
      })
    }
  })

  // Get initial active tab
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0]
    if (tab?.id && tab.url && tab.title) {
      rootActor.send({
        type: "TAB_ACTIVATED",
        tabId: tab.id,
        url: tab.url,
        title: tab.title
      })
    }
  })
}
