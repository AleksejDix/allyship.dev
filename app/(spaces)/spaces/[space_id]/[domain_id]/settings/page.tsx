import { DomainDelete } from "@/features/domain/components/domain-delete"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { space_id: string; domain_id: string }
}

export default async function SettingsPage({ params }: Props) {
  const { space_id, domain_id } = await params

  const domain = await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!domain) {
    throw new Error("Domain not found")
  }

  return (
    <div className="space-y-6">
      <DomainDelete domain={domain} spaceId={space_id} />
    </div>
  )
}
