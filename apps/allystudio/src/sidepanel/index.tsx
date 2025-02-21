import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { AuthRequired } from "@/components/auth-required"
import { Header } from "@/components/header"
import { HeadingAnalysis } from "@/components/heading-analysis"
import { Layout } from "@/components/layout"
import { LoadingState } from "@/components/loading-state"
import { Toolbar } from "@/components/toolbar"
import { connectPageToAllyship, getWebsiteForUrl } from "@/core/pages"
import { supabase } from "@/core/supabase"
import type { Database } from "@/types/database"

type PageData = Database["public"]["Tables"]["Page"]["Row"]

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTool, setActiveTool] = useState("")
  const [currentUrl, setCurrentUrl] = useState("")
  const [currentTitle, setCurrentTitle] = useState("Untitled Page")
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [websiteId, setWebsiteId] = useState<string | null>(null)

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
        setCurrentUrl(tabs[0].url || "")
        setCurrentTitle(tabs[0].title || "Untitled Page")
      }
    })

    // Listen for tab title changes
    chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
      if (changeInfo.title) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]?.id === tabId) {
            setCurrentTitle(changeInfo.title || "Untitled Page")
          }
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Get website ID and check if page exists when URL changes
  useEffect(() => {
    if (!currentUrl || !session) return

    // Get website ID
    getWebsiteForUrl(currentUrl).then((result) => {
      if (result.success) {
        setWebsiteId(result.data.id)

        // Check if page exists
        supabase
          .from("Page")
          .select()
          .eq("url", currentUrl)
          .single()
          .then(({ data }) => {
            setPageData(data)
          })
      }
    })
  }, [currentUrl, session])

  const handleAddPage = async () => {
    if (!websiteId || !currentUrl) return

    const result = await connectPageToAllyship(currentUrl, websiteId)
    if (result.success) {
      setPageData(result.data)
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
