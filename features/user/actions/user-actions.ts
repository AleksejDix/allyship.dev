"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabasePrecedure } from "@/features/user/procedures/authPrecedude"
import {
  loginFormSchema,
  ResetPasswordForEmailSchema,
} from "@/features/user/schemas/user-schemas"
import { isAuthApiError } from "@supabase/supabase-js"

// import { isAuthApiError } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { createClient } from "@/lib/supabase/server"

export const signInWithPassword = supabasePrecedure
  .createServerAction()
  .input(loginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const { error, data } = await supabase.auth.signInWithPassword(input)

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

    revalidatePath("/", "layout")
    redirect("/")

    return {
      success: true,
      data,
    }
  })

export const signup = supabasePrecedure
  .createServerAction()
  .input(loginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const { error, data } = await supabase.auth.signUp({
      ...input,
      options: {
        emailRedirectTo: env.NEXT_PUBLIC_APP_URL + "/auth/welcome",
      },
    })

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

    revalidatePath("/", "layout")

    return {
      success: true,
      data,
    }
  })

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    redirect("/error")
  }

  revalidatePath("/", "layout")
  redirect("/")
}

export const resetPasswordForEmail = supabasePrecedure
  .createServerAction()
  .input(ResetPasswordForEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { error } = await ctx.supabase.auth.resetPasswordForEmail(
      input.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/welcome`,
      }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: "Reset link sent if email exists." }
  })
