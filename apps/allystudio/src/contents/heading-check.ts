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
}

const getUniqueSelector = (element: HTMLElement): string => {
  // Try using existing ID
  if (element.id) {
    return `#${element.id}`
  }

  // Generate path using classes and nth-child
  const path: string[] = []
  let current: Element | null = element

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase()

    // Add classes if they exist (limit to first 2 classes to keep selector manageable)
    const classes = Array.from(current.classList).slice(0, 2)
    if (classes.length) {
      selector += `.${classes.join(".")}`
    }

    // Add nth-child for uniqueness
    const parent = current.parentElement
    if (parent) {
      const index = Array.from(parent.children).indexOf(current) + 1
      selector += `:nth-child(${index})`
    }

    path.unshift(selector)
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
  console.log("Collecting heading data...")

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
      status: "valid", // Default status
      element: heading
    }
  })

  // Validate order in a single pass
  headingData = validateHeadingOrder(headingData)

  // Get invalid headings
  const invalidHeadings = headingData.filter((h) => h.status === "invalid")

  // Enhanced logging with element references and accessibility
  console.group("Heading Analysis")

  // Log all headings in order with status indicators
  headingData.forEach((h) => {
    const isValid = h.status === "valid"
    console.log(
      `%c${isValid ? "■" : "▲"} L${h.level} %o`,
      `color: ${isValid ? "#22c55e" : "#ef4444"}`,
      h.element
    )

    // Auto-scroll to first invalid heading
    if (!isValid && h === invalidHeadings[0]) {
      h.element.scrollIntoView({ behavior: "smooth" })
    }
  })

  // Summary
  console.log(
    `%c${headingData.length} headings, ${invalidHeadings.length} issues`,
    "font-weight: bold"
  )
  console.groupEnd()

  // Send each invalid heading separately
  invalidHeadings.forEach((heading) => {
    const issue: HeadingIssue = {
      selector: heading.selector,
      level: heading.level,
      url: normalizedUrl
    }

    sendToBackground({
      name: "heading-issue",
      body: issue
    }).catch((err) => {
      console.error("Failed to send heading issue:", err)
    })
  })
}

// Watch for test activation
storage.watch({
  test_enabled_headings: ({ newValue }) => {
    if (newValue) {
      collectHeadingData()
    }
  }
})
