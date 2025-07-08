/**
 * ACT Rule 97a4e1: Button has accessible name
 *
 * @see https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html
 * @see https://act-rules.github.io/rules/97a4e1
 *
 * WCAG Success Criteria:
 * - 4.1.2 Name, Role, Value (Level A)
 *
 * This rule checks that each button element has an accessible name.
 * An accessible name is computed using the accessible name computation algorithm.
 */
export function defineACTRule_97a4e1(runner: any) {
  runner.describe("ACT 97a4e1: Button Accessible Name", () => {
    runner.test(
      "should have accessible name",
      ({ element }: { element: HTMLElement }) => {
        // Get accessible name using various methods
        const ariaLabel = element.getAttribute("aria-label")
        const ariaLabelledby = element.getAttribute("aria-labelledby")
        const textContent = element.textContent?.trim()

        // Check for accessible name via aria-label
        if (ariaLabel && ariaLabel.trim()) {
          return // Has aria-label
        }

        // Check for accessible name via aria-labelledby
        if (ariaLabelledby) {
          const labelElement = document.getElementById(ariaLabelledby)
          if (labelElement && labelElement.textContent?.trim()) {
            return // Has valid aria-labelledby reference
          }
        }

        // Check for accessible name via text content
        if (textContent) {
          return // Has text content
        }

        throw new Error(
          "Button must have an accessible name (via aria-label, aria-labelledby, or text content)"
        )
      },
      "button"
    )
  })
}
