import { actRuleRunner } from "../act-rule-runner"
import {
  ACTRuleCategory,
  createACTRule,
  getWCAGReference,
  registerACTRule
} from "../act-rules-registry"
import { getAccessibleName } from "../act-test-runner"
import { formatACTResult } from "../utils/act-result-formatter"
import { getValidSelector } from "../utils/selector-utils"

/**
 * Rule: Link must have accessible name
 */
export const linkAccessibleNameRule = createACTRule(
  "link-accessible-name",
  "Link must have accessible name",
  "Each link must have non-empty accessible text content",
  {
    accessibility_requirements: getWCAGReference("2.4.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement)

        const passed = !!accessibleName
        const message = accessibleName
          ? `Link has accessible name: "${accessibleName}"`
          : "Link has no accessible name"

        const result = formatACTResult(
          "link-accessible-name",
          "Link must have accessible name",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "serious",
          ["WCAG2.1:2.4.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: Link text is descriptive
 */
export const linkDescriptiveTextRule = createACTRule(
  "link-descriptive-text",
  "Link text is descriptive",
  "Link text should be descriptive and meaningful out of context",
  {
    accessibility_requirements: getWCAGReference("2.4.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement).toLowerCase()

        if (!accessibleName) continue // Skip links with no accessible name

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

        const passed = !hasNonDescriptiveText
        const message = hasNonDescriptiveText
          ? `Link text "${accessibleName}" is not descriptive - avoid generic phrases like "click here" or "read more"`
          : "Link text is descriptive"

        const result = formatACTResult(
          "link-descriptive-text",
          "Link text is descriptive",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "moderate",
          ["WCAG2.1:2.4.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: Link text length is appropriate
 */
export const linkTextLengthRule = createACTRule(
  "link-text-length",
  "Link text length is appropriate",
  "Link text should be concise but meaningful",
  {
    accessibility_requirements: getWCAGReference("2.4.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement)

        if (!accessibleName) continue // Skip links with no accessible name

        const words = accessibleName.trim().split(/\s+/).length
        let passed = true
        let message = "Link text length is appropriate"

        // Check if link text is too long (more than 10 words)
        if (words > 10) {
          passed = false
          message = `Link text is too long (${words} words) - consider making it more concise`
        }
        // Check if link text is too short (less than 2 characters)
        else if (accessibleName.length < 2) {
          passed = false
          message = "Link text is too short - should be meaningful"
        }

        const result = formatACTResult(
          "link-text-length",
          "Link text length is appropriate",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "minor",
          ["WCAG2.1:2.4.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: No duplicate link text with different destinations
 */
export const linkDuplicateTextRule = createACTRule(
  "link-duplicate-text",
  "No duplicate link text with different destinations",
  "Links with the same text should point to the same destination",
  {
    accessibility_requirements: getWCAGReference("2.4.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")
      const linkTextMap = new Map<string, string[]>()

      // First pass: build a map of link text to hrefs
      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement)
          .toLowerCase()
          .trim()
        const href = htmlElement.getAttribute("href") || ""

        if (!accessibleName) continue

        if (!linkTextMap.has(accessibleName)) {
          linkTextMap.set(accessibleName, [href])
        } else {
          const hrefs = linkTextMap.get(accessibleName) || []
          if (!hrefs.includes(href)) {
            hrefs.push(href)
          }
          linkTextMap.set(accessibleName, hrefs)
        }
      }

      // Second pass: check for duplicates
      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement)
          .toLowerCase()
          .trim()

        if (!accessibleName) continue

        const hrefs = linkTextMap.get(accessibleName) || []
        const passed = hrefs.length <= 1
        const message = passed
          ? "Link text is unique or points to same destination"
          : `Same link text "${accessibleName}" points to different destinations`

        const result = formatACTResult(
          "link-duplicate-text",
          "No duplicate link text with different destinations",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "moderate",
          ["WCAG2.1:2.4.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: External links should be marked
 */
export const linkExternalMarkedRule = createACTRule(
  "link-external-marked",
  "External links should be marked",
  "External links should indicate they open in a new window/tab",
  {
    accessibility_requirements: getWCAGReference("3.2.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href][target='_blank']")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href][target='_blank']")

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const accessibleName = getAccessibleName(htmlElement)

        // Check for security attributes
        const rel = htmlElement.getAttribute("rel") || ""
        const hasNoopener = rel.includes("noopener")
        const hasNoreferrer = rel.includes("noreferrer")
        const hasSecurityAttributes = hasNoopener && hasNoreferrer

        // Check for new window indication in accessible name
        const newWindowIndicators = [
          "new window",
          "new tab",
          "opens in new",
          "external",
          "(opens in new window)",
          "(opens in new tab)",
          "(external)"
        ]

        const hasNewWindowIndicator = newWindowIndicators.some((indicator) =>
          accessibleName.toLowerCase().includes(indicator)
        )

        // Check for external link icon with aria-hidden="true"
        const hasAriaHiddenIcon = Array.from(
          htmlElement.querySelectorAll("*")
        ).some(
          (el) =>
            el.getAttribute("aria-hidden") === "true" &&
            (el.tagName === "SVG" ||
              el.tagName === "I" ||
              el.tagName === "SPAN" ||
              el.tagName === "IMG")
        )

        // Determine if the link passes the test
        const passed = hasNewWindowIndicator && hasSecurityAttributes

        // Create appropriate message based on what's missing
        let message = ""
        if (passed) {
          message = `External link properly indicates it opens in a new window and has security attributes`
        } else {
          const missingItems = []

          if (!hasNewWindowIndicator) {
            missingItems.push("indication that it opens in a new window/tab")
          }

          if (!hasSecurityAttributes) {
            missingItems.push('security attributes (rel="noopener noreferrer")')
          }

          message = `External link missing: ${missingItems.join(" and ")}`
        }

        const result = formatACTResult(
          "link-external-marked",
          "External links should be marked",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "moderate",
          ["WCAG2.1:3.2.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/consistent-identification.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: Link href is valid
 */
export const linkValidHrefRule = createACTRule(
  "link-valid-href",
  "Link href is valid",
  "Link href attribute should be valid and point to content",
  {
    accessibility_requirements: getWCAGReference("2.4.4"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const href = htmlElement.getAttribute("href")

        if (!href) {
          const result = formatACTResult(
            "link-valid-href",
            "Link href is valid",
            htmlElement,
            getValidSelector(htmlElement),
            false,
            "Missing href attribute",
            "serious",
            ["WCAG2.1:2.4.4"],
            "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
          )

          actRuleRunner.addResult(result)
          continue
        }

        // Check for common invalid href values
        const invalidHrefs = ["#", "javascript:void(0)", "javascript:;"]
        if (invalidHrefs.includes(href)) {
          const result = formatACTResult(
            "link-valid-href",
            "Link href is valid",
            htmlElement,
            getValidSelector(htmlElement),
            false,
            `Invalid href value "${href}" - use a valid URL or fragment identifier`,
            "serious",
            ["WCAG2.1:2.4.4"],
            "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
          )

          actRuleRunner.addResult(result)
          continue
        }

        // Check fragment identifiers point to valid elements
        if (href.startsWith("#") && href !== "#") {
          const targetId = href.slice(1)
          const targetElement = document.getElementById(targetId)

          if (!targetElement) {
            const result = formatACTResult(
              "link-valid-href",
              "Link href is valid",
              htmlElement,
              getValidSelector(htmlElement),
              false,
              `Fragment "${href}" does not point to an existing element ID`,
              "serious",
              ["WCAG2.1:2.4.4"],
              "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
            )

            actRuleRunner.addResult(result)
            continue
          }
        }

        // If we got here, the href is valid
        const result = formatACTResult(
          "link-valid-href",
          "Link href is valid",
          htmlElement,
          getValidSelector(htmlElement),
          true,
          "Link href is valid",
          "serious",
          ["WCAG2.1:2.4.4"],
          "https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

/**
 * Rule: Links should have sufficient touch target size
 */
export const linkTouchTargetSizeRule = createACTRule(
  "link-touch-target-size",
  "Links have sufficient touch target size",
  "Link touch targets should be at least 44×44 pixels for better mobile accessibility",
  {
    accessibility_requirements: getWCAGReference("2.5.5"),
    categories: [ACTRuleCategory.LINKS],
    implementation_url:
      "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html",

    isApplicable: () => {
      const elements = document.querySelectorAll("a[href]")
      return elements.length > 0
    },

    execute: async () => {
      const elements = document.querySelectorAll("a[href]")
      const MIN_TARGET_SIZE = 44 // Minimum touch target size in pixels

      for (const element of Array.from(elements)) {
        const htmlElement = element as HTMLElement
        const rect = htmlElement.getBoundingClientRect()

        // Calculate the effective touch target size
        const width = Math.round(rect.width)
        const height = Math.round(rect.height)

        // Check if link is visually hidden but still accessible to screen readers
        const isVisuallyHidden =
          htmlElement.offsetParent === null ||
          width === 0 ||
          height === 0 ||
          window.getComputedStyle(htmlElement).display === "none" ||
          window.getComputedStyle(htmlElement).visibility === "hidden"

        // Skip visually hidden elements
        if (isVisuallyHidden) continue

        // Check if size meets minimum requirements
        const passed = width >= MIN_TARGET_SIZE && height >= MIN_TARGET_SIZE

        // Create appropriate message
        let message = ""
        if (passed) {
          message = `Link has sufficient touch target size: ${width}×${height}px`
        } else {
          message = `Link touch target size is too small: ${width}×${height}px (should be at least ${MIN_TARGET_SIZE}×${MIN_TARGET_SIZE}px)`
        }

        const result = formatACTResult(
          "link-touch-target-size",
          "Links have sufficient touch target size",
          htmlElement,
          getValidSelector(htmlElement),
          passed,
          message,
          "moderate",
          ["WCAG2.1:2.5.5"],
          "https://www.w3.org/WAI/WCAG21/Understanding/target-size.html"
        )

        actRuleRunner.addResult(result)
      }
    }
  }
)

// Register all link rules
export function registerLinkRules() {
  registerACTRule(linkAccessibleNameRule)
  // TODO: fix with AI beucase this test has a language bias
  // registerACTRule(linkDescriptiveTextRule)
  registerACTRule(linkTextLengthRule)
  registerACTRule(linkDuplicateTextRule)
  registerACTRule(linkExternalMarkedRule)
  registerACTRule(linkValidHrefRule)
  // TODO: this is not relevant for wcag 2.1
  // registerACTRule(linkTouchTargetSizeRule)
}
