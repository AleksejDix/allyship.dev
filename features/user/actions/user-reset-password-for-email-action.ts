"use server"

import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-reset-password-for-email-schema"
import { createServerAction } from "zsa"

import { createClient } from "@/lib/supabase/server"

export const resetPasswordForEmail = createServerAction()
  .input(ResetPasswordForEmailSchema)
  .handler(async ({ input: { email } }) => {
    const supabase = await createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/account`,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, message: "Reset link sent if email exists." }
  })
