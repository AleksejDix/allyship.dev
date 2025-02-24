import "@/styles/globals.css"

import { Layout } from "@/components/layout"
import { OptionsHeader } from "@/components/options-header"
import { ThemeSelector } from "@/components/theme-selector"
import { useAuth } from "@/providers/auth-provider"

function IndexOptions() {
  const { session, isLoading } = useAuth()

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
