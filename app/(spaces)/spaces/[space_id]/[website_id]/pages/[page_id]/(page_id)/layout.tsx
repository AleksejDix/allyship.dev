import { PageNavigation } from "@/features/pages/components/page-navigation"

import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  params: { website_id: string; space_id: string; page_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { website_id, space_id, page_id } = params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from("Page")
    .select(
      `
      *,
      domain:Domain (*)
    `
    )
    .eq("id", page_id)
    .single()

  if (!page) {
    return null
  }

  return (
    <>
      <PageNavigation
        space_id={space_id}
        website_id={website_id}
        page_id={page_id}
      />
      {children}
    </>
  )
}
