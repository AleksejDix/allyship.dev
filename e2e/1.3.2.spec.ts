// playwright-test-skip-heading-levels.spec.ts
import { expect, test } from "@playwright/test"

test.describe("WCAG 1.3.2: Info and Relationships", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the target webpage
    await page.goto("/") // Replace with your target URL
  })

  test("should not use white space characters to format tables in plain text", async ({
    page,
  }) => {
    // Get all preformatted text blocks (e.g., <pre>, <code>)
    const preformattedContent = await page.$$eval("pre, code", (elements) =>
      elements.map((el) => el.textContent || "")
    )

    // Check for white space-based table formatting
    const whitespaceTablePattern = /\|\s{2,}\|/g // Detects patterns like: |  Value1  |  Value2  |

    preformattedContent.forEach((content, index) => {
      const matches = content.match(whitespaceTablePattern)
      expect(matches).toBeNull() // Fail if any match is found
      if (matches) {
        console.error(
          `Preformatted block ${index + 1} contains a whitespace-formatted table.`
        )
      }
    })

    console.log("No white space-formatted tables found in plain text content.")
  })

  test("should not use excessive spacing to format text", async ({ page }) => {
    // Navigate to the target webpage

    // Collect all relevant elements and their text
    const elementsWithText = await page.$$eval(
      "h1, h2, h3, h4, h5, h6, p, span, div",
      (elements) =>
        elements.map((el) => ({
          text: el.innerText || "",
          tagName: el.tagName,
        }))
    )

    // Check each element's text for excessive spacing
    elementsWithText.forEach(({ text, tagName }, index) => {
      // Remove natural spaces between words and check for single-character spacing
      const normalizedText = text.replace(/\s+/g, " ").trim()
      const hasExcessiveSpacing = /(?:\b\w\s\w\b)+/.test(normalizedText) // Matches "W e l c o m e"

      expect(hasExcessiveSpacing).toBe(false)

      if (hasExcessiveSpacing) {
        console.error(
          `Element ${index + 1} (<${tagName}>) contains excessively spaced text: "${text}"`
        )
      }
    })

    console.log("No excessive spacing found in text content.")
  })
})
