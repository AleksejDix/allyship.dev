/**
 * Button accessibility tests using ACT rule 97a4e1
 * Tests that buttons have accessible names
 */
export function defineButtonTests(runner: any) {
  runner.describe("Button Accessibility", () => {
    runner.test(
      "should have accessible name",
      ({ element }: { element: HTMLElement }) => {
        // Get accessible name using various methods
        const ariaLabel = element.getAttribute("aria-label")
        const ariaLabelledby = element.getAttribute("aria-labelledby")
        const textContent = element.textContent?.trim()

        // Check for accessible name
        if (ariaLabel && ariaLabel.trim()) {
          return // Has aria-label
        }

        if (ariaLabelledby) {
          const labelElement = document.getElementById(ariaLabelledby)
          if (labelElement && labelElement.textContent?.trim()) {
            return // Has valid aria-labelledby reference
          }
        }

        if (textContent) {
          return // Has text content
        }

        throw new Error("Button must have an accessible name")
      },
      "button"
    )
  })
}
