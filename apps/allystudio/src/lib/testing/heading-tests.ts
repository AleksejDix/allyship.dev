import type { ACTTestSuite } from "./act-test-runner"
import { getAccessibleName, getUniqueSelector } from "./act-test-runner"

export const headingTests: ACTTestSuite = {
  name: "Heading Structure",
  description: "Tests for proper heading structure and hierarchy",
  applicability: "h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]",
  testCases: [
    {
      id: "heading-accessible-name",
      description: "Headings must have an accessible name",
      evaluate: (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        return {
          passed: !!accessibleName,
          message: accessibleName
            ? "Heading has accessible name"
            : "Empty heading"
        }
      }
    },
    {
      id: "heading-first-level",
      description: "First heading must be h1",
      evaluate: (element: HTMLElement) => {
        const isFirstHeading = !element.previousElementSibling?.matches(
          "h1, h2, h3, h4, h5, h6, [role='heading']"
        )
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)

        if (!isFirstHeading) {
          return {
            passed: true,
            message: `Level ${level} heading`
          }
        }

        return {
          passed: level === 1,
          message:
            level === 1
              ? "First heading is h1"
              : `First heading is h${level}, should be h1`
        }
      }
    },
    {
      id: "heading-hierarchy",
      description: "Heading levels should only increase by one",
      evaluate: (element: HTMLElement) => {
        const currentLevel = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)

        // Find previous heading level
        let previousHeading = element.previousElementSibling
        while (
          previousHeading &&
          !previousHeading.matches("h1, h2, h3, h4, h5, h6, [role='heading']")
        ) {
          previousHeading = previousHeading.previousElementSibling
        }

        if (!previousHeading) {
          return {
            passed: true,
            message: `Level ${currentLevel} heading`
          }
        }

        const previousLevel = previousHeading.getAttribute("aria-level")
          ? parseInt(previousHeading.getAttribute("aria-level")!, 10)
          : parseInt(previousHeading.tagName.charAt(1), 10)

        const isValid = currentLevel <= previousLevel + 1

        return {
          passed: isValid,
          message: isValid
            ? `Level ${currentLevel} heading`
            : `Heading skips from h${previousLevel} to h${currentLevel}`
        }
      }
    }
  ]
}
