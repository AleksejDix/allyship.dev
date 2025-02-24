import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { Layout } from "@/components/layout"
import { OptionsHeader } from "@/components/options-header"
import { ThemeSelector } from "@/components/theme-selector"
import { supabase } from "@/core/supabase"

function IndexOptions() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      // Notify background of auth change
      chrome.runtime.sendMessage({
        type: "AUTH_STATE_CHANGE",
        session
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <main className="flex h-screen items-center justify-center">
        <div role="status" className="text-center">
          <p>Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <Layout>
      <div className="flex min-h-screen flex-col">
        <OptionsHeader session={session} />
        <main className="flex-1 p-4">
          {/* Theme Settings Section */}
          <div className="mx-auto max-w-md rounded-lg border bg-card p-6">
            <ThemeSelector />
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default IndexOptions
