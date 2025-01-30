import { z } from "zod"

export const EmailSchema = z.object({
  email: z.string().email(),
})

export const UrlSchema = z.object({
  url: z.string().url(),
})

export const NameSchema = z.object({
  name: z.string().min(1),
})

export const PasswordSchema = z.object({
  password: z.string().min(8),
})
