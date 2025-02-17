import { DomainDelete } from "@/features/website/components/domain-delete"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { space_id: string; website_id: string }
}

export default async function SettingsPage({ params }: Props) {
  const { space_id, website_id } = await params

  const domain = await prisma.domain.findUnique({
    where: {
      id: website_id,
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
