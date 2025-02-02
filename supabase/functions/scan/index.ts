// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
import { AxePuppeteer } from 'npm:@axe-core/puppeteer'


console.log(AxePuppeteer)

Deno.serve(async (req) => {
  try {
    console.log(`wss://chrome.browserless.io?token=${Deno.env.get('PUPPETEER_BROWSERLESS_IO_KEY')}`)

    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: `wss://chrome.browserless.io?token=${Deno.env.get(
    //     'PUPPETEER_BROWSERLESS_IO_KEY'
    //   )}`,
    // })

    console.log(`wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`)

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`,
    });


    const page = await browser.newPage()

    const url = new URL(req.url).searchParams.get('url')

    await page.goto(url)

    const results = await new AxePuppeteer(page).analyze();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error(e)
    return new Response(JSON.stringify({ error: e.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scan' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

