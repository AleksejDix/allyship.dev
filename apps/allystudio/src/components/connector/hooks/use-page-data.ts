import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import {
  fetchPagesForWebsite,
  toRecord,
  type Page,
  type Website
} from "../api/sdk"

// Maximum loading time before automatically resetting loading state
const MAX_LOADING_TIME = 5000 // 5 seconds
const LOADING_DEBUG = false // Set to true to enable debug logs

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

  // Use refs to track state between renders
  const lastFetchRef = useRef<number>(0)
  const isMountedRef = useRef<boolean>(true)
  const websiteIdRef = useRef<string | null>(null)
  // Timeout ref for safety
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  // Track fetch attempts to identify stuck requests
  const fetchAttemptRef = useRef<number>(0)

  // Transform pages object to array for dropdown options (memoized)
  const pageOptions = useMemo(() => Object.values(pages), [pages])

  // Get the currently selected page (memoized)
  const selectedPage = useMemo(
    () => (selectedPageId ? pages[selectedPageId] : null),
    [selectedPageId, pages]
  )

  // Clear loading timeout
  const clearLoadingTimeout = useCallback(() => {
    if (loadingTimeoutRef.current) {
      if (LOADING_DEBUG) console.log("Clearing loading timeout for pages")
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
  }, [])

  // Force reset the loading state completely
  const forceResetLoading = useCallback(() => {
    clearLoadingTimeout()
    setIsLoading(false)
    if (LOADING_DEBUG) console.warn("Force reset loading state for pages")
  }, [clearLoadingTimeout])

  // Set loading with safety timeout
  const setLoadingWithSafety = useCallback(
    (loading: boolean) => {
      // Clear any existing timeout
      clearLoadingTimeout()

      if (loading) {
        if (LOADING_DEBUG)
          console.log("Setting pages loading to true with safety timeout")
        // Set a safety timeout to clear loading state after MAX_LOADING_TIME
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.warn("Loading timeout reached for pages fetch")
            setIsLoading(false)
          }
        }, MAX_LOADING_TIME)
      } else {
        if (LOADING_DEBUG) console.log("Setting pages loading to false")
      }

      // Set the loading state
      setIsLoading(loading)
    },
    [clearLoadingTimeout]
  )

  // Fetch pages for the selected website
  const fetchPages = useCallback(
    async (forceRefresh = false) => {
      if (!selectedWebsite) {
        if (LOADING_DEBUG) console.log("No selectedWebsite, clearing pages")
        setPages({})
        return
      }

      // Skip if already loading and not forced
      if (isLoading && !forceRefresh) {
        if (LOADING_DEBUG) console.log("Already loading pages, skipping fetch")
        return
      }

      // If the time since last fetch is less than 500ms, debounce the call
      const now = Date.now()
      if (!forceRefresh && now - lastFetchRef.current < 500) {
        if (LOADING_DEBUG) console.log("Debouncing pages fetch")
        return
      }

      // Update last fetch time
      lastFetchRef.current = now

      // Update the website ID ref for tracking changes
      websiteIdRef.current = selectedWebsite.id

      // Track this fetch attempt
      const currentFetchAttempt = ++fetchAttemptRef.current
      if (LOADING_DEBUG)
        console.log(
          `Starting pages fetch #${currentFetchAttempt} for website ${selectedWebsite.id}`
        )

      setLoadingWithSafety(true)
      setError(null)

      try {
        const response = await fetchPagesForWebsite(selectedWebsite.id)

        // Check if this is still the current fetch attempt
        if (fetchAttemptRef.current !== currentFetchAttempt) {
          if (LOADING_DEBUG)
            console.log(
              `Fetch #${currentFetchAttempt} was superseded, ignoring result`
            )
          return
        }

        if (response.error) {
          setError(response.error.message || "Failed to fetch pages")
          return
        }

        const pageMap = toRecord<Page>(response.data || [], "id")

        // Only update state if component is still mounted and website hasn't changed
        if (
          isMountedRef.current &&
          websiteIdRef.current === selectedWebsite.id
        ) {
          if (LOADING_DEBUG)
            console.log(
              `Fetch #${currentFetchAttempt} successful, updating pages`
            )
          setPages(pageMap)
        }
      } catch (err) {
        if (isMountedRef.current) {
          console.error(`Error in pages fetch #${currentFetchAttempt}:`, err)
          setError(
            err instanceof Error ? err.message : "Unknown error fetching pages"
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
    [selectedWebsite, isLoading, setLoadingWithSafety, clearLoadingTimeout]
  )

  // Add an optimistic page to the state
  const addOptimisticPage = useCallback((page: Page) => {
    setPages((prev) => {
      const updatedPages = {
        ...prev,
        [page.id]: page
      }
      return updatedPages
    })

    // Automatically select the new page
    setSelectedPageId(page.id)
  }, [])

  // Reset when website changes
  useEffect(() => {
    setSelectedPageId(null)

    if (LOADING_DEBUG) console.log("Website changed, resetting page selection")

    // Don't reset pages immediately to prevent UI flicker
    // Instead, wait for new data to load

    if (selectedWebsite) {
      // Update the website ID ref
      websiteIdRef.current = selectedWebsite.id
      if (LOADING_DEBUG)
        console.log(
          `New website selected (${selectedWebsite.id}), fetching pages`
        )
      fetchPages()
    } else {
      if (LOADING_DEBUG) console.log("No website selected, clearing pages")
      setPages({})
      forceResetLoading()
    }

    return () => {
      // Cleanup for component unmount or website change
      clearLoadingTimeout()
    }
  }, [selectedWebsite?.id, fetchPages, clearLoadingTimeout, forceResetLoading])

  // Set up mount/unmount handling
  useEffect(() => {
    isMountedRef.current = true

    // Double check after a tick to ensure loading state is consistent
    const immediateCheck = setTimeout(() => {
      if (isLoading && isMountedRef.current) {
        if (LOADING_DEBUG)
          console.log(
            "Initial safety check: pages still loading, setting timeout"
          )
        // Set a safety timeout if we're already loading
        clearLoadingTimeout()
        loadingTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current) {
            console.warn("Initial safety timeout reached for pages")
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
    pages,
    pageOptions,
    selectedPageId,
    selectedPage,
    setSelectedPageId,
    isLoading,
    error,
    setError,
    fetchPages,
    addOptimisticPage,
    forceResetLoading
  }
}
