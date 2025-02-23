import { storage } from "@/storage"
import { memo, useEffect, useState } from "react"

const HighlightBoxComponent = ({ message }: { message: string }) => {
  const [positions, setPositions] = useState<
    { top: number; left: number; width: number; height: number }[]
  >([])

  const updateHighlights = async () => {
    const issues = (await storage.get("heading_issues")) || []

    console.log("🔍 Retrieved issues from storage:", issues)

    const issueElements = issues
      .filter((issue) => issue.message === message)
      .map((issue) => {
        const element = document.querySelector(issue.selector) as HTMLElement
        if (!element) {
          console.warn("⚠️ Element not found for selector:", issue.selector)
          return null
        }

        const rect = element.getBoundingClientRect()
        return {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height
        }
      })
      .filter(Boolean)

    console.log("✅ Updated highlight positions:", issueElements)
    setPositions(issueElements as any)
  }

  useEffect(() => {
    updateHighlights() // Initial update

    // ✅ Watch for storage updates
    storage.watch({
      heading_issues: () => {
        console.log("🔄 Storage updated, refreshing highlights...")
        updateHighlights()
      }
    })
  }, [])

  if (positions.length === 0) return null

  return (
    <>
      {positions.map((pos, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            width: `${pos.width}px`,
            height: `${pos.height}px`,
            border: "2px solid red",
            background: "rgba(255, 0, 0, 0.2)",
            zIndex: 9999,
            pointerEvents: "none"
          }}>
          {message}
        </div>
      ))}
    </>
  )
}

export const HighlightBox = memo(HighlightBoxComponent)
