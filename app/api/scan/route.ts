import { NextRequest, NextResponse } from "next/server"
import { AxeBuilder } from "@axe-core/playwright"
import { chromium } from "@playwright/test"

export const runtime = "nodejs"

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url).searchParams.get("url")

    if (!url) {
      return NextResponse.json(
        { error: "Missing 'url' query parameter." },
        { status: 400 }
      )
    }

    // Launch a Chromium browser
    const browser = await chromium.launch()
    const context = await browser.newContext()
    const page = await context.newPage()

    try {
      // Navigate to the URL with a timeout
      await page.goto(url, { waitUntil: "networkidle", timeout: 30000 })

      // Create and configure AxeBuilder with proper context
      const axeBuilder = new AxeBuilder({ page })
        .disableRules([
          "html-has-lang",
          "landmark-one-main",
          "page-has-heading-one",
        ])
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])

      // Run the analysis
      const { violations } = await axeBuilder.analyze()

      // Return the results
      return NextResponse.json(violations)
    } finally {
      // Ensure browser is closed even if there's an error
      await browser.close()
    }
  } catch (error) {
    console.error("Error scanning URL:", error)
    return NextResponse.json(
      {
        error: "Failed to scan the URL.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
