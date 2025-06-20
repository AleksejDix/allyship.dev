import { normalizeUrl, type NormalizedUrl } from "@allystudio/url-utils"
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren
} from "react"

interface UrlContextValue {
  currentUrl: string | null
  normalizedUrl: NormalizedUrl | null
  isLoading: boolean
}

const UrlContext = createContext<UrlContextValue | undefined>(undefined)

export function UrlProvider({ children }: PropsWithChildren) {
  const [currentUrl, setCurrentUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial URL
    async function getCurrentTab() {
      try {
        if (!chrome?.tabs) {
          setIsLoading(false)
          return
        }

        const tabs = await chrome.tabs.query({
          active: true,
          currentWindow: true
        })
        const currentTab = tabs[0]

        if (currentTab?.url) {
          setCurrentUrl(currentTab.url)
        }

        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
      }
    }

    getCurrentTab()

    // Set up tab listeners
    function handleTabUpdate(
      tabId: number,
      changeInfo: chrome.tabs.TabChangeInfo,
      tab: chrome.tabs.Tab
    ) {
      if (tab.active && tab.url) {
        setCurrentUrl(tab.url)
        setIsLoading(changeInfo.status === "loading")
      }
    }

    async function handleTabActivated(activeInfo: chrome.tabs.TabActiveInfo) {
      try {
        setIsLoading(true)

        const tab = await chrome.tabs.get(activeInfo.tabId)

        if (tab?.url) {
          setCurrentUrl(tab.url)
        }

        setIsLoading(tab?.status === "loading")
      } catch (error) {
        setIsLoading(false)
      }
    }

    if (chrome?.tabs) {
      chrome.tabs.onUpdated.addListener(handleTabUpdate)
      chrome.tabs.onActivated.addListener(handleTabActivated)

      return () => {
        chrome.tabs.onUpdated.removeListener(handleTabUpdate)
        chrome.tabs.onActivated.removeListener(handleTabActivated)
      }
    }
  }, [])

  // Compute normalized URL
  const normalizedUrl = useMemo(() => {
    if (!currentUrl) return null

    try {
      return normalizeUrl(currentUrl)
    } catch (error) {
      return null
    }
  }, [currentUrl])

  const value = useMemo(
    () => ({
      currentUrl,
      normalizedUrl,
      isLoading
    }),
    [currentUrl, normalizedUrl, isLoading]
  )

  return <UrlContext.Provider value={value}>{children}</UrlContext.Provider>
}

// Hook for accessing URL context
export function useUrl() {
  const context = useContext(UrlContext)
  if (!context) {
    throw new Error("useUrl must be used within UrlProvider")
  }
  return context
}

// Convenience hooks
export function useCurrentDomain() {
  const { normalizedUrl, isLoading } = useUrl()
  return {
    currentDomain: normalizedUrl?.domain || null,
    isLoading
  }
}

export function useCurrentUrl() {
  const { currentUrl, normalizedUrl, isLoading } = useUrl()
  return { currentUrl, normalizedUrl, isLoading }
}
