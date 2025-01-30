import { AxeBuilder } from "@axe-core/playwright"
import { test } from "@playwright/test"
import * as pw from "playwright"

test.describe("Accessibility Tests with BrowserCat", () => {
  test("should pass accessibility tests on homepage", async ({
    page,
  }, testInfo) => {
    const browser = await pw.chromium.connect(
      "wss://api.browsercat.com/connect",
      {
        wsEndpoint: "wss://api.browsercat.com/connect",
        headers: {
          "Api-Key": process.env.BROWSERCAT_API_KEY || "",
        },
      }
    )

    const context = await browser.newContext()
    const testPage = await context.newPage()

    try {
      await testPage.goto("https://allyship.dev")
      await testPage.waitForLoadState("networkidle")

      const { violations } = await new AxeBuilder({ page: testPage })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()

      await testInfo.attach("Accessibility Scan Results", {
        body: JSON.stringify(violations, null, 2),
        contentType: "application/json",
      })
    } finally {
      await context.close()
      await browser.close()
    }
  })
})
