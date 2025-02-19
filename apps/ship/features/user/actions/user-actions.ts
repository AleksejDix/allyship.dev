"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { supabasePrecedure } from "@/features/user/procedures/authPrecedude"
import { loginFormSchema } from "@/features/user/schemas/user-schemas"
import { isAuthApiError } from "@supabase/supabase-js"

import { env } from "@/env.mjs"
import { createClient } from "@/lib/supabase/server"

export const signInWithPassword = supabasePrecedure
  .createServerAction()
  .input(loginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const { error, data } = await supabase.auth.signInWithPassword({
      email: input.username,
      password: input.password,
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
    redirect("/")

  })

export const signup = supabasePrecedure
  .createServerAction()
  .input(loginFormSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx
    const { error, data } = await supabase.auth.signUp({
      email: input.username,
      password: input.password,
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
      message: "Check your email to verify your account.",
    }
  })

export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    if (isAuthApiError(error)) {
      throw new Error(error.message)
    }
    throw new Error("Something went wrong during logout.")
  }

  revalidatePath("/", "layout")
  redirect("/auth/login")
}
