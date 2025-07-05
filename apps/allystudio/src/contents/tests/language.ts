/**
 * Language accessibility tests using ACT rule bf051a
 * Tests that HTML elements have valid lang attributes
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

        // BCP 47 language tag validation
        const bcp47Pattern =
          /^[a-z]{2,3}(-[A-Z][a-z]{3})?(-[A-Z]{2}|[0-9]{3})?(-[a-zA-Z0-9]{4,8})*$/
        if (!bcp47Pattern.test(langAttribute.trim())) {
          throw new Error(
            `HTML lang attribute "${langAttribute}" is not a valid BCP 47 language tag`
          )
        }
      },
      "html"
    )
  })
}
