import { notFound } from "next/navigation"
import { DomainNavigation } from "@/features/domain/components/domain-navigation"

import { prisma } from "@/lib/prisma"

type LayoutProps = {
  params: { domain_id: string; space_id: string; page_id?: string }
  children: React.ReactNode
}

export default async function Layout({ params, children }: LayoutProps) {
  const { domain_id, space_id } = await params

  const domain = await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
  })

  if (!domain) {
    return notFound()
  }

  return (
    <>
      <DomainNavigation
        domain={domain}
        space_id={space_id}
        domain_id={domain_id}
      />
      {children}
    </>
  )
}
