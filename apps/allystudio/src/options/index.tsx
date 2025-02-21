import type { Provider, Session } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

import "@/styles/globals.css"

import { Layout } from "@/components/layout"
import { OptionsHeader } from "@/components/options-header"
import { ThemeSelector } from "@/components/theme-selector"
import { supabase } from "@/core/supabase"
import { cn } from "@/lib/utils"

function IndexOptions() {
  const [session, setSession] = useState<Session | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  const handleEmailLogin = async (
    type: "LOGIN" | "SIGNUP",
    email: string,
    password: string
  ) => {
    try {
      setError(null)
      const { error } =
        type === "LOGIN"
          ? await supabase.auth.signInWithPassword({
              email,
              password
            })
          : await supabase.auth.signUp({
              email,
              password
            })

      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  const handleOAuthLogin = async (provider: Provider) => {
    try {
      setError(null)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: chrome.runtime.getURL("options.html")
        }
      })
      if (error) throw error
    } catch (error) {
      setError(error.message)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

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

          {/* Auth Section */}
          <div className="mt-8 flex min-h-[400px] items-center justify-center p-4">
            <div className="w-full max-w-md space-y-4 rounded-lg border p-6 shadow-lg">
              {error && (
                <div
                  role="alert"
                  className="rounded-md bg-red-50 p-4 text-red-700">
                  {error}
                </div>
              )}

              {!session?.user && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      type="text"
                      placeholder="Your Email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-md border px-3 py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <button
                      className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                      onClick={() =>
                        handleEmailLogin("LOGIN", username, password)
                      }>
                      Login
                    </button>
                    <button
                      className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                      onClick={() =>
                        handleEmailLogin("SIGNUP", username, password)
                      }>
                      Sign up
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-white px-2 text-gray-500">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <button
                    className="flex w-full items-center justify-center rounded-md bg-gray-800 px-4 py-2 text-white hover:bg-gray-900"
                    onClick={() => handleOAuthLogin("github")}>
                    <span>GitHub</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default IndexOptions
