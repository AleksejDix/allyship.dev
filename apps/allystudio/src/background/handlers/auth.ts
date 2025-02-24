import { supabase } from "@/core/supabase"

import { rootActor } from "../machines/root"

export function setupAuthHandlers() {
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    rootActor.send({
      type: "AUTH_STATE_CHANGE",
      event,
      session
    })
  })
}
