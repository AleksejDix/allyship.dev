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
      `${supabaseUrl}/functions/v1/process-scheduled-scans`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('[CRON] Edge function error:', errorText)
      return NextResponse.json(
        {
          success: false,
          error: { message: 'Failed to process scheduled scans' },
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

// GET endpoint for testing/manual trigger
export async function GET(request: Request) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      {
        success: false,
        error: { message: 'Not available in production' },
      },
      { status: 403 }
    )
  }

  return POST(request)
}
