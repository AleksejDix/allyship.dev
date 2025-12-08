/**
 * Cron job to refresh expired tokens
 *
 * POST /api/cron/refresh-tokens
 *
 * This endpoint should be called periodically (e.g., every 30 minutes)
 * to automatically refresh tokens that are expired or expiring soon.
 *
 * In production, set up a cron job or scheduled task:
 * - Vercel: Use Vercel Cron Jobs
 * - Other platforms: Use system cron or external service (e.g., cron-job.org)
 *
 * Security: In production, protect this endpoint with a secret token
 */

import { refreshExpiredTokens } from '~/server/utils/token-refresh'

export default defineEventHandler(async (event) => {
  // TODO: In production, verify cron secret token
  // const cronSecret = getHeader(event, 'x-cron-secret')
  // if (cronSecret !== process.env.CRON_SECRET) {
  //   throw createError({ statusCode: 401, message: 'Unauthorized' })
  // }

  console.log('⏰ Cron job triggered: Token refresh')

  await refreshExpiredTokens()

  return {
    success: true,
    message: 'Token refresh completed',
    timestamp: new Date().toISOString()
  }
})
