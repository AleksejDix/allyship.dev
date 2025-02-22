import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { useCallback, useEffect, useRef, useState } from "react"

// Theme configuration
export const OVERLAY_COLORS = {
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

export interface OverlayElement {
  element: HTMLElement
  isValid: boolean
  label: string
  message?: string
}

interface ElementHighlightBoxProps {
  element: HTMLElement
  isValid: boolean
  children: React.ReactNode
  isDark: boolean
}

export function ElementHighlightBox({
  element,
  isValid,
  children,
  isDark
}: ElementHighlightBoxProps) {
  const colors = OVERLAY_COLORS[isDark ? "dark" : "light"]
  const boxColors = isValid ? colors.valid : colors.error
  const rect = element.getBoundingClientRect()

  return (
    <div
      className={cn(
        "absolute transition-all duration-200 ease-in-out will-change-[transform,opacity,width,height]"
      )}
      style={{
        position: "absolute",
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        backgroundColor: boxColors.bg,
        outline: `2px solid ${boxColors.outline}`,
        opacity: 1,
        pointerEvents: "none"
      }}>
      {children}
    </div>
  )
}

interface ElementIndicatorProps {
  label: string
  isValid: boolean
  isDark: boolean
  message?: string
}

export function ElementIndicator({
  label,
  isValid,
  isDark,
  message
}: ElementIndicatorProps) {
  const colors = OVERLAY_COLORS[isDark ? "dark" : "light"]
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

interface ElementOverlayProps {
  elements: OverlayElement[]
  onElementsChange?: (elements: OverlayElement[]) => void
}

export default function ElementOverlay({
  elements,
  onElementsChange
}: ElementOverlayProps) {
  const { theme } = useTheme()
  const [forceUpdate, setForceUpdate] = useState(0)
  const rafRef = useRef<number | null>(null)
  const isResizingRef = useRef(false)
  const isDark = theme === "dark"

  // Handle resize with RAF for performance
  const handleResize = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    if (!isResizingRef.current) {
      isResizingRef.current = true
    }

    rafRef.current = requestAnimationFrame(() => {
      setForceUpdate((prev) => prev + 1)
      setTimeout(() => {
        isResizingRef.current = false
        setForceUpdate((prev) => prev + 1)
      }, 100)
    })
  }, [])

  useEffect(() => {
    window.addEventListener("resize", handleResize, { passive: true })
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [handleResize])

  return (
    <>
      {elements.map(({ element, isValid, label, message }, index) => (
        <ElementHighlightBox
          key={`${index}-${forceUpdate}`}
          element={element}
          isValid={isValid}
          isDark={isDark}>
          <ElementIndicator
            label={label}
            isValid={isValid}
            isDark={isDark}
            message={message}
          />
        </ElementHighlightBox>
      ))}
    </>
  )
}
