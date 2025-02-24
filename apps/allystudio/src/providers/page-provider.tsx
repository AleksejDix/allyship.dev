import { rootActor } from "@/background/machines/root"
import {
  connectPageToAllyship,
  getPageByUrl,
  getWebsiteForUrl
} from "@/core/pages"
import { eventBus } from "@/lib/events/event-bus"
import type {
  HeadingAnalysisCompleteEvent,
  HeadingIssue
} from "@/lib/events/types"
import type { Database } from "@/types/database"
import { useSelector } from "@xstate/react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from "react"

type PageData = Database["public"]["Tables"]["Page"]["Row"] & {
  website: Database["public"]["Tables"]["Website"]["Row"]
}

interface PageContextValue {
  // Current page info
  currentUrl: string
  currentTitle: string
  // Page data
  pageData: PageData | null
  websiteId: string | null
  isConnecting: boolean
  // Tool state
  activeTool: string
  headingIssues: HeadingIssue[]
  // Actions
  handleAddPage: () => Promise<void>
  setActiveTool: (tool: string) => void
  navigateToIssue: (xpath: string) => void
}

const PageContext = createContext<PageContextValue | undefined>(undefined)

export function PageProvider({ children }: PropsWithChildren) {
  // Get current tab info from root machine
  const currentTab = useSelector(rootActor, (state) => state.context.currentTab)
  const currentUrl = currentTab.url ?? ""
  const currentTitle = currentTab.title ?? "Untitled Page"

  // Page state
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Tool state
  const [activeTool, setActiveTool] = useState("")
  const [headingIssues, setHeadingIssues] = useState<HeadingIssue[]>([])

  // Effect to handle tool state changes
  useEffect(() => {
    if (currentTab.id) {
      eventBus.publish({
        type: "TOOL_STATE_CHANGE",
        timestamp: Date.now(),
        tabId: currentTab.id,
        data: {
          tool: "headings",
          enabled: activeTool === "headings"
        }
      })
    }
  }, [activeTool, currentTab.id])

  // Check if page exists and get website ID when URL changes
  useEffect(() => {
    if (!currentUrl) return

    // First check if page already exists
    getPageByUrl(currentUrl).then((result) => {
      if (result.success) {
        setPageData(result.data)
        setWebsiteId(result.data.website_id)
      } else {
        setPageData(null)
        // If page doesn't exist, get website ID for potential connection
        getWebsiteForUrl(currentUrl).then((websiteResult) => {
          if (websiteResult.success) {
            setWebsiteId(websiteResult.data.id)
          } else {
            setWebsiteId(null)
          }
        })
      }
    })
  }, [currentUrl])

  // Subscribe to heading analysis events
  useEffect(() => {
    const unsubscribe = eventBus.subscribe((event) => {
      if (event.type === "HEADING_ANALYSIS_COMPLETE") {
        const analysisEvent = event as HeadingAnalysisCompleteEvent
        setHeadingIssues(analysisEvent.data.issues)
      }
    })

    return unsubscribe
  }, [])

  // Actions
  const handleAddPage = useCallback(async () => {
    if (!websiteId || !currentUrl) return

    setIsConnecting(true)
    try {
      const result = await connectPageToAllyship(currentUrl)
      if (result.success) {
        // Refresh page data after connection
        const pageResult = await getPageByUrl(currentUrl)
        if (pageResult.success) {
          setPageData(pageResult.data)
        }
      }
    } catch (error) {
      console.error("Failed to track page:", error)
    } finally {
      setIsConnecting(false)
    }
  }, [websiteId, currentUrl])

  const navigateToIssue = useCallback(
    (xpath: string) => {
      if (currentTab.id) {
        eventBus.publish({
          type: "HEADING_NAVIGATE_REQUEST",
          timestamp: Date.now(),
          tabId: currentTab.id,
          data: { xpath }
        })
      }
    },
    [currentTab.id]
  )

  const value = {
    currentUrl,
    currentTitle,
    pageData,
    websiteId,
    isConnecting,
    activeTool,
    headingIssues,
    handleAddPage,
    setActiveTool,
    navigateToIssue
  }

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>
}

export function usePage() {
  const context = useContext(PageContext)
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider")
  }
  return context
}
