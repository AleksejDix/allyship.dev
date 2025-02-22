import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"

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

// Base interfaces for all tools
export interface ValidationResult {
  isValid: boolean
  message?: string
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
        message: "First heading must be H1"
      }
    }

    // Check for valid heading level sequence
    const isValidSequence = level <= lastValidLevel + 1
    const isValid = index === 0 ? level === 1 : isValidSequence

    if (!isValid) {
      return {
        isValid: false,
        message: `Invalid heading sequence: H${lastValidLevel} to H${level}`
      }
    }

    return { isValid: true }
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

// React component for heading analysis overlay
export default function HeadingAnalysisOverlay() {
  const { theme } = useTheme()
  const [isActive, setIsActive] = useState(false)
  const [elements, setElements] = useState<ElementData[]>([])
  const [forceUpdate, setForceUpdate] = useState(0)
  const isDark = theme === "dark"
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

  const updateElements = useCallback(() => {
    if (!isActive) return
    const validatedElements = headingTool.validateElements()
    setElements(validatedElements)
    setForceUpdate((prev) => prev + 1)
  }, [isActive])

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
