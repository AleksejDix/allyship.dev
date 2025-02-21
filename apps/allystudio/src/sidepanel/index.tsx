import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { AuthRequired } from "@/components/auth-required"
import { Header } from "@/components/header"
import { HeadingAnalysis } from "@/components/heading-analysis"
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

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTool, setActiveTool] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("Untitled Page")
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [websiteId, setWebsiteId] = useState<string | null>(null)

  // Function to update current tab info
  const updateCurrentTab = (tab: chrome.tabs.Tab) => {
    if (tab.url) {
      setCurrentUrl(tab.url)
      setCurrentTitle(tab.title || "Untitled Page")
    }
  }

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
            {activeTool === "headings" && <HeadingAnalysis />}
            {/* Add other tool components here */}
          </div>
        </div>
        <Header session={session} />
      </div>
    </Layout>
  )
}

export default IndexSidePanel
