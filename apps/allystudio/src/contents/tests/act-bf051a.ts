import { isValidLanguageTag } from "@aleksejdix/ally-bcp47"

/**
 * ACT Rule bf051a: HTML page has lang attribute
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/language-of-page.html
 * @see https://act-rules.github.io/rules/bf051a
 *
 * WCAG Success Criteria:
 * - 3.1.1 Language of Page (Level A)
 *
 * This rule checks that the HTML document has a non-empty lang attribute
 * that contains a valid language tag according to BCP 47.
 */
export function defineACTRule_bf051a(runner: any) {
  runner.describe("ACT bf051a: Language of Page", () => {
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
