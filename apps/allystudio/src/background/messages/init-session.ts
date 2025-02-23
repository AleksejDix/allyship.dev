import { supabase } from "@/core/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
  })

  await supabase.auth.setSession(req.body)

  // Send the focus change data to all extension views
  chrome.runtime.sendMessage({
    type: "FOCUS_CHANGE",
    data: req.body
  })

  // Respond to confirm receipt
  res.send({ success: true })
}

export default handler
