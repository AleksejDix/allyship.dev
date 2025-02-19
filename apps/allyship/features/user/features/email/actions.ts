"use server"

import { revalidatePath } from "next/cache"
import { userProcedure } from "@/features/user/procedures/authPrecedude"
import { ResetPasswordForEmailSchema } from "@/features/user/schemas/user-schemas"
import { isAuthApiError } from "@supabase/supabase-js"

export const updateEmail = userProcedure
  .createServerAction()
  .input(ResetPasswordForEmailSchema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const { error } = await supabase.auth.updateUser({
      email: input.email,
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

    revalidatePath("/", "layout") // Revalidate the layout to reflect changes
    return { success: true, message: "Email updated successfully." }
  })
