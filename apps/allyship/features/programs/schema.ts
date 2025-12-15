import { z } from "zod"

export const createProgramSchema = z.object({
  accountId: z.string().uuid({
    message: "Invalid account ID",
  }),
  frameworkId: z.string().min(1, {
    message: "Please select a framework",
  }),
})

export type CreateProgramInput = z.infer<typeof createProgramSchema>
