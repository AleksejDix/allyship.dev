"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabasePrecedure } from "@/features/user/procedures/authPrecedude"
import {
  LoginFormSchema,
  ResetPasswordForEmailSchema,
} from "@/features/user/schemas/user-schemas"
import { isAuthApiError } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { createClient } from "@/lib/supabase/server"

export const login = supabasePrecedure
  .createServerAction()
  .input(LoginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const { error } = await supabase.auth.signInWithPassword(input)

    if (error) {
      // Handle other types of errors

      if (isAuthApiError(error)) {
        return {
          type: error.status,
          message: error.message || "Something went wrong. Please try again.",
        }
      }
    }
    revalidatePath("/", "layout")
    redirect("/")
  })

export const signup = supabasePrecedure
  .createServerAction()
  .input(LoginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const response = await supabase.auth.signUp(input)

    if (response.error || !response.data.user) {
      return {
        success: false,
        message: response.error?.message || "User creation failed",
      }
    }

    if (response.data.user?.email === input.email && !response.data.session) {
      const { error } = await supabase.auth.signInWithPassword(input)

      if (error) {
        redirect("/auth/login")
      }

      revalidatePath("/", "layout")
      redirect("/")
    }

    return redirect("/auth/check-email") // Redirect to the success page
  })

export async function signout() {
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
        redirectTo: env.NEXT_PUBLIC_APP_URL + "/account", // Update with your reset password page URL
      }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: "Reset link sent if email exists." }
  })
