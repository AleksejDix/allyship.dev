import { z } from "zod"

export const newsletterShema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export type NewsletterSchema = z.infer<typeof newsletterShema>
