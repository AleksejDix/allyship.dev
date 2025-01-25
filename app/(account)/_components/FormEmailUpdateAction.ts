"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { userProcedure } from "@/app/(auth)/_procedures/authPrecedude"

import { FormUpdateEmailSchema } from "./FormEmailUpdateSchema"

export const updateEmail = userProcedure
  .createServerAction()
  .input(FormUpdateEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    // Attempt to update the user's email
    const { error: updateError } = await supabase.auth.updateUser({
      email: input.email,
    })

    if (updateError) {
      return { error: updateError.message }
    }

    // Optional: Revalidate paths if necessary
    revalidatePath("/", "layout")

    // Redirect to a success page or return a success response
    redirect("/account") // Replace with your desired success page
  })
