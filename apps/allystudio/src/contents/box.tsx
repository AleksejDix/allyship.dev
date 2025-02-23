import ElementOverlay from "@/components/element-overlay/ElementOverlay"
import type { OverlayElement } from "@/components/element-overlay/ElementOverlay"
import { storage } from "@/storage"
import { memo, useEffect, useState } from "react"

interface HeadingIssue {
  selector: string
  level: number
  isValid: boolean
  message: string
}

const HighlightBoxComponent = () => {
  const [elements, setElements] = useState<OverlayElement[]>([])

  const updateHighlights = async () => {
    const issues = ((await storage.get("heading_issues")) ||
      []) as HeadingIssue[]

    console.log("🔍 Retrieved heading issues:", issues)

    const overlayElements = issues
      .map((issue) => {
        const element = document.querySelector(issue.selector) as HTMLElement
        if (!element) {
          console.warn("⚠️ Element not found for selector:", issue.selector)
          return null
        }

        return {
          element,
          isValid: issue.isValid,
          label: `H${issue.level}`,
          message: issue.message
        }
      })
      .filter(Boolean) as OverlayElement[]

    console.log("✅ Updated overlay elements:", overlayElements)
    setElements(overlayElements)
  }

  useEffect(() => {
    updateHighlights() // Initial update

    // Watch for storage updates
    storage.watch({
      heading_issues: () => {
        console.log("🔄 Storage updated, refreshing highlights...")
        updateHighlights()
      }
    })
  }, [])

  if (elements.length === 0) return null

  return <ElementOverlay elements={elements} />
}

export const HighlightBox = memo(HighlightBoxComponent)
