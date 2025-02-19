import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { Footer } from "@/components/site/Footer"
import { Header } from "@/components/site/Header"

type RootLayoutProps = {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <>
      <Header />
      <main id="main" tabIndex={-1} role="main" aria-label="Main">
        {children}
      </main>
      <Footer />
    </>
  )
}
