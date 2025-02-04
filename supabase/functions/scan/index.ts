// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
import { AxePuppeteer } from 'npm:@axe-core/puppeteer'
import { createClient } from 'jsr:@supabase/supabase-js@2'



Deno.serve(async (req) => {
  try {

    const supabase = createClient(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL'), Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'))
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const {user,  error } = await supabase.auth.getUser(token);
    console.log({user, error})
    if (error) {
      return new Response(JSON.stringify({error: error.message}), {
        headers: { 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // get body from request
    const { url, id } = await req.json()


    // curl --request POST 'http://localhost:54321/functions/v1/scan' \
    // --header 'Authorization: Bearer XXXX' \
    // --header 'Content-Type: application/json' \
    // --data '{ "url":"https://bubba.com.ua", id: "c6f0aa8b-3aeb-4fab-8a10-d382123bd169" }'


    // console.log(`wss://chrome.browserless.io?token=${Deno.env.get('PUPPETEER_BROWSERLESS_IO_KEY')}`)

    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: `wss://chrome.browserless.io?token=${Deno.env.get(
    //     'PUPPETEER_BROWSERLESS_IO_KEY'
    //   )}`,
    // })

    // console.log(`wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`)

    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`
    });


    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }); // Wait until network is idle

    await page.waitForFunction(() => document.readyState === "complete");

    // https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
    const results = await new AxePuppeteer(page)
      .withTags(["wcag22aa", "best-practice"])
      .withRules([
        'accesskeys',
        'aria-allowed-role',
        'aria-conditional-attr',
        'aria-deprecated-role',
        'aria-dialog-name',
        'aria-prohibited-attr',
        'aria-treeitem-name',
        'aria-text',
        'empty-heading',
        'heading-order',
        'html-xml-lang-mismatch',
        'identical-links-same-purpose',
        'image-redundant-alt',
        'input-button-name',
        'label-content-name-mismatch',
        'landmark-one-main',
        'link-in-text-block',
        'meta-viewport',
        'select-name',
        'skip-link',
        'tabindex',
        'table-duplicate-name',
        'table-fake-caption',
        'target-size',
        'td-has-header'
      ])
      .disableRules([
        'area-alt',
        'aria-braille-equivalent',
        'aria-roledescription',
        'audio-caption',
        'blink',
        'duplicate-id',
        'frame-focusable-content',
        'frame-title-unique',
        'marquee',
        'nested-interactive',
        'no-autoplay-audio',
        'role-img-alt',
        'scrollable-region-focusable',
        'server-side-image-map',
        'summary-name',
        'svg-img-alt'
      ])
      .analyze()

    const { data: scanData, error: scanError } = await supabase.from("scan").update({
      results: results,
      status: "completed",
    }).eq("id", id)

    console.log({data: scanData, error: scanError})

    if (scanError) {
      return new Response(JSON.stringify({error: scanError.message}), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    return new Response(JSON.stringify(scanData), {
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

