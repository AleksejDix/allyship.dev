import { WebsitesNavigation } from "@/features/websites/components/website-navigation"

import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  params: Promise<{ website_id: string; space_id: string }>
  children: React.ReactNode
}

export default async function Layout(props: LayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

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
