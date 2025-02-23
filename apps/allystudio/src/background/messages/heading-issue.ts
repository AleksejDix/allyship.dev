import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  if (req.body.type === "HEADING_DATA_UPDATE") {
    const { overlayData, issues } = req.body.data

    // Broadcast updates to all components
    chrome.runtime.sendMessage({
      type: "HEADING_DATA_UPDATE",
      data: { overlayData, issues }
    })

    // Also send to content scripts in active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: "HEADING_DATA_UPDATE",
        data: { overlayData, issues }
      })
    }

    res.send({ success: true })
    return
  }

  res.send({ success: false, error: "Unknown message type" })
}

export default handler
