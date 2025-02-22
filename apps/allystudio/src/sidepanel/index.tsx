import { cn } from "@/lib/utils"
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
import type { Database } from "@/types/database"

type PageData = Database["public"]["Tables"]["Page"]["Row"] & {
  website: Database["public"]["Tables"]["Website"]["Row"]
}

interface IssueLocation {
  xpath: string
  selector: string
  element_type: string
  context: string
}

interface PanelIssue {
  id: string
  severity: "Critical" | "High" | "Medium" | "Low"
  message: string
  element: string
  expected: string
  location: IssueLocation
  text: string
}

function HeadingIssuesPanel() {
  const [issues, setIssues] = useState<PanelIssue[]>([])
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    // Listen for messages from content script
    const handleMessage = (message: any) => {
      console.log("Received message in sidepanel:", message)
      if (message.type === "HEADING_ISSUES_UPDATE") {
        console.log("Updating issues:", message.issues)
        setIssues(message.issues)
      }
    }

    // Add message listener
    chrome.runtime.onMessage.addListener(handleMessage)

    // Request current issues from content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: "REQUEST_HEADING_ISSUES"
        })
      }
    })

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [])

  const handleIssueClick = (issue: PanelIssue) => {
    setSelectedIssue(issue.id)
    // Send message to content script to highlight the element
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0]
      if (activeTab?.id) {
        chrome.tabs.sendMessage(activeTab.id, {
          type: "NAVIGATE_TO_HEADING_ISSUE",
          xpath: issue.location.xpath
        })
      }
    })
  }

  const getSeverityIcon = (severity: PanelIssue["severity"]) => {
    switch (severity) {
      case "Critical":
        return "⛔️"
      case "High":
        return "⚠️"
      case "Medium":
        return "⚡️"
      case "Low":
        return "ℹ️"
      default:
        return "ℹ️"
    }
  }

  const getSeverityClass = (severity: PanelIssue["severity"]) => {
    switch (severity) {
      case "Critical":
        return "text-red-600 dark:text-red-400"
      case "High":
        return "text-orange-600 dark:text-orange-400"
      case "Medium":
        return "text-yellow-600 dark:text-yellow-400"
      case "Low":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  if (issues.length === 0) {
    return (
      <div className="px-2 py-1 text-sm text-gray-500 dark:text-gray-400">
        No issues found
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800">
        <span className="transform transition-transform duration-200 ease-in-out">
          {isExpanded ? "▼" : "▶"}
        </span>
        <span>Heading Issues ({issues.length})</span>
      </button>
      {isExpanded && (
        <div className="space-y-0.5 pl-4">
          {issues.map((issue) => (
            <button
              key={issue.id}
              onClick={() => handleIssueClick(issue)}
              className={`group flex w-full items-start gap-2 rounded px-2 py-1 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
                selectedIssue === issue.id ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}>
              <span
                className={`flex h-4 w-4 items-center justify-center ${getSeverityClass(
                  issue.severity
                )}`}>
                {getSeverityIcon(issue.severity)}
              </span>
              <div className="flex-1 truncate">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {issue.element} → {issue.expected}
                  </span>
                </div>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {issue.message}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTool, setActiveTool] = useState("")
  const [isActive, setIsActive] = useState(false)
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("Untitled Page")
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [websiteId, setWebsiteId] = useState<string | null>(null)
  const injectedTabsRef = useRef<Set<number>>(new Set())

  // Function to inject content script if not already injected
  const injectContentScript = async (tabId: number) => {
    if (injectedTabsRef.current.has(tabId)) {
      console.log("Content script already injected in tab:", tabId)
      return
    }

    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: ["contents/heading-analysis.js"]
      })
      injectedTabsRef.current.add(tabId)
      console.log("Content script injected in tab:", tabId)
    } catch (error) {
      console.error("Failed to inject heading analysis:", error)
    }
  }

  // Function to update current tab info
  const updateCurrentTab = async (tab: chrome.tabs.Tab) => {
    if (tab.url) {
      setCurrentUrl(tab.url)
      setCurrentTitle(tab.title || "Untitled Page")

      // Inject content script if needed
      if (tab.id) {
        await injectContentScript(tab.id)
        // If tool is active, send activation message
        if (activeTool === "headings") {
          chrome.tabs.sendMessage(tab.id, {
            type: "HEADING_ANALYSIS_STATE",
            isActive: true
          })
        }
      }
    }
  }

  // Inject content scripts on initial load
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      if (tabs[0]?.id) {
        await injectContentScript(tabs[0].id)
      }
    })

    // Clean up injected tabs tracking when the panel is closed
    return () => {
      injectedTabsRef.current.clear()
    }
  }, [])

  // Effect to handle heading analysis state
  useEffect(() => {
    if (!activeTool) {
      setIsActive(false)
      // Notify content script to deactivate
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "HEADING_ANALYSIS_STATE",
            isActive: false
          })
        }
      })
      return
    }

    if (activeTool === "headings") {
      setIsActive(true)
      // Notify content script to activate
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: "HEADING_ANALYSIS_STATE",
            isActive: true
          })
        }
      })
    }
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
              <div className="card p-4 bg-card">
                <p className="text-sm">
                  {isActive
                    ? "Headings are now highlighted on the page. Click again to hide."
                    : "Click to highlight all headings on the page."}
                </p>
              </div>
            )}
            <HeadingIssuesPanel />
          </div>
        </div>
        <Header session={session} />
      </div>
    </Layout>
  )
}

export default IndexSidePanel
