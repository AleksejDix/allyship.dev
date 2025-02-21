import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { AuthRequired } from "@/components/auth-required"
import { Header } from "@/components/header"
import { HeadingAnalysis } from "@/components/heading-analysis"
import { Layout } from "@/components/layout"
import { LoadingState } from "@/components/loading-state"
import { supabase } from "@/core/supabase"

function IndexSidePanel() {
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
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return <LoadingState />
  }

  if (!session) {
    return <AuthRequired />
  }

  return (
    <Layout>
      <div className="flex h-screen flex-col">
        <div className="flex-1 p-4 space-y-4">
          <HeadingAnalysis />
        </div>
        <Header session={session} />
      </div>
    </Layout>
  )
}

export default IndexSidePanel
