import { redirect } from "next/navigation"
import { createServerActionProcedure } from "zsa"

import { createClient } from "@/lib/supabase/server"

export const supabasePrecedure = createServerActionProcedure().handler(
  async () => {
    const supabase = await createClient()
    return { supabase }
  }
)
export const userProcedure = createServerActionProcedure(
  supabasePrecedure
).handler(async ({ ctx }) => {
  const { supabase } = ctx

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return { user, supabase }
})
