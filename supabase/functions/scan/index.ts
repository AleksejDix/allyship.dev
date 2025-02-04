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

    const supabase = createClient(Deno.env.get('NEXT_PUBLIC_SUPABASE_URL'), Deno.env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY'))


    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    await supabase.auth.getUser(token);

    // get body from request
    const { url, id } = await req.json()

    console.log({id, url})

    // console.log(`wss://chrome.browserless.io?token=${Deno.env.get('PUPPETEER_BROWSERLESS_IO_KEY')}`)

    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: `wss://chrome.browserless.io?token=${Deno.env.get(
    //     'PUPPETEER_BROWSERLESS_IO_KEY'
    //   )}`,
    // })

    // console.log(`wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`)

    const browser = await puppeteer.connect({
      browserWSEndpoint:   `wss://api.browsercat.com/connect?apiKey=${Deno.env.get('BROWSERCAT_API_KEY')}`
    });


    const page = await browser.newPage()
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }); // Wait until network is idle

    await page.waitForFunction(() => document.readyState === "complete");

    // https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
    const results = await new AxePuppeteer(page)
      .withTags(["wcag22aa", "best-practice"])
      .withRules({
        'accesskeys': {enabled: true},
        'area-alt': {enabled: false},
        'aria-allowed-role': {enabled: true},
        'aria-braille-equivalent': {enabled: false},
        'aria-conditional-attr': {enabled: true},
        'aria-deprecated-role': {enabled: true},
        'aria-dialog-name': {enabled: true},
        'aria-prohibited-attr': {enabled: true},
        'aria-roledescription': {enabled: false},
        'aria-treeitem-name': {enabled: true},
        'aria-text': {enabled: true},
        'audio-caption': {enabled: false},
        'blink': {enabled: false},
        'duplicate-id': {enabled: false},
        'empty-heading': {enabled: true},
        'frame-focusable-content': {enabled: false},
        'frame-title-unique': {enabled: false},
        'heading-order': {enabled: true},
        'html-xml-lang-mismatch': {enabled: true},
        'identical-links-same-purpose': {enabled: true},
        'image-redundant-alt': {enabled: true},
        'input-button-name': {enabled: true},
        'label-content-name-mismatch': {enabled: true},
        'landmark-one-main': {enabled: true},
        'link-in-text-block': {enabled: true},
        'marquee': {enabled: false},
        'meta-viewport': {enabled: true},
        // https://github.com/dequelabs/axe-core/issues/2958
        'nested-interactive': {enabled: false},
        'no-autoplay-audio': {enabled: false},
        'role-img-alt': {enabled: false},
        'scrollable-region-focusable': {enabled: false},
        'select-name': {enabled: true},
        'server-side-image-map': {enabled: false},
        'skip-link': {enabled: true},
        // https://github.com/GoogleChrome/lighthouse/issues/16163
        'summary-name': {enabled: false},
        'svg-img-alt': {enabled: false},
        'tabindex': {enabled: true},
        'table-duplicate-name': {enabled: true},
        'table-fake-caption': {enabled: true},
        'target-size': {enabled: true},
        'td-has-header': {enabled: true},
      })
      .analyze()

    const { data, error } = await supabase.from("scan").update({
      results: results,
      status: "completed",
    }).eq("id", id)

    if (error) {
      return new Response(JSON.stringify({error: error.message}), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }

    // console.log({data, error})

    return new Response(JSON.stringify(data), {
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

