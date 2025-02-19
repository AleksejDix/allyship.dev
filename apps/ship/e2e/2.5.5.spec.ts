// playwright-test-target-size.spec.ts
import { expect, test } from "@playwright/test"

test.describe("WCAG 2.5.5: Target Size", () => {
  test.skip("should have interactive elements with sufficient target size", async ({
    page,
  }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL

    // Collect all interactive elements
    const interactiveElements = await page.$$eval(
      'a, button, input[type="button"], input[type="submit"], select',
      (elements) =>
        elements.map((el) => {
          const { width, height } = el.getBoundingClientRect()
          return {
            tagName: el.tagName,
            width,
            height,
            text: el.innerText || el.value || "N/A",
          }
        })
    )

    // Check if each interactive element meets the minimum size of 44x44 pixels
    interactiveElements.forEach(({ tagName, width, height, text }, index) => {
      const isSufficientSize = width >= 24 && height >= 24
      expect(isSufficientSize).toBe(true)

      if (!isSufficientSize) {
        console.error(
          `Interactive element ${index + 1} (<${tagName}>, text: "${text}") has insufficient size: ${width}x${height}px.`
        )
      }
    })

    console.log("All interactive elements meet the target size requirements.")
  })
})
