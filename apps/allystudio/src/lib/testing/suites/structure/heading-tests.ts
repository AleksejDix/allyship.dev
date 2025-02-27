import { getAccessibleName } from "../../act-test-runner"
import { describe, suite, test } from "../../act-test-suite"

export const headingTests = suite(
  "Heading Structure",
  "h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]",
  () => {
    test(
      "Heading must have accessible name",
      (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)
        return {
          passed: !!accessibleName,
          message: accessibleName
            ? `Level ${level} heading has accessible name`
            : `Level ${level} heading is empty`
        }
      },
      {
        description: "Each heading must have non-empty accessible text content",
        severity: "High"
      }
    )

    test(
      "First heading must be h1",
      (element: HTMLElement) => {
        const level = element.getAttribute("aria-level")
          ? parseInt(element.getAttribute("aria-level")!, 10)
          : parseInt(element.tagName.charAt(1), 10)

        // Find all headings in the document
        const allHeadings = Array.from(
          document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='heading']")
        )

        // Check if this is the first heading
        const isFirstHeading = allHeadings[0] === element

        if (!isFirstHeading) {
          return {
            passed: true,
            message: `Level ${level} heading is not the first heading`
          }
        }

        return {
          passed: level === 1,
          message:
            level === 1
              ? "Document starts with h1 heading"
              : `Document starts with h${level} - should start with h1`
        }
      },
      {
        description: "The first heading in the document must be an h1",
        severity: "Critical"
      }
    )

    describe("Heading Hierarchy", () => {
      test(
        "Heading levels must increase by only one",
        (element: HTMLElement) => {
          const currentLevel = element.getAttribute("aria-level")
            ? parseInt(element.getAttribute("aria-level")!, 10)
            : parseInt(element.tagName.charAt(1), 10)

          // Find all headings in the document
          const allHeadings = Array.from(
            document.querySelectorAll(
              "h1, h2, h3, h4, h5, h6, [role='heading']"
            )
          ) as HTMLElement[]

          // Find the index of the current heading
          const currentIndex = allHeadings.indexOf(element)
          if (currentIndex === 0) {
            // First heading is handled by heading-first-level test
            return {
              passed: true,
              message: `Level ${currentLevel} heading starts document`
            }
          }

          // Get the previous heading's level
          const previousHeading = allHeadings[currentIndex - 1]
          const previousLevel = previousHeading.getAttribute("aria-level")
            ? parseInt(previousHeading.getAttribute("aria-level")!, 10)
            : parseInt(previousHeading.tagName.charAt(1), 10)

          // Check if the heading level increase is valid
          // Valid cases:
          // 1. Same level as previous (h1 -> h1)
          // 2. One level deeper than previous (h1 -> h2)
          // 3. Any number of levels back up (h3 -> h1)
          const isValid = currentLevel <= previousLevel + 1

          return {
            passed: isValid,
            message: isValid
              ? `Level ${currentLevel} heading follows h${previousLevel} correctly`
              : `Invalid heading structure: h${previousLevel} is followed by h${currentLevel} - can only increase by one level`
          }
        },
        {
          description:
            "Heading levels should only increase by one level at a time",
          severity: "High"
        }
      )

      test(
        "Only one h1 heading per page",
        (element: HTMLElement) => {
          const level = element.getAttribute("aria-level")
            ? parseInt(element.getAttribute("aria-level")!, 10)
            : parseInt(element.tagName.charAt(1), 10)

          if (level !== 1) {
            return {
              passed: true,
              message: "Not an h1 heading"
            }
          }

          // Find all h1 headings
          const h1Headings = Array.from(
            document.querySelectorAll("h1, [role='heading'][aria-level='1']")
          )

          return {
            passed: h1Headings.length === 1,
            message:
              h1Headings.length === 1
                ? "Page has exactly one h1 heading"
                : `Page has ${h1Headings.length} h1 headings - should have exactly one`
          }
        },
        {
          description: "Each page should have exactly one h1 heading",
          severity: "High"
        }
      )
    })

    describe("Heading Content", () => {
      test(
        "Heading length is appropriate",
        (element: HTMLElement) => {
          const accessibleName = getAccessibleName(element)
          const words = accessibleName.trim().split(/\s+/).length

          // Check if heading is too long (more than 20 words)
          if (words > 20) {
            return {
              passed: false,
              message: `Heading is too long (${words} words) - consider breaking it up`
            }
          }

          // Check if heading is too short (less than 2 characters)
          if (accessibleName.length < 2) {
            return {
              passed: false,
              message: "Heading is too short - should be meaningful"
            }
          }

          return {
            passed: true,
            message: "Heading length is appropriate"
          }
        },
        {
          description: "Headings should be concise and meaningful",
          severity: "Medium"
        }
      )

      test(
        "No duplicate headings at same level",
        (element: HTMLElement) => {
          const currentLevel = element.getAttribute("aria-level")
            ? parseInt(element.getAttribute("aria-level")!, 10)
            : parseInt(element.tagName.charAt(1), 10)

          const currentText = getAccessibleName(element).toLowerCase().trim()

          // Find all headings at the same level
          const sameLevel = Array.from(
            document.querySelectorAll(
              `h${currentLevel}, [role='heading'][aria-level='${currentLevel}']`
            )
          ) as HTMLElement[]

          // Check for duplicates
          const duplicates = sameLevel.filter(
            (h) =>
              h !== element &&
              getAccessibleName(h).toLowerCase().trim() === currentText
          )

          return {
            passed: duplicates.length === 0,
            message:
              duplicates.length === 0
                ? "Heading text is unique at this level"
                : `Duplicate heading text "${currentText}" found at level ${currentLevel}`
          }
        },
        {
          description: "Headings at the same level should have unique text",
          severity: "Medium"
        }
      )
    })
  }
)
