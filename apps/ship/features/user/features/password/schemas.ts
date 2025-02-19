import { z } from "zod"

export const schema = z.object({
  password: z.string(),
})

export type Schema = z.infer<typeof schema>
