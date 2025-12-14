import { z } from "zod"

export const accountSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Account name is required",
    })
    .max(50, {
      message: "Account name cannot be longer than 50 characters",
    })
    .refine((value) => !/^\s*$/.test(value), {
      message: "Account name cannot be only whitespace",
    })
    .transform((value) => value.trim()),
})

export const teamAccountSchema = accountSchema.extend({
  slug: z
    .string()
    .min(3, {
      message: "Team slug must be at least 3 characters",
    })
    .max(50, {
      message: "Team slug cannot be longer than 50 characters",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Team slug can only contain lowercase letters, numbers, and hyphens",
    })
    .transform((value) => value.toLowerCase().trim()),
})
