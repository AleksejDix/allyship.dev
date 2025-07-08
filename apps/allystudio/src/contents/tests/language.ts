import { isValidLanguageTag } from "@aleksejdix/ally-bcp47"

/**
 * Language accessibility tests using ACT rule bf051a
 * Tests that HTML elements have valid lang attributes
 * Uses ally-bcp47 library for proper BCP-47 validation
 */
export function defineLanguageTests(runner: any) {
  runner.describe("Language", () => {
    runner.test(
      "should have valid language tag",
      ({ element }: { element: HTMLElement }) => {
        const langAttribute = element.getAttribute("lang")

        if (!langAttribute) {
          throw new Error("HTML element must have a lang attribute")
        }

        // Use ally-bcp47 library for proper BCP-47 validation
        if (!isValidLanguageTag(langAttribute.trim())) {
          throw new Error(
            `HTML lang attribute "${langAttribute}" is not a valid BCP-47 language tag. See https://bcp47.allystudio.dev/ for valid examples.`
          )
        }
      },
      "html"
    )
  })
}
