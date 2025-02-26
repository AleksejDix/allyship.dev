import {
  compareUrlPaths,
  isValidPageUrl,
  normalizeUrl,
  type NormalizedUrl
} from "@/utils/url"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react"

interface UrlError {
  code: "NO_URL" | "INVALID_URL" | "API_ERROR" | "PERMISSION_ERROR"
  message: string
}

interface UrlContextValue {
  // Raw values
  currentUrl: string | null
  currentDomain: string | null

  // Normalized values (for matching)
  normalizedUrl: NormalizedUrl | null
  normalizedDomain: string | null

  // Loading state
  isLoading: boolean
  error: UrlError | null
}

const UrlContext = createContext<UrlContextValue | undefined>(undefined)

function useUrlContext() {
  const context = useContext(UrlContext)
  if (!context) {
    throw new Error("useUrl must be used within UrlProvider")
  }
  return context
}

export function UrlProvider({ children }: PropsWithChildren) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<UrlError | null>(null)
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(
    null
  )

  useEffect(() => {
    // Function to safely update URL
    function updateUrl(url: string | undefined | null) {
      if (!url) {
        setError({
          code: "NO_URL",
          message: "No URL provided for the current tab"
        })
        setCurrentUrl(null)
        return
      }

      try {
        // Validate URL format
        new URL(url)
        console.log("[UrlProvider] Updating URL to:", url)
        setCurrentUrl(url)
        setError(null)
      } catch (e) {
        setError({
          code: "INVALID_URL",
          message: `Invalid URL format: ${url}`
        })
        setCurrentUrl(null)
      }
    }

    // Function to get current tab URL
    async function getCurrentTab() {
      try {
        setIsLoading(true)

        // Check if chrome.tabs is available
        if (!chrome?.tabs) {
          throw new Error("PERMISSION_ERROR")
        }

        console.log("[UrlProvider] Querying current tab")
        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        console.log("[UrlProvider] Current tabs:", tabs)

        const currentTab = tabs[0]
        if (currentTab) {
          if (currentTab.url) {
            updateUrl(currentTab.url)
          } else {
            setError({
              code: "NO_URL",
              message: "No URL found in current tab"
            })
            setCurrentUrl(null)
          }
        } else {
          setError({
            code: "NO_URL",
            message: "No active tab found"
          })
          setCurrentUrl(null)
        }
        setIsLoading(false)
      } catch (error: unknown) {
        console.error("[UrlProvider] Error getting current tab:", error)
        const errorMessage =
          error instanceof Error ? error.message : String(error)
        setError({
          code:
            errorMessage === "PERMISSION_ERROR"
              ? "PERMISSION_ERROR"
              : "API_ERROR",
          message:
            errorMessage === "PERMISSION_ERROR"
              ? "Missing chrome.tabs permission. Please check extension permissions."
              : "Failed to access tab information"
        })
        setCurrentUrl(null)
        setIsLoading(false)
      }
    }

    // Get initial URL
    getCurrentTab()

    // Set up tab listeners
    // Listen for tab updates with debouncing
    function handleTabUpdate(
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) {
      console.log("[UrlProvider] Tab updated:", { tabId, changeInfo, tab })

      // Clear any pending updates
      if (updateTimeout) {
        clearTimeout(updateTimeout)
        setUpdateTimeout(null)
      }

      // Only update if the tab is active
      if (tab.active && tab.url) {
        // Always update URL immediately
        updateUrl(tab.url)
        setIsLoading(changeInfo.status === "loading")
      }
    }

    // Listen for tab activation with validation
    async function handleTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
      console.log("[UrlProvider] Tab activated:", activeInfo)

      try {
        // Clear any pending updates
        if (updateTimeout) {
          clearTimeout(updateTimeout)
          setUpdateTimeout(null)
        }

        setIsLoading(true)
        const tab = await chrome.tabs.get(activeInfo.tabId)

        // Always update URL if available
        if (tab?.url) {
          updateUrl(tab.url)
        } else {
          setError({
            code: "NO_URL",
            message: "No URL found in activated tab"
          })
          setCurrentUrl(null)
        }

        // Set loading based on tab status
        setIsLoading(tab?.status === "loading")
      } catch (error: unknown) {
        console.error("[UrlProvider] Error getting activated tab:", error)
        setError({
          code: "API_ERROR",
          message: "Failed to get activated tab information"
        })
        setCurrentUrl(null)
        setIsLoading(false)
      }
    }

    if (chrome?.tabs) {
      console.log("[UrlProvider] Setting up tab listeners")
      chrome.tabs.onUpdated.addListener(handleTabUpdate)
      chrome.tabs.onActivated.addListener(handleTabActivated)

      return () => {
        console.log("[UrlProvider] Cleaning up tab listeners")
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }
        chrome.tabs.onUpdated.removeListener(handleTabUpdate)
        chrome.tabs.onActivated.removeListener(handleTabActivated)
      }
    }
  }, [updateTimeout])

  // Compute normalized values
  const { normalizedUrl, normalizedDomain, currentDomain } = useMemo(() => {
    if (!currentUrl) {
      return {
        normalizedUrl: null,
        normalizedDomain: null,
        currentDomain: null
      }
    }

    try {
      // Use isValidPageUrl to validate URL
      if (!isValidPageUrl(currentUrl)) {
        setError({
          code: "INVALID_URL",
          message: "Invalid URL format or unsupported URL type"
        })
        return {
          normalizedUrl: null,
          normalizedDomain: null,
          currentDomain: null
        }
      }

      // Get full normalized URL for page matching
      const normalized = normalizeUrl(currentUrl)

      console.log("URL Provider Normalized:", {
        currentUrl,
        normalized
      })

      return {
        normalizedUrl: normalized,
        normalizedDomain: normalized.domain, // Just the domain for website matching
        currentDomain: normalized.domain
      }
    } catch (error: unknown) {
      console.error("Error normalizing URL:", error)
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      setError({
        code: "INVALID_URL",
        message: errorMessage || "Failed to normalize URL"
      })
      return {
        normalizedUrl: null,
        normalizedDomain: null,
        currentDomain: null
      }
    }
  }, [currentUrl])

  const value = useMemo(
    () => ({
      currentUrl,
      currentDomain,
      normalizedUrl,
      normalizedDomain,
      isLoading,
      error
    }),
    [
      currentUrl,
      currentDomain,
      normalizedUrl,
      normalizedDomain,
      isLoading,
      error
    ]
  )

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>
}

