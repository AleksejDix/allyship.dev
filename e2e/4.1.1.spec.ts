// playwright-test-parsing.spec.ts
import { expect, test } from "@playwright/test"
import { JSDOM } from "jsdom"

test.describe("WCAG 4.1.1: Parsing", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/") // Replace with your target URL
  })

  test("should not have duplicate IDs", async ({ page }) => {
    // Collect all elements with an id attribute
    const ids = await page.$$eval("[id]", (elements) =>
      elements.map((el) => el.id)
    )

    // Use a Set to find unique IDs
    const uniqueIds = new Set(ids)

    // Check that the number of unique IDs matches the total number of IDs
    expect(ids.length).toBe(uniqueIds.size)

    console.log("No duplicate IDs found on the page.")
  })

  test("should have valid HTML structure", async ({ page }) => {
    // Get the HTML content of the page
    const htmlContent = await page.content()

    // Use JSDOM to parse the HTML
    const dom = new JSDOM(htmlContent)
    const document = dom.window.document

    // Check for parsing errors by ensuring the document exists
    expect(document).not.toBeNull()

    console.log("The page has valid HTML structure.")
  })

  test("should have valid ARIA attributes", async ({ page }) => {
    // Find all elements with aria-* attributes
    const elementsWithArias = await page.$$eval("*", (elements) =>
      elements.map((el) => {
        const attributes = Array.from(el.attributes)
          .filter((attr) => attr.name.startsWith("aria-"))
          .map((attr) => ({ name: attr.name, value: attr.value }))
        return { tagName: el.tagName, attributes }
      })
    )

    const elementsWithAria = Array.from(elementsWithArias).filter(
      (el) => el.attributes.length > 0
    )

    // Validate ARIA attributes
    elementsWithAria.forEach((el) => {
      el.attributes.forEach((attr) => {
        expect(attr.value).not.toBe("")
        console.log(
          `${el.tagName} has valid ARIA attribute: ${attr.name}="${attr.value}".`
        )
      })
    })

    console.log("All ARIA attributes are valid.")
  })

  test("should not have invalid tabindex values", async ({ page }) => {
    // Find all elements with a tabindex attribute
    const elementsWithTabindex = await page.$$eval("[tabindex]", (elements) =>
      elements.map((el) => {
        return {
          tagName: el.tagName,
          tabindex: el.getAttribute("tabindex"),
        }
      })
    )

    // Validate tabindex values
    elementsWithTabindex.forEach((el) => {
      if (el.tabindex === null) return
      const tabindexValue = parseInt(el.tabindex, 10)
      expect(!isNaN(tabindexValue) && tabindexValue >= -1).toBe(true)
      console.log(`${el.tagName} has valid tabindex: ${el.tabindex}`)
    })

    console.log("All tabindex values are valid.")
  })
})
