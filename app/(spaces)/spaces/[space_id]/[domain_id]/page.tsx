import { CrawlButton } from "@/features/pages/components/crawl-button"
import { PagesIndex } from "@/features/pages/components/pages-index"

import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"

type Props = {
  params: { domain_id: string; space_id: string }
}

export default async function DomainsPage({ params }: Props) {
  const { domain_id, space_id } = await params

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
    <>
      <div className="container">
        <div className="flex items-center justify-between py-6">
          <div>
            <h1 className="text-3xl">Pages</h1>
          </div>
          <div className="flex items-center gap-2">
            <CrawlButton domain={domain} />
            <Button>Add Page</Button>
          </div>
        </div>
      </div>
      <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
    </>
  )
}
