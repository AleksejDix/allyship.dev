// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { AxePuppeteer } from "npm:@axe-core/puppeteer"

Deno.serve(async (req) => {
  try {
    const { url, id } = await req.json()
    console.log(`[START] Processing scan for URL: ${url}, ID: ${id}`)

    const supabase = createClient(
      Deno.env.get("NEXT_PUBLIC_SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    )
    console.log("[SETUP] Supabase client created")

    const authHeader = req.headers.get("Authorization")!
    console.log({ authHeader })
    const token = authHeader.replace("Bearer ", "")
    console.log({ token })
    const { user, error } = await supabase.auth.getUser(token)
    console.log({ user, error })
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { "Content-Type": "application/json" },
        status: 401,
      })
    }

    console.log("[BROWSER] Connecting to browsercat")
    const browser = await puppeteer.connect({
      browserWSEndpoint: `wss://api.browsercat.com/connect?apiKey=${Deno.env.get("BROWSERCAT_API_KEY")}`,
    })
    console.log("[BROWSER] Connected successfully")

    // Browserless.io configuration (alternative)
    // console.log(`wss://chrome.browserless.io?token=${Deno.env.get('PUPPETEER_BROWSERLESS_IO_KEY')}`)
    // const browser = await puppeteer.connect({
    //   browserWSEndpoint: `wss://chrome.browserless.io?token=${Deno.env.get('PUPPETEER_BROWSERLESS_IO_KEY')}`,
    // })

    // Function to capture screenshot and run axe tests in specific mode
    async function captureAndTest(page: puppeteer.Page, isDarkMode: boolean) {
      const mode = isDarkMode ? "dark" : "light"
      console.log(`[${mode.toUpperCase()}] Starting capture and test`)

      await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 })

      if (isDarkMode) {
        await page.emulateMediaFeatures([
          { name: "prefers-color-scheme", value: "dark" },
        ])
      } else {
        await page.emulateMediaFeatures([
          { name: "prefers-color-scheme", value: "light" },
        ])
      }

      console.log(`[${mode.toUpperCase()}] Navigating to URL`)
      await page.goto(url, { waitUntil: "networkidle0" })
      console.log(`[${mode.toUpperCase()}] Page loaded`)

      console.log(`[${mode.toUpperCase()}] Taking screenshot`)
      const screenshot = await page.screenshot({
        type: "png",
      })
      console.log(`[${mode.toUpperCase()}] Screenshot captured`)

      console.log(`[${mode.toUpperCase()}] Running accessibility tests`)
      const results = await new AxePuppeteer(page)
        .withTags(["wcag22aa", "best-practice"])
        .withRules([
          "accesskeys",
          "aria-allowed-role",
          "aria-conditional-attr",
          "aria-deprecated-role",
          "aria-dialog-name",
          "aria-prohibited-attr",
          "aria-treeitem-name",
          "aria-text",
          "empty-heading",
          "heading-order",
          "html-xml-lang-mismatch",
          "identical-links-same-purpose",
          "image-redundant-alt",
          "input-button-name",
          "label-content-name-mismatch",
          "landmark-one-main",
          "link-in-text-block",
          "meta-viewport",
          "select-name",
          "skip-link",
          "tabindex",
          "table-duplicate-name",
          "table-fake-caption",
          "target-size",
          "td-has-header",
        ])
        .disableRules([
          "area-alt",
          "aria-braille-equivalent",
          "aria-roledescription",
          "audio-caption",
          "blink",
          "duplicate-id",
          "frame-focusable-content",
          "frame-title-unique",
          "marquee",
          "nested-interactive",
          "no-autoplay-audio",
          "role-img-alt",
          "scrollable-region-focusable",
          "server-side-image-map",
          "summary-name",
          "svg-img-alt",
        ])
        .analyze()
      console.log(`[${mode.toUpperCase()}] Accessibility tests completed`)

      const screenshotFileName = `${id}/${isDarkMode ? "dark" : "light"}.png`
      console.log(
        `[${mode.toUpperCase()}] Uploading screenshot: ${screenshotFileName}`
      )
      const { error: screenshotError } = await supabase.storage
        .from("screenshots")
        .upload(screenshotFileName, screenshot, {
          contentType: "image/png",
          upsert: true,
        })

      if (screenshotError) throw screenshotError

      // Upload test results as JSON
      const resultsFileName = `${id}/${isDarkMode ? "dark" : "light"}.json`
      const { error: resultsError } = await supabase.storage
        .from("test-results")
        .upload(resultsFileName, JSON.stringify(results, null, 2), {
          contentType: "application/json",
          upsert: true,
        })

      if (resultsError) throw resultsError

      // Get signed URLs that expire in 24 hours
      const screenshotUrl = supabase.storage
        .from("screenshots")
        .createSignedUrl(screenshotFileName, 60 * 60 * 24)
        .then(({ data }) => data?.signedUrl)

      const resultsUrl = supabase.storage
        .from("test-results")
        .createSignedUrl(resultsFileName, 60 * 60 * 24)
        .then(({ data }) => data?.signedUrl)

      // Wait for both signed URLs
      const [signedScreenshotUrl, signedResultsUrl] = await Promise.all([
        screenshotUrl,
        resultsUrl,
      ])

      if (!signedScreenshotUrl || !signedResultsUrl) {
        throw new Error("Failed to create signed URLs")
      }

      console.log(`[${mode.toUpperCase()}] Processing completed`)
      return {
        screenshot: signedScreenshotUrl,
        results,
        resultsUrl: signedResultsUrl,
      }
    }

    console.log("[SCAN] Creating new page")
    const page = await browser.newPage()

    console.log("[SCAN] Starting light mode capture")
    const lightMode = await captureAndTest(page, false)
    console.log("[SCAN] Light mode capture completed")

    console.log("[SCAN] Starting dark mode capture")
    const darkMode = await captureAndTest(page, true)
    console.log("[SCAN] Dark mode capture completed")

    console.log("[DATABASE] Updating scan record")
    const { error: updateError } = await supabase
      .from("Scan")
      .update({
        screenshot_light: lightMode.screenshot,
        screenshot_dark: darkMode.screenshot,
        metrics: {
          light: {
            violations_count: lightMode.results.violations.length,
            passes_count: lightMode.results.passes.length,
            incomplete_count: lightMode.results.incomplete.length,
            inapplicable_count: lightMode.results.inapplicable.length,
            critical_issues: lightMode.results.violations.filter(
              (v) => v.impact === "critical"
            ).length,
            serious_issues: lightMode.results.violations.filter(
              (v) => v.impact === "serious"
            ).length,
            moderate_issues: lightMode.results.violations.filter(
              (v) => v.impact === "moderate"
            ).length,
            minor_issues: lightMode.results.violations.filter(
              (v) => v.impact === "minor"
            ).length,
            results_url: lightMode.resultsUrl,
          },
          dark: {
            violations_count: darkMode.results.violations.length,
            passes_count: darkMode.results.passes.length,
            incomplete_count: darkMode.results.incomplete.length,
            inapplicable_count: darkMode.results.inapplicable.length,
            critical_issues: darkMode.results.violations.filter(
              (v) => v.impact === "critical"
            ).length,
            serious_issues: darkMode.results.violations.filter(
              (v) => v.impact === "serious"
            ).length,
            moderate_issues: darkMode.results.violations.filter(
              (v) => v.impact === "moderate"
            ).length,
            minor_issues: darkMode.results.violations.filter(
              (v) => v.impact === "minor"
            ).length,
            results_url: darkMode.resultsUrl,
          },
        },
        status: "completed",
      })
      .eq("id", id)

    if (updateError) throw updateError
    console.log("[DATABASE] Scan record updated successfully")

    await browser.close()
    console.log("[BROWSER] Browser closed")

    console.log("[COMPLETE] Scan completed successfully")
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          screenshot_light: lightMode.screenshot,
          screenshot_dark: darkMode.screenshot,
          metrics: {
            light: {
              violations_count: lightMode.results.violations.length,
              passes_count: lightMode.results.passes.length,
              incomplete_count: lightMode.results.incomplete.length,
              inapplicable_count: lightMode.results.inapplicable.length,
              critical_issues: lightMode.results.violations.filter(
                (v) => v.impact === "critical"
              ).length,
              serious_issues: lightMode.results.violations.filter(
                (v) => v.impact === "serious"
              ).length,
              moderate_issues: lightMode.results.violations.filter(
                (v) => v.impact === "moderate"
              ).length,
              minor_issues: lightMode.results.violations.filter(
                (v) => v.impact === "minor"
              ).length,
              results_url: lightMode.resultsUrl,
            },
            dark: {
              violations_count: darkMode.results.violations.length,
              passes_count: darkMode.results.passes.length,
              incomplete_count: darkMode.results.incomplete.length,
              inapplicable_count: darkMode.results.inapplicable.length,
              critical_issues: darkMode.results.violations.filter(
                (v) => v.impact === "critical"
              ).length,
              serious_issues: darkMode.results.violations.filter(
                (v) => v.impact === "serious"
              ).length,
              moderate_issues: darkMode.results.violations.filter(
                (v) => v.impact === "moderate"
              ).length,
              minor_issues: darkMode.results.violations.filter(
                (v) => v.impact === "minor"
              ).length,
              results_url: darkMode.resultsUrl,
            },
          },
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (e) {
    console.error("[ERROR]", e)
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: e.message,
          status: 500,
          code: "screenshot_error",
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    )
  }
})
/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/scan' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp6aWNmb25jbnJxZnltcXN6bXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NTcxNjgsImV4cCI6MjA1MzEzMzE2OH0.glde8ZbmkAUgfn6oUJ8JF5wfNCfW44Vd8VM43JahWDg' \
    --header 'Content-Type: application/json' \
    --data '{ "url":"https://www.ihr-holz-mueller.de/", "id": "b350df4b-2ef6-46e7-bc63-06d0f96b9088"}'

*/
