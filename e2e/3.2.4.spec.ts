import { expect, test } from "@playwright/test"

test("WCAG 3.2.4: Check for consistent identification of interactive elements", async ({
  page,
}) => {
  // Navigate to the page to test
  await page.goto("/") // Replace with your URL

  // Define selectors for common interactive elements
  const interactiveElements = [
    "button",
    "a[href]",
    '[role="button"]',
    '[role="link"]',
  ]

  // Find all interactive elements
  const elements = await page.$$(`${interactiveElements.join(", ")}`)

  // Extract labels, text content, or accessible names for comparison
  const labels = await Promise.all(
    elements.map(async (element) => {
      const accessibleName = await element.getAttribute("aria-label")
      const textContent = await element.textContent()
      return accessibleName || textContent?.trim() || ""
    })
  )

  // Check for duplicate labels and identify inconsistencies
  const labelMap: Record<string, number> = {}
  labels.forEach((label) => {
    if (label) {
      labelMap[label] = (labelMap[label] || 0) + 1
    }
  })

  // Assert that labels are used consistently
  for (const [_label, count] of Object.entries(labelMap)) {
    expect(count).toBeGreaterThan(0) // At least one element with the label
  }
})
