import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const scanScheduleSchema = z.object({
  id: z.string().optional(),
  page_id: z.string(),
  frequency: z.enum(['daily', 'weekly', 'biweekly', 'monthly', 'disabled']),
  is_active: z.boolean(),
})

// GET - Fetch scan schedule for a page
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('page_id')

    if (!pageId) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'page_id parameter is required' },
        },
        { status: 400 }
      )
    }

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Not authenticated' },
        },
        { status: 401 }
      )
    }

    // Get scan schedule
    const { data: schedule, error } = await supabase
      .from('ScanSchedule')
      .select('*')
      .eq('page_id', pageId)
      .single()

    if (error && error.code !== 'PGRST116') {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Failed to fetch scan schedule' },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: schedule || null,
    })
  } catch (error) {
    console.error('[SCAN_SCHEDULE] GET Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Internal server error' },
      },
      { status: 500 }
    )
  }
}

// POST - Create new scan schedule
export async function POST(request: Request) {
  try {
    console.log('[SCAN_SCHEDULE] POST request received')
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    console.log('[SCAN_SCHEDULE] User check:', {
      user: user?.id,
      error: userError,
    })
    if (userError || !user) {
      console.log('[SCAN_SCHEDULE] Authentication failed')
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Not authenticated' },
        },
        { status: 401 }
      )
    }

    // Validate input
    const body = await request.json()
    console.log('[SCAN_SCHEDULE] Request body:', body)
    const result = scanScheduleSchema.safeParse(body)
    if (!result.success) {
      console.log('[SCAN_SCHEDULE] Validation failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request body',
            details: result.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const { page_id, frequency, is_active } = result.data
    console.log('[SCAN_SCHEDULE] Parsed data:', {
      page_id,
      frequency,
      is_active,
    })

    // Verify page ownership using a simpler query
    const { data: pageData, error: pageError } = await supabase
      .from('Page')
      .select(
        `
        id,
        website_id,
        Website!inner(
          id,
          space_id,
          Space!inner(
            id,
            owner_id
          )
        )
      `
      )
      .eq('id', page_id)
      .single()

    console.log('[SCAN_SCHEDULE] Page query result:', { pageData, pageError })

    if (pageError || !pageData) {
      console.log('[SCAN_SCHEDULE] Page not found:', pageError)
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Page not found' },
        },
        { status: 404 }
      )
    }

    const spaceOwnerId = pageData.Website?.Space?.owner_id
    if (!spaceOwnerId) {
      console.log('[SCAN_SCHEDULE] Invalid page structure - no space owner')
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Page not found' },
        },
        { status: 404 }
      )
    }

    if (spaceOwnerId !== user.id) {
      console.log('[SCAN_SCHEDULE] Authorization failed:', {
        pageOwner: spaceOwnerId,
        currentUser: user.id,
      })
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Not authorized' },
        },
        { status: 403 }
      )
    }

    // Calculate next scan time
    const nextScanAt =
      frequency !== 'disabled' ? await calculateNextScanTime(frequency) : null
    console.log('[SCAN_SCHEDULE] Next scan time calculated:', nextScanAt)

    // Create scan schedule
    const insertData = {
      page_id,
      frequency,
      is_active,
      next_scan_at: nextScanAt,
    }
    console.log('[SCAN_SCHEDULE] Inserting data:', insertData)

    const { data: schedule, error: insertError } = await supabase
      .from('ScanSchedule')
      .insert(insertData)
      .select()
      .single()

    console.log('[SCAN_SCHEDULE] Insert result:', { schedule, insertError })

    if (insertError) {
      console.log('[SCAN_SCHEDULE] Insert failed:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to create scan schedule',
            details: insertError,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    console.error('[SCAN_SCHEDULE] POST Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Internal server error' },
      },
      { status: 500 }
    )
  }
}

// PUT - Update existing scan schedule
export async function PUT(request: Request) {
  try {
    console.log('[SCAN_SCHEDULE] PUT request received')
    const supabase = await createClient()

    // Verify authentication
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()
    console.log('[SCAN_SCHEDULE] PUT User check:', {
      user: user?.id,
      error: userError,
    })
    if (userError || !user) {
      console.log('[SCAN_SCHEDULE] PUT Authentication failed')
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Not authenticated' },
        },
        { status: 401 }
      )
    }

    // Validate input
    const body = await request.json()
    console.log('[SCAN_SCHEDULE] PUT Request body:', body)
    const result = scanScheduleSchema.safeParse(body)
    if (!result.success) {
      console.log('[SCAN_SCHEDULE] PUT Validation failed:', result.error)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Invalid request body',
            details: result.error.flatten(),
          },
        },
        { status: 400 }
      )
    }

    const { id, page_id, frequency, is_active } = result.data
    console.log('[SCAN_SCHEDULE] PUT Parsed data:', {
      id,
      page_id,
      frequency,
      is_active,
    })

    if (!id) {
      console.log('[SCAN_SCHEDULE] PUT Missing schedule ID')
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Schedule ID is required for updates' },
        },
        { status: 400 }
      )
    }

    // Verify schedule ownership
    const { data: scheduleData, error: scheduleError } = await supabase
      .from('ScanSchedule')
      .select(
        `
        id,
        page_id,
        Page!inner(
          id,
          website_id,
          Website!inner(
            id,
            space_id,
            Space!inner(
              id,
              owner_id
            )
          )
        )
      `
      )
      .eq('id', id)
      .single()

    console.log('[SCAN_SCHEDULE] PUT Schedule query result:', {
      scheduleData,
      scheduleError,
    })

    if (scheduleError || !scheduleData) {
      console.log('[SCAN_SCHEDULE] PUT Schedule not found:', scheduleError)
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Schedule not found' },
        },
        { status: 404 }
      )
    }

    const scheduleSpaceOwnerId = scheduleData.Page?.Website?.Space?.owner_id
    if (!scheduleSpaceOwnerId) {
      console.log(
        '[SCAN_SCHEDULE] PUT Invalid schedule structure - no space owner'
      )
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Schedule not found' },
        },
        { status: 404 }
      )
    }

    if (scheduleSpaceOwnerId !== user.id) {
      console.log('[SCAN_SCHEDULE] PUT Authorization failed:', {
        scheduleOwner: scheduleSpaceOwnerId,
        currentUser: user.id,
      })
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Not authorized' },
        },
        { status: 403 }
      )
    }

    // Calculate next scan time
    const nextScanAt =
      frequency !== 'disabled' ? await calculateNextScanTime(frequency) : null
    console.log('[SCAN_SCHEDULE] PUT Next scan time calculated:', nextScanAt)

    // Update scan schedule
    const updateData = {
      frequency,
      is_active,
      next_scan_at: nextScanAt,
    }
    console.log('[SCAN_SCHEDULE] PUT Updating with data:', updateData)

    const { data: schedule, error: updateError } = await supabase
      .from('ScanSchedule')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    console.log('[SCAN_SCHEDULE] PUT Update result:', { schedule, updateError })

    if (updateError) {
      console.log('[SCAN_SCHEDULE] PUT Update failed:', updateError)
      return NextResponse.json(
        {
          success: false,
          error: {
            message: 'Failed to update scan schedule',
            details: updateError,
          },
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: schedule,
    })
  } catch (error) {
    console.error('[SCAN_SCHEDULE] PUT Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Internal server error' },
      },
      { status: 500 }
    )
  }
}

// Helper function to calculate next scan time
async function calculateNextScanTime(frequency: string): Promise<string> {
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
