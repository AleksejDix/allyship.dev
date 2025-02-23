import { storage } from "@/storage"
import { normalizeUrl } from "@/utils/url"
import type { PlasmoCSConfig } from "plasmo"

import { sendToBackground } from "@plasmohq/messaging"

export const config: PlasmoCSConfig = {
  matches: ["<all_urls>"]
}

interface HeadingData {
  tagName: string
  role: string | null
  ariaLevel: string | null
  textContent: string
  outerHTML: string
  index: number
  level: number
  id: string
  selector: string
  status: "valid" | "invalid"
  element: HTMLElement // Store reference to the actual element
}

// Minimal data structure for transfer
interface MinimalHeadingData {
  level: number
  selector: string
  status: "valid" | "invalid"
}

interface PageData {
  url: string
  normalizedUrl: string
  timestamp: number
  totalHeadings: number
  totalInvalid: number
}

interface HeadingIssue {
  selector: string
  level: number
  url: string
  message: string
  isValid: boolean
}

const getUniqueSelector = (element: HTMLElement): string => {
  // Try using existing ID first as it's most reliable
  if (element.id) {
    return `#${CSS.escape(element.id)}`
  }

  // Get the element's tag name and position among siblings
  const getElementSelector = (el: Element): string => {
    const tag = el.tagName.toLowerCase()
    const parent = el.parentElement
    if (!parent) return tag

    // Get the element's position among siblings of the same type
    const sameTypeSiblings = Array.from(parent.children).filter(
      (child) => child.tagName === el.tagName
    )
    const index = sameTypeSiblings.indexOf(el) + 1

    return `${tag}:nth-of-type(${index})`
  }

  // Build the path from the element to the root
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

const validateHeadingOrder = (headings: HeadingData[]): HeadingData[] => {
  if (headings.length === 0) return []

  let previousLevel = headings[0].level
  let structureBroken = false

  // Single pass validation
  return headings.map((heading, i) => {
    const currentLevel = heading.level

    // First heading is always valid
    if (i === 0) {
      return { ...heading, status: "valid" }
    }

    // Check if this heading breaks the order
    if (currentLevel > previousLevel + 1) {
      structureBroken = true // Mark structure as broken for all subsequent headings
    }

    // Update previous level for next iteration
    previousLevel = currentLevel

    return {
      ...heading,
      status: structureBroken ? "invalid" : "valid"
    }
  })
}

const collectHeadingData = () => {
  const url = window.location.href
  const normalizedUrl = normalizeUrl(url)

  // Collect all headings in document order
  const headings = Array.from(
    document.querySelectorAll(
      "h1, h2, h3, h4, h5, h6, [role='heading'][aria-level]"
    )
  ) as HTMLElement[]

  // Single pass to create heading data with minimal processing
  let headingData: HeadingData[] = headings.map((heading, index) => {
    // Get level - treat ARIA and HTML headings equally
    const level = heading.getAttribute("aria-level")
      ? parseInt(heading.getAttribute("aria-level")!, 10)
      : parseInt(heading.tagName.charAt(1), 10)

    return {
      tagName: heading.tagName,
      role: heading.getAttribute("role"),
      ariaLevel: heading.getAttribute("aria-level"),
      textContent: heading.textContent || "",
      outerHTML: heading.outerHTML,
      index,
      level,
      id: heading.id || `ally-heading-${index}-${Date.now()}`,
      selector: getUniqueSelector(heading),
      status: "valid",
      element: heading
    }
  })

  // Validate order in a single pass
  headingData = validateHeadingOrder(headingData)

  // Store all headings for visualization with proper message
  const overlayData = headingData.map((heading) => ({
    selector: heading.selector,
    message: `${heading.status === "valid" ? "Valid" : "Invalid"} H${heading.level} Heading`,
    element: heading.element
  }))

  // Store in storage for overlay
  storage.set("issues", overlayData)
}

// Watch for test activation
storage.watch({
  test_enabled_headings: ({ newValue }) => {
    if (newValue) {
      collectHeadingData()
    }
  }
})
