"use client"

import { useSpaceContext } from "@/components/space/space-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { supabase } from "@/core/supabase"
import { cn } from "@/lib/utils"
import { useCurrentUrl } from "@/providers/url-provider"
import { useSelector } from "@xstate/react"
import { useCallback, useEffect, useState } from "react"

type Website = {
  id: string
  url: string
  normalized_url: string
  name: string
  space_id: string
}

type Page = {
  id: string
  path: string
  website_id: string
  url: string
}

type ConnectionState = "loading" | "connected" | "disconnected"

/**
 * Full-featured connector component with context integration
 */
export const Connector = () => {
  const spaceActor = useSpaceContext()
  const currentSpace = useSelector(
    spaceActor,
    (state) => state.context.currentSpace
  )
  const { normalizedUrl } = useCurrentUrl()

  // State management
  const [websites, setWebsites] = useState<Record<string, Website>>({})
  const [pages, setPages] = useState<Record<string, Page>>({})
  const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(null)
  const [state, setState] = useState<ConnectionState>("loading")
  const [isCreating, setIsCreating] = useState(false)

  const currentDomain = normalizedUrl?.hostname || null
  const currentPath = normalizedUrl?.path || null

  // Load websites for current space
  useEffect(() => {
    if (!currentSpace?.id) {
      setWebsites({})
      setState("disconnected")
      return
    }

    const fetchWebsites = async () => {
      setState("loading")
      try {
        const { data, error } = await supabase
          .from("Website")
          .select("*")
          .eq("space_id", currentSpace.id)

        if (error) throw error

        if (data) {
          const websiteRecord = data.reduce(
            (acc, website) => {
              acc[website.normalized_url] = website
              return acc
            },
            {} as Record<string, Website>
          )
          setWebsites(websiteRecord)
        }
      } catch (error) {
        console.error("Error fetching websites:", error)
        setWebsites({})
      }
    }

    fetchWebsites()
  }, [currentSpace?.id])

  // Find matching website
  const matchedWebsite = currentDomain ? websites[currentDomain] : null
  const isHostnameMatch = !!matchedWebsite

  // Update current website ID when match changes
  useEffect(() => {
    setCurrentWebsiteId(matchedWebsite?.id || null)
  }, [matchedWebsite?.id])

  // Load pages for current website
  useEffect(() => {
    if (!currentWebsiteId) {
      setPages({})
      setState(isHostnameMatch ? "disconnected" : "disconnected")
      return
    }

    const fetchPages = async () => {
      setState("loading")
      try {
        const { data, error } = await supabase
          .from("Page")
          .select("*")
          .eq("website_id", currentWebsiteId)

        if (error) throw error

        if (data) {
          const pageRecord = data.reduce(
            (acc, page) => {
              acc[page.path] = page
              return acc
            },
            {} as Record<string, Page>
          )
          setPages(pageRecord)

          // Check if current path matches any page
          const isPathMatch = currentPath && pageRecord[currentPath]
          setState(isPathMatch ? "connected" : "disconnected")
        } else {
          setState("disconnected")
        }
      } catch (error) {
        console.error("Error fetching pages:", error)
        setPages({})
        setState("disconnected")
      }
    }

    fetchPages()
  }, [currentWebsiteId, currentPath, isHostnameMatch])

  // Create website and/or page
  const handleCreateWebsiteAndPage = useCallback(async () => {
    if (!currentSpace?.id || !currentDomain || !normalizedUrl) return

    setIsCreating(true)
    try {
      let websiteId = matchedWebsite?.id

      // Create website if it doesn't exist
      if (!websiteId) {
        const { data: newWebsite, error: websiteError } = await supabase
          .from("Website")
          .insert({
            space_id: currentSpace.id,
            url: normalizedUrl.raw,
            normalized_url: currentDomain,
            name: currentDomain,
            theme: "BOTH"
          })
          .select()
          .single()

        if (websiteError) throw websiteError
        websiteId = newWebsite.id

        // Update local state optimistically
        setWebsites((prev) => ({
          ...prev,
          [currentDomain]: newWebsite
        }))
      }

      // Create page if we have a path and it doesn't exist
      if (websiteId && currentPath && !pages[currentPath]) {
        const { data: newPage, error: pageError } = await supabase
          .from("Page")
          .insert({
            website_id: websiteId,
            path: currentPath,
            url: normalizedUrl.raw
          })
          .select()
          .single()

        if (pageError) throw pageError

        // Update local state optimistically
        setPages((prev) => ({
          ...prev,
          [currentPath]: newPage
        }))
      }

      setState("connected")
    } catch (error) {
      console.error("Error creating website/page:", error)
    } finally {
      setIsCreating(false)
    }
  }, [
    currentSpace?.id,
    currentDomain,
    currentPath,
    normalizedUrl,
    matchedWebsite?.id,
    pages
  ])

  // Navigate to website
  const handleNavigateToWebsite = useCallback((website: Website) => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.update({ url: website.url })
    } else {
      window.open(website.url, "_blank")
    }
  }, [])

  if (!currentDomain) {
    return null
  }

  return (
    <div className="px-3 py-2 border-b bg-muted/10 text-xs min-h-[40px]">
      <div className="flex items-center justify-between ">
        {/* Compact Status - Fixed width container */}
        <div className="flex items-center min-w-0 flex-1 mr-4">
          <span
            className={cn(
              "font-medium truncate",
              isHostnameMatch ? "text-green-600" : "text-red-600"
            )}>
            {currentDomain}
          </span>

          {currentPath && (
            <span
              className={cn(
                " truncate flex-shrink-0",
                pages[currentPath] ? "text-green-600" : "text-red-600"
              )}>
              {currentPath}
            </span>
          )}
        </div>

        {/* Connection Status & Action - Fixed width container */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Always reserve space for status indicator */}
          <div className="w-4 text-center">
            <span className="text-muted-foreground">
              {state === "loading" && "..."}
              {state === "connected" && "✓"}
              {state === "disconnected" && "✗"}
            </span>
          </div>

          {/* Always reserve space for button to prevent layout shift */}
          <div className="w-12">
            {state === "disconnected" && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCreateWebsiteAndPage}
                disabled={isCreating}
                className="h-6 px-2 text-xs w-full">
                {isCreating ? "..." : "Track"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
