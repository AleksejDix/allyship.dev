import { rootActor } from "../machines/root"

export function setupTabHandlers() {
  // Clean up when tabs are closed
  chrome.tabs.onRemoved.addListener((tabId) => {
    rootActor.send({
      type: "TAB_CLOSED",
      tabId
    })
  })
}
