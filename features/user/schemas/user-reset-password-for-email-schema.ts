import { z } from "zod"

export const ResetPasswordForEmailSchema = z.object({
  username: z.string().email(),
})

export type ResetPasswordForEmail = z.infer<typeof ResetPasswordForEmailSchema>
