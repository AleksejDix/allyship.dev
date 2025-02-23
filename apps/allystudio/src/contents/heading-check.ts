import { eventBus } from "@/lib/events/event-bus"
import type { HeadingIssue } from "@/lib/events/types"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Helper functions for element selection and identification
const getUniqueSelector = (element: HTMLElement): string => {
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }

  const getElementSelector = (el: Element): string => {
    const tag = el.tagName.toLowerCase()
    const parent = el.parentElement
    if (!parent) return tag

    const sameTypeSiblings = Array.from(parent.children).filter(
      (child) => child.tagName === el.tagName
    )
    const index = sameTypeSiblings.indexOf(el) + 1

    return `${tag}:nth-of-type(${index})`
  }

  const path: string[] = []
  let current: Element | null = element

  while (
    current &&
    current !== document.body &&
    current !== document.documentElement
  ) {
    path.unshift(getElementSelector(current))
    current = current.parentElement
  }

  return path.join(" > ")
}

function getXPath(element: HTMLElement): string {
  if (element.id) {
    return `//*[@id="${element.id}"]`
  }

  if (element === document.body) {
    return "/html/body"
  }

  let ix = 0
  const siblings = element.parentNode?.children || []

  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling === element) {
      const tagName = element.tagName.toLowerCase()
      const pathIndex = ix + 1
      const parentPath =
        element.parentNode && element.parentNode !== document.body
          ? getXPath(element.parentNode as HTMLElement)
          : ""
      return `${parentPath}/${tagName}[${pathIndex}]`
    }
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++
    }
  }

  return ""
}

const analyzeHeadings = () => {
  const headings = Array.from(
    document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]"
    )
  ) as HTMLElement[]

  const headingData = headings.map((heading, index) => {
    const level = heading.getAttribute("aria-level")
      ? parseInt(heading.getAttribute("aria-level")!, 10)
      : parseInt(heading.tagName.charAt(1), 10)

    return {
      level,
      selector: getUniqueSelector(heading),
      element: heading,
      index
    }
  })

  let previousLevel = headingData[0]?.level ?? 0
  let issues: HeadingIssue[] = []

  headingData.forEach((heading, index) => {
    if (index === 0) return // First heading is always valid

    if (heading.level > previousLevel + 1) {
      issues.push({
        id: `heading-${index}`,
        selector: heading.selector,
        message: `Invalid heading order: H${heading.level} after H${previousLevel}`,
        severity: "High",
        element: {
          tagName: heading.element.tagName,
          textContent: heading.element.textContent || "",
          xpath: getXPath(heading.element)
        }
      })

      // Publish highlight request
      eventBus.publish({
        type: "HEADING_HIGHLIGHT_REQUEST",
        timestamp: Date.now(),
        data: {
          selector: heading.selector,
          message: `Invalid H${heading.level} after H${previousLevel}`
        }
      })
    }

    previousLevel = heading.level
  })

  // Publish analysis complete event
  eventBus.publish({
    type: "HEADING_ANALYSIS_COMPLETE",
    timestamp: Date.now(),
    data: {
      issues,
      stats: {
        total: headingData.length,
        invalid: issues.length
      }
    }
  })
}

// Event listeners
eventBus.subscribe((event) => {
  if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === "headings") {
    if (event.data.enabled) {
      analyzeHeadings()
    } else {
      // Clear highlights by sending empty analysis
      eventBus.publish({
        type: "HEADING_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          issues: [],
          stats: { total: 0, invalid: 0 }
        }
      })
    }
  } else if (event.type === "HEADING_ANALYSIS_REQUEST") {
    analyzeHeadings()
  }
})
