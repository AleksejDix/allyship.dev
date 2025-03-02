import { useCallback, useEffect, useState } from "react"

import {
  fetchPagesForWebsite,
  toRecord,
  type Page,
  type Website
} from "../api/sdk"

/**
 * Custom hook for managing page data
 *
 * @param selectedWebsite - The currently selected website
 * @returns Page data and state management functions
 */
export function usePageData(selectedWebsite: Website | null) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pages, setPages] = useState<Record<string, Page>>({})
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)

  // Transform pages object to array for dropdown options
  const pageOptions = Object.values(pages)

  // Get the currently selected page
  const selectedPage = selectedPageId ? pages[selectedPageId] : null

  // Fetch pages for the selected website
  const fetchPages = useCallback(async () => {
    if (!selectedWebsite) {
      setPages({})
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchPagesForWebsite(selectedWebsite.id)

      if (response.error) {
        setError(response.error.message || "Failed to fetch pages")
        return
      }

      const pageMap = toRecord<Page>(response.data || [], "id")
      setPages(pageMap)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unknown error fetching pages"
      )
    } finally {
      setIsLoading(false)
    }
  }, [selectedWebsite])

  // Add an optimistic page to the state
  const addOptimisticPage = useCallback((page: Page) => {
    setPages((prev) => ({
      ...prev,
      [page.id]: page
    }))

    // Automatically select the new page
    setSelectedPageId(page.id)
  }, [])

  // Reset when website changes
  useEffect(() => {
    setSelectedPageId(null)
    setPages({})

    if (selectedWebsite) {
      fetchPages()
    }
  }, [selectedWebsite?.id, fetchPages])

  return {
    pages,
    pageOptions,
    selectedPageId,
    selectedPage,
    setSelectedPageId,
    isLoading,
    error,
    setError,
    fetchPages,
    addOptimisticPage
  }
}
