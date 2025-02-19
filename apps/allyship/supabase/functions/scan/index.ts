// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts"
import { createClient } from "jsr:@supabase/supabase-js@2"
import { AxePuppeteer } from "npm:@axe-core/puppeteer"

// Types for scan modes and results
type ScanMode = "light" | "dark"
type ScanResult = {
  screenshot: Uint8Array // Changed from Buffer to Uint8Array for Deno compatibility
  results: any // Replace with proper Axe results type
}
type SignedUrls = {
  screenshot: string
  results: string
}
type Metrics = {
  violations_count: number
  passes_count: number
  incomplete_count: number
  inapplicable_count: number
  critical_issues: number
  serious_issues: number
  moderate_issues: number
  minor_issues: number
  results_url: string
}

// Constants
const PAGE_TIMEOUT = 30000 // 30 seconds
const SIGNED_URL_EXPIRY = 60 * 60 * 24 // 24 hours
const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 1 }

Deno.serve(async (req) => {
  let browser: puppeteer.Browser | undefined
  let scanId: string | undefined

  try {
    // Validate environment variables
    const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    const browsercatApiKey = Deno.env.get("BROWSERCAT_API_KEY")

    if (!supabaseUrl) throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set")
    if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set")
    if (!browsercatApiKey) throw new Error("BROWSERCAT_API_KEY is not set")

    const { url, id, mode } = await req.json()
    scanId = id
    if (!url || !scanId) throw new Error("Missing required parameters: url and id")

    console.log(`[START] Processing scan for URL: ${url}, ID: ${id}, Mode: ${mode || "both"}`)

    const supabase = createClient(supabaseUrl, serviceRoleKey)
    console.log("[SETUP] Supabase client created")

    // Validate auth header
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      throw new Error("Missing Authorization header - please include a valid JWT token")
    }

    console.log("[AUTH] Validating user token")
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }

    if (!user?.id) {
      throw new Error("Invalid or expired token - please sign in again")
    }

    // Verify user has access to the scan
    const { data: hasAccess, error: accessError } = await supabase
      .from("Scan")
      .select(`
        id,
        page:Page (
          website:Website (
            space:Space (
              owner_id
            )
          )
        )
      `)
      .eq("id", scanId)
      .single()

    if (accessError) {
      throw new Error(`Failed to verify access: ${accessError.message}`)
    }

    if (!hasAccess?.page?.website?.space?.owner_id) {
      throw new Error("Scan not found or you don't have access to it")
    }

    if (hasAccess.page.website.space.owner_id !== user.id) {
      throw new Error("You don't have permission to access this scan")
    }

    console.log("[AUTH] User validated successfully")

    // Determine scan modes based on request
    let selectedModes: ScanMode[]
    if (mode === "dark") {
      selectedModes = ["dark"]
      console.log(`[MODE] Running dark mode scan`)
    } else if (mode === "both") {
      selectedModes = ["light", "dark"]
      console.log("[MODE] Running dual mode scan (light + dark)")
    } else {
      // Default to light mode if no mode specified or if mode is "light"
      selectedModes = ["light"]
      console.log("[MODE] Running light mode scan (default)")
    }

    console.log("[BROWSER] Connecting to browsercat")
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://api.browsercat.com/connect?apiKey=${browsercatApiKey}`,
    })
    console.log("[BROWSER] Connected successfully")

    // Function to capture screenshot and run axe tests in specific mode
    async function captureAndTest(page: puppeteer.Page, mode: ScanMode): Promise<ScanResult> {
      console.log(`[${mode.toUpperCase()}] Starting capture and test`)

      await page.setViewport(VIEWPORT)
      await page.emulateMediaFeatures([
        { name: "prefers-color-scheme", value: mode },
      ])

      console.log(`[${mode.toUpperCase()}] Navigating to URL`)

      try {
        if (page.isClosed()) {
          console.error(`[${mode.toUpperCase()}] ERROR: Page is already closed`)
          throw new Error("Page is closed unexpectedly")
        }

        // Ensure no duplicate navigation requests
        await page.evaluate(() => {
          window.stop() // Stop any ongoing navigations before starting a new one
        })

        // Navigate to the page
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: PAGE_TIMEOUT,
        })

        // Ensure no pending navigation requests are still running
        await page.waitForNavigation({ waitUntil: "networkidle0", timeout: PAGE_TIMEOUT })
          .catch(() => console.warn(`[${mode.toUpperCase()}] Page load timeout`))

        console.log(`[${mode.toUpperCase()}] Page fully loaded`)

        // Verify we have valid content
        const content = await page.content()
        if (!content || content.trim().length === 0) {
          throw new Error("Page loaded but content is empty")
        }

      } catch (error) {
        console.error(`[${mode.toUpperCase()}] ERROR DURING NAVIGATION:`, error)
        throw error
      }

      // Wait for page to stabilize
      console.log(`[${mode.toUpperCase()}] Waiting for page to stabilize`)
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 2000)))

      // Take screenshot with retry
      console.log(`[${mode.toUpperCase()}] Taking screenshot`)
      let screenshot
      try {
        screenshot = await page.screenshot({
          type: "png",
          clip: { ...VIEWPORT, x: 0, y: 0 },
          fromSurface: true,
          captureBeyondViewport: true
        })
      } catch (error) {
        console.warn(`[${mode.toUpperCase()}] Screenshot failed, retrying: ${error.message}`)
        // Wait a bit and retry once
        await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 1000)))
        screenshot = await page.screenshot({
          type: "png",
          clip: { ...VIEWPORT, x: 0, y: 0 },
          fromSurface: true,
          captureBeyondViewport: true
        })
      }

      console.log(`[${mode.toUpperCase()}] Running accessibility tests`)
      const results = await new AxePuppeteer(page)
        .withTags(["wcag21aa", "wcag21a", "best-practice", "ACT"])
        .configure({
          reporter: "v2",
          resultTypes: ["violations", "incomplete", "inapplicable", "passes"],
        })
        .analyze()
      console.log(`[${mode.toUpperCase()}] Accessibility tests completed`)

      return { screenshot, results }
    }

    // Function to upload files to Supabase Storage with partial success handling
    async function uploadFiles(mode: ScanMode, data: ScanResult) {
      console.log(`[STORAGE] Uploading files for mode: ${mode}`)

      const resultsJson = JSON.stringify(data.results, null, 2)
      const uploads = await Promise.allSettled([
        supabase.storage
          .from("screenshots")
          .upload(`${id}/${mode}.png`, data.screenshot, {
            contentType: "image/png",
            upsert: true,
          }),
        supabase.storage
          .from("test-results")
          .upload(`${id}/${mode}.json`, resultsJson, {
            contentType: "application/json",
            upsert: true,
          })
      ])

      // Check for failures and log them
      for (const [index, upload] of uploads.entries()) {
        const fileType = index === 0 ? "screenshot" : "test results"
        if (upload.status === "rejected") {
          console.error(`[STORAGE] Failed to upload ${mode} ${fileType}:`, upload.reason)
        } else if (upload.value.error) {
          console.error(`[STORAGE] Error uploading ${mode} ${fileType}:`, upload.value.error)
        }
      }

      // If both uploads failed, throw an error
      if (uploads.every(upload => upload.status === "rejected")) {
        throw new Error(`Failed to upload all files for ${mode} mode`)
      }

      return true
    }

    // Function to get signed URLs
    async function getSignedUrls(mode: ScanMode): Promise<SignedUrls> {
      const [screenshot, results] = await Promise.all([
        supabase.storage
          .from("screenshots")
          .createSignedUrl(`${id}/${mode}.png`, SIGNED_URL_EXPIRY),
        supabase.storage
          .from("test-results")
          .createSignedUrl(`${id}/${mode}.json`, SIGNED_URL_EXPIRY),
      ])

      if (screenshot.error) throw screenshot.error
      if (results.error) throw results.error
      if (!screenshot.data?.signedUrl || !results.data?.signedUrl) {
        throw new Error("Failed to create signed URLs")
      }

      return {
        screenshot: screenshot.data.signedUrl,
        results: results.data.signedUrl,
      }
    }

    // Function to extract metrics from results
    function extractMetrics(results: any, resultsUrl: string): Metrics {
      return {
        violations_count: results.violations.length,
        passes_count: results.passes.length,
        incomplete_count: results.incomplete.length,
        inapplicable_count: results.inapplicable.length,
        critical_issues: results.violations.filter(
          (v: any) => v.impact === "critical"
        ).length,
        serious_issues: results.violations.filter(
          (v: any) => v.impact === "serious"
        ).length,
        moderate_issues: results.violations.filter(
          (v: any) => v.impact === "moderate"
        ).length,
        minor_issues: results.violations.filter(
          (v: any) => v.impact === "minor"
        ).length,
        results_url: resultsUrl,
      }
    }

    console.log("[SCAN] Creating new page")
    const page = await browser.newPage()

    // Set default timeout for all operations
    page.setDefaultTimeout(PAGE_TIMEOUT)

    // Run scans only for selected modes
    console.log(`[SCAN] Starting scans for modes: ${selectedModes.join(", ")}`)
    const scans = await Promise.all(
      selectedModes.map((m) => captureAndTest(page, m))
    )
    console.log("[SCAN] Scans completed")

    // Upload files only for selected modes
    console.log("[STORAGE] Uploading files")
    await Promise.all(
      selectedModes.map((m, index) => uploadFiles(m, scans[index]))
    )
    console.log("[STORAGE] Files uploaded")

    // Get signed URLs only for selected modes
    console.log("[STORAGE] Getting signed URLs")
    const signedUrls = await Promise.all(
      selectedModes.map((m) => getSignedUrls(m))
    )
    console.log("[STORAGE] Signed URLs generated")

    // Process metrics only for selected modes
    const metrics: Partial<Record<ScanMode, Metrics>> = {}
    selectedModes.forEach((m, index) => {
      metrics[m] = extractMetrics(scans[index].results, signedUrls[index].results)
    })

    // Update scan record with only scanned modes
    console.log("[DATABASE] Updating scan record")
    const updatePayload: Record<string, any> = {
      metrics,
      status: "completed"
    }

    if (selectedModes.includes("light")) {
      updatePayload.screenshot_light = signedUrls[selectedModes.indexOf("light")].screenshot
    }
    if (selectedModes.includes("dark")) {
      updatePayload.screenshot_dark = signedUrls[selectedModes.indexOf("dark")].screenshot
    }

    const { error: updateError } = await supabase
      .from("Scan")
      .update(updatePayload)
      .eq("id", id)

    if (updateError) throw updateError
    console.log("[DATABASE] Scan record updated successfully")

    console.log("[COMPLETE] Scan completed successfully")
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          screenshot_light: updatePayload.screenshot_light || null,
          screenshot_dark: updatePayload.screenshot_dark || null,
          metrics,
        },
      }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("[ERROR]", error)

    // Only update scan status if we have a valid ID and it's a new scan
    if (scanId) {
      try {
        const supabase = createClient(
          Deno.env.get("NEXT_PUBLIC_SUPABASE_URL")!,
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        )

        // Check if scan exists and is in pending state
        const { data: existingScan } = await supabase
          .from("Scan")
          .select("status")
          .eq("id", scanId)
          .single()

        // Only update if scan is in pending state
        if (existingScan?.status === "pending") {
          await supabase
            .from("Scan")
            .update({
              status: "failed",
              metrics: {
                error: error instanceof Error ? error.message : "Unknown error occurred",
                timestamp: new Date().toISOString(),
                details: error instanceof Error ? error.stack : undefined,
                type: error.constructor.name,
                code: error instanceof Error && 'code' in error ? error.code : undefined
              },
            })
            .eq("id", scanId)
            .eq("status", "pending")
        }
      } catch (updateError) {
        console.error("[ERROR] Failed to update scan status:", updateError)
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error instanceof Error ? error.message : "Unknown error occurred",
          status: 500,
          stack: error instanceof Error ? error.stack : undefined,
          type: error.constructor.name,
          code: error instanceof Error && 'code' in error ? error.code : undefined,
          timestamp: new Date().toISOString()
        },
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    )
  } finally {
    if (browser) {
      console.log("[BROWSER] Disconnecting from remote browser")
      try {
        await browser.disconnect()
      } catch (error) {
        console.warn("[BROWSER] Failed to disconnect properly:", error)
      }
    }
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
