import { expect, test } from "@playwright/test"
import { validate } from "bcp47-validate"

test("WCAG 3.1.2: Ensure parts of the page with different languages have valid lang attributes", async ({
  page,
}) => {
  // Navigate to the page
  await page.goto("/") // Replace with your URL

  // Select all elements with a `lang` attribute
  const elementsWithLang = await page.$$("[lang]")

  // Check that all `lang` attributes are valid
  for (const element of elementsWithLang) {
    const lang = await element.getAttribute("lang")

    // Validate the lang attribute using BCP 47 standards
    const isValidLang = lang && validate(lang)

    // Log any invalid lang attributes for debugging
    if (!isValidLang) {
      const tagName = await element.evaluate((el) => el.tagName)
      console.log(`Invalid lang attribute "${lang}" found on <${tagName}>.`)
    }

    // Assert that the lang attribute is valid
    expect(isValidLang).toBeTruthy()
  }

  console.log(
    "All parts of the page with a different language have valid lang attributes."
  )
})