// Hook for accessing URL context
export function useUrl() {
  return useUrlContext()
}

// Convenience hooks for specific use cases
export function useCurrentDomain() {
  const { currentDomain, normalizedDomain, isLoading, error } = useUrl()
  return { currentDomain, normalizedDomain, isLoading, error }
}

export function useCurrentUrl() {
  const { currentUrl, normalizedUrl, isLoading, error } = useUrl()
  return { currentUrl, normalizedUrl, isLoading, error }
}

/**
 * Hook to check if the current URL matches a website domain
 * @param websiteDomain The domain to check against (e.g., "example.com")
 * @returns Object with isMatch and isLoading properties
 */
export function useIsCurrentWebsite(websiteDomain: string | null | undefined) {
  const { normalizedDomain, isLoading } = useUrl()

  const isMatch = useMemo(() => {
    if (!normalizedDomain || !websiteDomain) return false
    return normalizedDomain === websiteDomain
  }, [normalizedDomain, websiteDomain])

  return { isMatch, isLoading }
}

/**
 * Hook to check if the current URL matches a specific page URL
 * @param pageDomain The domain of the page (e.g., "example.com")
 * @param pagePath The path of the page (e.g., "/products")
 * @returns Object with isMatch, isDomainMatch, isPathMatch and isLoading properties
 */
export function useIsCurrentPage(
  pageDomain: string | null | undefined,
  pagePath: string | null | undefined
) {
  const { normalizedUrl, normalizedDomain, isLoading } = useUrl()

  const result = useMemo(() => {
    const isDomainMatch =
      normalizedDomain && pageDomain ? normalizedDomain === pageDomain : false

    const isPathMatch =
      normalizedUrl?.path && pagePath
        ? compareUrlPaths(normalizedUrl.path, pagePath)
        : false

    const isMatch = isDomainMatch && isPathMatch

    return { isMatch, isDomainMatch, isPathMatch }
  }, [normalizedUrl, normalizedDomain, pageDomain, pagePath])

  return { ...result, isLoading }
}
