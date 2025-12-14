import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

interface ScheduledScan {
  id: string
  page_id: string
  frequency: string
  next_scan_at: string
  page: {
    id: string
    url: string
    website: {
      id: string
      url: string
      space: {
        owner_id: string
      }
    }
  }
}

Deno.serve(async (req: Request) => {
  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
    if (!serviceRoleKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Verify this is a cron job request (optional security check)
    const authHeader = req.headers.get('Authorization')
    if (authHeader !== `Bearer ${serviceRoleKey}`) {
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'Unauthorized' },
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    console.log('[CRON] Starting scheduled scan processing')

    // Get all active schedules that are due for scanning
    const { data: scheduledScans, error: fetchError } = await supabase
      .from('ScanSchedule')
      .select(
        `
        id,
        page_id,
        frequency,
        next_scan_at,
        page:Page!ScanSchedule_page_id_fkey(
          id,
          url,
          website:Website!Page_website_id_fkey(
            id,
            url,
            space:Space!Website_space_id_fkey(
              owner_id
            )
          )
        )
      `
      )
      .eq('is_active', true)
      .not('next_scan_at', 'is', null)
      .lte('next_scan_at', new Date().toISOString())
      .limit(50) // Process max 50 scans per run

    if (fetchError) {
      console.error('[CRON] Error fetching scheduled scans:', fetchError)
      return new Response(
        JSON.stringify({
          success: false,
          error: { message: 'Failed to fetch scheduled scans' },
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    if (!scheduledScans || scheduledScans.length === 0) {
      console.log('[CRON] No scheduled scans due')
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No scheduled scans due',
          processed: 0,
        }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.log(
      `[CRON] Found ${scheduledScans.length} scheduled scans to process`
    )

    const results = {
      processed: 0,
      successful: 0,
      failed: 0,
      errors: [] as string[],
    }

    // Process each scheduled scan
    for (const schedule of scheduledScans as ScheduledScan[]) {
      try {
        console.log(`[CRON] Processing scan for page ${schedule.page.url}`)
        results.processed++

        // Create a new scan record
        const { data: scan, error: scanError } = await supabase
          .from('Scan')
          .insert({
            page_id: schedule.page_id,
            status: 'pending',
            metrics: {},
            url: schedule.page.url,
            normalized_url: schedule.page.url.toLowerCase(),
          })
          .select()
          .single()

        if (scanError) {
          console.error(
            `[CRON] Failed to create scan for page ${schedule.page.url}:`,
            scanError
          )
          results.failed++
          results.errors.push(
            `Failed to create scan for ${schedule.page.url}: ${scanError.message}`
          )
          continue
        }

        // Trigger the scan Edge Function
        const { error: functionError } = await supabase.functions.invoke(
          'scan',
          {
            body: {
              url: `https://${schedule.page.url}`,
              id: scan.id,
            },
          }
        )

        if (functionError) {
          console.error(
            `[CRON] Failed to trigger scan for page ${schedule.page.url}:`,
            functionError
          )
          results.failed++
          results.errors.push(
            `Failed to trigger scan for ${schedule.page.url}: ${functionError.message}`
          )

          // Update scan status to failed
          await supabase
            .from('Scan')
            .update({ status: 'failed' })
            .eq('id', scan.id)

          continue
        }

        // Calculate next scan time
        const nextScanAt = calculateNextScanTime(schedule.frequency)

        // Update the schedule with new next_scan_at and last_scan_at
        const { error: updateError } = await supabase
          .from('ScanSchedule')
          .update({
            last_scan_at: new Date().toISOString(),
            next_scan_at: nextScanAt,
          })
          .eq('id', schedule.id)

        if (updateError) {
          console.error(
            `[CRON] Failed to update schedule for page ${schedule.page.url}:`,
            updateError
          )
          // Don't fail the scan for this, just log it
        }

        console.log(
          `[CRON] Successfully triggered scan for page ${schedule.page.url}`
        )
        results.successful++
      } catch (error) {
        console.error(
          `[CRON] Unexpected error processing schedule ${schedule.id}:`,
          error
        )
        results.failed++
        results.errors.push(
          `Unexpected error for schedule ${schedule.id}: ${error instanceof Error ? error.message : String(error)}`
        )
      }
    }

    console.log(`[CRON] Completed processing. Results:`, results)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Processed ${results.processed} scheduled scans`,
        results,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[CRON] Fatal error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message:
            error instanceof Error ? error.message : 'Unknown error occurred',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
})

// Helper function to calculate next scan time
function calculateNextScanTime(frequency: string): string {
  const now = new Date()

  switch (frequency) {
    case 'daily':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
    case 'weekly':
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    case 'biweekly':
      return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString()
    case 'monthly':
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      return nextMonth.toISOString()
    default:
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
}
