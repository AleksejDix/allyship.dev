import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('Authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    // Verify authorization
    if (!authHeader || authHeader !== `Bearer ${serviceRoleKey}`) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Unauthorized' },
        },
        { status: 401 }
      )
    }

    // Call the Supabase Edge Function
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Supabase URL not configured' },
        },
        { status: 500 }
      )
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/process-crawl-queue`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_concurrent: 3, // Process up to 3 URLs concurrently
          max_items: 15, // Process up to 15 items per cron run
        }),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[CRON] Edge function error:', errorText)
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Failed to process crawl queue' },
        },
        { status: 500 }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error('[CRON] API Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Internal server error' },
      },
      { status: 500 }
    )
  }
}

// Allow GET for development/testing
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'GET method only allowed in development' },
      { status: 405 }
    )
  }

  // In development, allow GET requests for easy testing
  return POST(
    new Request('http://localhost:3000/api/cron/crawl-queue', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
    })
  )
}
