import { expect, test } from "@playwright/test"

test("WCAG 1.1.1: Check all images have alt text", async ({ page }) => {
  // Navigate to the page
  await page.goto("/") // Replace with your URL

  // Get all images and validate their alt attributes
  const images = await page.$$("img")
  for (const image of images) {
    const altText = await image.getAttribute("alt")
    expect(altText).not.toBeNull() // Check alt exists
    expect(altText?.trim()).not.toBe("") // Check alt is not empty
  }
})
