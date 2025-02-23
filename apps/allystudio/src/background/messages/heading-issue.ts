import { storage } from "@/storage"

// import supabase from "@/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  console.log("📌 Received new issues from content script:", req.body)

  const currentUrl = req.sender?.url
  const issues = req.body

  if (!issues || !currentUrl) {
    console.warn("⚠️ Missing issues or URL. Skipping storage.")
    return res.send({ success: false })
  }

  // ✅ Store issues locally in Plasmo Storage
  await storage.set("heading_issues", issues)

  // ✅ Notify the sidebar & overlay to update
  chrome.runtime.sendMessage({ type: "new-issues", body: issues })

  res.send({ success: true })
}

export default handler
