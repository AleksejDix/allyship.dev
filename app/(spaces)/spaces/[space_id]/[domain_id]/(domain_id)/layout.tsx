import { DomainNavigation } from "@/features/domain/components/domain-navigation"

import { createClient } from "@/lib/supabase/server"

type LayoutProps = {
  params: { domain_id: string; space_id: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id } = params
  const supabase = await createClient()

  const { data: domain } = await supabase
    .from("Domain")
    .select()
    .eq("id", domain_id)
    .single()

  if (!domain) {
    return null
  }

  return (
    <>
      <DomainNavigation space_id={space_id} domain_id={domain_id} />
      {children}
    </>
  )
}
