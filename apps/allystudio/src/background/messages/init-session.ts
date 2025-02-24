import { supabase } from "@/core/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  try {
    // Set the session
    const { data, error } = await supabase.auth.setSession(req.body)

    if (error) {
      throw error
    }

    // Send auth state change to update UI
    chrome.runtime.sendMessage({
      type: "AUTH_STATE_CHANGE",
      event: "SIGNED_IN",
      session: data.session
    })

    // Respond with success and session
    res.send({
      success: true,
      session: data.session
    })
  } catch (error) {
    console.error("Failed to initialize session:", error)
    res.send({
      success: false,
      error: error.message
    })
  }
}

export default handler
