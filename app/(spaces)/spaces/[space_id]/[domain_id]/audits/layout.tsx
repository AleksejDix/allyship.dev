import { DomainNavigation } from "@/features/domain/components/domain-navigation"

type LayoutProps = {
  params: { domain_id: string; space_id: string; page_id?: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id } = await params

  return (
    <>
      <DomainNavigation space_id={space_id} domain_id={domain_id} />
      {children}
    </>
  )
}
