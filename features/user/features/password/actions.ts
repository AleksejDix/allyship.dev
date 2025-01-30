"use server"

import { userProcedure } from "@/features/user/procedures/authPrecedude"

import { schema } from "./schemas"

// export const index  = userProcedure.createServerAction()
// export const create = userProcedure.createServerAction()
// export const store  = userProcedure.createServerAction()
// export const show   = userProcedure.createServerAction()

export const update = userProcedure
  .createServerAction()
  .input(schema)
  .handler(async ({ input, ctx }) => {
    const { supabase } = ctx

    const userResponse = await supabase.auth.updateUser(input)

    if (userResponse.error) {
      throw new Error(userResponse.error.message)
    }

    return { success: true }
  })
