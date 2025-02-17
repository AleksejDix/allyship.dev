import { WesbiteNavigation } from "@/features/website/components/website-navigation"

import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  params: { website_id: string; space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { website_id, space_id } = params
  const supabase = await createClient()

  const { data: domain } = await supabase
    .from("Domain")
    .select()
    .eq("id", website_id)
    .single()

  if (!domain) {
    return null
  }

  return (
    <>
      <WesbiteNavigation space_id={space_id} website_id={website_id} />
      {children}
    </>
  )
}
