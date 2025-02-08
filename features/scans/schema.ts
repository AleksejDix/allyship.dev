import { z } from "zod"

export const scanJobSchema = z.object({
  url: z.string().url("URL must contain http:// or https://"),
})

export type ScanJobSchema = z.infer<typeof scanJobSchema>
