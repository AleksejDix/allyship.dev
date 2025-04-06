'use server'

import { Resend } from 'resend'
import { createServerAction } from 'zsa'
import { z } from 'zod'

import { env } from '@/env.mjs'

// Initialize Resend client
const resend = new Resend(env.RESEND_API_KEY)

// Single audience ID for all subscribers
const GENERAL_AUDIENCE_ID = 'f186e3af-7f35-428d-b6b8-e779838e38b6' // Replace with your actual audience ID

// Input validation schema
const subscribeSchema = z.object({
  email: z.string().email(),
  campaign: z.string().default('white-label-wcag-audits'),
})

export const waitingListAction = createServerAction()
  .input(subscribeSchema)
  .handler(async ({ input }) => {
    try {
      const { email, campaign } = input

      // Add to the general audience
      try {
        await resend.contacts.create({
          email,
          firstName: campaign, // Store campaign in firstName field for segmentation
          audienceId: GENERAL_AUDIENCE_ID,
        })
      } catch (error) {
        // Ignore audience errors - subscriber might already exist
        console.error('Error adding to audience:', error)
      }

      // Send confirmation email
      try {
        await resend.emails.send({
          from: 'Allyship <newsletter@allyship.dev>',
          to: email,
          subject: 'Thanks for your interest',
          text: `Thank you for your interest in our product. We'll notify you when it's available.

Best regards,
The Allyship Team`,
        })
      } catch (error) {
        console.error('Error sending email:', error)
      }

      return {
        success: true,
      }
    } catch (error) {
      console.error('Subscription error:', error)
      return {
        success: false,
        error: {
          message: 'Failed to process subscription',
          code: 'internal_server_error',
          status: 500,
        },
      }
    }
  })
