import { PageHeader } from "@/features/domain/components/page-header"
import { PagesIndex } from "@/features/pages/components/pages-index"
import { Plus } from "lucide-react"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { RouterLink } from "@/components/RouterLink"

type Props = {
  params: { domain_id: string; space_id: string }
}

export default async function PagesPage({ params }: Props) {
  const { domain_id, space_id } = params

  const domain = await prisma.domain.findUnique({
    where: {
      id: domain_id,
    },
  })

  if (!domain) {
    throw new Error("Domain not found")
  }

  const pages = await prisma.page.findMany({
    where: {
      domain_id: domain_id,
    },
    include: {
      domain: true,
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description={`Manage pages for ${domain.name}`}>
        <Button asChild>
          <RouterLink href={`/spaces/${space_id}/${domain_id}/pages/new`}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add Page
          </RouterLink>
        </Button>
      </PageHeader>

      <div className="container">
        <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
      </div>
    </div>
  )
}
