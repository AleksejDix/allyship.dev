import { z } from "zod"

export const spaceSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Workspace name is required",
    })
    .max(50, {
      message: "Workspace name cannot be longer than 50 characters",
    })
    .refine((value) => !/^\s*$/.test(value), {
      message: "Workspace name cannot be only whitespace",
    })
    .transform((value) => value.trim()) // Trim whitespace before validation
})
