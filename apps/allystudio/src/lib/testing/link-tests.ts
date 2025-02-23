import { getAccessibleName } from "./act-test-runner"
import { describe, suite, test } from "./act-test-suite"

export const linkTests = suite("Link Accessibility", "a, [role='link']", () => {
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
      description: "Links must have an accessible name",
      severity: "High"
    }
  )

  describe("Link Text", () => {
    test(
      "Links with same text must have same destination",
      (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        if (!accessibleName) {
          return {
            passed: false,
            message: "Link has no accessible name"
          }
        }

        // Find all links with same accessible name
        const similarLinks = Array.from(
          document.querySelectorAll("a, [role='link']")
        ).filter(
          (link) =>
            link !== element &&
            getAccessibleName(link as HTMLElement) === accessibleName
        )

        if (similarLinks.length === 0) {
          return {
            passed: true,
            message: `Unique link text: "${accessibleName}"`
          }
        }

        // Check if all similar links have same href
        const currentHref = (element as HTMLAnchorElement).href
        const differentDestinations = similarLinks.some(
          (link) => (link as HTMLAnchorElement).href !== currentHref
        )

        return {
          passed: !differentDestinations,
          message: differentDestinations
            ? `Links with text "${accessibleName}" go to different URLs`
            : `Links with text "${accessibleName}" go to same URL`
        }
      },
      {
        description:
          "Links with same accessible name must have same destination",
        severity: "High"
      }
    )

    // Example async test that checks if the link destination is reachable
    test(
      "Link destination must be reachable",
      async (element: HTMLElement) => {
        if (!(element instanceof HTMLAnchorElement)) {
          return {
            passed: true,
            message: "Element is not an anchor tag"
          }
        }

        const href = element.href
        if (!href || href.startsWith("javascript:") || href === "#") {
          return {
            passed: true,
            message: "Link is not an external URL"
          }
        }

        try {
          const response = await fetch(href, { method: "HEAD" })
          const isValid = response.ok
          return {
            passed: isValid,
            message: isValid
              ? `Link destination is reachable: ${href}`
              : `Link destination returns ${response.status}: ${href}`
          }
        } catch (error) {
          return {
            passed: false,
            message: `Failed to reach link destination: ${error instanceof Error ? error.message : String(error)}`
          }
        }
      },
      {
        description: "Link destinations should be reachable",
        severity: "High"
      }
    )
  })

  describe("New Window Behavior", () => {
    test(
      "New window must be indicated",
      (element: HTMLElement) => {
        const target = element.getAttribute("target")
        if (target !== "_blank") {
          return {
            passed: true,
            message: "Link opens in same window"
          }
        }

        const accessibleName = getAccessibleName(element)
        const hasNewWindowIndicator =
          accessibleName.toLowerCase().includes("new window") ||
          accessibleName.toLowerCase().includes("new tab") ||
          element.querySelector(
            "[aria-label*='new window'], [aria-label*='new tab']"
          ) !== null

        return {
          passed: hasNewWindowIndicator,
          message: hasNewWindowIndicator
            ? `Link "${accessibleName}" properly indicates it opens in new window`
            : `Link "${accessibleName}" opens in new window without indication`
        }
      },
      {
        description: "Links that open in new window must indicate this",
        severity: "High"
      }
    )
  })
})
