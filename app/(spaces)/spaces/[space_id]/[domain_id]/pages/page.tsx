import { PagesHeader } from "@/features/pages/components/pages-header"
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
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <>
      <div className="container">
        <PagesHeader domain={domain} spaceId={space_id} domainId={domain_id} />
      </div>
      <PagesIndex spaceId={space_id} domainId={domain_id} pages={pages} />
    </>
  )
}
