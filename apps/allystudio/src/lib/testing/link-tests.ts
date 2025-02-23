import { getAccessibleName } from "./act-test-runner"
import { describe, suite, test } from "./act-test-suite"

export const linkTests = suite("Link Accessibility", "a[href]", () => {
  test(
    "Link must have accessible name",
    (element: HTMLElement) => {
      const accessibleName = getAccessibleName(element)
      return {
        passed: !!accessibleName,
        message: accessibleName
          ? `Link has accessible name: "${accessibleName}"`
          : "Link has no accessible name"
      }
    },
    {
      description: "Each link must have non-empty accessible text content",
      severity: "Critical"
    }
  )

  describe("Link Text Quality", () => {
    test(
      "Link text is descriptive",
      (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element).toLowerCase()
        const nonDescriptiveText = [
          "click here",
          "click",
          "here",
          "more",
          "read more",
          "learn more",
          "details",
          "link"
        ]

        const hasNonDescriptiveText = nonDescriptiveText.some((text) =>
          accessibleName.includes(text)
        )

        return {
          passed: !hasNonDescriptiveText,
          message: hasNonDescriptiveText
            ? `Link text "${accessibleName}" is not descriptive - avoid generic phrases like "click here" or "read more"`
            : "Link text is descriptive"
        }
      },
      {
        description:
          "Link text should be descriptive and meaningful out of context",
        severity: "High"
      }
    )

    test(
      "Link text length is appropriate",
      (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        const words = accessibleName.trim().split(/\s+/).length

        // Check if link text is too long (more than 10 words)
        if (words > 10) {
          return {
            passed: false,
            message: `Link text is too long (${words} words) - consider making it more concise`
          }
        }

        // Check if link text is too short (less than 2 characters)
        if (accessibleName.length < 2) {
          return {
            passed: false,
            message: "Link text is too short - should be meaningful"
          }
        }

        return {
          passed: true,
          message: "Link text length is appropriate"
        }
      },
      {
        description: "Link text should be concise but meaningful",
        severity: "Medium"
      }
    )

    test(
      "No duplicate link text with different destinations",
      (element: HTMLElement) => {
        const currentText = getAccessibleName(element).toLowerCase().trim()
        const currentHref = element.getAttribute("href")

        // Find all links with the same text
        const sameTextLinks = Array.from(
          document.querySelectorAll("a[href]")
        ) as HTMLElement[]

        // Check for links with same text but different destinations
        const duplicates = sameTextLinks.filter(
          (link) =>
            link !== element &&
            getAccessibleName(link).toLowerCase().trim() === currentText &&
            link.getAttribute("href") !== currentHref
        )

        return {
          passed: duplicates.length === 0,
          message:
            duplicates.length === 0
              ? "Link text is unique or points to same destination"
              : `Same link text "${currentText}" points to different destinations`
        }
      },
      {
        description:
          "Links with the same text should point to the same destination",
        severity: "Medium"
      }
    )
  })

  describe("Link Behavior", () => {
    test(
      "External links should be marked",
      (element: HTMLElement) => {
        const href = element.getAttribute("href")
        if (!href) return { passed: true, message: "No href attribute" }

        try {
          const url = new URL(href, window.location.href)
          const isExternal = url.origin !== window.location.origin

          if (!isExternal) {
            return { passed: true, message: "Internal link" }
          }

          // Check if link has external link indicator
          const hasNewWindowText = getAccessibleName(element)
            .toLowerCase()
            .includes("new window")
          const hasExternalIcon =
            element.querySelector('[aria-label*="external"]') !== null
          const hasAriaLabel = element
            .getAttribute("aria-label")
            ?.toLowerCase()
            .includes("external")

          return {
            passed: hasNewWindowText || hasExternalIcon || hasAriaLabel,
            message:
              hasNewWindowText || hasExternalIcon || hasAriaLabel
                ? "External link is properly marked"
                : "External link should indicate it opens in a new window"
          }
        } catch (error) {
          return {
            passed: true,
            message: "Could not parse URL - skipping external link check"
          }
        }
      },
      {
        description:
          "External links should indicate they open in a new window/tab",
        severity: "Medium"
      }
    )

    test(
      "Link href is valid",
      (element: HTMLElement) => {
        const href = element.getAttribute("href")
        if (!href) return { passed: false, message: "Missing href attribute" }

        // Check for common invalid href values
        const invalidHrefs = ["#", "javascript:void(0)", "javascript:;"]
        if (invalidHrefs.includes(href)) {
          return {
            passed: false,
            message: `Invalid href value "${href}" - use a valid URL or fragment identifier`
          }
        }

        // Check for empty fragments
        if (href === "#") {
          return {
            passed: false,
            message:
              'Empty fragment "#" is not a valid href - use a proper ID reference'
          }
        }

        // Check fragment identifiers point to valid elements
        if (href.startsWith("#")) {
          const targetId = href.slice(1)
          const targetElement = document.getElementById(targetId)
          if (!targetElement) {
            return {
              passed: false,
              message: `Fragment "${href}" does not point to an existing element ID`
            }
          }
        }

        return {
          passed: true,
          message: "Link href is valid"
        }
      },
      {
        description: "Link href attribute should be valid and point to content",
        severity: "High"
      }
    )

    test(
      "Link is not empty or too small",
      (element: HTMLElement) => {
        // Check if link has dimensions
        const rect = element.getBoundingClientRect()
        const minSize = 44 // Minimum recommended touch target size

        if (rect.width === 0 || rect.height === 0) {
          return {
            passed: false,
            message: "Link has no dimensions - should be visible and clickable"
          }
        }

        // Check if link is too small
        if (rect.width < minSize || rect.height < minSize) {
          return {
            passed: false,
            message: `Link is too small (${Math.round(rect.width)}x${Math.round(
              rect.height
            )}px) - should be at least ${minSize}x${minSize}px for touch targets`
          }
        }

        return {
          passed: true,
          message: "Link has appropriate dimensions"
        }
      },
      {
        description:
          "Links should have sufficient size to be easily clickable on touch devices",
        severity: "Medium"
      }
    )
  })
})
