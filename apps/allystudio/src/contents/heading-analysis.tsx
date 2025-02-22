import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { createClient } from "@supabase/supabase-js"
import { useCallback, useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"

// Common color system moved to a shared location
export const COLORS = {
  light: {
    valid: {
      bg: "rgba(59, 130, 246, 0.1)",
      outline: "#3b82f6",
      indicator: {
        bg: "#1d4ed8",
        text: "#ffffff"
      }
    },
    error: {
      bg: "rgba(239, 68, 68, 0.1)",
      outline: "#ef4444",
      indicator: {
        bg: "#b91c1c",
        text: "#ffffff"
      }
    }
  },
  dark: {
    valid: {
      bg: "rgba(59, 130, 246, 0.2)",
      outline: "#60a5fa",
      indicator: {
        bg: "#2563eb",
        text: "#ffffff"
      }
    },
    error: {
      bg: "rgba(239, 68, 68, 0.2)",
      outline: "#f87171",
      indicator: {
        bg: "#dc2626",
        text: "#ffffff"
      }
    }
  }
}

// Types for accessibility issues
interface AccessibilityIssue {
  issue_id: string
  rule_id: string
  agent_id: string
  step_id: string
  url: string
  normalized_url: string
  location: {
    xpath: string
    selector: string
    element_type: string
    attribute?: string
    context: string
  }
  severity: "Critical" | "High" | "Medium" | "Low"
  confidence: number
  evidence: {
    found_value: string
    expected_value: string
    snippet: string
  }
  impact: {
    user_groups: string[]
    assistive_tech: string[]
    functionality: string[]
  }
  fix_suggestion: {
    description: string
    code_example: string
    related_resources: string[]
  }
}

// Base interfaces for all tools
export interface ValidationResult {
  isValid: boolean
  message?: string
  severity?: "Critical" | "High" | "Medium" | "Low"
  expected?: string
}

export interface ElementData extends ValidationResult {
  element: HTMLElement
}

// Base tool class that can be extended by specific tools
export abstract class BaseTool {
  abstract getSelector(): string
  abstract validateElement(el: HTMLElement): ValidationResult
  abstract getLabel(el: HTMLElement): string

  getElements(): NodeListOf<HTMLElement> {
    return document.querySelectorAll<HTMLElement>(this.getSelector())
  }

  getVisibleElements(): HTMLElement[] {
    return Array.from(this.getElements()).filter((el) => {
      const style = window.getComputedStyle(el)
      return style.display !== "none" && style.visibility !== "hidden"
    })
  }

  validateElements(): ElementData[] {
    return this.getVisibleElements().map((element) => {
      const result = this.validateElement(element)
      return {
        element,
        ...result
      }
    })
  }
}

// Heading-specific tool implementation
export class HeadingTool extends BaseTool {
  getSelector(): string {
    return "h1, h2, h3, h4, h5, h6"
  }

  getLabel(el: HTMLElement): string {
    const level = parseInt(el.tagName[1])
    return `H${level}`
  }

  validateElement(el: HTMLElement): ValidationResult {
    const level = parseInt(el.tagName[1])
    const allHeadings = this.getVisibleElements()
    const index = allHeadings.indexOf(el)
    let lastValidLevel = 0

    // Get previous valid heading level
    for (let i = 0; i < index; i++) {
      const prevLevel = parseInt(allHeadings[i].tagName[1])
      if (prevLevel <= lastValidLevel + 1) {
        lastValidLevel = prevLevel
      }
    }

    // First heading should be h1
    if (index === 0 && level !== 1) {
      return {
        isValid: false,
        message: "First heading must be H1",
        severity: "Critical",
        expected: "h1"
      }
    }

    // Check for valid heading level sequence
    const isValidSequence = level <= lastValidLevel + 1
    const isValid = index === 0 ? level === 1 : isValidSequence

    if (!isValid) {
      return {
        isValid: false,
        message: `Invalid heading sequence: H${lastValidLevel} to H${level}`,
        severity: "High",
        expected: `h${lastValidLevel + 1}`
      }
    }

    return { isValid: true }
  }

  getElementXPath(element: HTMLElement): string {
    // Get all headings
    const headings = document.querySelectorAll<HTMLElement>(this.getSelector())
    let count = 0
    let found = false

    // Count headings of the same level that come before this one
    for (let i = 0; i < headings.length; i++) {
      const heading = headings[i]
      if (heading === element) {
        found = true
        break
      }
      if (heading.tagName === element.tagName) {
        count++
      }
    }

    if (!found) return ""

    // XPath format: //h1[1], //h2[3], etc.
    return `//${element.tagName.toLowerCase()}[${count + 1}]`
  }

  collectIssues(): AccessibilityIssue[] {
    const elements = this.validateElements()
    const issues: AccessibilityIssue[] = []
    const url = window.location.href
    const normalized_url = url.replace(/^https?:\/\//, "").replace(/\/$/, "")

    elements.forEach(({ element, isValid, message, severity, expected }) => {
      if (!isValid && message && severity && expected) {
        const level = parseInt(element.tagName[1])
        const xpath = this.getElementXPath(element)

        const issue = {
          issue_id: `heading_${level}_${xpath.replace(/[^\w]/g, "_")}`,
          rule_id: "1.3.1",
          agent_id: "heading_structure_validator",
          step_id: "heading_sequence_check",
          url,
          normalized_url,
          location: {
            xpath,
            selector: `h${level}`,
            element_type: "heading",
            context: "Document structure"
          },
          severity,
          confidence: 1.0,
          evidence: {
            found_value: `h${level}`,
            expected_value: expected,
            snippet: element.outerHTML
          },
          impact: {
            user_groups: [
              "Screen reader users",
              "Keyboard users",
              "Users with cognitive disabilities"
            ],
            assistive_tech: ["Screen readers", "Navigation tools"],
            functionality: [
              "Content structure",
              "Navigation",
              "Document outline"
            ]
          },
          fix_suggestion: {
            description: message,
            code_example: `<${expected}>${element.textContent}</${expected}>`,
            related_resources: [
              "https://www.w3.org/WAI/tutorials/page-structure/headings/",
              "https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements",
              "https://webaim.org/techniques/semanticstructure/#headings"
            ]
          }
        }

        issues.push(issue)

        // Log each issue with detailed formatting
        console.group(`🚨 Heading Issue Found: ${message}`)
        console.log(
          "%cLocation",
          "font-weight: bold; color: #2563eb",
          `\nElement: ${element.tagName.toLowerCase()}\nXPath: ${xpath}\nText: "${element.textContent?.trim()}"`
        )
        console.log(
          "%cDetails",
          "font-weight: bold; color: #2563eb",
          `\nSeverity: ${severity}\nFound: H${level}\nExpected: ${expected.toUpperCase()}`
        )
        console.log(
          "%cImpact",
          "font-weight: bold; color: #2563eb",
          "\nAffects:",
          issue.impact.user_groups.join(", ")
        )
        console.log(
          "%cFix Suggestion",
          "font-weight: bold; color: #2563eb",
          `\n${message}\nExample: ${issue.fix_suggestion.code_example}`
        )
        console.groupEnd()
      }
    })

    // Log summary if issues found
    if (issues.length > 0) {
      console.log(
        `\n%c📊 Heading Analysis Summary`,
        "font-size: 14px; font-weight: bold; color: #2563eb"
      )
      console.log(
        `%cFound ${issues.length} issue${issues.length === 1 ? "" : "s"}:`,
        "font-weight: bold"
      )
      console.table(
        issues.map((issue) => ({
          Severity: issue.severity,
          Message: issue.fix_suggestion.description,
          Element: issue.evidence.found_value,
          Expected: issue.evidence.expected_value
        }))
      )
    }

    // Update shared state and notify sidepanel
    currentIssues = issues
    notifySidepanelOfIssues(issues)

    return issues
  }
}

// Reusable UI components
export function ElementHighlightBox({
  element,
  isValid,
  children,
  isDark
}: {
  element: HTMLElement
  isValid: boolean
  children: React.ReactNode
  isDark: boolean
}) {
  const colors = COLORS[isDark ? "dark" : "light"]
  const boxColors = isValid ? colors.valid : colors.error
  const rect = element.getBoundingClientRect()

  return (
    <div
      className={cn(
        "pointer-events-none absolute transition-all duration-200 ease-in-out will-change-[transform,opacity,width,height]"
      )}
      style={{
        position: "absolute",
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        backgroundColor: boxColors.bg,
        outline: `2px solid ${boxColors.outline}`,
        opacity: 1
      }}>
      {children}
    </div>
  )
}

export function ElementIndicator({
  label,
  isValid,
  isDark,
  message
}: {
  label: string
  isValid: boolean
  isDark: boolean
  message?: string
}) {
  const colors = COLORS[isDark ? "dark" : "light"]
  const indicatorColors = isValid
    ? colors.valid.indicator
    : colors.error.indicator

  return (
    <div
      className="element-indicator"
      style={{
        backgroundColor: indicatorColors.bg,
        color: indicatorColors.text,
        border: `2px solid ${indicatorColors.bg}`,
        position: "absolute",
        bottom: "100%",
        left: "-2px",
        padding: "4px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: "nowrap",
        userSelect: "none",
        zIndex: 10001,
        transition: "all 200ms ease"
      }}
      title={message}>
      <span>{label}</span>
    </div>
  )
}

// Create tool instance
const headingTool = new HeadingTool()

// Function to send issues using Beacon API
async function sendIssuesToBackend(issues: AccessibilityIssue[]) {
  const endpoint = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/Issue`
  const apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  // Log sending status
  console.log(
    `\n%c📤 Sending ${issues.length} issue${issues.length === 1 ? "" : "s"} to backend...`,
    "font-size: 14px; font-weight: bold; color: #2563eb"
  )

  // Prepare the data for sending
  const data = issues.map((issue) => ({
    ...issue,
    metadata: {
      tool: "heading_analysis",
      version: "1.0",
      automated: true,
      ai_ready: true
    }
  }))

  // Use Beacon API to send data
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" })
  const success = navigator.sendBeacon(endpoint, blob)

  if (success) {
    console.log(
      "%c✅ Issues sent successfully via Beacon API",
      "color: #059669; font-weight: bold"
    )
  } else {
    console.log(
      "%c⚠️ Beacon API failed, trying fetch fallback...",
      "color: #d97706; font-weight: bold"
    )
    // Fallback to fetch if beacon fails
    try {
      await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: apiKey,
          Prefer: "resolution=merge-duplicates"
        },
        body: JSON.stringify(data)
      })
      console.log(
        "%c✅ Issues sent successfully via fetch",
        "color: #059669; font-weight: bold"
      )
    } catch (error) {
      console.error(
        "%c❌ Failed to send issues:",
        "color: #dc2626; font-weight: bold",
        error
      )
    }
  }
}

// Shared state for issues
let currentIssues: AccessibilityIssue[] = []

// Function to notify sidepanel of issues
function notifySidepanelOfIssues(issues: AccessibilityIssue[]) {
  chrome.runtime.sendMessage({
    type: "HEADING_ISSUES_UPDATE",
    issues: issues.map((issue) => ({
      ...issue,
      // Include only necessary data for the panel
      id: issue.issue_id,
      severity: issue.severity,
      message: issue.fix_suggestion.description,
      element: issue.evidence.found_value,
      expected: issue.evidence.expected_value,
      location: issue.location,
      text: issue.evidence.snippet
    }))
  })
}

// Function to scroll to element
function scrollToElement(xpath: string) {
  try {
    console.log("Trying to find element with XPath:", xpath)

    // First try by XPath
    let element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    ).singleNodeValue as HTMLElement

    // If XPath fails, try finding by heading level and index
    if (!element) {
      const matches = xpath.match(/\/\/(h[1-6])\[(\d+)\]/)
      if (matches) {
        const [, tag, index] = matches
        const headings = Array.from(
          document.getElementsByTagName(tag)
        ) as HTMLElement[]
        element = headings[parseInt(index) - 1]
      }
    }

    if (element) {
      console.log("Found element:", element)

      // Ensure element is in view
      const rect = element.getBoundingClientRect()
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)

      // Scroll into view if not visible
      if (!isInViewport) {
        element.scrollIntoView({ behavior: "smooth", block: "center" })
      }

      // Create a temporary highlight overlay
      const tempHighlight = document.createElement("div")
      document.body.appendChild(tempHighlight)

      // Render the highlight overlay
      const root = createRoot(tempHighlight)
      root.render(
        <ElementHighlightBox
          element={element}
          isValid={true}
          isDark={window.matchMedia("(prefers-color-scheme: dark)").matches}>
          <ElementIndicator
            label={headingTool.getLabel(element)}
            isValid={true}
            isDark={window.matchMedia("(prefers-color-scheme: dark)").matches}
          />
        </ElementHighlightBox>
      )

      // Remove the highlight after delay
      setTimeout(() => {
        root.unmount()
        tempHighlight.remove()
      }, 2000)
    } else {
      console.error("Element not found for XPath:", xpath)
    }
  } catch (error) {
    console.error("Error scrolling to element:", error)
  }
}

// React component for heading analysis overlay
export default function HeadingAnalysisOverlay() {
  const { theme } = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [elements, setElements] = useState<ElementData[]>([])
  const [forceUpdate, setForceUpdate] = useState(0)
  const [isSending, setIsSending] = useState(false)
  const isDark = theme === "dark"
  const rafRef = useRef<number | null>(null)
  const isResizingRef = useRef(false)

  // Function to send issues to sidepanel
  const sendIssuesToSidepanel = useCallback(() => {
    const issues = headingTool.collectIssues()
    if (issues.length > 0) {
      console.log("Sending issues to sidepanel:", issues)
      chrome.runtime.sendMessage({
        type: "HEADING_ISSUES_UPDATE",
        issues: issues.map((issue) => ({
          id: issue.issue_id,
          severity: issue.severity,
          message: issue.fix_suggestion.description,
          element: issue.evidence.found_value,
          expected: issue.evidence.expected_value,
          location: issue.location,
          text: issue.evidence.snippet
        }))
      })
    }
  }, [])

  // Listen for activation messages and issue requests
  useEffect(() => {
    const handleMessage = (message: any) => {
      console.log("Received message in content script:", message)
      if (message.type === "HEADING_ANALYSIS_STATE") {
        setIsActive(message.isActive)
        if (message.isActive) {
          const issues = headingTool.collectIssues()
          if (issues.length > 0) {
            setIsSending(true)
            sendIssuesToBackend(issues)
              .catch(console.error)
              .finally(() => setIsSending(false))
            // Also send to sidepanel
            sendIssuesToSidepanel()
          }
        }
      } else if (message.type === "REQUEST_HEADING_ISSUES") {
        // Respond with current issues
        sendIssuesToSidepanel()
      } else if (message.type === "NAVIGATE_TO_HEADING_ISSUE") {
        scrollToElement(message.xpath)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [sendIssuesToSidepanel])

  const updateElements = useCallback(() => {
    if (!isActive) return
    const validatedElements = headingTool.validateElements()
    setElements(validatedElements)
    setForceUpdate((prev) => prev + 1)

    // Send updated issues when elements change
    const issues = headingTool.collectIssues()
    if (issues.length > 0) {
      setIsSending(true)
      sendIssuesToBackend(issues)
        .catch(console.error)
        .finally(() => setIsSending(false))
      // Also send to sidepanel
      sendIssuesToSidepanel()
    }
  }, [isActive, sendIssuesToSidepanel])

  // RAF-based resize handler
  const handleResize = useCallback(() => {
    if (!isActive) return

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    if (!isResizingRef.current) {
      isResizingRef.current = true
    }

    rafRef.current = requestAnimationFrame(() => {
      updateElements()
      setTimeout(() => {
        isResizingRef.current = false
        updateElements()
      }, 100)
    })
  }, [isActive, updateElements])

  useEffect(() => {
    if (!isActive) return

    updateElements()

    const observer = new MutationObserver((mutations) => {
      if (isResizingRef.current) return

      const hasRelevantChanges = mutations.some((mutation) => {
        const isHeadingChange = Array.from(mutation.addedNodes).some(
          (node) =>
            node instanceof HTMLElement &&
            (node.matches(headingTool.getSelector()) ||
              node.querySelector(headingTool.getSelector()))
        )

        const isStyleChange =
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" ||
            mutation.attributeName === "class")

        return isHeadingChange || isStyleChange
      })

      if (hasRelevantChanges) {
        updateElements()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    })

    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive, handleResize, updateElements])

  if (!isActive) return null

  return (
    <>
      {elements.map(({ element, isValid, message }, index) => (
        <ElementHighlightBox
          key={`${index}-${forceUpdate}`}
          element={element}
          isValid={isValid}
          isDark={isDark}>
          <ElementIndicator
            label={headingTool.getLabel(element)}
            isValid={isValid}
            isDark={isDark}
            message={message}
          />
        </ElementHighlightBox>
      ))}
    </>
  )
}

export const config = {
  matches: ["<all_urls>"]
}
