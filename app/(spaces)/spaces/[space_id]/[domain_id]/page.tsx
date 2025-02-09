import { prisma } from "@/lib/prisma"

export default async function DomainsPage({
  params,
}: {
  params: { domain_id: string }
}) {
  const { domain_id } = params

  const pages = await prisma.page.findMany({
    where: {
      domain_id: domain_id,
    },
  })

  return <div>{JSON.stringify(pages, null, 2)}</div>
}
