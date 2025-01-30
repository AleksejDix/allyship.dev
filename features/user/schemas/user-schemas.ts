import { z } from "zod"

const email = z.string().email("Invalid email address")
const password = z
  .string()
  .min(6, "Password must be at least 6 characters long")

export const LoginFormSchema = z.object({
  email,
  password,
})

// TypeScript type inference
export type LoginForm = z.infer<typeof LoginFormSchema>

export const ResetPasswordForEmailSchema = z.object({
  email,
})

export type ResetPasswordForEmail = z.infer<typeof ResetPasswordForEmailSchema>

export const UpdatePasswordSchema = z.object({
  password,
})

export type UpdatePassword = z.infer<typeof UpdatePasswordSchema>
