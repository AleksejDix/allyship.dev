import { z } from "zod"

// Create schemas
export const createPageSchema = z.object({
  url: z.string().url(),
  website_id: z.string(),
})

// Read schemas
export const getPagesSchema = z.object({
  website_id: z.string(),
})

export const getPageSchema = z.object({
  id: z.string(),
})

// Update schemas
export const updatePageSchema = z.object({
  id: z.string(),
  url: z.string().url().optional(),
  website_id: z.string().optional(),
  status: z.enum(["idle", "scanning", "completed", "failed"]).optional(),
  last_scan_at: z.string().datetime().optional(),
  error_message: z.string().optional(),
})

// Delete schemas
export const deletePageSchema = z.object({
  id: z.string(),
})

// Types
export type CreatePageInput = z.infer<typeof createPageSchema>
export type GetPagesInput = z.infer<typeof getPagesSchema>
export type GetPageInput = z.infer<typeof getPageSchema>
export type UpdatePageInput = z.infer<typeof updatePageSchema>
export type DeletePageInput = z.infer<typeof deletePageSchema>
