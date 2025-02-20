import { Header } from "@/components/header"
import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { supabase } from "@/core/supabase"
import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

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

    // Listen for auth changes from Supabase
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
      <Layout>
        <div className="flex h-screen items-center justify-center">
          <div role="status" className="text-center">
            <p>Loading...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!session) {
    return (
      <Layout>
        <div className="flex h-screen items-center justify-center p-4">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Authentication Required</CardTitle>
              <CardDescription>
                Please log in to use Allyship Studio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                className="w-full"
                onClick={() => chrome.runtime.openOptionsPage()}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col space-y-4">
        <Header session={session} />
        <div className="p-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Heading Analysis</CardTitle>
              <CardDescription>
                Analyze and highlight heading structure on the current page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                onClick={
                  headingsHighlighted
                    ? handleRemoveHighlights
                    : handleHighlightHeadings
                }>
                {headingsHighlighted
                  ? "Remove Highlights"
                  : "Highlight Headings"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default IndexSidePanel
