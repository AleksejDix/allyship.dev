import { notFound } from "next/navigation"
import { DomainIdNavigation } from "@/features/domain/components/domain-id-navigation"

import { prisma } from "@/lib/prisma"

type LayoutProps = {
  params: { domain_id: string; space_id: string }
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
      <DomainIdNavigation
        domain={domain}
        space_id={space_id}
        domain_id={domain_id}
      />

      {children}
    </>
  )
}
