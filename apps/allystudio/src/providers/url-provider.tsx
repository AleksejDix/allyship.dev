import { normalizeUrl } from "@/utils/url"
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
  normalizedUrl: string | null
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
          lastFocusedWindow: true
        })
        console.log("[UrlProvider] Current tabs:", tabs)

        const currentTab = tabs[0]
        if (currentTab?.url) {
          updateUrl(currentTab.url)
        } else {
          setError({
            code: "NO_URL",
            message: "No URL found in current tab"
          })
          setCurrentUrl(null)
        }
      } catch (error) {
        console.error("[UrlProvider] Error getting current tab:", error)
        setError({
          code:
            error.message === "PERMISSION_ERROR"
              ? "PERMISSION_ERROR"
              : "API_ERROR",
          message:
            error.message === "PERMISSION_ERROR"
              ? "Missing chrome.tabs permission. Please check extension permissions."
              : "Failed to access tab information"
        })
        setCurrentUrl(null)
      } finally {
        setIsLoading(false)
      }
    }

    // Get initial URL
    getCurrentTab()

    // Set up tab listeners
    let updateTimeout: NodeJS.Timeout

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
      }

      // Only update if the tab is active and has completed loading
      if (tab.active) {
        if (changeInfo.status === "complete") {
          // Debounce URL updates to prevent rapid changes
          updateTimeout = setTimeout(() => {
            updateUrl(tab.url)
          }, 250)
        } else if (changeInfo.status === "loading") {
          // Show loading state while page is loading
          setIsLoading(true)
        }
      }
    }

    // Listen for tab activation with validation
    async function handleTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
      console.log("[UrlProvider] Tab activated:", activeInfo)
      try {
        // Clear any pending updates
        if (updateTimeout) {
          clearTimeout(updateTimeout)
        }

        setIsLoading(true)
        const tab = await chrome.tabs.get(activeInfo.tabId)

        // Only update if tab still exists and has a URL
        if (tab && tab.url) {
          updateUrl(tab.url)
        } else {
          setError({
            code: "NO_URL",
            message: "No URL found in activated tab"
          })
        }
      } catch (error) {
        console.error("[UrlProvider] Error getting activated tab:", error)
        setError({
          code: "API_ERROR",
          message: "Failed to get activated tab information"
        })
      } finally {
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
  }, [])

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
      const url = new URL(currentUrl)

      // Skip normalization for invalid URLs
      if (!url.protocol.startsWith("http")) {
        setError({
          code: "INVALID_URL",
          message: "Only HTTP/HTTPS URLs are supported"
        })
        return {
          normalizedUrl: null,
          normalizedDomain: null,
          currentDomain: null
        }
      }

      // Extract and clean domain
      const domain = url.hostname
        .replace(/^www\./, "") // Remove www.
        .toLowerCase() // Normalize case

      // Skip IP addresses and localhost
      if (
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(domain) || // IPv4
        domain === "localhost" ||
        domain.endsWith(".local")
      ) {
        setError({
          code: "INVALID_URL",
          message: "IP addresses and localhost URLs are not supported"
        })
        return {
          normalizedUrl: null,
          normalizedDomain: null,
          currentDomain: null
        }
      }

      return {
        normalizedUrl: normalizeUrl(currentUrl),
        normalizedDomain: normalizeUrl(domain),
        currentDomain: domain
      }
    } catch (error) {
      console.error("Error normalizing URL:", error)
      setError({
        code: "INVALID_URL",
        message: "Failed to normalize URL"
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
