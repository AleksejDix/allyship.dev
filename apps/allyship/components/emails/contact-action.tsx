'use server'

import { Resend } from 'resend'
import { z } from 'zod'
import { createServerAction } from 'zsa'

import { env } from '@/env.mjs'
import { EmailTemplate } from './contact-template'
import { contactFormSchema } from './contact-schema'

const resend = new Resend(env.RESEND_API_KEY)

export const contactFormAction = createServerAction()
  .input(contactFormSchema)
  .handler(async ({ input }) => {
    try {
      // Send email
      await resend.emails.send({
        from: `Allyship <contact@allyship.dev>`,
        to: ['privat@aleksejdix.com'],
        subject: `New Message from ${input.name}`,
        react: EmailTemplate(input) as React.ReactElement,
      })

      // Return success response
      return {
        success: true,
      }
    } catch (error) {
      // Handle Resend API errors
      if (error instanceof Error) {
        return {
          success: false,
          error: {
            message: 'Failed to send email',
            code: 'email_error',
            status: 500,
          },
        }
      }

      // Handle unknown errors
      return {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'internal_server_error',
          status: 500,
        },
      }
    }
  })
