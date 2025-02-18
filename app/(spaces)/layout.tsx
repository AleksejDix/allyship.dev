import { redirect } from "next/navigation"

import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/site/Header"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
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
      {children}
    </>
  )
}
