"use server"

import { userProcedure } from "@/features/user/procedures/authPrecedude"
import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-schemas"

export const updateEmail = userProcedure
  .createServerAction()
  .input(ResetPasswordForEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const { error } = await supabase.auth.updateUser({
      email: input.email,
    })

    if (error) {
      throw new Error(error.message)
    }

    return { success: true, message: "Email updated" }
  })
