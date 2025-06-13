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

    // Call edge function securely from server-side
    const { error: functionError, data } = await supabase.functions.invoke(
      'crawl',
      {
        body: { website_id, url },
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      }
    )

    if (functionError) {
      console.error('[CRAWL] Edge function error:', functionError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to crawl website',
            code: 'EDGE_FUNCTION_ERROR',
            details: functionError.message,
          },
        },
        { status: 500 }
      )
    }

    // Check if crawl was successful and has URLs
    if (!data?.success || !data?.data?.urls || !Array.isArray(data.data.urls)) {
      return NextResponse.json(data)
    }

    const crawledUrls = data.data.urls

    // Get existing pages to avoid duplicates
    const { data: existingPages } = await supabase
      .from('Page')
      .select('url, path')
      .eq('website_id', website_id)

    const existingUrls = new Set(existingPages?.map(p => p.url) || [])
    const existingPaths = new Set(existingPages?.map(p => p.path) || [])
    const newUrls = crawledUrls.filter(
      (crawlUrl: string) => !existingUrls.has(crawlUrl)
    )

    // Create new pages with path deduplication
    if (newUrls.length > 0) {
      // Deduplicate by path to avoid constraint violations
      const pathToUrl = new Map<string, string>()

      for (const crawlUrl of newUrls) {
        const urlObj = new URL(crawlUrl)
        const path =
          urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/$/, '')

        // Skip if path already exists in database or in current batch
        if (!existingPaths.has(path) && !pathToUrl.has(path)) {
          pathToUrl.set(path, crawlUrl)
        }
      }

      const pagesToInsert = Array.from(pathToUrl.entries()).map(
        ([path, crawlUrl]) => ({
          url: crawlUrl,
          path,
          normalized_url: crawlUrl.toLowerCase(),
          website_id,
        })
      )

      if (pagesToInsert.length > 0) {
        const { data: createdPages, error: insertError } = await supabase
          .from('Page')
          .upsert(pagesToInsert, {
            onConflict: 'website_id,path',
            ignoreDuplicates: true,
          })
          .select()

        if (insertError) {
          console.error('[CRAWL] Failed to create pages:', insertError)
          return NextResponse.json(
            {
              success: false,
              error: {
                message: 'Failed to create pages',
                code: 'CREATE_PAGES_ERROR',
                details: insertError.message,
              },
            },
            { status: 500 }
          )
        }

        console.log(`[CRAWL] Created ${createdPages?.length || 0} new pages`)
      }
    }

    // Update stats to reflect actual database operations
    const updatedStats = {
      ...data.data.stats,
      new: newUrls.length,
      existing: crawledUrls.length - newUrls.length,
    }

    return NextResponse.json({
      ...data,
      data: {
        ...data.data,
        stats: updatedStats,
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
