import { useTheme } from "@/components/theme-provider"
import { useCallback, useEffect, useRef, useState } from "react"

const COLORS = {
  light: {
    bg: "rgba(59, 130, 246, 0.1)", // Light blue background
    outline: "#3b82f6", // Blue outline
    error: {
      bg: "rgba(239, 68, 68, 0.1)", // Light red background
      outline: "#ef4444" // Red outline
    }
  },
  dark: {
    bg: "rgba(59, 130, 246, 0.2)", // Darker blue background
    outline: "#60a5fa", // Lighter blue outline
    error: {
      bg: "rgba(239, 68, 68, 0.2)", // Darker red background
      outline: "#f87171" // Lighter red outline
    }
  }
}

interface HeadingData {
  element: HTMLElement
  level: number
  isValid: boolean
  message?: string
}

function validateHeadings(headings: HeadingData[]): HeadingData[] {
  let lastValidLevel = 0

  return headings.map((heading, index) => {
    // First heading should be h1
    if (index === 0 && heading.level !== 1) {
      return {
        ...heading,
        isValid: false,
        message: "First heading must be H1"
      }
    }

    // Check for valid heading level sequence
    const isValidSequence = heading.level <= lastValidLevel + 1
    const isValid = index === 0 ? heading.level === 1 : isValidSequence

    if (!isValid) {
      return {
        ...heading,
        isValid: false,
        message: `Invalid heading sequence: H${lastValidLevel} to H${heading.level}`
      }
    }

    lastValidLevel = heading.level
    return {
      ...heading,
      isValid: true
    }
  })
}

function HeadingIndicator({
  level,
  isDark,
  isValid,
  message
}: {
  level: number
  isDark: boolean
  isValid: boolean
  message?: string
}) {
  const colors = COLORS[isDark ? "dark" : "light"]
  const style = {
    position: "absolute" as const,
    bottom: "100%",
    left: "-2px", // Align with the border
    padding: "0",
    borderRadius: "0",
    fontSize: "0.675rem",
    lineHeight: "1",
    fontWeight: "bold",
    backgroundColor: isValid ? colors.outline : colors.error.outline,
    color: "#ffffff",
    zIndex: 10001,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "1.5rem",
    height: "1.5rem",
    border: `2px solid ${isValid ? colors.outline : colors.error.outline}`,
    borderBottom: "none"
  }

  return (
    <div style={style} title={message}>
      <span>H{level}</span>
    </div>
  )
}

export default function HeadingAnalysisOverlay() {
  const { theme } = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [headings, setHeadings] = useState<HeadingData[]>([])
  const [forceUpdate, setForceUpdate] = useState(0)
  const isDark = theme === "dark"
  const colors = COLORS[isDark ? "dark" : "light"]
  const rafRef = useRef<number | null>(null)
  const isResizingRef = useRef(false)

  // Listen for activation messages
  useEffect(() => {
    const handleMessage = (message: any) => {
      if (message.type === "HEADING_ANALYSIS_STATE") {
        setIsActive(message.isActive)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)
    return () => chrome.runtime.onMessage.removeListener(handleMessage)
  }, [])

  // Function to update heading positions
  const updateHeadings = useCallback(() => {
    if (!isActive) return

    // Get all headings, including those that might be hidden
    const foundHeadings = Array.from(
      document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    ) as HTMLElement[]

    // Filter for visible headings
    const visibleHeadings = foundHeadings.filter((heading) => {
      const style = window.getComputedStyle(heading)
      return style.display !== "none" && style.visibility !== "hidden"
    })

    // Map to heading data and validate
    const headingData = visibleHeadings.map((element) => ({
      element,
      level: parseInt(element.tagName[1]),
      isValid: true // Will be updated by validateHeadings
    }))

    const validatedHeadings = validateHeadings(headingData)
    setHeadings(validatedHeadings)
    setForceUpdate((prev) => prev + 1)
  }, [isActive])

  // RAF-based resize handler
  const handleResize = useCallback(() => {
    if (!isActive) return

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Start resize tracking
    if (!isResizingRef.current) {
      isResizingRef.current = true
    }

    // Schedule update
    rafRef.current = requestAnimationFrame(() => {
      updateHeadings()

      // End resize tracking after a delay
      setTimeout(() => {
        isResizingRef.current = false
        // Final update to ensure accuracy
        updateHeadings()
      }, 100)
    })
  }, [isActive, updateHeadings])

  useEffect(() => {
    if (!isActive) return

    // Initial heading detection
    updateHeadings()

    // Set up mutation observer for DOM changes
    const observer = new MutationObserver((mutations) => {
      if (isResizingRef.current) return // Skip during resize

      const hasRelevantChanges = mutations.some((mutation) => {
        const isHeadingChange = Array.from(mutation.addedNodes).some(
          (node) =>
            node instanceof HTMLElement &&
            (node.matches("h1, h2, h3, h4, h5, h6") ||
              node.querySelector("h1, h2, h3, h4, h5, h6"))
        )

        const isStyleChange =
          mutation.type === "attributes" &&
          (mutation.attributeName === "style" ||
            mutation.attributeName === "class")

        return isHeadingChange || isStyleChange
      })

      if (hasRelevantChanges) {
        updateHeadings()
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"]
    })

    // Event listeners
    window.addEventListener("resize", handleResize, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [isActive, handleResize, updateHeadings])

  // Don't render anything if not active
  if (!isActive) return null

  return (
    <>
      {headings.map(({ element, level, isValid, message }, index) => {
        const rect = element.getBoundingClientRect()

        return (
          <div
            key={`${index}-${forceUpdate}`}
            style={{
              position: "absolute",
              top: `${rect.top + window.scrollY}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              backgroundColor: isValid ? colors.bg : colors.error.bg,
              outline: `2px solid ${isValid ? colors.outline : colors.error.outline}`,
              pointerEvents: "none",
              zIndex: 10000,
              opacity: isActive ? 1 : 0,
              transition: isResizingRef.current
                ? "none"
                : "all 0.2s ease-in-out",
              willChange: "transform, opacity, width, height"
            }}>
            <HeadingIndicator
              level={level}
              isDark={isDark}
              isValid={isValid}
              message={message}
            />
          </div>
        )
      })}
    </>
  )
}

// Export config to specify when this UI should be injected
export const config = {
  matches: ["<all_urls>"]
}
