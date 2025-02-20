import type { Session } from "@supabase/supabase-js"
import { ImageIcon, ScanIcon, TypeIcon } from "lucide-react"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { supabase } from "@/core/supabase"

import { Button } from "../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "../components/ui/card"
import { Separator } from "../components/ui/separator"

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
    )
  }

  return (
    <div className="flex h-screen flex-col space-y-4 p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Allyship Studio</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => supabase.auth.signOut()}></Button>
            </div>
          </div>
          <CardDescription>Welcome back, {session.user.email}</CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Accessibility Tools</h2>
        <Separator />

        <div className="grid gap-2">
          <Button variant="default" className="w-full justify-start">
            <ScanIcon className="mr-2 h-4 w-4" />
            Scan Page
          </Button>

          <Button
            variant={headingsHighlighted ? "destructive" : "default"}
            className="w-full justify-start"
            onClick={
              headingsHighlighted
                ? handleRemoveHighlights
                : handleHighlightHeadings
            }>
            <TypeIcon className="mr-2 h-4 w-4" />
            {headingsHighlighted
              ? "Remove Heading Highlights"
              : "Check Headings"}
          </Button>

          <Button variant="default" className="w-full justify-start">
            <ImageIcon className="mr-2 h-4 w-4" />
            Analyze Images
          </Button>
        </div>
      </div>

      <div className="mt-auto">
        <Separator />
        <p className="pt-2 text-center text-sm text-muted-foreground">
          Version 0.0.1
        </p>
      </div>
    </div>
  )
}

export default IndexSidePanel
