import type { ACTTestSuite } from "./act-test-runner"
import { getAccessibleName, getUniqueSelector } from "./act-test-runner"

export const linkTests: ACTTestSuite = {
  name: "Link Accessibility",
  description: "Tests for proper link accessibility",
  applicability: "a, [role='link']",
  testCases: [
    {
      id: "link-accessible-name",
      description: "Links must have an accessible name",
      evaluate: (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        return {
          passed: !!accessibleName,
          message: accessibleName
            ? "Link has accessible name"
            : "Empty link text"
        }
      }
    },
    {
      id: "link-unique-accessible-name",
      description: "Links with same accessible name must have same destination",
      evaluate: (element: HTMLElement) => {
        const accessibleName = getAccessibleName(element)
        if (!accessibleName) {
          return {
            passed: false,
            message: "Empty link text"
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
            message: "Unique link text"
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
            ? "Same link text points to different destinations"
            : "Link text and destination are consistent"
        }
      }
    },
    {
      id: "link-new-window",
      description: "Links that open in new window must indicate this",
      evaluate: (element: HTMLElement) => {
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
            ? "Link properly indicates it opens in new window"
            : "Link opens in new window without indication"
        }
      }
    }
  ]
}
