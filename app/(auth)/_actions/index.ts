"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { isAuthApiError } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { createClient } from "@/lib/auth/server"

import { supabasePrecedure } from "../_procedures/authPrecedude"
import {
  LoginFormSchema,
  ResetPasswordForEmailSchema,
  UpdatePasswordSchema,
} from "../_schemas/form"

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

    if (response.error) {
      return { error: response.error.message }
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
        redirectTo: env.NEXT_PUBLIC_APP_URL + "/auth/update-password", // Update with your reset password page URL
      }
    )

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: "Reset link sent if email exists." }
  })

export const updatePassword = supabasePrecedure
  .createServerAction()
  .input(UpdatePasswordSchema)
  .handler(async ({ input, ctx }) => {
    // Step 2: Update the user's password
    const { error } = await ctx.supabase.auth.updateUser(input)

    if (error) {
      return { error: error.message }
    }

    return { success: true, message: "Password updated successfully." }
  })
