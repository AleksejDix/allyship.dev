import { storage } from "@/storage"
import { useEffect, useState } from "react"

interface Issue {
  selector: string
  message: string
  element?: HTMLElement
}

interface IssueWithElement extends Issue {
  element: HTMLElement
}

export default function PlasmoContent() {
  const [issues, setIssues] = useState<IssueWithElement[]>([])

  useEffect(() => {
    const updateOverlay = async ({ newValue }: { newValue: Issue[] }) => {
      const storedIssues = newValue || []
      console.log("🔄 Updating overlay with issues:", storedIssues)

      // Ensure elements still exist in the DOM and attach element references
      setIssues(
        storedIssues
          .map((issue) => {
            const element = document.querySelector(
              issue.selector
            ) as HTMLElement
            return element ? { ...issue, element } : null
          })
          .filter((issue): issue is IssueWithElement => issue !== null)
      )
    }

    // ✅ Watch for storage chang es
    storage.watch({
      issues: updateOverlay
    })
  }, [])

  return (
    <>
      {issues.map(({ element, message }, index) => {
        const rect = element.getBoundingClientRect()

        return (
          <div
            key={index}
            style={{
              position: "absolute",
              top: `${rect.top + window.scrollY}px`,
              left: `${rect.left}px`,
              width: `${rect.width}px`,
              height: `${rect.height}px`,
              border: "2px solid red",
              backgroundColor: "rgba(255, 0, 0, 0.2)",
              zIndex: 9999,
              pointerEvents: "none"
            }}>
            <span
              style={{
                position: "absolute",
                top: "-20px",
                left: "0",
                background: "red",
                color: "white",
                padding: "2px 5px",
                fontSize: "12px",
                borderRadius: "3px"
              }}>
              {message}
            </span>
          </div>
        )
      })}
    </>
  )
}
