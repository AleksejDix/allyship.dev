import { z } from 'zod'

/**
 * Generic schema for product waiting list subscriptions.
 * Used by the server action component for any campaign.
 */
export const waitingListSchema = z.object({
  email: z.string().email(),
})

export type WaitingListSchema = z.infer<typeof waitingListSchema>
