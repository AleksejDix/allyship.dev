import { z } from "zod"

export const FormUpdateEmailSchema = z.object({
  email: z.string().email(),
})

export type FormUpdateEmail = z.infer<typeof FormUpdateEmailSchema>
