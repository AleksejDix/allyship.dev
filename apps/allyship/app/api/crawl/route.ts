import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const crawlSchema = z.object({
  website_id: z.string(),
  url: z.string().url(),
})

export async function POST(request: Request) {
  try {
    // First verify the user has access
    const supabase = await createClient()

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession()
    if (sessionError || !sessionData.session) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'AUTH_ERROR',
          },
        },
        { status: 401 }
      )
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Not authenticated',
            code: 'AUTH_ERROR',
          },
        },
        { status: 401 }
      )
    }

    // Validate input
    const body = await request.json()
    const result = crawlSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request body',
            code: 'VALIDATION_ERROR',
            details: result.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const { website_id, url } = result.data

    // Verify website ownership
    const { data: website, error: websiteError } = await supabase
      .from('Website')
      .select('space:Space(owner_id)')
      .eq('id', website_id)
      .single()

    if (websiteError || !website?.space?.owner_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Website not found',
            code: 'WEBSITE_NOT_FOUND',
          },
        },
        { status: 404 }
      )
    }

    if (website.space.owner_id !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Not authorized to crawl this website',
            code: 'NOT_WEBSITE_OWNER',
          },
        },
        { status: 403 }
      )
    }

    // Check if we can start a new crawl job (this also cleans up stuck jobs)
    const { data: canStart, error: canStartError } = await supabase.rpc(
      'can_start_crawl_job',
      { p_website_id: website_id }
    )

    if (canStartError) {
      console.error('[CRAWL] Error checking crawl job status:', canStartError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to check crawl job status',
            code: 'CRAWL_CHECK_ERROR',
            details: canStartError.message,
          },
        },
        { status: 500 }
      )
    }

    if (!canStart) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'A crawl job is already running for this website',
            code: 'CRAWL_IN_PROGRESS',
          },
        },
        { status: 409 }
      )
    }

    // Create crawl job directly in the database
    const { data: crawlJob, error: jobError } = await supabase
      .from('CrawlJob')
      .insert({
        website_id,
        status: 'running',
        started_at: new Date().toISOString(),
        progress: {
          urls_queued: 1,
          urls_processed: 0,
          urls_completed: 0,
          urls_failed: 0,
          crawled_urls: [],
        },
      })
      .select()
      .single()

    if (jobError) {
      console.error('[CRAWL] Error creating crawl job:', jobError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to create crawl job',
            code: 'CRAWL_JOB_CREATE_ERROR',
            details: jobError.message,
          },
        },
        { status: 500 }
      )
    }

    // Queue the initial URL
    const { error: queueError } = await supabase.rpc('queue_crawl_url', {
      p_crawl_job_id: crawlJob.id,
      p_url: url,
      p_depth: 0,
      p_priority: 100,
    })

    if (queueError) {
      console.error('[CRAWL] Error queuing initial URL:', queueError)
      // Try to clean up the job if queuing failed
      await supabase
        .from('CrawlJob')
        .update({
          status: 'failed',
          error_message: 'Failed to queue initial URL',
        })
        .eq('id', crawlJob.id)

      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to queue initial URL',
            code: 'QUEUE_ERROR',
            details: queueError.message,
          },
        },
        { status: 500 }
      )
    }

    // Return success with crawl job info
    return NextResponse.json({
      success: true,
      data: {
        crawl_job_id: crawlJob.id,
        message:
          'Crawl job started successfully. Pages will be discovered and processed in the background.',
        stats: {
          status: 'running',
          total: 0,
          new: 0,
          existing: 0,
        },
      },
    })
  } catch (error) {
    console.error('[CRAWL] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'An unexpected error occurred',
          code: 'INTERNAL_SERVER_ERROR',
        },
      },
      { status: 500 }
    )
  }
}
