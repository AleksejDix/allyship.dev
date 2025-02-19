import type { Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import { supabase } from "~core/supabase"

function IndexSidePanel() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div role="status" className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p>Please log in to use the extension</p>
          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col p-4">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold">Allyship Studio</h1>
        <button
          onClick={() => supabase.auth.signOut()}
          className="text-sm text-red-600 hover:text-red-700">
          Sign Out
        </button>
      </header>

      <main className="flex-1">
        <div className="rounded-lg border p-4">
          <h2 className="mb-2 font-medium">Welcome, {session.user.email}</h2>
          <p className="text-sm text-gray-600">
            Start using the accessibility tools below
          </p>
        </div>

        {/* Add your accessibility tools here */}
        <div className="mt-4 space-y-4">
          <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            Scan Page
          </button>
          <button className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">
            Check Headings
          </button>
          <button className="w-full rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700">
            Analyze Images
          </button>
        </div>
      </main>

      <footer className="mt-4 text-center text-sm text-gray-500">
        <p>Allyship Studio v0.0.1</p>
      </footer>
    </div>
  )
}

export default IndexSidePanel
