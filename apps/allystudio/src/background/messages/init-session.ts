import { supabase } from "@/core/supabase"

import type { PlasmoMessaging } from "@plasmohq/messaging"

const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session)
  })

  await supabase.auth.setSession(req.body)

  res.send({ success: true })
}

export default handler
