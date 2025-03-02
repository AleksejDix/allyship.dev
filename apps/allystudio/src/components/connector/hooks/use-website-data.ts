import { useCallback, useEffect, useState } from "react"

import { fetchWebsitesForSpace, toRecord, type Website } from "../api/sdk"

/**
 * Custom hook for managing website data
 *
 * @param spaceId - The ID of the space to fetch websites for
 * @returns Website data and state management functions
 */
export function useWebsiteData(spaceId: string | undefined) {
  const [websites, setWebsites] = useState<Record<string, Website>>({})
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Transform websites object to array for dropdown options
  const websiteOptions = Object.values(websites)

  // Get the selected website object
  const selectedWebsite = selectedWebsiteId
    ? websites[selectedWebsiteId] || null
    : null

  // Fetch websites from the API
  const fetchWebsites = useCallback(async () => {
    if (!spaceId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchWebsitesForSpace(spaceId)

      if (response.error) {
        throw new Error(
          response.error.message || "An error occurred while fetching websites"
        )
      }

      // Transform array to object by ID for easier lookup
      const websitesMap = toRecord<Website>(response.data || [], "id")
      setWebsites(websitesMap || {})
    } catch (err) {
      console.error("Error fetching websites:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch websites")
    } finally {
      setIsLoading(false)
    }
  }, [spaceId])

  // Add an optimistic website to the state
  const addOptimisticWebsite = useCallback((website: Website) => {
    setWebsites((prev) => ({
      ...prev,
      [website.id]: website
    }))

    // Automatically select the new website
    setSelectedWebsiteId(website.id)
  }, [])

  // Fetch websites on mount or when spaceId changes
  useEffect(() => {
    if (spaceId) {
      fetchWebsites()
    } else {
      // Clear data when spaceId is not available
      setWebsites({})
      setSelectedWebsiteId(null)
    }
  }, [spaceId, fetchWebsites])

  return {
    websites,
    websiteOptions,
    selectedWebsiteId,
    selectedWebsite,
    setSelectedWebsiteId,
    isLoading,
    error,
    setError,
    fetchWebsites,
    addOptimisticWebsite
  }
}
