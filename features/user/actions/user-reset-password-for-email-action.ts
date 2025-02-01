"use server"

import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-reset-password-for-email-schema"
import { isAuthApiError } from "@supabase/supabase-js"
import { createServerAction } from "zsa"

import { env } from "@/env.mjs"
import { createClient } from "@/lib/supabase/server"

export const resetPasswordForEmail = createServerAction()
  .input(ResetPasswordForEmailSchema)
  .handler(async ({ input }) => {
    const supabase = await createClient()

    const { error, data } = await supabase.auth.resetPasswordForEmail(
      input.username,
      {
        redirectTo: `${env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/account`,
      }
    )

    if (error) {
      if (isAuthApiError(error)) {
        const { message, code, status } = error
        return {
          success: false,
          error: {
            message,
            status,
            code,
          },
        }
      }
      return {
        success: false,
        error: {
          message: "Something went wrong",
          status: 500,
          code: "unknown_error",
        },
      }
    }

    return {
      success: true,
      data,
    }
  })
