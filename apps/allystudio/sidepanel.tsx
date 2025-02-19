import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { supabase } from "~core/supabase"

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [headingsHighlighted, setHeadingsHighlighted] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleHighlightHeadings = async () => {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tab?.id) return

      // Execute script to highlight headings
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          // Find all heading elements
          const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6")

          headings.forEach((heading) => {
            const headingElement = heading as HTMLElement
            // Add data attribute
            headingElement.setAttribute("data-ally-studio", "heading")

            // Store original styles
            const originalStyles = {
              backgroundColor: headingElement.style.backgroundColor,
              outline: headingElement.style.outline
            }
            headingElement.setAttribute(
              "data-ally-studio-original-styles",
              JSON.stringify(originalStyles)
            )

            // Add highlight styles
            headingElement.style.backgroundColor = "#fef3c7" // Light yellow background
            headingElement.style.outline = "2px solid #d97706" // Orange outline
          })

          // Return count of headings found
          return headings.length
        }
      })

      setHeadingsHighlighted(true)
    } catch (error) {
      console.error("Error highlighting headings:", error)
    }
  }

  const handleRemoveHighlights = async () => {
    try {
      // Get the active tab
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
      })
      if (!tab?.id) return

      // Execute script to remove highlights
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

            // Remove our attributes
            headingElement.removeAttribute("data-ally-studio")
            headingElement.removeAttribute("data-ally-studio-original-styles")
          })
        }
      })

      setHeadingsHighlighted(false)
    } catch (error) {
      console.error("Error removing highlights:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div role="status" className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Please log in to use the extension</p>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Allyship Studio</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-red-600 hover:text-red-700">
          Sign Out
        </button>
      </header>

      <main className="flex-1">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Welcome, {session.user.email}</h2>
          <p className="text-sm text-gray-600">
            Start using the accessibility tools below
          </p>
        </div>

        {/* Add your accessibility tools here */}
        <div className="mt-4 space-y-4">
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Scan Page
          </button>
          <button
            onClick={
              headingsHighlighted
                ? handleRemoveHighlights
                : handleHighlightHeadings
            }
            className={`w-full rounded-md px-4 py-2 text-white ${
              headingsHighlighted
                ? "bg-yellow-600 hover:bg-yellow-700"
                : "bg-green-600 hover:bg-green-700"
            }`}>
            {headingsHighlighted
              ? "Remove Heading Highlights"
              : "Check Headings"}
          </button>
          <button className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            Analyze Images
          </button>
        </div>
      </main>

      <footer className="mt-4 text-center text-sm text-gray-500">
        <p>Allyship Studio v0.0.1</p>
      </footer>
    </div>
  )
}

export default IndexSidePanel
