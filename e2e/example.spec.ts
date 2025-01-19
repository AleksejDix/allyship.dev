import { expect, test } from "@playwright/test"
import { validate } from "bcp47-validate"

test("WCAG 3.1.1: Validate lang attribute with BCP-47 standard", async ({
  page,
}) => {
  // Navigate to the page
  await page.goto("http://localhost:3000") // Replace with your URL

  // Get the `lang` attribute of the <html> element
  const langAttribute = await page.getAttribute("html", "lang")

  // Ensure the `lang` attribute exists and is not empty
  expect(langAttribute).not.toBeNull()
  expect(langAttribute).not.toBe("")

  // Validate the `lang` attribute using BCP-47 standards
  const isValidLangTag = validate(langAttribute!)

  // Assert that the lang attribute is valid
  expect(isValidLangTag).toBeTruthy()

  console.log(
    `Lang attribute "${langAttribute}" is ${
      isValidLangTag ? "valid" : "invalid"
    } according to BCP-47 standards.`
  )
})
