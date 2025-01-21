import { expect, test } from "@playwright/test"

// Function to calculate contrast ratio
function calculateContrast(foreground: string, background: string): number {
  const rgb = (color: string) =>
    color
      .replace(/[^\d,]/g, "")
      .split(",")
      .map(Number)

  const luminance = ([r, g, b]: number[]) => {
    const channel = (v: number) => {
      v /= 255
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
  }

  const fgLuminance = luminance(rgb(foreground))
  const bgLuminance = luminance(rgb(background))

  return (
    (Math.max(fgLuminance, bgLuminance) + 0.05) /
    (Math.min(fgLuminance, bgLuminance) + 0.05)
  )
}

test("WCAG 1.1.3: Ensure sufficient contrast for non-text elements", async ({
  page,
}) => {
  // Navigate to the page
  await page.goto("/") // Replace with your URL

  // Select non-text elements like buttons, icons, and borders
  const nonTextElements = await page.$$(
    'button, [role="button"], [role="img"], svg, img'
  )

  for (const element of nonTextElements) {
    // Get the foreground and background colors
    const fgColor = await element.evaluate(
      (el) => window.getComputedStyle(el).color
    )
    const bgColor = await element.evaluate(
      (el) => window.getComputedStyle(el).backgroundColor
    )

    // Calculate the contrast ratio
    const contrastRatio = calculateContrast(fgColor, bgColor)

    // Assert that the contrast ratio meets the minimum requirement (3:1 for non-text elements)
    expect(contrastRatio).toBeGreaterThanOrEqual(3)
  }
})
