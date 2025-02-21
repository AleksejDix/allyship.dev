import { useTheme } from "@/components/theme-provider"
import { useEffect, useRef } from "react"

import { Button } from "./ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "./ui/card"

declare global {
  interface Window {
    __allyStudioObserver?: MutationObserver
  }
}

interface HeadingAnalysisProps {
  isActive: boolean
}

export function HeadingAnalysis({ isActive }: HeadingAnalysisProps) {
  const { theme } = useTheme()
  const observerRef = useRef<MutationObserver | null>(null)

  // Function to highlight headings with theme-aware colors
  const highlightHeadings = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tab?.id) return

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (isDark) => {
          const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

          // Theme-aware colors
          const colors = {
            h1: {
              bg: isDark ? "#374151" : "#fef3c7",
              outline: isDark ? "#9ca3af" : "#d97706"
            },
            h2: {
              bg: isDark ? "#374151" : "#e0f2fe",
              outline: isDark ? "#9ca3af" : "#0284c7"
            },
            h3: {
              bg: isDark ? "#374151" : "#f3e8ff",
              outline: isDark ? "#9ca3af" : "#7c3aed"
            },
            h4: {
              bg: isDark ? "#374151" : "#dcfce7",
              outline: isDark ? "#9ca3af" : "#16a34a"
            },
            h5: {
              bg: isDark ? "#374151" : "#fae8ff",
              outline: isDark ? "#9ca3af" : "#c026d3"
            },
            h6: {
              bg: isDark ? "#374151" : "#fff1f2",
              outline: isDark ? "#9ca3af" : "#e11d48"
            }
          }

          headings.forEach((heading) => {
            const headingElement = heading as HTMLElement
            const level = heading.tagName.toLowerCase() as keyof typeof colors

            // Store original styles
            if (
              !headingElement.hasAttribute("data-ally-studio-original-styles")
            ) {
              const originalStyles = {
                backgroundColor: headingElement.style.backgroundColor,
                outline: headingElement.style.outline,
                position: headingElement.style.position,
                zIndex: headingElement.style.zIndex
              }
              headingElement.setAttribute(
                "data-ally-studio-original-styles",
                JSON.stringify(originalStyles)
              )
            }

            // Add highlight styles
            headingElement.setAttribute("data-ally-studio", "heading")
            headingElement.style.backgroundColor = colors[level].bg
            headingElement.style.outline = `2px solid ${colors[level].outline}`
            headingElement.style.position = "relative"
            headingElement.style.zIndex = "10000"

            // Add level indicator
            let indicator = headingElement.querySelector(".ally-studio-level")
            if (!indicator) {
              indicator = document.createElement("div") as HTMLDivElement
              indicator.className = "ally-studio-level"
              indicator.style.position = "absolute"
              indicator.style.top = "-1rem"
              indicator.style.left = "-0.25rem"
              indicator.style.padding = "0.125rem 0.25rem"
              indicator.style.borderRadius = "0.25rem"
              indicator.style.fontSize = "0.75rem"
              indicator.style.fontWeight = "bold"
              indicator.style.backgroundColor = colors[level].outline
              indicator.style.color = isDark ? "#1f2937" : "#ffffff"
              indicator.textContent = level.toUpperCase()
              headingElement.appendChild(indicator)
            }
          })

          return headings.length
        },
        args: [theme === "dark"]
      })
    } catch (error) {
      console.error("Error highlighting headings:", error)
    }
  }

  // Function to remove highlights
  const removeHighlights = async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tab?.id) return

      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const headings = document.querySelectorAll(
            '[data-ally-studio="heading"]'
          )

          headings.forEach((heading) => {
            const headingElement = heading as HTMLElement

            // Restore original styles
            const originalStyles = JSON.parse(
              headingElement.getAttribute("data-ally-studio-original-styles") ||
                "{}"
            )

            headingElement.style.backgroundColor =
              originalStyles.backgroundColor || ""
            headingElement.style.outline = originalStyles.outline || ""
            headingElement.style.position = originalStyles.position || ""
            headingElement.style.zIndex = originalStyles.zIndex || ""

            // Remove our attributes and elements
            headingElement.removeAttribute("data-ally-studio")
            headingElement.removeAttribute("data-ally-studio-original-styles")

            const indicator = headingElement.querySelector(".ally-studio-level")
            if (indicator) {
              indicator.remove()
            }
          })
        }
      })
    } catch (error) {
      console.error("Error removing highlights:", error)
    }
  }

  // Set up DOM mutation observer
  const setupObserver = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })
    if (!tab?.id) return

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const observer = new MutationObserver((mutations) => {
          // Check if any mutations affect headings
          const affectsHeadings = mutations.some((mutation) => {
            // Check added nodes
            const hasAddedHeadings = Array.from(mutation.addedNodes).some(
              (node) =>
                node instanceof HTMLElement && /^h[1-6]$/i.test(node.tagName)
            )

            // Check removed nodes
            const hasRemovedHeadings = Array.from(mutation.removedNodes).some(
              (node) =>
                node instanceof HTMLElement && /^h[1-6]$/i.test(node.tagName)
            )

            // Check attribute changes on headings
            const isHeadingAttributeChange =
              mutation.type === "attributes" &&
              mutation.target instanceof HTMLElement &&
              /^h[1-6]$/i.test(mutation.target.tagName)

            return (
              hasAddedHeadings || hasRemovedHeadings || isHeadingAttributeChange
            )
          })

          if (affectsHeadings) {
            // Notify the extension that headings have changed
            window.postMessage(
              { type: "ALLY_STUDIO_HEADINGS_CHANGED" },
              window.location.origin
            )
          }
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true
        })

        // Store observer reference in window for cleanup
        window.__allyStudioObserver = observer
      }
    })
  }

  // Clean up observer
  const cleanupObserver = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    })
    if (!tab?.id) return

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        if (window.__allyStudioObserver) {
          window.__allyStudioObserver.disconnect()
          delete window.__allyStudioObserver
        }
      }
    })
  }

  // Handle tool activation/deactivation
  useEffect(() => {
    if (isActive) {
      highlightHeadings()
      setupObserver()
    } else {
      removeHighlights()
      cleanupObserver()
    }
  }, [isActive])

  // Handle theme changes
  useEffect(() => {
    if (isActive) {
      highlightHeadings()
    }
  }, [theme])

  // Handle URL changes
  useEffect(() => {
    const handleUrlChange = () => {
      if (isActive) {
        highlightHeadings()
      }
    }

    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.url) {
        handleUrlChange()
      }
    })

    return () => {
      chrome.tabs.onUpdated.removeListener(handleUrlChange)
    }
  }, [isActive])

  // Handle DOM changes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "ALLY_STUDIO_HEADINGS_CHANGED" && isActive) {
        highlightHeadings()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      removeHighlights()
      cleanupObserver()
    }
  }, [])

  useEffect(() => {
    // Inject or remove the CSUI script based on isActive state
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (!tabs[0]?.id) return

      if (isActive) {
        // Inject CSUI script
        await chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          files: ["contents/heading-analysis.js"]
        })

        // Send active state to CSUI
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: "HEADING_ANALYSIS_STATE",
          isActive: true
        })
      } else {
        // Send inactive state to CSUI
        await chrome.tabs.sendMessage(tabs[0].id, {
          type: "HEADING_ANALYSIS_STATE",
          isActive: false
        })

        // Remove CSUI after transition
        setTimeout(async () => {
          await chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: () => {
              const root = document.getElementById("plasmo-shadow-container")
              if (root) {
                root.remove()
              }
            }
          })
        }, 200) // Match transition duration
      }
    })
  }, [isActive])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Heading Analysis</CardTitle>
        <CardDescription>
          Analyze and highlight heading structure on the current page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {isActive
            ? "Headings are currently highlighted. Each heading level has a distinct color and indicator."
            : "Click the heading icon in the toolbar to highlight all headings on the page."}
        </div>
      </CardContent>
    </Card>
  )
}
