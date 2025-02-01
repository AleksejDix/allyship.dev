import { expect, Page, test } from "@playwright/test"

test.describe("WCAG 2.4.1 Bypass Blocks", () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    await page.goto("/")
  })

  test("Skip link points to main content and is among first links", async ({
    page,
  }: {
    page: Page
  }) => {
    // Find main element and get its ID
    const main = page.locator('main, [role="main"]')
    await expect(main).toBeVisible()

    const mainId = await main.getAttribute("id")
    expect(mainId, "Main content should have an ID").toBeTruthy()

    // Get all links on the page
    const allLinks = page.locator("a")
    const firstFiveLinks = await allLinks
      .all()
      .then((links) => links.slice(0, 5))

    // Find skip link that points to main content
    const skipLinkHref = `#${mainId}`
    const isSkipLinkInFirstFive = await Promise.all(
      firstFiveLinks.map((link) => link.getAttribute("href"))
    ).then((hrefs) => hrefs.includes(skipLinkHref))

    expect(
      isSkipLinkInFirstFive,
      "Skip link should be among first 5 links"
    ).toBe(true)
  })
})
