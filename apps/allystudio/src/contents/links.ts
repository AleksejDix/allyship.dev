import { eventBus } from "@/lib/events/event-bus"
import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

// Helper function to get unique selector for elements
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

// Helper function to get accessible name for links
const getAccessibleName = (element: HTMLElement): string => {
  // Check aria-labelledby first
  const labelledBy = element.getAttribute("aria-labelledby")
  if (labelledBy) {
    const labelElements = labelledBy
      .split(" ")
      .map((id) => document.getElementById(id))
    const labelText = labelElements
      .filter((el) => el && !el.hidden)
      .map((el) => el?.textContent || "")
      .join(" ")
    if (labelText.trim()) return labelText
  }

  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label")
  if (ariaLabel?.trim()) return ariaLabel

  // Check for img alt text
  const img = element.querySelector("img")
  if (img && !img.matches('[role="presentation"], [role="none"]')) {
    const altText = img.getAttribute("alt")
    if (altText?.trim()) return altText
  }

  // Check visible text content
  return element.textContent?.trim() || ""
}

const analyzeLinks = () => {
  const links = Array.from(
    document.querySelectorAll("a, [role='link']")
  ) as HTMLElement[]

  const issues = []

  // Analyze each link and send highlight request
  links.forEach((link, index) => {
    const accessibleName = getAccessibleName(link)
    const isValid = !!accessibleName
    const selector = getUniqueSelector(link)
    const message = isValid ? "Valid link" : "Empty link text"

    // Send highlight request for each link
    eventBus.publish({
      type: "HIGHLIGHT",
      timestamp: Date.now(),
      data: {
        selector,
        message,
        isValid
      }
    })

    // Add to issues if empty
    if (!isValid) {
      issues.push({
        id: `empty-link-${index}`,
        selector,
        message,
        severity: "High",
        element: {
          tagName: link.tagName,
          textContent: link.textContent || "",
          xpath: link.id ? `//*[@id="${link.id}"]` : ""
        }
      })
    }
  })

  // Publish analysis complete event
  eventBus.publish({
    type: "LINK_ANALYSIS_COMPLETE",
    timestamp: Date.now(),
    data: {
      issues,
      stats: {
        total: links.length,
        invalid: issues.length
      }
    }
  })
}

// Event listeners
eventBus.subscribe((event) => {
  if (event.type === "TOOL_STATE_CHANGE" && event.data.tool === "links") {
    if (event.data.enabled) {
      analyzeLinks()
    } else {
      // Clear analysis and remove all highlights
      eventBus.publish({
        type: "LINK_ANALYSIS_COMPLETE",
        timestamp: Date.now(),
        data: {
          issues: [],
          stats: { total: 0, invalid: 0 }
        }
      })
      // Clear all highlights
      eventBus.publish({
        type: "HIGHLIGHT",
        timestamp: Date.now(),
        data: {
          selector: "",
          message: "",
          isValid: true
        }
      })
    }
  } else if (event.type === "LINK_ANALYSIS_REQUEST") {
    analyzeLinks()
  }
})
