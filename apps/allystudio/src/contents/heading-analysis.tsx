import { useTheme } from "@/components/theme-provider"
import { useCallback, useEffect, useRef, useState } from "react"

const COLORS = {
  light: {
    bg: "rgba(59, 130, 246, 0.1)", // Light blue background
    outline: "#3b82f6" // Blue outline
  },
  dark: {
    bg: "rgba(59, 130, 246, 0.2)", // Darker blue background
    outline: "#60a5fa" // Lighter blue outline
  }
}

interface HeadingData {
  element: HTMLElement
  level: number
}

function HeadingIndicator({
  level,
  isDark
}: {
  level: number
  isDark: boolean
}) {
  const colors = COLORS[isDark ? "dark" : "light"]
  const style = {
    position: "absolute" as const,
    top: "-1.25rem",
    left: "-0.25rem",
    padding: "0.125rem 0.25rem",
    borderRadius: "0.25rem",
    fontSize: "0.75rem",
    fontWeight: "bold",
    backgroundColor: colors.outline,
    color: "#ffffff",
    zIndex: 10001,
    display: "flex",
    alignItems: "center",
    gap: "0.25rem"
  }

  return (
    <div style={style}>
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
  const scrollTimeoutRef = useRef<number | null>(null)
  const isResizingRef = useRef(false)
  const lastUpdateRef = useRef(0)

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

    // Map to heading data
    const headingData = visibleHeadings.map((element) => ({
      element,
      level: parseInt(element.tagName[1])
    }))

    setHeadings(headingData)
    setForceUpdate((prev) => prev + 1)
  }, [isActive])

  // RAF-based resize handler
  const handleResize = useCallback(() => {
    if (!isActive) return

    const now = Date.now()

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Start resize tracking
    if (!isResizingRef.current) {
      isResizingRef.current = true
    }

    // If we haven't updated in 16ms (roughly 60fps), update immediately
    if (now - lastUpdateRef.current >= 16) {
      updateHeadings()
      lastUpdateRef.current = now
    }

    // Schedule next update
    rafRef.current = requestAnimationFrame(() => {
      updateHeadings()
      lastUpdateRef.current = Date.now()

      // End resize tracking after a delay
      setTimeout(() => {
        isResizingRef.current = false
        // Final update to ensure accuracy
        updateHeadings()
      }, 100)
    })
  }, [isActive, updateHeadings])

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    if (!isActive || isResizingRef.current) return

    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = window.setTimeout(() => {
      updateHeadings()
    }, 50)
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
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Intersection Observer for dynamic content
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (isResizingRef.current) return // Skip during resize
        if (entries.some((entry) => entry.isIntersecting)) {
          updateHeadings()
        }
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "50px 0px"
      }
    )

    // Observe headings
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading) => {
      intersectionObserver.observe(heading)
    })

    return () => {
      observer.disconnect()
      intersectionObserver.disconnect()
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("scroll", handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [isActive, handleResize, handleScroll, updateHeadings])

  // Don't render anything if not active
  if (!isActive) return null

  return (
    <>
      {headings.map(({ element, level }, index) => {
        const rect = element.getBoundingClientRect()

        // Expanded viewport check with dynamic buffer during resize
        const buffer = isResizingRef.current ? 200 : 100
        if (
          rect.bottom < -buffer ||
          rect.top > window.innerHeight + buffer ||
          rect.right < -buffer ||
          rect.left > window.innerWidth + buffer
        ) {
          return null
        }

        return (
          <div
            key={`${index}-${forceUpdate}`}
            style={{
              position: "fixed",
              top: `${rect.top}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              backgroundColor: colors.bg,
              outline: `2px solid ${colors.outline}`,
              pointerEvents: "none",
              zIndex: 10000,
              transform: `translate3d(0, ${window.scrollY}px, 0)`,
              opacity: isActive ? 1 : 0,
              transition: isResizingRef.current
                ? "none"
                : "all 0.2s ease-in-out",
              willChange: "transform, opacity, width, height"
            }}>
            <HeadingIndicator level={level} isDark={isDark} />
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
