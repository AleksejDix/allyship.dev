import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
}

interface ProcessAxeResultsRequest {
  scan_id: string
  force_reprocess?: boolean
}

serve(async req => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { scan_id, force_reprocess = false }: ProcessAxeResultsRequest =
      await req.json()

    if (!scan_id) {
      return new Response(JSON.stringify({ error: 'scan_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Get scan details
    const { data: scan, error: scanError } = await supabase
      .from('Scan')
      .select('id, url, scan_type, metrics')
      .eq('id', scan_id)
      .single()

    if (scanError || !scan) {
      return new Response(
        JSON.stringify({ error: 'Scan not found', details: scanError }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if scan is axe-core type
    if (scan.scan_type !== 'axe_core') {
      return new Response(
        JSON.stringify({ error: 'Scan is not an axe-core scan' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if already processed (unless force reprocess)
    if (!force_reprocess) {
      const { data: existingExecution } = await supabase
        .from('test_executions')
        .select('id')
        .eq('scan_id', scan_id)
        .eq('tool_name', 'axe-core')
        .single()

      if (existingExecution) {
        return new Response(
          JSON.stringify({
            message: 'Scan already processed',
            execution_id: existingExecution.id,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Get axe results from storage
    const resultsUrl = scan.metrics?.light?.results_url
    if (!resultsUrl) {
      return new Response(
        JSON.stringify({ error: 'No axe results URL found in scan metrics' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Fetch axe results
    const axeResponse = await fetch(resultsUrl)
    if (!axeResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch axe results',
          status: axeResponse.status,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const axeResults = await axeResponse.json()

    // Process results using the database function
    const { data: processResult, error: processError } = await supabase.rpc(
      'process_axe_scan_results',
      {
        scan_id_param: scan_id,
        axe_results: axeResults,
      }
    )

    if (processError) {
      console.error('Error processing axe results:', processError)
      return new Response(
        JSON.stringify({
          error: 'Failed to process axe results',
          details: processError,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const result = processResult[0]

    return new Response(
      JSON.stringify({
        success: true,
        execution_id: result.execution_id,
        processed_rules: result.processed_rules,
        processed_violations: result.processed_violations,
        scan_id: scan_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in process-axe-results function:', error)
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
