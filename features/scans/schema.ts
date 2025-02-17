import { z } from "zod"

export const scanJobSchema = z.object({
  url: z.string().url(),
  page_id: z.string().uuid(),
})

export type ScanJobInput = z.infer<typeof scanJobSchema>

export const scanStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
  "queued",
])

export type ScanStatus = z.infer<typeof scanStatusSchema>
