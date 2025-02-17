import { WebsitesNavigation } from "@/features/websites/components/website-navigation"

import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  params: { website_id: string; space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { website_id, space_id } = params
  const supabase = await createClient()

  const { data: domain } = await supabase
    .from("Website")
    .select()
    .eq("id", website_id)
    .single()

  if (!domain) {
    return null
  }

  return (
    <>
      <WebsitesNavigation space_id={space_id} website_id={website_id} />
      {children}
    </>
  )
}
