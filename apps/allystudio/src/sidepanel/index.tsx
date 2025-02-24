import { Werkzeug } from "@/components/werkzeug"
import type { Session } from "@supabase/supabase-js"
import { useEffect, useRef, useState } from "react"

import "@/styles/globals.css"

import { AuthRequired } from "@/components/auth-required"
import { Header } from "@/components/header"
import { Layout } from "@/components/layout"
import { LoadingState } from "@/components/loading-state"
import { Toolbar } from "@/components/toolbar"
import {
  connectPageToAllyship,
  getPageByUrl,
  getWebsiteForUrl
} from "@/core/pages"
import { supabase } from "@/core/supabase"
import { eventBus } from "@/lib/events/event-bus"
import type {
  HeadingAnalysisCompleteEvent,
  HeadingIssue
} from "@/lib/events/types"
import type { Database } from "@/types/database"

type PageData = Database["public"]["Tables"]["Page"]["Row"] & {
  website: Database["public"]["Tables"]["Website"]["Row"]
}

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTool, setActiveTool] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("Untitled Page")
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const injectedTabsRef = useRef<Set<number>>(new Set())
  const lastUrlRef = useRef<string>("")
  const [headingIssues, setHeadingIssues] = useState<HeadingIssue[]>([])

  // Function to inject content script if not already injected
  const injectContentScript = async (tabId: number) => {
    if (injectedTabsRef.current.has(tabId)) {
      console.log("Content script already injected in tab:", tabId)
      return
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["contents/heading-order.js"]
      })
      injectedTabsRef.current.add(tabId)
      console.log("Content script injected in tab:", tabId)
    } catch (error) {
      console.error("Failed to inject heading analysis:", error)
    }
  }

  // Function to trigger analysis
  const triggerAnalysis = (tabId: number) => {
    if (activeTool === "headings") {
      eventBus.publish({
        type: "TOOL_STATE_CHANGE",
        timestamp: Date.now(),
        tabId,
        data: {
          tool: "headings",
          enabled: true
        }
      })
    }
  }

  // Function to update current tab info
  const updateCurrentTab = async (tab: chrome.tabs.Tab) => {
    if (!tab.url) return

    const isNewUrl = tab.url !== lastUrlRef.current
    lastUrlRef.current = tab.url
    setCurrentUrl(tab.url)
    setCurrentTitle(tab.title || "Untitled Page")

    // Inject content script if needed
    if (tab.id) {
      await injectContentScript(tab.id)

      // If URL changed and tool is active, rerun analysis
      if (isNewUrl && activeTool) {
        console.log("URL changed, rerunning analysis")
        // Small delay to ensure DOM is ready
        setTimeout(() => triggerAnalysis(tab.id!), 500)
      }
      // If tool is active but not a new URL, just ensure analysis is running
      else if (activeTool) {
        triggerAnalysis(tab.id)
      }
    }
  }

  // Inject content scripts on initial load
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        await injectContentScript(tabs[0].id)
        if (activeTool) {
          triggerAnalysis(tabs[0].id)
        }
      }
    })

    // Clean up injected tabs tracking when the panel is closed
    return () => {
      injectedTabsRef.current.clear()
    }
  }, [])

  // Effect to handle tool state changes
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        eventBus.publish({
          type: "TOOL_STATE_CHANGE",
          timestamp: Date.now(),
          tabId: tabs[0].id,
          data: {
            tool: "headings",
            enabled: activeTool === "headings"
          }
        })
      }
    })
  }, [activeTool])

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes from Supabase
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    // Get current tab URL and title
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        updateCurrentTab(tabs[0])
      }
    })

    // Listen for tab URL and title changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id === tabId) {
          // If URL changed or title changed, update current tab info
          if (changeInfo.url || changeInfo.title) {
            updateCurrentTab(tab)
          }
        }
      })
    })

    // Listen for tab activation changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      chrome.tabs.get(activeInfo.tabId, (tab) => {
        updateCurrentTab(tab)
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  // Check if page exists and get website ID when URL changes
  useEffect(() => {
    if (!currentUrl || !session) return

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
  }, [currentUrl, session])

  const handleAddPage = async () => {
    if (!websiteId || !currentUrl) return

    const result = await connectPageToAllyship(currentUrl)
    if (result.success) {
      // Refresh page data after connection
      const pageResult = await getPageByUrl(currentUrl)
      if (pageResult.success) {
        setPageData(pageResult.data)
      }
    }
  }

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

  // Function to navigate to issue
  const navigateToIssue = (xpath: string) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        eventBus.publish({
          type: "HEADING_NAVIGATE_REQUEST",
          timestamp: Date.now(),
          tabId: tabs[0].id,
          data: { xpath }
        })
      }
    })
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (!session) {
    return <AuthRequired />
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 flex-col">
          <Werkzeug />
          <Toolbar
            onToolChange={setActiveTool}
            currentFile={currentTitle}
            isConnected={!!pageData}
            onAddPage={handleAddPage}
            pageData={pageData}
            currentUrl={currentUrl}
            websiteId={websiteId}
          />
          <div className="flex-1 p-4 space-y-4">
            {activeTool === "headings" && (
              <>
                <div className="card p-4 bg-card">
                  <p className="text-sm">
                    {activeTool
                      ? "Headings are now highlighted on the page. Click again to hide."
                      : "Click to highlight all headings on the page."}
                  </p>
                </div>
                {headingIssues.length > 0 ? (
                  <div className="space-y-2">
                    {headingIssues.map((issue) => (
                      <div
                        key={issue.id}
                        className="card p-4 bg-card hover:bg-card/80 cursor-pointer"
                        onClick={() =>
                          issue.element?.xpath &&
                          navigateToIssue(issue.element.xpath)
                        }>
                        <div className="flex items-start gap-2">
                          <span
                            className={`px-2 py-1 text-xs rounded ${
                              issue.severity === "Critical"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                            {issue.severity}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {issue.message}
                            </p>
                            {issue.element?.textContent && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {issue.element.textContent}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground p-4">
                    No heading issues found
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <Header session={session} />
      </div>
    </Layout>
  )
}

export default IndexSidePanel
