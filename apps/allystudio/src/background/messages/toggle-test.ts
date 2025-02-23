import { storage } from "@/storage"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  const { test, enabled } = req.body
  await storage.set(`test_enabled_${test}`, enabled)
  res.send({ status: "ok" }) // Respond back to the sender
}

export default handler
