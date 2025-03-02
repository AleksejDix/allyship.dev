import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { fetchWebsitesForSpace, toRecord, type Website } from "../api/sdk"

// Maximum loading time before automatically resetting loading state
const MAX_LOADING_TIME = 5000 // 5 seconds
const LOADING_DEBUG = false // Set to true to enable debug logs

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

  // Use a ref to track the last fetch time for debouncing
  const lastFetchRef = useRef<number>(0)
  // Track if the component is mounted
  const isMountedRef = useRef<boolean>(true)
  // Timeout ref for safety
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Track fetch attempts to identify stuck requests
  const fetchAttemptRef = useRef<number>(0)

  // Transform websites object to array for dropdown options (memoized)
  const websiteOptions = useMemo(() => Object.values(websites), [websites])

  // Get the selected website object (memoized)
  const selectedWebsite = useMemo(
    () => (selectedWebsiteId ? websites[selectedWebsiteId] || null : null),
    [selectedWebsiteId, websites]
  )

  // Clear loading timeout
  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      if (LOADING_DEBUG) console.log("Clearing loading timeout for websites")
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }, [])

  // Force reset the loading state completely
  const forceResetLoading = useCallback(() => {
    clearLoadingTimeout()
    setIsLoading(false)
    if (LOADING_DEBUG) console.warn("Force reset loading state for websites")
  }, [clearLoadingTimeout])

  // Set loading with safety timeout
  const setLoadingWithSafety = useCallback(
    (loading: boolean) => {
      // Clear any existing timeout
      clearLoadingTimeout()

      if (loading) {
        if (LOADING_DEBUG)
          console.log("Setting websites loading to true with safety timeout")
        // Set a safety timeout to clear loading state after MAX_LOADING_TIME
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.warn("Loading timeout reached for websites fetch")
            setIsLoading(false)
          }
        }, MAX_LOADING_TIME)
      } else {
        if (LOADING_DEBUG) console.log("Setting websites loading to false")
      }

      // Set the loading state
      setIsLoading(loading)
    },
    [clearLoadingTimeout]
  )

  // Fetch websites from the API
  const fetchWebsites = useCallback(
    async (forceRefresh = false) => {
      if (!spaceId) {
        if (LOADING_DEBUG) console.log("No spaceId, skipping fetchWebsites")
        return
      }

      // Skip if already loading and not forced
      if (isLoading && !forceRefresh) {
        if (LOADING_DEBUG)
          console.log("Already loading websites, skipping fetch")
        return
      }

      // If the time since last fetch is less than 500ms, debounce the call
      const now = Date.now()
      if (!forceRefresh && now - lastFetchRef.current < 500) {
        if (LOADING_DEBUG) console.log("Debouncing websites fetch")
        return
      }

      // Update last fetch time
      lastFetchRef.current = now

      // Track this fetch attempt
      const currentFetchAttempt = ++fetchAttemptRef.current
      if (LOADING_DEBUG)
        console.log(`Starting websites fetch #${currentFetchAttempt}`)

      setLoadingWithSafety(true)
      setError(null)

      try {
        const response = await fetchWebsitesForSpace(spaceId)

        // Check if this is still the current fetch attempt
        if (fetchAttemptRef.current !== currentFetchAttempt) {
          if (LOADING_DEBUG)
            console.log(
              `Fetch #${currentFetchAttempt} was superseded, ignoring result`
            )
          return
        }

        if (response.error) {
          throw new Error(
            response.error.message ||
              "An error occurred while fetching websites"
          )
        }

        // Transform array to object by ID for easier lookup
        const websitesMap = toRecord<Website>(response.data || [], "id")

        if (isMountedRef.current) {
          if (LOADING_DEBUG)
            console.log(
              `Fetch #${currentFetchAttempt} successful, updating websites`
            )
          setWebsites(websitesMap || {})
        }
      } catch (err) {
        console.error(`Error in websites fetch #${currentFetchAttempt}:`, err)
        if (isMountedRef.current) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch websites"
          )
        }
      } finally {
        // Always clean up regardless of success or failure
        if (isMountedRef.current) {
          if (LOADING_DEBUG)
            console.log(`Fetch #${currentFetchAttempt} complete, cleaning up`)
          setLoadingWithSafety(false)
        } else {
          if (LOADING_DEBUG)
            console.log(
              `Component unmounted during fetch #${currentFetchAttempt}`
            )
          // Component unmounted, force cleanup
          clearLoadingTimeout()
        }
      }
    },
    [spaceId, isLoading, setLoadingWithSafety, clearLoadingTimeout]
  )

  // Add an optimistic website to the state
  const addOptimisticWebsite = useCallback((website: Website) => {
    setWebsites((prev) => {
      const updatedSites = {
        ...prev,
        [website.id]: website
      }
      return updatedSites
    })

    // Automatically select the new website
    setSelectedWebsiteId(website.id)
  }, [])

  // Fetch websites on mount or when spaceId changes
  useEffect(() => {
    if (spaceId) {
      if (LOADING_DEBUG) console.log("spaceId changed, fetching websites")
      fetchWebsites()
    } else {
      // Clear data when spaceId is not available
      if (LOADING_DEBUG) console.log("No spaceId, clearing websites data")
      setWebsites({})
      setSelectedWebsiteId(null)
      forceResetLoading()
    }

    // Cleanup function to handle component unmount
    return () => {
      isMountedRef.current = false
      clearLoadingTimeout()
    }
  }, [spaceId, fetchWebsites, clearLoadingTimeout, forceResetLoading])

  // Reset the mounted ref when the component mounts
  useEffect(() => {
    isMountedRef.current = true

    // Double check after a tick to ensure loading state is consistent
    const immediateCheck = setTimeout(() => {
      if (isLoading && isMountedRef.current) {
        if (LOADING_DEBUG)
          console.log(
            "Initial safety check: websites still loading, setting timeout"
          )
        // Set a safety timeout if we're already loading
        clearLoadingTimeout()
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.warn("Initial safety timeout reached for websites")
            setIsLoading(false)
          }
        }, MAX_LOADING_TIME)
      }
    }, 0)

    return () => {
      clearTimeout(immediateCheck)
      isMountedRef.current = false
      clearLoadingTimeout()
      // Force reset loading state on unmount to prevent stuck state
      setIsLoading(false)
    }
  }, [clearLoadingTimeout, isLoading])

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
    addOptimisticWebsite,
    forceResetLoading
  }
}
