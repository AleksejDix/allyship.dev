import { PageHeader } from "@/features/domain/components/page-header"

import { prisma } from "@/lib/prisma"

type Props = {
  params: { space_id: string; domain_id: string }
}

export default async function AuditsPage({ params }: Props) {
  const { domain_id } = params

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
      <PageHeader
        title="Audits"
        description={`View accessibility audits for ${domain.name}`}
      />

      <div className="container">{/* Audit content will go here */}</div>
    </div>
  )
}
