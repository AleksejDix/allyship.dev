import { PageHeader } from "@/features/domain/components/page-header"
import { AddPageDialog } from "@/features/pages/components/add-page-dialog"
import { CrawlButton } from "@/features/pages/components/crawl-button"
import { PagesIndex } from "@/features/pages/components/pages-index"

import { prisma } from "@/lib/prisma"

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
      scans: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Pages" description={`Manage pages for ${domain.name}`}>
        <div className="flex items-center gap-2">
          <CrawlButton domain={domain} />
          <AddPageDialog
            spaceId={space_id}
            domainId={domain_id}
            domain={domain}
          />
        </div>
      </PageHeader>

      <div className="container space-y-6">
        <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
      </div>
    </div>
  )
}
