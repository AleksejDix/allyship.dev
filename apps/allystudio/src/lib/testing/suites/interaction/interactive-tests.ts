import { getAccessibleName } from "../../act-test-runner"
import { describe, suite, test } from "../../act-test-suite"
import { focusableSelectors } from "../../focusable-selectors"

// Join all focusable selectors for our test suite
const interactiveSelector = focusableSelectors.join(", ")

export const interactiveTests = suite(
  "Interactive Elements",
  interactiveSelector,
  () => {
    test(
      "No empty interactive elements",
      (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        const hasVisibleContent = element.textContent
          ? element.textContent.trim().length > 0
          : false
        const hasAriaLabel = element.hasAttribute("aria-label")
        const hasAriaLabelledBy = element.hasAttribute("aria-labelledby")

        const isEmpty =
          !accessibleName &&
          !hasVisibleContent &&
          !hasAriaLabel &&
          !hasAriaLabelledBy

        return {
          passed: !isEmpty,
          message: isEmpty
            ? `${element.tagName.toLowerCase()} has no accessible name or content`
            : `${element.tagName.toLowerCase()} has proper labeling`
        }
      },
      {
        description: "Interactive elements must have an accessible name",
        severity: "Critical"
      }
    )

    test(
      "No nested interactive elements",
      (element: HTMLElement) => {
        // Check if element itself is interactive
        const isInteractive = (el: HTMLElement) =>
          el.matches(interactiveSelector)

        // Check for nested interactive elements
        const nestedInteractives = Array.from(
          element.querySelectorAll(interactiveSelector)
        ) as HTMLElement[]

        const invalidNesting = nestedInteractives.some(
          (nested) => isInteractive(nested) && nested !== element
        )

        if (invalidNesting) {
          const nestedTypes = nestedInteractives
            .map((el) => el.tagName.toLowerCase())
            .join(", ")

          return {
            passed: false,
            message: `Found nested interactive elements: ${nestedTypes} inside ${element.tagName.toLowerCase()}`
          }
        }

        return {
          passed: true,
          message: "No nested interactive elements found"
        }
      },
      {
        description:
          "Interactive elements should not be nested within each other",
        severity: "Critical"
      }
    )

    test(
      "No redundant click handlers",
      (element: HTMLElement) => {
        // Check if element has click handler or is interactive
        const hasClickHandler =
          element.hasAttribute("onclick") ||
          element.getAttribute("role") === "button" ||
          element.matches(interactiveSelector)

        // Check if any parent up to 3 levels has a click handler
        let current = element.parentElement
        let depth = 0
        const maxDepth = 3

        while (current && depth < maxDepth) {
          if (
            current.hasAttribute("onclick") ||
            current.matches(interactiveSelector)
          ) {
            return {
              passed: false,
              message: `Element has redundant click handler - parent ${current.tagName.toLowerCase()} is already clickable`
            }
          }
          current = current.parentElement
          depth++
        }

        return {
          passed: true,
          message: "No redundant click handlers found"
        }
      },
      {
        description: "Elements should not have redundant click handlers",
        severity: "High"
      }
    )

    describe("Button Specific Tests", () => {
      test(
        "Button has valid type attribute",
        (element: HTMLElement) => {
          if (element.tagName !== "BUTTON")
            return { passed: true, message: "Not a button element" }

          const validTypes = ["button", "submit", "reset"]
          const type = element.getAttribute("type")

          // Buttons without type default to submit which can cause unexpected form submissions
          if (!type) {
            return {
              passed: false,
              message:
                "Button missing type attribute - defaults to submit which may cause unexpected form submissions"
            }
          }

          return {
            passed: validTypes.includes(type),
            message: validTypes.includes(type)
              ? `Button has valid type="${type}"`
              : `Button has invalid type="${type}"`
          }
        },
        {
          description: "Buttons should have a valid type attribute",
          severity: "High"
        }
      )
    })

    describe("Link Specific Tests", () => {
      test(
        "Links with click handlers have roles",
        (element: HTMLElement) => {
          if (element.tagName !== "A")
            return { passed: true, message: "Not a link element" }

          const hasClickHandler = element.hasAttribute("onclick")
          const hasRole = element.hasAttribute("role")

          if (hasClickHandler && !hasRole) {
            return {
              passed: false,
              message: "Link with click handler should have role='button'"
            }
          }

          return {
            passed: true,
            message: "Link has proper role definition"
          }
        },
        {
          description:
            "Links with click handlers should have appropriate roles",
          severity: "High"
        }
      )
    })
  }
)
