import { z } from "zod"

export const scanJobSchema = z.object({
  url: z.string().url(),
})

export type ScanJobSchema = z.infer<typeof scanJobSchema>
