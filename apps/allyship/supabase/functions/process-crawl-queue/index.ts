/// <reference lib="deno.ns" />
import { createClient } from 'jsr:@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  console.log(`[PROCESS-QUEUE] Edge function called`)

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables')
    }

    console.log(`[PROCESS-QUEUE] Creating Supabase client`)
    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Call our working database function
    console.log(`[PROCESS-QUEUE] Calling process_crawl_queue_simple`)
    const { data, error } = await supabase.rpc('process_crawl_queue_simple')

    if (error) {
      console.error(`[PROCESS-QUEUE] Database function error:`, error)
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            message: 'Database function failed',
            details: error.message,
          },
        }),
        { headers: { 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    console.log(`[PROCESS-QUEUE] Database function result:`, data)

    return new Response(
      JSON.stringify({
        success: true,
        data,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[PROCESS-QUEUE] Unexpected error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: 'Internal server error',
          details: error instanceof Error ? error.message : String(error),
        },
      }),
      { headers: { 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
